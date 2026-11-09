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
import { cleanEmail } from "../utils/sanitizeEmail";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [verificationStage, setVerificationStage] = useState(1); // 1: Identity, 2: Token Handshake, 3: Sync

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    setVerificationStage(2);

    const sanitizedEmail = cleanEmail(form.email);
    try {
      const user = await login(sanitizedEmail, form.password);
      setVerificationStage(3);
      navigate(isProfileComplete(user) ? "/dashboard" : "/complete-profile");
    } catch (err) {
      setVerificationStage(1);
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
      <AuthCard className="max-w-[500px]">
        <form className="flex flex-col gap-4" onSubmit={onSubmit}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="tg-formcard__title">Sign In</h2>
              <p className="tg-formcard__sub">
                Authenticate with TrailGuard to access telemetry & live dispatch.
              </p>
            </div>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-teal-500/30 bg-teal-500/10 text-teal-400">
              <IoShieldCheckmarkOutline className="h-5 w-5" />
            </div>
          </div>

          {/* Tiered Verification Stage Stepper */}
          <div className="rounded-xl border border-[var(--border-default)] bg-[var(--surface-elevated)] p-3">
            <div className="mb-2 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 font-bold text-[var(--text-primary)]">
                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-teal-500/40 bg-teal-500/20 text-[10px] text-teal-300">
                  L{verificationStage}
                </span>
                <span>
                  {verificationStage === 1 && "Level 1: Identity Verification"}
                  {verificationStage === 2 && "Level 2: Cryptographic Handshake"}
                  {verificationStage === 3 && "Level 3: Telemetry Sync Complete"}
                </span>
              </div>
              <span className="font-mono text-[10px] text-teal-400">
                {verificationStage === 1 ? "Credentials" : verificationStage === 2 ? "Authorizing" : "Verified ✓"}
              </span>
            </div>

            {/* Stepper Progress Bar */}
            <div className="flex items-center gap-1.5">
              <div
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  verificationStage >= 1 ? "bg-teal-400" : "bg-[var(--border-default)]"
                }`}
              />
              <div
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  verificationStage >= 2 ? "bg-teal-400" : "bg-[var(--border-default)]"
                }`}
              />
              <div
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  verificationStage >= 3 ? "bg-teal-400" : "bg-[var(--border-default)]"
                }`}
              />
            </div>

            <div className="mt-2 flex justify-between font-mono text-[10px] text-[var(--text-muted)]">
              <span className={verificationStage >= 1 ? "font-semibold text-teal-300" : ""}>
                1. Account ID
              </span>
              <span className={verificationStage >= 2 ? "font-semibold text-teal-300" : ""}>
                2. Crypto Token
              </span>
              <span className={verificationStage >= 3 ? "font-semibold text-teal-300" : ""}>
                3. Wearable Link
              </span>
            </div>
          </div>

          {error && <div className="tg-formcard__error">{error}</div>}

          <Field
            label="Email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={onChange}
            onBlur={() => setForm((f) => ({ ...f, email: cleanEmail(f.email) }))}
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

          <Button type="submit" disabled={busy}>
            {busy ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                <span>Verifying Level {verificationStage}…</span>
              </span>
            ) : (
              "Complete Level 1 Sign In"
            )}
          </Button>

          <div className="tg-formcard__divider">
            <span />
            <em>or</em>
            <span />
          </div>

          <Button
            variant="secondary"
            type="button"
            onClick={() => (window.location.href = authApi.googleLoginUrl())}
          >
            <FcGoogle className="text-[22px]" />
            Continue with Google SSO
          </Button>

          <p className="tg-formcard__footer">
            Don't have an account?{" "}
            <Link to="/register" className="tg-formcard__link">
              Sign up
            </Link>
          </p>
        </form>
      </AuthCard>
    </AuthLayout>
  );
}
