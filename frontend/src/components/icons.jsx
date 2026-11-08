import { FaHeart, FaDroplet } from "react-icons/fa6";
import { CiTempHigh } from "react-icons/ci";
import { Droplets, Gauge, MapPin, Watch } from "lucide-react";

export function HeartIcon({ size = 23, color = "var(--action-destructive)" }) {
  return <FaHeart size={size} style={{ color }} />;
}

export function DropletIcon({ size = 24, color = "var(--status-optimal)" }) {
  return <FaDroplet size={size} style={{ color }} />;
}

export function ThermometerIcon({ size = 28, color = "var(--status-warning)" }) {
  return <CiTempHigh size={size} style={{ color }} />;
}

export function HumidityIcon({ size = 30, color = "var(--status-info)" }) {
  return <Droplets size={size} style={{ color }} />;
}

export function PressureIcon({ size = 27, color = "var(--status-info)" }) {
  return <Gauge size={size} style={{ color }} />;
}

export function WatchIcon({ size = 20, color = "var(--action-primary)" }) {
  return <Watch size={size} strokeWidth={2} style={{ color }} />;
}

export function LocationPulseIcon({ color = "var(--action-primary)", size = 14 }) {
  return (
    <span
      className="inline-block rounded-full"
      style={{
        width: size,
        height: size,
        background: color,
        boxShadow: `0 0 0 3px rgba(16, 185, 129, 0.25)`,
      }}
    />
  );
}

export function GPSIcon({ size = 18, color = "var(--status-optimal)" }) {
  return <MapPin size={size} strokeWidth={2.3} style={{ color }} />;
}
