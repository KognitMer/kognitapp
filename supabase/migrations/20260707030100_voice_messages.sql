
INSERT INTO storage.buckets (id, name, public) VALUES ('voice-messages', 'voice-messages', false)
  ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Participants read own voice-messages folder" ON storage.objects
  FOR SELECT TO authenticated USING (
    bucket_id = 'voice-messages' AND (
      auth.uid()::text = split_part((storage.foldername(name))[1], '_', 1)
      OR auth.uid()::text = split_part((storage.foldername(name))[1], '_', 2)
    )
  );
CREATE POLICY "Participants upload to own voice-messages folder" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (
    bucket_id = 'voice-messages' AND (
      auth.uid()::text = split_part((storage.foldername(name))[1], '_', 1)
      OR auth.uid()::text = split_part((storage.foldername(name))[1], '_', 2)
    )
  );
CREATE POLICY "Participants delete own voice-messages folder" ON storage.objects
  FOR DELETE TO authenticated USING (
    bucket_id = 'voice-messages' AND (
      auth.uid()::text = split_part((storage.foldername(name))[1], '_', 1)
      OR auth.uid()::text = split_part((storage.foldername(name))[1], '_', 2)
    )
  );

-- Audio también en notas de Comunidad (bucket público, igual que note-images)
ALTER TABLE public.notes ADD COLUMN audio_path text;
ALTER TABLE public.notes ADD COLUMN audio_duration_seconds smallint;

INSERT INTO storage.buckets (id, name, public) VALUES ('note-audio', 'note-audio', true)
  ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read note-audio" ON storage.objects
  FOR SELECT USING (bucket_id = 'note-audio');
CREATE POLICY "Users upload to own note-audio folder" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (
    bucket_id = 'note-audio' AND (storage.foldername(name))[1] = auth.uid()::text
  );
CREATE POLICY "Users delete own note-audio" ON storage.objects
  FOR DELETE TO authenticated USING (
    bucket_id = 'note-audio' AND (storage.foldername(name))[1] = auth.uid()::text
  );
