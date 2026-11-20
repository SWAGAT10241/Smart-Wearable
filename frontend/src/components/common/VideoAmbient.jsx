import { useRef, useEffect } from "react";

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

  useEffect(() => {
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
  }, []);

  return (
    <div
      className={`relative w-full overflow-visible ${className}`}
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

      {/* Main Foreground Video Element */}
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
        className="relative z-10 h-full w-full rounded-2xl border border-white/10 object-cover shadow-2xl"
      />
    </div>
  );
}
