import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { X, Mic, Square } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/sonner";
import { useVoiceRecorder } from "@/hooks/use-voice-recorder";
import { audioFileExtension, formatDuration } from "@/lib/audio";

interface Props {
  open: boolean;
  onClose: () => void;
  recipientId: string;
  recipientName: string;
  noteId?: string;
  onSent?: () => void;
}

export const ReplyComposer = ({ open, onClose, recipientId, recipientName, noteId, onSent }: Props) => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const recorder = useVoiceRecorder();

  const send = async () => {
    if (!user || !content.trim()) return;
    setSending(true);
    const { error } = await supabase.rpc("send_direct_message", {
      p_recipient_id: recipientId,
      p_content: content.trim(),
      p_note_id: noteId ?? null,
    });
    setSending(false);
    if (error) {
      toast.error(t("replyComposer.toasts.error"));
      return;
    }
    toast.success(t("replyComposer.toasts.success"));
    setContent("");
    onSent?.();
    onClose();
  };

  const startRecording = async () => {
    try {
      await recorder.start();
    } catch {
      toast.error(t("messages.recording.permissionDenied"));
    }
  };

  useEffect(() => {
    if (recorder.status !== "recorded" || !recorder.recording || !user) return;
    (async () => {
      setSending(true);
      const ext = audioFileExtension(recorder.recording!.mimeType);
      const sortedIds = [user.id, recipientId].sort().join("_");
      const path = `${sortedIds}/${crypto.randomUUID()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("voice-messages")
        .upload(path, recorder.recording!.blob, { cacheControl: "3600", upsert: false });
      if (uploadError) {
        setSending(false);
        toast.error(t("messages.recording.uploadError"));
        recorder.reset();
        return;
      }
      const { error } = await supabase.rpc("send_direct_message", {
        p_recipient_id: recipientId,
        p_note_id: noteId ?? null,
        p_audio_path: path,
        p_audio_duration_seconds: Math.round(recorder.recording!.durationSeconds),
      });
      setSending(false);
      recorder.reset();
      if (error) {
        toast.error(t("replyComposer.toasts.error"));
        return;
      }
      toast.success(t("replyComposer.toasts.success"));
      onSent?.();
      onClose();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- solo dispara cuando termina de grabar
  }, [recorder.status]);

  if (!open) return null;

  return (
    <div className="absolute inset-0 z-50 bg-foreground/40 backdrop-blur-sm flex items-end md:items-center justify-center">
      <div className="w-full bg-card rounded-t-3xl md:rounded-3xl shadow-card p-5 max-h-[85%] overflow-y-auto">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold">{t("replyComposer.titlePrefix")} {recipientName}</p>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
            <X size={14} />
          </button>
        </div>

        {recorder.status === "recording" ? (
          <div className="mt-4 w-full flex items-center gap-2 bg-secondary/40 rounded-2xl py-3 px-4">
            <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
            <span className="flex-1 text-xs font-bold">{t("messages.recording.recording")} {formatDuration(recorder.elapsed)}</span>
            <button type="button" onClick={recorder.cancel} aria-label={t("messages.recording.cancelAria")}><X size={16} /></button>
            <button type="button" onClick={recorder.stop} aria-label={t("messages.recording.stopAria")}><Square size={16} /></button>
          </div>
        ) : (
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder={t("replyComposer.placeholder")}
            rows={4}
            autoFocus
            className="mt-4 w-full bg-secondary/40 rounded-2xl p-3 text-sm placeholder:text-muted-foreground/70 focus:outline-none resize-none"
          />
        )}

        {recorder.status !== "recording" && (
          content.trim() ? (
            <button
              onClick={send}
              disabled={sending}
              className="mt-4 w-full bg-foreground text-background font-bold py-3.5 rounded-2xl text-sm shadow-card disabled:opacity-40">
              {sending ? t("replyComposer.sending") : t("replyComposer.send")}
            </button>
          ) : recorder.supported && (
            <button
              onClick={startRecording}
              disabled={sending}
              className="mt-4 w-full flex items-center justify-center gap-2 bg-foreground text-background font-bold py-3.5 rounded-2xl text-sm shadow-card disabled:opacity-40">
              <Mic size={15} />
              {t("replyComposer.recordAudio")}
            </button>
          )
        )}
      </div>
    </div>
  );
};
