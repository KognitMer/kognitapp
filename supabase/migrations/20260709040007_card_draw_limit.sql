-- Límite de una carta gratis por día para usuarios no suscriptos.
-- is_subscribed: por ahora no hay cobro real conectado, todos arrancan en false.
-- last_free_card_draw_at: se actualiza cuando un usuario no suscripto saca una carta.
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_subscribed boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS last_free_card_draw_at timestamptz;
