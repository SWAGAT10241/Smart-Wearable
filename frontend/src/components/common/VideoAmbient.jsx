import { useRef, useEffect, useState } from "react";

const CANVAS_W = 64;
const CANVAS_H = 36;

export default function VideoAmbient({
  src,
  poster,
  blurAmount = 60,
  intensity = 0.85,
  autoPlay = false,
  muted = true,
  loop = true,
  className = "",
  aspectRatio = "16/9",
}) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const rafRef = useRef(0);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (hasError) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext ? canvas.getContext("2d") : null;
    if (!ctx) return;

    const paint = () => {
      try {
        ctx.drawImage(video, 0, 0, CANVAS_W, CANVAS_H);
      } catch {
        // Guard against CORS-restricted media or unbuffered state
      }
    };

    const loopRender = () => {
      if (!video.paused && !video.ended && video.readyState >= 2) {
        paint();
      }
      rafRef.current = requestAnimationFrame(loopRender);
    };

    video.addEventListener("loadeddata", paint);
    video.addEventListener("seeked", paint);
    video.addEventListener("play", () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(loopRender);
    });

    rafRef.current = requestAnimationFrame(loopRender);

    return () => {
      cancelAnimationFrame(rafRef.current);
      video.removeEventListener("loadeddata", paint);
      video.removeEventListener("seeked", paint);
    };
  }, [hasError]);

  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl ${className}`}
      style={{ aspectRatio }}
    >
      {/* 21st.dev Ambient Light Halo Canvas */}
      <canvas
        ref={canvasRef}
        width={CANVAS_W}
        height={CANVAS_H}
        aria-hidden="true"
        className="absolute inset-0 h-full w-full pointer-events-none rounded-2xl transition-opacity duration-500"
        style={{
          filter: `blur(${blurAmount}px)`,
          opacity: intensity,
          transform: "scale(1.10)",
          zIndex: 0,
        }}
      />

      {/* Main Video or Resilient Tactical Poster Fallback */}
      {!hasError ? (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          controls
          playsInline
          crossOrigin="anonymous"
          preload="metadata"
          autoPlay={autoPlay}
          muted={muted}
          loop={loop}
          onError={() => setHasError(true)}
          className="relative z-10 h-full w-full rounded-2xl border border-white/10 object-cover shadow-2xl"
        />
      ) : (
        <div className="relative z-10 flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-slate-950 shadow-2xl">
          {poster && (
            <img
              src={poster}
              alt="Sector Reconnaissance Feed"
              className="absolute inset-0 h-full w-full object-cover opacity-60"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          <div className="relative z-20 flex flex-col items-center text-center p-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-500/40 bg-cyan-500/10 text-cyan-400 mb-2 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              🛰
            </span>
            <span className="font-mono text-xs font-semibold tracking-wider text-cyan-300">
              TACTICAL AERIAL FEED // SATELLITE STANDBY
            </span>
            <span className="mt-1 font-mono text-[10px] text-slate-400">
              Mesh Link 433-915 MHz Active · Alpine Telemetry Synchronized
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
