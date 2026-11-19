import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import AuthLayout from "../components/auth/AuthLayout";
import AuthCard from "../components/auth/AuthCard";
import Field from "../components/auth/Field";
import Button from "../components/auth/Button";
import { useAuth } from "../context/AuthContext";
import { authApi } from "../lib/apiClient";
import { isProfileComplete } from "../lib/profileCompletion";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);

    try {
      const user = await login(form.email, form.password);
      navigate(isProfileComplete(user) ? "/dashboard" : "/complete-profile");
    } catch (err) {
      setError(err.message || "Invalid email or password");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout
      headline={
        <>
          Peace of mind
          <br />
          on every <span className="text-[var(--action-primary)]">trail.</span>
        </>
      }
    >
      <AuthCard className="max-w-[480px]">
        <form className="flex flex-col gap-[var(--space-5)]" onSubmit={onSubmit}>
          <div>
            <h2 className="text-[var(--font-size-2xl)] font-bold tracking-tight text-[var(--text-primary)] sm:text-[var(--font-size-3xl)]">
              Welcome back
            </h2>
            <p className="mt-[var(--space-1)] text-[var(--font-size-sm)] text-[var(--text-secondary)]">
              Log in to see your live trail dashboard.
            </p>
          </div>

          {error && (
            <div className="rounded-[var(--radius-lg)] border border-[var(--action-destructive)]/30 bg-[var(--surface-error)] px-[var(--space-4)] py-[var(--space-3)] text-[var(--font-size-sm)] font-medium text-[var(--action-destructive)]">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-[var(--space-4)]">
            <Field
              label="Email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={onChange}
              required
            />

            <Field
              label="Password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={onChange}
              required
            />
          </div>

          <Button type="submit" disabled={busy}>
            {busy ? (
              <span className="flex items-center justify-center gap-[var(--space-2)]">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                <span>Logging in…</span>
              </span>
            ) : (
              "Log in"
            )}
          </Button>

          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-[var(--border-default)]" />
            <span className="absolute bg-[var(--surface-card)] px-[var(--space-3)] text-[var(--font-size-xs)] uppercase tracking-wider text-[var(--text-muted)]">
              or
            </span>
          </div>

          <Button
            variant="secondary"
            type="button"
            onClick={() => (window.location.href = authApi.googleLoginUrl())}
            className="flex items-center justify-center gap-[var(--space-3)]"
          >
            <FcGoogle className="text-[22px]" />
            Continue with Google
          </Button>

          <p className="text-center text-[var(--font-size-sm)] text-[var(--text-muted)]">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-[var(--action-primary)] transition-colors hover:text-[var(--action-primary-hover)] underline underline-offset-4"
            >
              Sign up
            </Link>
          </p>
        </form>
      </AuthCard>
    </AuthLayout>
  );
}
