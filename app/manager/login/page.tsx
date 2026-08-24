import { ShieldCheck } from "lucide-react";
import Link from "next/link";
import { ManagerLoginForm } from "@/components/manager-login-form";

export default function ManagerLoginPage() {
  return (
    <main className="login-page">
      <section className="login-visual">
        <Link className="brand" href="/manager/login">
          <span className="brand-mark">Z</span>
          <span>
            <p className="brand-title">Zivira Labs</p>
            <p className="brand-subtitle">Manager Portal</p>
          </span>
        </Link>
        <h1>Manager Portal</h1>
        <p>Review, approve and manage your team&apos;s field activities in one place.</p>
      </section>
      <section className="login-panel">
        <div className="login-card">
          <ShieldCheck size={34} color="var(--brand)" />
          <h2>Sign in</h2>
          <p className="muted">Seed user: abm-001</p>
          <ManagerLoginForm />
        </div>
      </section>
    </main>
  );
}
