import { useState } from "react";
import {
  IoEyeOutline,
  IoEyeOffOutline,
  IoLockClosedOutline,
  IoMailOutline,
  IoWarningOutline,
  IoCheckmarkCircle,
} from "react-icons/io5";

export default function Field({
  label,
  className = "",
  onKeyDown,
  onKeyUp,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [capsLockActive, setCapsLockActive] = useState(false);
  const isPassword = props.type === "password";
  const isEmail = props.type === "email";
  const inputType = isPassword && showPassword ? "text" : props.type;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid =
    isEmail && Boolean(props.value) && emailRegex.test(String(props.value).trim());

  const handleKeyModifier = (e) => {
    if (isPassword && e.getModifierState) {
      setCapsLockActive(e.getModifierState("CapsLock"));
    }
  };

  const handleKeyDown = (e) => {
    handleKeyModifier(e);
    if (onKeyDown) onKeyDown(e);
  };

  const handleKeyUp = (e) => {
    handleKeyModifier(e);
    if (onKeyUp) onKeyUp(e);
  };

  return (
    <div className={`flex w-full flex-col gap-[var(--space-2)] ${className}`}>
      {label && (
        <label
          htmlFor={props.id || props.name}
          className="text-[var(--font-size-sm-alt)] font-medium text-[var(--color-text)]"
        >
          {label}
        </label>
      )}

      <div className="relative">
        {(isEmail || isPassword) && (
          <span className="pointer-events-none absolute left-4 top-1/2 z-10 flex -translate-y-1/2 items-center text-[20px] text-[var(--color-text-muted)]">
            {isEmail ? <IoMailOutline /> : <IoLockClosedOutline />}
          </span>
        )}

        <input
          id={props.id || props.name}
          {...props}
          type={inputType}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          className={`
            h-[var(--input-height)] w-full rounded-[var(--input-radius)] border border-[var(--color-border)]
            bg-[var(--color-surface)] px-[var(--input-padding-x)] text-[15px] text-[var(--color-text)] outline-none
            transition-all placeholder:text-[var(--color-text-muted)]
            focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/15
            disabled:cursor-not-allowed disabled:opacity-60
            ${isEmail || isPassword ? "pl-12" : ""}
            ${isPassword || isEmail ? "pr-12" : ""}
          `}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center justify-center text-[20px] text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)] focus:outline-none focus:text-[var(--color-accent)]"
            aria-label={showPassword ? "Hide password" : "Show password"}
            title={showPassword ? "Hide password" : "Show password"}
            tabIndex={-1}
          >
            {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
          </button>
        )}

        {isEmail && isEmailValid && (
          <span
            className="pointer-events-none absolute right-4 top-1/2 flex -translate-y-1/2 items-center text-[19px] text-emerald-500 transition-opacity"
            title="Valid email format"
            aria-label="Valid email format"
          >
            <IoCheckmarkCircle />
          </span>
        )}
      </div>

      {isPassword && capsLockActive && (
        <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-500 dark:text-amber-400">
          <IoWarningOutline className="text-sm shrink-0" />
          <span>Caps Lock is ON</span>
        </div>
      )}
    </div>
  );
}