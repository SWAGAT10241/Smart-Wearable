import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCheck } from "react-icons/fa6";
import { IoShieldOutline, IoRadioOutline } from "react-icons/io5";
import AuthLayout from "../components/auth/AuthLayout";
import AuthCard from "../components/auth/AuthCard";
import Field from "../components/auth/Field";
import PhoneField from "../components/auth/PhoneField";
import Button from "../components/auth/Button";
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
      <AuthCard className="max-w-[var(--auth-card-max-width-wide)]">
        <form className="flex flex-col gap-[var(--auth-field-gap)]" onSubmit={onSubmit}>
          {/* Header Block with Live Safety Readiness Meter */}
          <div className="mb-[var(--auth-header-margin-bottom)]">
            <div className="flex items-start justify-between gap-[var(--auth-header-gap)]">
              <div>
                <h2 className="tg-formcard__title">Create your account</h2>
                <p className="tg-formcard__sub">
                  Set up your baseline safety profile for automated rescue dispatch.
                </p>
              </div>
              <span
                className={`shrink-0 rounded-[var(--auth-badge-radius)] border px-[var(--auth-badge-padding-x)] py-[var(--auth-badge-padding-y)] text-[var(--auth-section-label-size)] font-semibold tracking-wider transition-all duration-300 ${
                  completedCount === 8
                    ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-400"
                    : "border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                }`}
              >
                {completedCount === 8 ? "ARMED & READY" : "SAFETY PROFILE"}
              </span>
            </div>

            {/* Live Dynamic Readiness Meter */}
            <div className="mt-[var(--auth-meter-margin-top)] rounded-[var(--auth-notice-radius)] border border-[var(--color-border)] bg-[var(--surface-elevated)]/60 p-[var(--space-3)]">
              <div className="flex items-center justify-between text-[var(--font-size-xs)]">
                <span className="font-medium text-[var(--color-text-secondary)]">
                  Safety Readiness
                </span>
                <span
                  className={`font-semibold transition-colors duration-300 ${
                    completedCount === 8
                      ? "text-emerald-400"
                      : "text-[var(--color-accent)]"
                  }`}
                >
                  {getStatusText()}
                </span>
              </div>
              <div className="mt-2 h-[var(--auth-meter-height)] w-full overflow-hidden rounded-[var(--auth-meter-radius)] bg-[var(--auth-meter-track-bg)]">
                <div
                  className={`h-full rounded-[var(--auth-meter-radius)] transition-all duration-300 ease-out ${
                    completedCount === 8
                      ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.4)]"
                      : "bg-[var(--auth-meter-fill-bg)]"
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* SECTION 01: ACCOUNT CREDENTIALS */}
          <div className="tg-formcard__section-label">
            <span className="flex items-center gap-[var(--auth-section-label-gap)]">
              <FaUserCheck className="h-3.5 w-3.5 text-[var(--color-accent)]" />
              01 / ACCOUNT & CREDENTIALS
            </span>
          </div>

          <div className="grid grid-cols-1 gap-[var(--space-4)] sm:grid-cols-2">
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
              placeholder="you@example.com"
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
          <div className="tg-formcard__section-label mt-[var(--space-2)]">
            <span className="flex items-center gap-[var(--auth-section-label-gap)]">
              <IoShieldOutline className="h-3.5 w-3.5 text-[var(--color-accent)]" />
              02 / EMERGENCY CONTACT & FALL BASELINE
            </span>
          </div>

          <div className="grid grid-cols-1 gap-[var(--space-4)] sm:grid-cols-2">
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

          <div className="grid grid-cols-1 gap-[var(--space-4)] sm:grid-cols-2">
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
          <div className="flex items-center gap-[var(--space-3)] rounded-[var(--auth-notice-radius)] border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/5 px-[var(--space-3-5)] py-[var(--space-2-5)] text-[var(--font-size-xs)] text-[var(--color-text-secondary)]">
            <IoRadioOutline className="h-4 w-4 shrink-0 text-[var(--color-accent)] animate-pulse" />
            <span>
              <strong className="text-[var(--color-text)]">Hardware Link:</strong> ESP32-S3 wearable & Ed25519 pairing activates post-setup.
            </span>
          </div>

          {/* ACTION BUTTON */}
          <div className="mt-[var(--auth-button-margin-top)]">
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

          <p className="text-center text-[var(--font-size-sm)] text-[var(--text-muted)]">
            Already have an account?{" "}
            <Link to="/login" className="tg-formcard__link">
              Sign in
            </Link>
          </p>
        </form>
      </AuthCard>
    </AuthLayout>
  );
}
