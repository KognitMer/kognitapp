import { useState } from "react";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/sonner";

interface Props {
  open: boolean;
  onClose: () => void;
  recipientId: string;
  recipientName: string;
  noteId: string;
  onSent?: () => void;
}

export const ReplyComposer = ({ open, onClose, recipientId, recipientName, noteId, onSent }: Props) => {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);

  if (!open) return null;

  const send = async () => {
    if (!user || !content.trim()) return;
    setSending(true);
    const { error } = await supabase.from("messages").insert({
      sender_id: user.id,
      recipient_id: recipientId,
      note_id: noteId,
      content: content.trim(),
    });
    setSending(false);
    if (error) {
      toast.error("No se pudo enviar el mensaje");
      return;
    }
    toast.success("Mensaje enviado");
    setContent("");
    onSent?.();
    onClose();
  };

  return (
    <div className="absolute inset-0 z-50 bg-foreground/40 backdrop-blur-sm flex items-end md:items-center justify-center">
      <div className="w-full bg-card rounded-t-3xl md:rounded-3xl shadow-card p-5 max-h-[85%] overflow-y-auto">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold">Responder a {recipientName}</p>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
            <X size={14} />
          </button>
        </div>

        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Escribí tu mensaje..."
          rows={4}
          autoFocus
          className="mt-4 w-full bg-secondary/40 rounded-2xl p-3 text-sm placeholder:text-muted-foreground/70 focus:outline-none resize-none"
        />

        <button
          onClick={send}
          disabled={!content.trim() || sending}
          className="mt-4 w-full bg-foreground text-background font-bold py-3.5 rounded-2xl text-sm shadow-card disabled:opacity-40">
          {sending ? "Enviando..." : "Enviar"}
        </button>
      </div>
    </div>
  );
};
