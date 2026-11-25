import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCheck } from "react-icons/fa6";
import { IoShieldOutline, IoRadioOutline } from "react-icons/io5";
import AuthLayout from "../components/auth/AuthLayout";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../components/ui/card";
import Field from "../components/auth/Field";
import PhoneField from "../components/auth/PhoneField";
import Button from "../components/auth/Button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { useAuth } from "../context/AuthContext";
import { cleanEmail } from "../utils/sanitizeEmail";

const EMPTY = {
  username: "",
  email: "",
  password: "",
  phoneNumber: "",
  emergencyContactName: "",
  emergencyContactPhone: "",
  height: "",
  weight: "",
};

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // Dynamic safety profile readiness calculation (8 required fields)
  const checks = [
    Boolean(form.username.trim()),
    cleanEmail(form.email).includes("@") && cleanEmail(form.email).includes("."),
    form.password.length >= 6,
    Boolean(form.phoneNumber.trim()),
    Boolean(form.height) && Number(form.height) > 0,
    Boolean(form.emergencyContactName.trim()),
    Boolean(form.weight) && Number(form.weight) > 0,
    Boolean(form.emergencyContactPhone.trim()),
  ];
  const completedCount = checks.filter(Boolean).length;
  const progressPercent = Math.round((completedCount / checks.length) * 100);

  const getStatusText = () => {
    if (completedCount === 8) return "100% • Trail-Ready";
    if (completedCount >= 5) return `${progressPercent}% • Calibrating (${completedCount}/8)`;
    if (completedCount >= 1) return `${progressPercent}% • In Progress (${completedCount}/8)`;
    return "0% • Awaiting Input";
  };

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);

    try {
      await register({ ...form, email: cleanEmail(form.email) });
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout headline="Set up your safety profile.">
      <Card className="w-full max-w-[var(--auth-card-max-width-wide)] border border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-slate-900/90 shadow-2xl backdrop-blur-2xl">
        <CardHeader className="space-y-4 pb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <CardTitle className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                Create your account
              </CardTitle>
              <CardDescription className="text-sm text-slate-500 dark:text-slate-400">
                Set up your baseline safety profile for automated rescue dispatch.
              </CardDescription>
            </div>
            <Badge
              variant={completedCount === 8 ? "tactical" : "secondary"}
              className="shrink-0 uppercase font-mono tracking-wider text-[11px]"
            >
              {completedCount === 8 ? "ARMED & READY" : "SAFETY PROFILE"}
            </Badge>
          </div>

          {/* Live Dynamic Readiness Meter */}
          <div className="rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-900/60 p-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-600 dark:text-slate-400">
                Safety Readiness
              </span>
              <span
                className={`font-semibold font-mono transition-colors duration-300 ${
                  completedCount === 8
                    ? "text-emerald-500 dark:text-emerald-400"
                    : "text-[var(--action-primary)]"
                }`}
              >
                {getStatusText()}
              </span>
            </div>
            <Progress
              value={progressPercent}
              max={100}
              className="mt-2 h-2 bg-slate-200 dark:bg-slate-800"
              indicatorClassName={
                completedCount === 8
                  ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                  : "bg-[var(--action-primary)]"
              }
            />
          </div>
        </CardHeader>

        <CardContent>
          <form className="flex flex-col space-y-4" onSubmit={onSubmit}>
            {error && (
              <div className="rounded-lg border border-red-200/80 bg-red-50/90 px-3.5 py-2.5 text-sm font-medium text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
                {error}
              </div>
            )}

            {/* SECTION 01: ACCOUNT CREDENTIALS */}
            <div className="flex items-center gap-2 pt-1 text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-slate-800 pb-1.5">
              <FaUserCheck className="h-3.5 w-3.5 text-[var(--action-primary)]" />
              <span>01 / Account & Credentials</span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field
                label="Username"
                name="username"
                placeholder="trailblazer_23"
                value={form.username}
                onChange={onChange}
                required
              />

              <Field
                label="Email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="hiker@trailguard.org"
                value={form.email}
                onChange={onChange}
                onBlur={() => setForm((f) => ({ ...f, email: cleanEmail(f.email) }))}
                required
              />
            </div>

            <Field
              label="Password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={onChange}
              required
            />

            {/* SECTION 02: SAFETY & EMERGENCY BASELINE */}
            <div className="flex items-center gap-2 pt-2 text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-slate-800 pb-1.5">
              <IoShieldOutline className="h-3.5 w-3.5 text-[var(--action-primary)]" />
              <span>02 / Emergency Contact & Fall Baseline</span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <PhoneField
                label="Phone Number"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={onChange}
                placeholder="Enter phone number"
                defaultCountry="IN"
                required
              />

              <Field
                label="Height (cm)"
                name="height"
                type="number"
                placeholder="175"
                value={form.height}
                onChange={onChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field
                label="Emergency contact name"
                name="emergencyContactName"
                placeholder="Priya Nair"
                value={form.emergencyContactName}
                onChange={onChange}
                required
              />

              <Field
                label="Weight (kg)"
                name="weight"
                type="number"
                placeholder="70"
                value={form.weight}
                onChange={onChange}
                required
              />
            </div>

            <PhoneField
              label="Emergency contact phone"
              name="emergencyContactPhone"
              value={form.emergencyContactPhone}
              onChange={onChange}
              placeholder="Emergency contact number"
              defaultCountry="IN"
            />

            {/* HARDWARE STATUS REASSURANCE */}
            <div className="flex items-center gap-3 rounded-xl border border-[var(--action-primary)]/20 bg-[var(--action-primary)]/5 px-3.5 py-2.5 text-xs text-slate-600 dark:text-slate-400">
              <IoRadioOutline className="h-4 w-4 shrink-0 text-[var(--action-primary)] animate-pulse" />
              <span>
                <strong className="text-slate-900 dark:text-slate-200">Hardware Link:</strong> ESP32-S3 wearable & Ed25519 pairing activates post-setup.
              </span>
            </div>

            {/* ACTION BUTTON */}
            <div className="pt-2">
              <Button type="submit" disabled={busy}>
                {busy ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    <span>Creating Safety Profile…</span>
                  </span>
                ) : (
                  "Create Safety Profile"
                )}
              </Button>
            </div>
          </form>
        </CardContent>

        <CardFooter className="justify-center border-t border-slate-100 dark:border-slate-800/60 pt-4 text-center text-sm text-slate-500 dark:text-slate-400">
          <span>
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-[var(--action-primary)] transition-colors hover:text-[var(--action-primary-hover)] underline underline-offset-4"
            >
              Sign in
            </Link>
          </span>
        </CardFooter>
      </Card>
    </AuthLayout>
  );
}
