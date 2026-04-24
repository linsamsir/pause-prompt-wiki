import { ResetForm } from "./_parts/reset-form";
import { ResetHeader } from "./_parts/header";

export const metadata = { title: "Reset password" };

export default function ResetPasswordPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 px-6 py-16">
      <ResetHeader />
      <div className="washi-card p-6">
        <ResetForm />
      </div>
    </div>
  );
}
