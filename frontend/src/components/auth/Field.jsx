import { useState } from "react";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { CiLock, CiMail } from "react-icons/ci";

export default function Field({ label, className = "", ...props }) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = props.type === "password";
  const isEmail = props.type === "email";
  const inputType = isPassword && showPassword ? "text" : props.type;

  return (
    <div className={`flex w-full flex-col gap-2 ${className}`}>
      {label && (
        <label
          htmlFor={props.id || props.name}
          className="text-[13px] font-medium text-[#102A43]"
        >
          {label}
        </label>
      )}

      <div className="relative">
        {(isEmail || isPassword) && (
          <span className="pointer-events-none absolute left-4 top-1/2 z-10 flex -translate-y-1/2 items-center text-[22px] text-[#64748B]">
            {isEmail ? <CiMail /> : <CiLock />}
          </span>
        )}

        <input
          id={props.id || props.name}
          {...props}
          type={inputType}
          className={`
            h-[56px] w-full rounded-[12px] border border-[#D6E0E8]
            bg-white px-4 text-[15px] text-[#102A43] outline-none
            transition-all placeholder:text-[#94A3B8]
            focus:border-[#2DD4BF] focus:ring-2 focus:ring-[#2DD4BF]/15
            ${isEmail || isPassword ? "pl-12" : ""}
            ${isPassword ? "pr-12" : ""}
          `}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center justify-center text-[20px] text-[#64748B] transition-colors hover:text-[#102A43]"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <BsEyeSlash /> : <BsEye />}
          </button>
        )}
      </div>
    </div>
  );
}