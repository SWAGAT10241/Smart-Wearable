import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { IoShieldCheckmarkOutline } from "react-icons/io5";
import AuthLayout from "../components/auth/AuthLayout";
import Field from "../components/auth/Field";
import Button from "../components/auth/Button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
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
      <Card className="w-full max-w-[var(--auth-card-max-width)] border border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-slate-900/90 shadow-2xl backdrop-blur-2xl">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Sign In
            </CardTitle>
            <CardDescription className="text-sm text-slate-500 dark:text-slate-400">
              Enter your credentials to access your safety dashboard.
            </CardDescription>
          </div>
          <Badge
            variant="tactical"
            className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono tracking-wider"
          >
            <IoShieldCheckmarkOutline className="text-sm" />
            <span>SECURE</span>
          </Badge>
        </CardHeader>

        <CardContent>
          <form className="flex flex-col space-y-4" onSubmit={onSubmit}>
            {error && (
              <div className="rounded-lg border border-red-200/80 bg-red-50/90 px-3.5 py-2.5 text-sm font-medium text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
                {error}
              </div>
            )}

            {/* Form Fields: Consistent vertical rhythm */}
            <div className="space-y-4">
              <Field
                label="Email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="hiker@trailguard.org"
                value={form.email}
                onChange={onChange}
                required
              />

              <Field
                label="Password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={form.password}
                onChange={onChange}
                required
              />
            </div>

            {/* Action Button: Deliberate separation */}
            <div className="pt-2">
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

            {/* Divider: Clean Tailwind line */}
            <div className="relative my-3 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800" />
              </div>
              <div className="relative bg-white/95 dark:bg-slate-900/90 px-3 text-xs uppercase tracking-wider text-slate-400">
                or
              </div>
            </div>

            <Button
              variant="secondary"
              type="button"
              onClick={() => (window.location.href = authApi.googleLoginUrl())}
              className="flex items-center justify-center gap-3"
            >
              <FcGoogle className="text-lg" />
              Continue with Google
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center border-t border-slate-100 dark:border-slate-800/60 pt-4 text-center text-sm text-slate-500 dark:text-slate-400">
          <span>
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-[var(--action-primary)] transition-colors hover:text-[var(--action-primary-hover)] underline underline-offset-4"
            >
              Sign up
            </Link>
          </span>
        </CardFooter>
      </Card>
    </AuthLayout>
  );
}
