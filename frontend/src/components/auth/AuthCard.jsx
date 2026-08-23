export default function AuthCard({ children, className = "" }) {
  return (
    <div
      className={`
        w-full
        rounded-[26px]
        border border-white/60
        bg-white/[0.78]
        p-8
        shadow-[0_20px_60px_rgba(7,28,46,0.22)]
        backdrop-blur-xl
        sm:p-9
        ${className}
      `}
    >
      {children}
    </div>
  );
}