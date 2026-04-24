"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Shield, CheckCircle2 } from "lucide-react";
import { useSession } from "@/components/auth/session-provider";
import { AgeGateModal } from "@/components/auth/age-gate-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

export function SettingsForm() {
    const { user, profile, loading, refreshProfile } = useSession();
    const router = useRouter();
    const [displayName, setDisplayName] = useState("");
    const [username, setUsername] = useState("");
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [ageModalOpen, setAgeModalOpen] = useState(false);

  useEffect(() => {
        if (!loading && !user) {
                router.replace("/login?redirect=/settings");
        }
  }, [user, loading, router]);

  useEffect(() => {
        if (profile) {
                setDisplayName(profile.display_name ?? "");
                setUsername(profile.username ?? "");
        }
  }, [profile]);

  async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        setError(null);
        setSaved(false);
        const supabase = createClient();
        const updates: { display_name?: string; username?: string } = {};
        if (displayName.trim()) updates.display_name = displayName.trim();
        if (username.trim()) updates.username = username.trim().toLowerCase();
        const { error: err } = await supabase
          .from("profiles")
          .update(updates)
          .eq("id", user!.id);
        setSaving(false);
        if (err) {
                setError(err.message?.includes("unique") ? "Username already taken." : "Save failed: " + err.message);
        } else {
                await refreshProfile();
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
        }
  }

  if (loading) {
        return (
                <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="size-4 animate-spin" />
                        <span>Loading...</span>
                </div>div>
              );
  }
  
    if (!user) return null;
  
    return (
          <div className="space-y-8">
                <div className="washi-card p-6 space-y-5">
                        <h2 className="font-serif-tc text-base font-semibold border-b border-border pb-2">Profile</h2>h2>
                        <div className="space-y-1">
                                  <Label className="text-xs uppercase tracking-widest text-muted-foreground">Email</Label>Label>
                                  <p className="text-sm">{user.email}</p>p>
                                  <p className="text-xs text-muted-foreground">Login via Magic Link (no password needed)</p>p>
                        </div>div>
                        <form onSubmit={handleSave} className="space-y-4">
                                  <div className="space-y-2">
                                              <Label htmlFor="display_name">Display Name</Label>Label>
                                              <Input
                                                              id="display_name"
                                                              value={displayName}
                                                              onChange={(e) => setDisplayName(e.target.value)}
                                                              placeholder="Your name"
                                                              maxLength={50}
                                                            />
                                  </div>div>
                                  <div className="space-y-2">
                                              <Label htmlFor="username">Username</Label>Label>
                                              <div className="flex items-center">
                                                            <span className="inline-flex h-9 items-center border border-r-0 border-border bg-secondary px-3 text-sm text-muted-foreground">@</span>span>
                                                            <Input
                                                                              id="username"
                                                                              value={username}
                                                                              onChange={(e) => setUsername(e.target.value.replace(/[^a-z0-9_]/gi, ""))}
                                                                              placeholder="yourname"
                                                                              maxLength={30}
                                                                              className="rounded-none border-l-0"
                                                                            />
                                              </div>div>
                                  </div>div>
                          {error && <p className="text-sm text-destructive">{error}</p>p>}
                                  <div className="flex items-center gap-3">
                                              <Button type="submit" disabled={saving}>
                                                {saving && <Loader2 className="size-4 animate-spin" />}
                                                            Save
                                              </Button>Button>
                                    {saved && (
                          <span className="flex items-center gap-1 text-sm text-primary">
                                          <CheckCircle2 className="size-4" /> Saved
                          </span>span>
                                              )}
                                  </div>div>
                        </form>form>
                </div>div>
          
                <div className="washi-card p-6 space-y-4">
                        <h2 className="font-serif-tc text-base font-semibold border-b border-border pb-2">Content Preferences</h2>h2>
                        <div className="flex items-start justify-between gap-4">
                                  <div>
                                              <div className="flex items-center gap-2">
                                                            <Shield className="size-4 text-primary" />
                                                            <span className="text-sm font-medium">NSFW Age Verification</span>span>
                                              </div>div>
                                              <p className="mt-1 text-xs text-muted-foreground">
                                                            Verify you are 18+ to enable the NSFW toggle in the header.
                                              </p>p>
                                  </div>div>
                          {profile?.age_verified ? (
                        <span className="flex shrink-0 items-center gap-1 text-xs text-primary border border-primary px-2 py-1">
                                      <CheckCircle2 className="size-3.5" /> Verified
                        </span>span>
                      ) : (
                        <Button type="button" variant="outline" size="sm" className="shrink-0" onClick={() => setAgeModalOpen(true)}>
                                      Verify Age
                        </Button>Button>
                                  )}
                        </div>div>
                </div>div>
          
                <AgeGateModal
                          open={ageModalOpen}
                          onOpenChange={setAgeModalOpen}
                          onConfirmed={async () => { await refreshProfile(); }}
                        />
          </div>div>
        );
}</div>
