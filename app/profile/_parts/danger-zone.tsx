"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, Loader2, Trash2 } from "lucide-react";
import { useLocale } from "@/lib/i18n/provider";
import { useSession } from "@/components/auth/session-provider";
import { createClient } from "@/lib/supabase/client";
import { updateAuthUser } from "@/lib/supabase/auth-direct";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function DangerZone({ email }: { email: string }) {
  const { t } = useLocale();
  const [pwdOpen, setPwdOpen] = useState(false);
  const [delOpen, setDelOpen] = useState(false);

  return (
    <section className="washi-card p-5 space-y-3 border-primary">
      <h2 className="section-title text-base text-primary">
        {t.profile.dangerZone}
      </h2>

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-full justify-start"
        onClick={() => setPwdOpen(true)}
      >
        <KeyRound className="size-4" /> {t.profile.changePasswordCta}
      </Button>

      <Button
        type="button"
        variant="destructive"
        size="sm"
        className="w-full justify-start"
        onClick={() => setDelOpen(true)}
      >
        <Trash2 className="size-4" /> {t.profile.deleteCta}
      </Button>

      <ChangePasswordModal open={pwdOpen} onOpenChange={setPwdOpen} />
      <DeleteAccountModal
        email={email}
        open={delOpen}
        onOpenChange={setDelOpen}
      />
    </section>
  );
}

function ChangePasswordModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { t } = useLocale();
  const [newPwd, setNewPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">(
    "idle",
  );
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (newPwd.length < 6) {
      setError(t.profile.changePasswordTooShort);
      return;
    }
    if (newPwd !== confirm) {
      setError(t.profile.changePasswordMismatch);
      return;
    }
    setStatus("saving");
    const { error: err } = await updateAuthUser({ password: newPwd });
    if (err) {
      setStatus("error");
      setError(t.profile.changePasswordError + err);
      return;
    }
    setStatus("success");
    setNewPwd("");
    setConfirm("");
    setTimeout(() => {
      setStatus("idle");
      onOpenChange(false);
    }, 1500);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t.profile.changePasswordTitle}</DialogTitle>
        </DialogHeader>

        <form onSubmit={submit} className="mt-2 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new_pwd">{t.profile.changePasswordNew}</Label>
            <Input
              id="new_pwd"
              type="password"
              autoComplete="new-password"
              minLength={6}
              required
              value={newPwd}
              onChange={(e) => setNewPwd(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm_pwd">
              {t.profile.changePasswordConfirm}
            </Label>
            <Input
              id="confirm_pwd"
              type="password"
              autoComplete="new-password"
              minLength={6}
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
          {status === "success" && (
            <p className="text-sm text-primary">
              {t.profile.changePasswordSuccess}
            </p>
          )}

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              {t.common.cancel}
            </Button>
            <Button type="submit" disabled={status === "saving"}>
              {status === "saving" && <Loader2 className="size-4 animate-spin" />}
              {t.profile.changePasswordSubmit}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DeleteAccountModal({
  email,
  open,
  onOpenChange,
}: {
  email: string;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { t } = useLocale();
  const router = useRouter();
  const { signOut } = useSession();
  const [typed, setTyped] = useState("");
  const [status, setStatus] = useState<"idle" | "deleting" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (typed.trim().toLowerCase() !== email.toLowerCase()) return;
    setStatus("deleting");
    const supabase = createClient();
    const { error: err } = await supabase.rpc("delete_account");
    if (err) {
      setStatus("error");
      setError(t.profile.deleteError + err.message);
      return;
    }
    await signOut();
    onOpenChange(false);
    router.replace("/");
    router.refresh();
  }

  const match = typed.trim().toLowerCase() === email.toLowerCase();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-destructive">
            {t.profile.deleteTitle}
          </DialogTitle>
          <DialogDescription>{t.profile.deleteDesc}</DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="mt-2 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="confirm_email">{t.profile.deleteConfirmHint}</Label>
            <Input
              id="confirm_email"
              type="email"
              required
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              placeholder={email}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              {t.common.cancel}
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={!match || status === "deleting"}
            >
              {status === "deleting" && (
                <Loader2 className="size-4 animate-spin" />
              )}
              {status === "deleting" ? t.profile.deleteSubmitting : t.profile.deleteCta}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
