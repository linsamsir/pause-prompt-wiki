import { SettingsForm } from "./_parts/settings-form";

export const metadata = { title: "Settings" };

export default function SettingsPage() {
    return (
          <div className="mx-auto max-w-lg px-6 py-16">
                <div className="mb-8">
                        <h1 className="font-serif-tc text-2xl font-semibold">Settings</h1>
                        <p className="mt-2 text-sm text-muted-foreground">
                                  Manage your profile and preferences
                        </p>
                </div>div>
                <SettingsForm />
          </div>div>
        );
}</div>
