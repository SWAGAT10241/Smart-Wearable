import loginBackground from "../../assets/images/login-background.webp";
import { FaPersonFalling, FaRegBell } from "react-icons/fa6";
import {
  IoLocationOutline,
  IoPulseOutline,
  IoShieldCheckmarkOutline,
} from "react-icons/io5";
import Typewriter from "typewriter-effect";

const FEATURES = [
  [
    <IoPulseOutline key="pulse" />,
    "Continuous Vitals Telemetry",
    "Medical-grade SpO₂ & cardiac EKG pulse analyzed by on-device Edge Risk Engine.",
  ],
  [
    <FaPersonFalling key="fall" />,
    "Autonomous Fall & Impact Detection",
    "Precision accelerometer telemetry with cancelable countdown to eliminate false alarms.",
  ],
  [
    <IoLocationOutline key="loc" />,
    "Tactical SAR Trail Tracking",
    "Sub-meter NEO-6M GPS coordinates with secure 6-hour incident replay.",
  ],
  [
    <IoShieldCheckmarkOutline key="shield" />,
    "Cryptographic Rescue Dispatch",
    "Ed25519 authenticated device pairing & automated emergency responder coordination.",
  ],
];

export default function AuthLayout({ headline, children }) {
  return (
    <div
      className="relative flex min-h-screen flex-col overflow-x-hidden tg-scrollbar bg-[var(--surface-canvas)] lg:flex-row"
      style={{
        backgroundImage: `url(${loginBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-[var(--surface-canvas)]/75 backdrop-blur-[2px]" />

      {/* Gradients */}
      <div className="hidden lg:block absolute inset-y-0 left-0 w-[52%] bg-gradient-to-b from-[var(--surface-canvas)] via-[var(--surface-canvas)]/90 to-transparent" />
      <div className="absolute inset-y-0 right-0 w-full lg:w-[48%] bg-gradient-to-b from-[var(--surface-canvas)]/90 via-[var(--surface-canvas)]/80 to-[var(--surface-canvas)]/60" />

      {/* Left content (Branding & Features) */}
      <div className="relative z-10 flex w-full flex-col justify-center px-[var(--space-6)] py-[var(--space-8)] sm:px-[var(--space-10)] lg:w-[52%] lg:px-[var(--space-16)] lg:py-[var(--space-12)]">
        
        {/* Logo */}
        <div className="flex items-center gap-[var(--space-3)] text-[var(--font-size-2xl)] font-bold tracking-tight text-[var(--text-primary)]">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-[var(--radius-lg)] border border-[var(--border-focus)]/40 bg-[var(--action-primary)]/15 text-xl shadow-lg shadow-[var(--action-primary)]/10">
            🛡
          </span>

          <Typewriter
            options={{
              autoStart: true,
              loop: true,
              delay: 100,
              deleteSpeed: 60,
            }}
            onInit={(typewriter) =>
              typewriter
                .typeString("Trail")
                .pauseFor(400)
                .typeString('<span style="color:var(--action-primary)">Guard</span>')
                .pauseFor(1800)
                .deleteAll()
                .pauseFor(500)
                .start()
            }
          />
        </div>

        {/* Main headline */}
        <h1 className="mt-[var(--space-6)] max-w-[620px] text-[32px] font-extrabold leading-[1.12] tracking-tight sm:text-[42px] lg:text-[50px] text-[var(--text-primary)]">
          {headline}
        </h1>

        {/* Description */}
        <p className="mt-[var(--space-4)] max-w-[510px] text-[var(--font-size-md)] leading-relaxed text-[var(--text-secondary)]">
          Live vitals, fall detection, and GPS tracking for hikers — with instant alerts to the people who matter.
        </p>

        {/* Features */}
        <ul className="mt-[var(--space-6)] sm:mt-[var(--space-8)] flex list-none flex-col gap-[var(--space-3)] sm:gap-[var(--space-4)] p-0">
          {FEATURES.map(([icon, title, sub]) => (
            <li
              key={title}
              className="flex items-center gap-[var(--space-3)] sm:gap-[var(--space-4)] group"
            >
              <span className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--surface-elevated)] text-lg sm:text-xl text-[var(--action-primary)] transition-colors group-hover:border-[var(--border-focus)]">
                {icon}
              </span>

              <div>
                <div className="text-[var(--font-size-sm)] font-semibold text-[var(--text-primary)]">
                  {title}
                </div>
                <div className="text-[var(--font-size-xs)] text-[var(--text-muted)]">
                  {sub}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Right content (Auth Card Form) */}
      <div className="relative z-10 flex w-full items-center justify-center p-[var(--space-4)] sm:p-[var(--space-8)] lg:w-[48%] lg:px-[var(--space-12)]">
        {children}
      </div>

      {/* Global footer */}
      <footer className="relative z-10 py-[var(--space-4)] text-center text-[var(--font-size-xs)] text-[var(--text-muted)] lg:absolute lg:bottom-4 lg:left-0 lg:w-full">
        <span>TrailGuard secures your adventures.</span>
        <span className="mx-2 opacity-50">•</span>
        <span>Stay safe. Explore more.</span>
      </footer>
    </div>
  );
}
