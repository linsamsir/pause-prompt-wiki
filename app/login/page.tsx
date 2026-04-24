import { LoginForm } from "@/components/login-form";
import { LoginHeader } from "./_parts";

export const metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 px-6 py-16">
      <LoginHeader />
      <div className="washi-card p-6">
        <LoginForm />
      </div>
    </div>
  );
}
