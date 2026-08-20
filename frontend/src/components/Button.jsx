// variant: 'primary' (accent teal, matches Login/Register/"I'm okay" buttons)
//        | 'secondary' (white + border, matches "Continue with Google")
//        | 'danger' (alert red, matches "Send SOS now" / "Log out")
export default function Button({ variant = 'primary', children, className = '', ...props }) {
  const variants = {
    primary: 'flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3.5 text-sm font-semibold tracking-[0.01em] text-slate-50 shadow-[0_10px_20px_rgba(16,42,67,0.28)] transition hover:shadow-[0_12px_24px_rgba(16,42,67,0.32)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-55',
    secondary: 'flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white/90 px-5 py-3.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-400 hover:bg-white active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-55',
    danger: 'flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3.5 text-sm font-semibold text-white shadow-[0_6px_16px_rgba(214,69,69,0.35)] transition hover:bg-red-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-55',
    ghost: 'flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 px-5 py-3.5 text-sm font-semibold text-red-600 transition hover:bg-red-100 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-55',
  };

  return (
    <button {...props} className={`${variants[variant]} ${className}`.trim()}>
      {children}
    </button>
  );
}
