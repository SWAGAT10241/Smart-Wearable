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
      await register(form);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout headline="Set up your safety profile.">
      <AuthCard className="max-w-[700px]">
        <form className="flex flex-col gap-4" onSubmit={onSubmit}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="tg-formcard__title">Create your account</h2>
              <p className="tg-formcard__sub">
                Takes about a minute — every level keeps you safer on the trail.
              </p>
            </div>
            <span className="rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 font-mono text-[11px] font-bold text-teal-300">
              3-Level Setup
            </span>
          </div>

          {/* 3-Tiered Registration Flow Progress Bar */}
          <div className="rounded-xl border border-[var(--border-default)] bg-[var(--surface-elevated)] p-3">
            <div className="flex items-center gap-2">
              <div className="flex flex-1 items-center gap-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-500/20 text-[10px] font-bold text-teal-300 border border-teal-500/40">
                  1
                </span>
                <span className="text-[11px] font-bold text-teal-300">Level 1: Account</span>
              </div>
              <div className="h-px w-6 bg-[var(--border-default)]" />
              <div className="flex flex-1 items-center gap-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-500/20 text-[10px] font-bold text-teal-300 border border-teal-500/40">
                  2
                </span>
                <span className="text-[11px] font-bold text-teal-300">Level 2: Safety</span>
              </div>
              <div className="h-px w-6 bg-[var(--border-default)]" />
              <div className="flex flex-1 items-center gap-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/20 text-[10px] font-bold text-amber-300 border border-amber-500/40">
                  3
                </span>
                <span className="text-[11px] font-bold text-amber-300">Level 3: Wearable</span>
              </div>
            </div>
          </div>

          {error && <div className="tg-formcard__error">{error}</div>}

          {/* LEVEL 1: YOUR ACCOUNT */}
          <div className="tg-formcard__section-label">
            <span className="flex items-center gap-1.5">
              <FaUserCheck className="h-3.5 w-3.5 text-teal-400" />
              LEVEL 1: ACCOUNT & CREDENTIALS
            </span>
          </div>

          <div className="tg-formcard__row">
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

          {/* LEVEL 2: SAFETY INFO */}
          <div className="tg-formcard__section-label">
            <span className="flex items-center gap-1.5">
              <IoShieldOutline className="h-3.5 w-3.5 text-teal-400" />
              LEVEL 2: EMERGENCY & VITALS BASELINE
            </span>
          </div>

          <div className="tg-formcard__row">
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

          <div className="tg-formcard__row">
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

          {/* LEVEL 3 NOTICE */}
          <div className="flex items-center gap-2 rounded-xl border border-teal-500/20 bg-teal-500/10 px-3.5 py-2.5 text-xs text-teal-300">
            <IoRadioOutline className="h-4 w-4 shrink-0 text-teal-400 animate-pulse" />
            <span>
              <strong>Level 3 (Hardware Pairing):</strong> Your Ed25519 cryptographic key will be registered upon account completion.
            </span>
          </div>

          <Button type="submit" disabled={busy}>
            {busy ? "Registering & Authenticating…" : "Complete Registration & Proceed"}
          </Button>

          <p className="tg-formcard__footer">
            Already have an account?{" "}
            <Link to="/login" className="tg-formcard__link">
              Log in
            </Link>
          </p>
        </form>
      </AuthCard>
    </AuthLayout>
  );
}
