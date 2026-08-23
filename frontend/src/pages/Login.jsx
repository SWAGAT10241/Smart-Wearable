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
          on every <span className="text-[#2DD4BF]">trail.</span>
        </>
      }
    >
      <AuthCard className="max-w-[500px]">
        <form className="flex flex-col gap-4" onSubmit={onSubmit}>
          <h2 className="tg-formcard__title">Welcome back</h2>

          <p className="tg-formcard__sub">
            Log in to see your live trail dashboard.
          </p>

          {error && <div className="tg-formcard__error">{error}</div>}

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

          <Button type="submit" disabled={busy}>
            {busy ? "Logging in…" : "Log in"}
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
            Continue with Google
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
