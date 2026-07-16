// Disparada cada 5 min por un cron job de pg_cron/pg_net (ver migración push_reminders.sql).
// Autenticación via header x-cron-secret (no hay sesión de usuario que verificar acá).
import { createClient } from "npm:@supabase/supabase-js@2";

const NOTIFICATION_TTL_SECONDS = 2419200; // 4 semanas, tope del estándar Web Push

function b64urlDecode(s: string): Uint8Array {
  const pad = "=".repeat((4 - (s.length % 4)) % 4);
  const bin = atob(s.replace(/-/g, "+").replace(/_/g, "/") + pad);
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

function b64urlEncode(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function vapidAuthHeader(endpoint: string, publicKeyB64: string, privateKeyB64: string, subject: string) {
  const pub = b64urlDecode(publicKeyB64); // 65 bytes: 0x04 || x(32) || y(32)
  const x = pub.slice(1, 33);
  const y = pub.slice(33, 65);
  const d = b64urlDecode(privateKeyB64); // 32 bytes
  const jwk = { kty: "EC", crv: "P-256", x: b64urlEncode(x), y: b64urlEncode(y), d: b64urlEncode(d), ext: true };
  const key = await crypto.subtle.importKey("jwk", jwk, { name: "ECDSA", namedCurve: "P-256" }, false, ["sign"]);

  const header = b64urlEncode(new TextEncoder().encode(JSON.stringify({ typ: "JWT", alg: "ES256" })));
  const aud = new URL(endpoint).origin;
  const exp = Math.floor(Date.now() / 1000) + 12 * 3600;
  const payload = b64urlEncode(new TextEncoder().encode(JSON.stringify({ aud, exp, sub: subject })));
  const signingInput = `${header}.${payload}`;
  // El output de ECDSA de Web Crypto para P-256 ya es r||s crudo (64 bytes) — es justo lo que pide JWS ES256, sin conversión DER.
  const sig = await crypto.subtle.sign({ name: "ECDSA", hash: "SHA-256" }, key, new TextEncoder().encode(signingInput));
  const jwt = `${signingInput}.${b64urlEncode(new Uint8Array(sig))}`;
  return `vapid t=${jwt}, k=${publicKeyB64}`;
}

async function sendPush(endpoint: string, vapid: { publicKey: string; privateKey: string; subject: string }) {
  const authorization = await vapidAuthHeader(endpoint, vapid.publicKey, vapid.privateKey, vapid.subject);
  // Sin payload cifrado (RFC 8291): el service worker muestra un texto fijo, así evitamos
  // la parte más frágil del protocolo Web Push para un recordatorio que no necesita contenido dinámico.
  return fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: authorization,
      TTL: String(NOTIFICATION_TTL_SECONDS),
      "Content-Length": "0",
    },
  });
}

function localMinutesOfDay(tz: string, d: Date): number {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: tz, hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(d);
  const h = Number(parts.find((p) => p.type === "hour")!.value);
  const m = Number(parts.find((p) => p.type === "minute")!.value);
  return h * 60 + m;
}

function localDateStr(tz: string, d: Date): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: tz }).format(d); // YYYY-MM-DD
}

function timeToMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

Deno.serve(async (req) => {
  if (req.headers.get("x-cron-secret") !== Deno.env.get("CRON_SECRET")) {
    return new Response("unauthorized", { status: 401 });
  }

  const vapidPublicKey = Deno.env.get("VAPID_PUBLIC_KEY");
  const vapidPrivateKey = Deno.env.get("VAPID_PRIVATE_KEY");
  const vapidSubject = Deno.env.get("VAPID_SUBJECT");
  if (!vapidPublicKey || !vapidPrivateKey || !vapidSubject) {
    return new Response("missing vapid config", { status: 500 });
  }
  const vapid = { publicKey: vapidPublicKey, privateKey: vapidPrivateKey, subject: vapidSubject };

  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, reminder_time, reminder_timezone, last_reminder_sent_on")
    .eq("reminder_enabled", true);
  if (profilesError) {
    return new Response(`profiles query failed: ${profilesError.message}`, { status: 500 });
  }

  const now = new Date();
  let sent = 0;

  for (const profile of profiles ?? []) {
    const tz = profile.reminder_timezone || "UTC";
    const today = localDateStr(tz, now);
    if (profile.last_reminder_sent_on === today) continue;

    const target = timeToMinutes(profile.reminder_time);
    const current = localMinutesOfDay(tz, now);
    const diff = (current - target + 1440) % 1440;
    if (diff >= 5) continue; // fuera de la ventana de este tick de cron (corre cada 5 min)

    const { data: subs, error: subsError } = await supabase
      .from("push_subscriptions")
      .select("id, endpoint")
      .eq("user_id", profile.id);
    if (subsError || !subs?.length) continue;

    let anySent = false;
    for (const sub of subs) {
      try {
        const res = await sendPush(sub.endpoint, vapid);
        if (res.status === 404 || res.status === 410) {
          await supabase.from("push_subscriptions").delete().eq("id", sub.id);
          continue;
        }
        if (res.ok) anySent = true;
      } catch {
        // push service caído/timeout puntual: no marcamos como enviado, se reintenta en el próximo tick de hoy
      }
    }

    if (anySent) {
      sent++;
      await supabase.from("profiles").update({ last_reminder_sent_on: today }).eq("id", profile.id);
    }
  }

  return new Response(JSON.stringify({ checked: profiles?.length ?? 0, sent }), {
    headers: { "Content-Type": "application/json" },
  });
});
