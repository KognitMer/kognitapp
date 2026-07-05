# Kognit — CLAUDE.md

App de entrenamiento mental para jugadores de poker. Mobile-first PWA, todo el UI está en español rioplatense.

## Stack

| Capa | Tecnología |
|---|---|
| Framework | React 18 + TypeScript |
| Build | Vite 5 + SWC (`@vitejs/plugin-react-swc`) |
| Estilos | Tailwind CSS 3 + `tailwindcss-animate` |
| Componentes | shadcn/ui (Radix UI primitives) |
| Backend / Auth / DB | Supabase (`@supabase/supabase-js`) |
| Server state | TanStack Query v5 |
| Routing | React Router DOM v7 |
| Formularios | React Hook Form + Zod |
| Animación | Framer Motion |
| Charts | Recharts |
| Iconos | Lucide React |
| Fuentes | Poppins (display) · Hind (body) · EB Garamond (cartas) via `@fontsource` |
| Sonido | Web Audio API — `src/lib/sound.ts` |
| Tests | Vitest + Testing Library |
| Linter | ESLint v9 |
| Package manager | **Bun** (hay `bun.lockb`; usar `bun` en lugar de `npm`/`npx`) |

## Comandos

```bash
bun dev          # servidor de desarrollo
bun build        # build de producción
bun preview      # preview del build
bun test         # vitest run (single pass)
bun test:watch   # vitest en modo watch
bun lint         # eslint
```

## Rutas de la app

| Path | Componente | Descripción |
|---|---|---|
| `/` | `pages/Index.tsx` | Landing + showcase de prototipos en PhoneFrame |
| `/auth` | `pages/Auth.tsx` | Login / signup / forgot / guest |
| `/reset-password` | `pages/ResetPassword.tsx` | Callback de reset de contraseña |
| `/app` | `pages/MobileApp.tsx` | Shell de la app autenticada |
| `*` | `pages/NotFound.tsx` | 404 |

`/app` requiere usuario autenticado; redirige a `/auth` si no hay sesión.

## Arquitectura de `/app`

`MobileApp.tsx` maneja todo el estado de navegación con un `useState<View>`. No usa React Router para las sub-pantallas — el cambio de vista es imperativo via callbacks.

```
View = "home" | "cards" | "calendar" | "community" | "profile" | "tilt" | "ritual" | "messages"
Tab  = "home" | "cards" | "calendar" | "community" | "profile"  ← visible en BottomNav
```

`BottomNav` se oculta en las vistas `tilt`, `ritual` y `messages` (pantallas de flujo completo).

### Pantallas (`src/pages/kognit/`)

| Archivo | Vista | Descripción |
|---|---|---|
| `Home.tsx` | `home` | Dashboard: selector de estado mental + acciones rápidas |
| `Tilt.tsx` | `tilt` | Protocolo de reset: respiración 4·7·8 o 4·4·4 → grounding → estado emocional → check |
| `Ritual.tsx` | `ritual` | Ritual diario de 7 pasos: energía, tensión, estado emocional, reflexión, gratitud, intención |
| `Cards.tsx` | `cards` | Cartas de coaching mental por categoría |
| `Calendar.tsx` | `calendar` | Diario mental: calendario, notas rápidas y gráfico de foco semanal |
| `Profile.tsx` | `profile` | Perfil con estadísticas del jugador |
| `Community.tsx` | `community` | Feed de notas públicas con reacciones emoji, imágenes opcionales y respuesta privada por mensaje directo |
| `Messages.tsx` | `messages` | Bandeja de mensajes directos: lista de conversaciones + vista de hilo |
| `Onboarding.tsx` | — | Solo usado en la landing `/` |

## Base de datos (Supabase)

Proyecto: `urebsukvtbdhtkixyyaw`

### Tablas

**`profiles`** — stats del usuario (1:1 con `auth.users`)
```
id, display_name, focus_level, emotional_control,
total_resets, streak_days, xp,
reminder_enabled, reminder_time,
created_at, updated_at
```

**`reset_sessions`** — cada ejecución del protocolo Tilt
```
id, user_id, mode ("deep"|"fast"), state, states[],
pre_intensity, post_intensity, note, created_at
```

**`ritual_entries`** — cada ritual diario completado
```
id, user_id, energy, body_tension, emotional_state,
reflection, gratitude, intention, created_at
```

**`notes`** — notas de la comunidad
```
id, user_id, title, content, mood, tag, image_url,
visibility ("public"|"private"), created_at, updated_at
```

**`note_reactions`** — reacciones emoji en notas
```
id, note_id (→notes), user_id, reaction, created_at
```

**`messages`** — mensajes directos entre usuarios (bandeja de "Mensajes")
```
id, sender_id, recipient_id, note_id (→notes, nullable),
content, read, created_at
```

### Storage

Bucket público `note-images` (imágenes opcionales adjuntas a notas de comunidad).
Path de objetos: `{user_id}/{uuid}.{ext}`. RLS de `storage.objects`: lectura pública,
escritura/borrado restringidos a la carpeta del propio usuario
(`storage.foldername(name)[1] = auth.uid()`).

### Cliente Supabase

```ts
import { supabase } from "@/integrations/supabase/client";
```

Tipos generados en `src/integrations/supabase/types.ts`. Si se modifica el schema en Supabase, regenerar con `supabase gen types`.

### Variables de entorno

```
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
```

Definidas en `.env` (no commitear). El `.env` está en `.gitignore`.

