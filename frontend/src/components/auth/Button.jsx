export default function Button({
  variant = "primary",
  type = "button",
  children,
  className = "",
  ...props
}) {
  const variants = {
    // Main TrailGuard action
    primary: `
      flex w-full
      h-[64px]
      items-center justify-center
      gap-2
      rounded-[13px]
      bg-[var(--action-primary)]
      px-5
      text-[17px]
      font-semibold
      text-[var(--text-on-action)]
      shadow-[0_8px_18px_rgba(16,185,129,0.22)]
      transition-all
      hover:bg-[var(--action-primary-hover)]
      hover:shadow-[0_10px_24px_rgba(16,185,129,0.28)]
      active:scale-[0.99]
      disabled:cursor-not-allowed
      disabled:opacity-60
    `,

    // Secondary action
    secondary: `
    flex w-full
    h-[64px]
    items-center justify-center
    gap-3
    rounded-[13px]
    border
    border-[var(--border-default)]
    bg-[var(--surface-elevated)]
    px-5
    text-[17px]
    font-semibold
    text-[var(--text-primary)]
    shadow-[0_4px_12px_rgba(0,0,0,0.1)]
    transition-all
    hover:bg-[var(--surface-hover)]
    hover:border-[var(--border-focus)]
    active:scale-[0.99]
    disabled:cursor-not-allowed
    disabled:opacity-60
  `,

    // Blue / brand button
    blue: `
      flex w-full
      h-[64px]
      items-center justify-center
      gap-2
      rounded-[13px]
      bg-[var(--color-secondary)]
      px-5
      text-[17px]
      font-semibold
      text-white
      shadow-[0_8px_18px_rgba(30,77,107,0.22)]
      transition-all
      hover:opacity-90
      hover:shadow-[0_10px_24px_rgba(30,77,107,0.28)]
      active:scale-[0.99]
      disabled:cursor-not-allowed
      disabled:opacity-60
    `,

    // White / Google-style button
    outline: `
    flex w-full
    h-[64px]
    items-center justify-center
    gap-3
    rounded-[13px]
    border
    border-[var(--color-border)]
    bg-[var(--color-surface-alt)]
    px-5
    text-[17px]
    font-medium
    text-[var(--color-text)]
    shadow-[0_3px_10px_rgba(16,42,67,0.10)]
    transition-all
    hover:bg-[var(--color-surface)]
    hover:border-[var(--color-accent)]
    active:scale-[0.99]
    disabled:cursor-not-allowed
    disabled:opacity-60
  `,

    // Soft button
    light: `
      flex w-full
      h-[64px]
      items-center justify-center
      gap-2
      rounded-[13px]
      bg-[var(--color-bg-alt)]
      px-5
      text-[17px]
      font-semibold
      text-[var(--color-text)]
      transition-all
      hover:bg-[var(--color-surface-alt)]
      active:scale-[0.99]
      disabled:cursor-not-allowed
      disabled:opacity-60
    `,

    // Destructive action
    danger: `
      flex w-full
      h-[64px]
      items-center justify-center
      gap-2
      rounded-[13px]
      bg-[var(--action-destructive)]
      px-5
      text-[17px]
      font-semibold
      text-white
      shadow-[0_6px_16px_rgba(229,72,77,0.22)]
      transition-all
      hover:bg-[var(--action-destructive-hover)]
      hover:shadow-[0_8px_20px_rgba(229,72,77,0.28)]
      active:scale-[0.99]
      disabled:cursor-not-allowed
      disabled:opacity-60
    `,

    // Soft destructive action
    ghost: `
      flex w-full
      h-[64px]
      items-center justify-center
      gap-2
      rounded-[13px]
      bg-red-50
      px-5
      text-[17px]
      font-semibold
      text-red-600
      transition-all
      hover:bg-red-100
      active:scale-[0.99]
      disabled:cursor-not-allowed
      disabled:opacity-60

      dark:bg-red-400/10
      dark:text-red-300
      dark:hover:bg-red-400/20
    `,
  };

  return (
    <button
      type={type}
      {...props}
      className={`${variants[variant] || variants.primary} ${className}`.trim()}
    >
      {children}
    </button>
  );
}
