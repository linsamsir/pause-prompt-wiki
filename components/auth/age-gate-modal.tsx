"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/lib/i18n/provider";
import { useSession } from "@/components/auth/session-provider";

export function AgeGateModal({
  open,
  onOpenChange,
  onConfirmed,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onConfirmed: () => void;
}) {
  const { t } = useLocale();
  const { markAgeVerified } = useSession();
  const [checked, setChecked] = useState(false);
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [showRequire, setShowRequire] = useState(false);

  useEffect(() => {
    if (!open) {
      setChecked(false);
      setStatus("idle");
      setShowRequire(false);
    }
  }, [open]);

  async function onConfirm() {
    if (!checked) {
      setShowRequire(true);
      return;
    }
    setStatus("saving");
    const res = await markAgeVerified();
    if (!res.ok) {
      setStatus("error");
      return;
    }
    setStatus("idle");
    onOpenChange(false);
    onConfirmed();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary">
            <AlertTriangle className="size-5" />
            <DialogTitle>{t.age.title}</DialogTitle>
          </div>
          <DialogDescription>{t.age.body}</DialogDescription>
        </DialogHeader>

        <label className="mt-5 flex cursor-pointer items-start gap-2 border border-border p-3 hover:border-primary">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => {
              setChecked(e.target.checked);
              if (e.target.checked) setShowRequire(false);
            }}
            className="mt-0.5 size-4 accent-primary"
          />
          <span className="text-sm leading-relaxed">{t.age.checkbox}</span>
        </label>

        {showRequire && (
          <p className="mt-2 text-xs text-destructive">{t.age.requireCheck}</p>
        )}
        {status === "error" && (
          <p className="mt-2 text-xs text-destructive">{t.age.error}</p>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={status === "saving"}
          >
            {t.age.reject}
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={status === "saving"}
          >
            {status === "saving" && (
              <Loader2 className="size-4 animate-spin" />
            )}
            {t.age.confirm}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
