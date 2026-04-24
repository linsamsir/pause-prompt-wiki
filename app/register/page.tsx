import { RegisterForm } from "./_parts/register-form";
import { RegisterHeader } from "./_parts/header";

export const metadata = { title: "Register" };

export default function RegisterPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 px-6 py-16">
      <RegisterHeader />
      <div className="washi-card p-6">
        <RegisterForm />
      </div>
    </div>
  );
}
