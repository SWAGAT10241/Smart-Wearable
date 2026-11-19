import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
      <AuthCard className="max-w-[640px]">
        <form className="flex flex-col gap-[var(--space-5)]" onSubmit={onSubmit}>
          <div>
            <h2 className="text-[var(--font-size-2xl)] font-bold tracking-tight text-[var(--text-primary)] sm:text-[var(--font-size-3xl)]">
              Create your account
            </h2>
            <p className="mt-[var(--space-1)] text-[var(--font-size-sm)] text-[var(--text-secondary)]">
              Takes about a minute — every field here keeps you safer on trail.
            </p>
          </div>

          {error && (
            <div className="rounded-[var(--radius-lg)] border border-[var(--action-destructive)]/30 bg-[var(--surface-error)] px-[var(--space-4)] py-[var(--space-3)] text-[var(--font-size-sm)] font-medium text-[var(--action-destructive)]">
              {error}
            </div>
          )}

          {/* Section: Your Account */}
          <div className="flex items-center gap-[var(--space-2)] pt-[var(--space-2)] text-[var(--font-size-xs)] font-bold uppercase tracking-wider text-[var(--action-primary)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--action-primary)]" />
            <span>Your Account</span>
            <div className="h-px flex-1 bg-[var(--border-default)]" />
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

          {/* Section: Safety Info */}
          <div className="flex items-center gap-[var(--space-2)] pt-[var(--space-2)] text-[var(--font-size-xs)] font-bold uppercase tracking-wider text-[var(--action-primary)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--action-primary)]" />
            <span>Safety Information</span>
            <div className="h-px flex-1 bg-[var(--border-default)]" />
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

          <Button type="submit" disabled={busy} className="mt-[var(--space-2)]">
            {busy ? (
              <span className="flex items-center justify-center gap-[var(--space-2)]">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                <span>Creating account…</span>
              </span>
            ) : (
              "Create account"
            )}
          </Button>

          <p className="text-center text-[var(--font-size-sm)] text-[var(--text-muted)]">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-[var(--action-primary)] transition-colors hover:text-[var(--action-primary-hover)] underline underline-offset-4"
            >
              Log in
            </Link>
          </p>
        </form>
      </AuthCard>
    </AuthLayout>
  );
}
