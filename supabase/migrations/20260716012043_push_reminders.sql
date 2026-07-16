
-- Recordatorio diario vía Web Push: timezone del usuario + dedupe de envío
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS reminder_timezone text NOT NULL DEFAULT 'UTC',
  ADD COLUMN IF NOT EXISTS last_reminder_sent_on date;

-- Subscriptions de Web Push, una fila por dispositivo
CREATE TABLE public.push_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint text NOT NULL,
  p256dh text NOT NULL,
  auth text NOT NULL,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, endpoint)
);
GRANT SELECT, INSERT, DELETE ON public.push_subscriptions TO authenticated;
GRANT ALL ON public.push_subscriptions TO service_role;
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own push subscriptions" ON public.push_subscriptions
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX push_subscriptions_user_idx ON public.push_subscriptions (user_id);

-- Cron cada 5 min: dispara la Edge Function que manda los push del día.
-- El header x-cron-secret se lee de un secret de Vault por nombre (no por valor,
-- así este archivo no contiene ningún secreto real). El secret se crea a mano,
-- fuera de git, con: select vault.create_secret('<valor>', 'cron_shared_secret');
create extension if not exists pg_cron;
create extension if not exists pg_net;

select cron.schedule(
  'send-daily-reminders',
  '*/5 * * * *',
  $$
  select net.http_post(
    url := 'https://urebsukvtbdhtkixyyaw.supabase.co/functions/v1/send-reminders',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-cron-secret', (select decrypted_secret from vault.decrypted_secrets where name = 'cron_shared_secret')
    ),
    body := '{}'::jsonb
  );
  $$
);
