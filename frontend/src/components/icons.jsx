import { FaHeart, FaDroplet } from "react-icons/fa6";
import { CiTempHigh } from "react-icons/ci";
import { Droplets, Gauge, MapPin} from "lucide-react";

export function HeartIcon({ size = 23 }) {
  return <FaHeart size={size} className="text-[#FF3B5C]" />;
}

export function DropletIcon({ size = 24 }) {
  return <FaDroplet size={size} className="text-[#1976D2]" />;
}

export function ThermometerIcon({ size = 28 }) {
  return <CiTempHigh size={size} className="text-[#F2A93B]" />;
}

export function HumidityIcon({ size = 30 }) {
  return <Droplets size={size} className="text-[#18BFC1]" />;
}

export function PressureIcon({ size = 27 }) {
  return <Gauge size={size} className="text-[#8B5CF6]" />;
}
export function WatchIcon({ size = 20 }) {
  return <Watch size={size} strokeWidth={2} className="text-[#0F766E]" />;
}

export function LocationPulseIcon({ color = "#1E4D6B", size = 14 }) {
  return (
    <span
      className="inline-block rounded-full"
      style={{
        width: size,
        height: size,
        background: color,
        boxShadow: `0 0 0 4px ${color}22, 0 0 12px ${color}66`,
      }}
    />
  );
}

export function GPSIcon({ size = 18, color = "#10B981" }) {
  return <MapPin size={size} strokeWidth={2.3} style={{ color }} />;
}
