import { FaHeart, FaDroplet } from "react-icons/fa6";
import { CiTempHigh } from "react-icons/ci";
import { WiHumidity } from "react-icons/wi";

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
  return <WiHumidity size={size} className="text-[#18BFC1]" />;
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
