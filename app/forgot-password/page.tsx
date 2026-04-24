import { ForgotForm } from "./_parts/forgot-form";
import { ForgotHeader } from "./_parts/header";

export const metadata = { title: "Forgot password" };

export default function ForgotPasswordPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 px-6 py-16">
      <ForgotHeader />
      <div className="washi-card p-6">
        <ForgotForm />
      </div>
    </div>
  );
}
