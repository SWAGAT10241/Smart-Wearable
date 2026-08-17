// Same glyphs used in the Figma dashboard stat cards (design.md §5).

export function HeartIcon({ color = '#FF6B85', size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        fill={color}
      />
    </svg>
  );
}

export function DropletIcon({ color = '#3E7A9E', size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2c0 0-7 8-7 13a7 7 0 0 0 14 0c0-5-7-13-7-13z"
        fill={color}
      />
    </svg>
  );
}

export function ThermometerIcon({ color = '#FFB84D', size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <rect x="6.5" y="0.7" width="5" height="11" rx="2.5" fill={color} />
      <circle cx="9" cy="13.5" r="4.5" fill={color} />
    </svg>
  );
}

export function LocationPulseIcon({ color = '#1E4D6B', size = 14 }) {
  return (
    <span
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        borderRadius: '50%',
        background: color,
        boxShadow: `0 0 0 4px ${color}22, 0 0 12px ${color}66`,
      }}
    />
  );
}