## Auth

`src/contexts/AuthContext.tsx` expone `useAuth()`:
```ts
{ user: User | null, session: Session | null, loading: boolean, signOut: () => Promise<void> }
```

Modos de auth:
- Email + password (login / signup)
- Forgot password → email con redirect a `/reset-password`
- **Guest mode**: signup con email `guest_<rand>@kognit.app` generado en cliente

## Estructura de archivos

```
src/
├── App.tsx                        # Providers + Routes
├── main.tsx                       # Entry point + fuentes
├── index.css                      # Variables CSS (tokens de diseño)
├── assets/                        # kognit-logo.png, kognit-mascot.png
├── components/
│   ├── kognit/
│   │   ├── BottomNav.tsx          # Barra de navegación inferior
│   │   ├── NoteComposer.tsx       # Modal para escribir nota de comunidad
│   │   ├── ReplyComposer.tsx      # Modal para responder a un autor por mensaje directo
│   │   └── PhoneFrame.tsx         # Wrapper visual de "teléfono" para la landing
│   ├── ui/                        # Componentes shadcn/ui (no editar manualmente)
│   └── NavLink.tsx
├── contexts/
│   └── AuthContext.tsx
├── data/
│   └── mentalCards.ts             # Contenido estático de las 5 categorías × 5 cartas
├── hooks/
│   ├── use-mobile.tsx
│   └── use-toast.ts
├── integrations/supabase/
│   ├── client.ts                  # createClient singleton
│   └── types.ts                   # Tipos generados — NO editar a mano
├── lib/
│   ├── sound.ts                   # playBong() — Web Audio API
│   └── utils.ts                   # cn() helper + timeAgo() formatter
└── pages/
    ├── Auth.tsx
    ├── Index.tsx                  # Landing pública
    ├── MobileApp.tsx              # Shell de la app autenticada
    ├── NotFound.tsx
    ├── ResetPassword.tsx
    └── kognit/                    # Pantallas de la app
```

## Diseño y estilos

### Tokens CSS personalizados (definidos en `index.css`)

Gradientes:
- `bg-gradient-hero` — fondo principal de la app (oscuro/neutro)
- `bg-gradient-primary` — teal/verde azulado (acción primaria)
- `bg-gradient-emergency` — azul cobalto (protocolo tilt/reset)
- `bg-gradient-deep` — oscuro profundo (pantallas de flujo: Tilt, Ritual)

Sombras: `shadow-card`, `shadow-soft`, `shadow-glow`, `shadow-emergency`

Animaciones: `animate-float-slow` (mascota), `animate-pulse-ring` (botón tilt)

Color extra: `warning` (amarillo/naranja, disciplina)

### Fuentes

- Display / headings (`h1`-`h4`, `.font-display`): Poppins bold, tracking negativo (`-0.02em`)
- Body / UI: `font-sans` → Hind (weights: 300 · 400 · 500 · 600 · 700), tracking negativo leve (`-0.011em` global en `body`)
- Cartas mentales (`Cards.tsx`): `font-serif` → EB Garamond (weights: 400 · 500 · 600 + italic 400) — transmite sabiduría, se usa en título, mensaje y acción de cada carta

### Convenciones de UI

- Bordes redondeados agresivos: `rounded-2xl`, `rounded-3xl`
- Glassmorphism en flujos oscuros: `bg-white/10 backdrop-blur border border-white/15`
- Texto en mayúsculas con tracking para labels: `text-[10px] uppercase tracking-[0.25em] font-bold`
- Todos los textos de la interfaz en **español rioplatense** (vos, sos, etc.)

## Cartas mentales

`src/data/mentalCards.ts` — 5 categorías, 10 cartas cada una:

| id | Nombre | Accent |
|---|---|---|
| `habits` | Formación de hábitos | seafoam (verde agua) |
| `focus` | Foco y concentración | info (azul) |
| `mindfulness` | Mindfulness y Respiración | violet (violeta) |
| `stress` | Manejo del estrés y Emociones | destructive (azul cobalto) |
| `performance` | Rendimiento mental | gold (dorado) |

Cada carta es un flip card (`Cards.tsx`): lado A muestra el título, lado B (al deslizar) muestra mensaje + acción concreta. Para agregar cartas: editar el array `CATEGORIES` en `mentalCards.ts`. No hay backend para este contenido.

## Protocolo Tilt (flujo completo)

```
intro → pulse (pre_intensity) → breathe → grounding → state → check (post_intensity) → exit
```

- Modes: `fast` (4·4·4, ~35s) / `deep` (4·7·8, ~90s)
- Al llegar a `exit`, guarda un `reset_sessions` en Supabase
- `sessionSavedRef` previene doble-guardado
- Sonido via `playBong()` (Web Audio API), activable por el usuario

## Reacciones en comunidad

5 reacciones predefinidas: `breathe` 🫁 · `focus` 🎯 · `inspire` 🌱 · `reflect` 💭 · `identify` 🤝

Constraint de unicidad en Supabase: `(note_id, user_id)` → `upsert` con `onConflict`.

## Alias de path

`@/` → `src/` (configurado en `tsconfig.app.json` y `vite.config.ts`)

## Configuración shadcn/ui

`components.json` — componentes en `src/components/ui/`, estilo `default`, Tailwind v3, aliases `@/components` y `@/lib/utils`.
Para agregar un componente: `bunx shadcn@latest add <nombre>`.
