import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ArrowRight, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

type TesterProgramDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const testerFormUrl = import.meta.env.VITE_TESTER_FORM_URL?.trim();

export function TesterProgramDialog({ open, onOpenChange }: TesterProgramDialogProps) {
  const { t } = useTranslation();

  const ctaClassName =
    "flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-slate-950 bg-gradient-to-r from-[#2b72df] to-[#46b8e7] px-5 py-3.5 text-sm font-bold text-white shadow-soft transition-transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2";

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[28px] border border-white/20 bg-[#f8fafc] shadow-2xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
          <div className="relative bg-gradient-to-br from-[#2b72df] to-[#46b8e7] px-6 pb-7 pt-6 text-white sm:px-8 sm:pb-8">
            <DialogPrimitive.Close
              className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full text-white/80 transition-colors hover:bg-white/15 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/80"
              aria-label={t("landing.testerProgram.closeAria")}
            >
              <X size={18} />
            </DialogPrimitive.Close>

            <p className="inline-flex rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em]">
              {t("landing.testerProgram.eyebrow")}
            </p>
            <DialogPrimitive.Title className="mt-4 max-w-xs text-3xl font-extrabold leading-[1.05] tracking-tight">
              {t("landing.testerProgram.title")}
            </DialogPrimitive.Title>
          </div>

          <div className="space-y-5 px-6 py-6 text-slate-950 sm:px-8">
            <DialogPrimitive.Description className="text-sm leading-relaxed text-slate-700">
              {t("landing.testerProgram.description")}
            </DialogPrimitive.Description>

            <div className="rounded-2xl bg-[#eaf2f7] p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#566b81]">
                {t("landing.testerProgram.instructionsTitle")}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[#385066]">
                {t("landing.testerProgram.instructions")}
              </p>
              <p className="mt-3 border-t border-[#cfdde7] pt-3 text-xs leading-relaxed text-[#566b81]">
                {t("landing.testerProgram.voluntary")}
              </p>
            </div>

            <div className="space-y-3">
              {testerFormUrl ? (
                <a
                  className={ctaClassName}
                  href={testerFormUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => onOpenChange(false)}
                >
                  {t("landing.testerProgram.primaryCta")}
                  <ArrowRight size={17} />
                </a>
              ) : (
                <Link
                  className={ctaClassName}
                  to="/auth?mode=signup&tester=1"
                  onClick={() => onOpenChange(false)}
                >
                  {t("landing.testerProgram.primaryCta")}
                  <ArrowRight size={17} />
                </Link>
              )}

              <DialogPrimitive.Close className="w-full py-1 text-xs font-semibold text-slate-500 transition-colors hover:text-slate-800 focus:outline-none focus:underline">
                {t("landing.testerProgram.secondaryCta")}
              </DialogPrimitive.Close>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
