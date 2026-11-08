import { FaHeart, FaDroplet, FaGaugeHigh, FaLocationDot } from "react-icons/fa6";
import { CiTempHigh } from "react-icons/ci";
import { IoWater, IoWatch } from "react-icons/io5";

export function HeartIcon({ size = 23, color = "var(--action-destructive)" }) {
  return <FaHeart size={size} style={{ color }} />;
}

export function DropletIcon({ size = 24, color = "var(--status-optimal)" }) {
  return <FaDroplet size={size} style={{ color }} />;
}

export function ThermometerIcon({ size = 28, color = "var(--status-warning)" }) {
  return <CiTempHigh size={size} style={{ color }} />;
}

export function HumidityIcon({ size = 26, color = "var(--status-info)" }) {
  return <IoWater size={size} style={{ color }} />;
}

export function PressureIcon({ size = 25, color = "var(--status-info)" }) {
  return <FaGaugeHigh size={size} style={{ color }} />;
}

export function WatchIcon({ size = 20, color = "var(--action-primary)" }) {
  return <IoWatch size={size} style={{ color }} />;
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
  return <FaLocationDot size={size} style={{ color }} />;
}
