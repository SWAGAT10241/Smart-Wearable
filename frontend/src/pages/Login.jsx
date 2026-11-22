import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { IoShieldCheckmarkOutline } from "react-icons/io5";
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
      <AuthCard className="w-full max-w-[var(--auth-card-max-width)]">
        <form className="flex flex-col" onSubmit={onSubmit}>
          {/* Header Block: Linear/Stripe style with generous breathing room */}
          <div className="mb-[var(--auth-header-margin-bottom)] flex items-start justify-between gap-[var(--auth-header-gap)]">
            <div>
              <h2 className="tg-formcard__title">Sign In</h2>
              <p className="tg-formcard__sub">
                Enter your credentials to access your safety dashboard.
              </p>
            </div>
            <div className="flex h-[var(--auth-icon-badge-size)] w-[var(--auth-icon-badge-size)] shrink-0 items-center justify-center rounded-[var(--radius-lg)] border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 text-[var(--color-accent)] shadow-sm">
              <IoShieldCheckmarkOutline className="h-[var(--auth-icon-size)] w-[var(--auth-icon-size)]" />
            </div>
          </div>

          {error && <div className="tg-formcard__error mb-[var(--auth-field-gap)]">{error}</div>}

          {/* Form Fields: Consistent vertical rhythm */}
          <div className="space-y-[var(--auth-field-gap)]">
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

          {/* Action Button: Deliberate separation */}
          <div className="mt-[var(--auth-button-margin-top)]">
            <Button type="submit" disabled={busy}>
              {busy ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  <span>Signing in…</span>
                </span>
              ) : (
                "Sign In"
              )}
            </Button>
          </div>

          {/* Divider: Clean vertical margins */}
          <div className="tg-formcard__divider my-[var(--auth-divider-margin-y)]">
            <span />
            <em>or</em>
            <span />
          </div>

          <Button
            variant="secondary"
            type="button"
            onClick={() => (window.location.href = authApi.googleLoginUrl())}
            className="flex items-center justify-center gap-[var(--space-3)]"
          >
            <FcGoogle className="text-[var(--auth-social-icon-size)]" />
            Continue with Google
          </Button>

          {/* Footer: Balanced margin handled via .tg-formcard__footer token */}
          <p className="tg-formcard__footer">
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
