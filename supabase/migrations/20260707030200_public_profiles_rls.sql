
-- Hasta ahora "profiles" solo era legible por el propio dueño (auth.uid() = id),
-- lo que de hecho hacía que Community.tsx no pudiera resolver el display_name
-- de otros autores (caía siempre al nombre por defecto). Ninguna columna de
-- profiles es sensible (nombre, streak, xp, foco, hora de recordatorio), así
-- que se abre lectura a cualquier autenticado.
CREATE POLICY "Authed read all profiles" ON public.profiles
  FOR SELECT TO authenticated USING (true);
