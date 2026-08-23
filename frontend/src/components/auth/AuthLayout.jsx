import loginBackground from "../../assets/images/login-background.png";
import { LuHeartPulse } from "react-icons/lu";
import { FaPersonFalling, FaRegBell } from "react-icons/fa6";
import { IoLocationOutline } from "react-icons/io5";
import Typewriter from "typewriter-effect";

const FEATURES = [
  [<LuHeartPulse />, "Real-time heart rate & SpO2", "Continuous monitoring of your vitals."],
  [<FaPersonFalling />, "Automatic fall detection", "Instant alerts when it matters most."],
  [<IoLocationOutline />, "Live GPS trail tracking", "Share your location in real time."],
  [<FaRegBell />, "Instant emergency contact alerts", "We notify your loved ones instantly."],
];

export default function AuthLayout({ headline, children }) {
  return (
    <div
      className="relative flex min-h-screen overflow-hidden bg-[#071C2E]"
      style={{
        backgroundImage: `url(${loginBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-[#061C2E]/30" />

      {/* 52% left */}
      <div className="absolute inset-y-0 left-0 w-[52%] bg-[linear-gradient(to_bottom,rgba(3,24,42,.94),rgba(5,34,56,.88)_35%,rgba(8,50,78,.60)_68%,rgba(8,50,78,.20))]" />

      {/* 48% right */}
      <div className="absolute inset-y-0 right-0 w-[48%] bg-[linear-gradient(to_bottom,rgba(14,55,86,.72),rgba(18,65,98,.62)_35%,rgba(18,72,108,.42)_68%,rgba(18,72,108,.12))]" />

      {/* Left content */}
      <div className="relative z-10 flex w-[52%] flex-col px-10 py-10 text-white lg:px-[76px] lg:pt-[74px]">
        
        {/* Logo */}
        <div className="flex items-center gap-3 text-[26px] font-semibold tracking-[-0.02em]">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-[14px] border border-teal-300/35 bg-teal-400/20 text-xl">
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
                .typeString('<span style="color:#2DD4BF">Guard</span>')
                .pauseFor(1800)
                .deleteAll()
                .pauseFor(500)
                .start()
            }
          />
        </div>

        {/* Main headline */}
        <h1 className="mt-8 max-w-[610px] text-[46px] font-bold leading-[1.08] tracking-[-0.035em] sm:text-[52px] lg:text-[58px] xl:text-[62px]">
          {headline}
        </h1>

        {/* Description */}
        <p className="mt-7 max-w-[510px] text-[17px] leading-7 text-slate-200/90">
          Live vitals, fall detection, and GPS tracking for hikers — with
          instant alerts to the people who matter.
        </p>

        {/* Features */}
        <ul className="mt-9 flex list-none flex-col gap-4 p-0">
          {FEATURES.map(([icon, title, sub]) => (
            <li
              key={title}
              className="flex items-center gap-4"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-400/20 text-[19px] text-teal-300">
                {icon}
              </span>

              <div>
                <div className="text-[14px] font-semibold">
                  {title}
                </div>

                <div className="mt-1 text-[12px] text-slate-300">
                  {sub}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Right content */}
      <div className="relative z-10 flex w-[48%] items-center justify-center p-6 sm:p-8 lg:px-[50px]">
        {children}
      </div>

      {/* Global footer */}
      <footer className="absolute bottom-5 left-0 z-20 flex w-full justify-center px-6 text-center text-[12px] text-slate-200/75">
        <span>TrailGuard secures your adventures.</span>
        <span className="mx-3 text-slate-300/50">|</span>
        <span>Stay safe. Explore more.</span>
      </footer>
    </div>
  );
}