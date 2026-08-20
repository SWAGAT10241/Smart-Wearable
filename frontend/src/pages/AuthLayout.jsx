const FEATURES = [
  ['❤', 'Real-time heart rate & SpO2', 'Continuous monitoring of your vitals.'],
  ['⚡', 'Automatic fall detection', 'Instant alerts when it matters most.'],
  ['◎', 'Live GPS trail tracking', 'Share your location in real time.'],
  ['🔔', 'Instant emergency contact alerts', 'We notify your loved ones instantly.'],
];

// Matches the Login/Register split layout in the Figma file: a Main-navy
// brand panel on the left, form content on the right.
export default function AuthLayout({ headline, children }) {
  return (
    <div className="flex min-h-screen bg-[linear-gradient(110deg,#0d2945_0%,#12395e_45%,#1b4f7b_100%)] lg:flex-row">
      <div className="relative flex w-full flex-col justify-start overflow-hidden p-10 text-white lg:w-[40%] lg:min-w-[480px] lg:p-[56px_54px_36px]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(255,255,255,0.2),transparent_38%)]" />
        <div className="relative z-10 flex items-center gap-2.5 text-[22px] font-semibold tracking-[-0.01em]">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-teal-300/35 bg-teal-400/20 text-lg shadow-[0_8px_20px_rgba(0,0,0,0.22)]">🛡</span>
          <span>
            Trail<span className="text-teal-300">Guard</span>
          </span>
        </div>
        <h1 className="relative z-10 mt-5 max-w-[460px] text-[40px] font-bold leading-[1.15] tracking-[-0.03em] lg:text-[40px]">{headline}</h1>
        <p className="relative z-10 mt-4 max-w-[440px] text-base leading-7 text-slate-200">
          Live vitals, fall detection, and GPS tracking for hikers — with instant alerts to the people who matter.
        </p>
        <ul className="relative z-10 mt-6 flex list-none flex-col gap-2.5 p-0">
          {FEATURES.map(([icon, title, sub]) => (
            <li key={title} className="flex items-center gap-3.5 rounded-2xl bg-white/10 px-3 py-2.5 backdrop-blur-sm">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-400/20 text-base">{icon}</span>
              <div>
                <div className="text-[13.5px] font-semibold">{title}</div>
                <div className="text-[11.5px] text-slate-300">{sub}</div>
              </div>
            </li>
          ))}
        </ul>
        <div className="relative z-10 mt-auto flex gap-3 pt-5 text-[12px] text-slate-200/80">
          <span>TrailGuard secures your adventures.</span>
          <span className="text-slate-300/60">|</span>
          <span>Stay safe. Explore more.</span>
        </div>
      </div>
      <div className="relative flex flex-1 items-center justify-center bg-[linear-gradient(180deg,rgba(18,58,92,0.4)_0%,rgba(12,35,57,0.52)_100%)] p-8 sm:p-10 lg:p-[56px_36px]">{children}</div>
    </div>
  );
}
