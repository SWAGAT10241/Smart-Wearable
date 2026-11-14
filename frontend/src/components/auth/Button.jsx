export default function Button({
  variant = "primary",
  type = "button",
  children,
  className = "",
  ...props
}) {
  const baseButtonLayout = `
    flex w-full
    h-[var(--btn-height)]
    items-center justify-center
    rounded-[var(--btn-radius)]
    px-[var(--btn-padding-x)]
    text-[var(--font-size-md)]
    font-semibold
    transition-all
    active:scale-[0.99]
    disabled:cursor-not-allowed
    disabled:opacity-60
  `;

  const variants = {
    // Main TrailGuard action
    primary: `
      ${baseButtonLayout}
      gap-[var(--btn-gap)]
      bg-[var(--action-primary)]
      text-[var(--text-on-action)]
      shadow-[0_8px_18px_rgba(16,185,129,0.22)]
      hover:bg-[var(--action-primary-hover)]
      hover:shadow-[0_10px_24px_rgba(16,185,129,0.28)]
    `,

    // Secondary action
    secondary: `
      ${baseButtonLayout}
      gap-[var(--space-3)]
      border
      border-[var(--border-default)]
      bg-[var(--surface-elevated)]
      text-[var(--text-primary)]
      shadow-[0_4px_12px_rgba(0,0,0,0.1)]
      hover:bg-[var(--surface-hover)]
      hover:border-[var(--border-focus)]
    `,

    // Blue / brand button
    blue: `
      ${baseButtonLayout}
      gap-[var(--btn-gap)]
      bg-[var(--color-secondary)]
      text-white
      shadow-[0_8px_18px_rgba(30,77,107,0.22)]
      hover:opacity-90
      hover:shadow-[0_10px_24px_rgba(30,77,107,0.28)]
    `,

    // White / Google-style button
    outline: `
      ${baseButtonLayout}
      gap-[var(--space-3)]
      border
      border-[var(--color-border)]
      bg-[var(--color-surface-alt)]
      font-medium
      text-[var(--color-text)]
      shadow-[0_3px_10px_rgba(16,42,67,0.10)]
      hover:bg-[var(--color-surface)]
      hover:border-[var(--color-accent)]
    `,

    // Soft button
    light: `
      ${baseButtonLayout}
      gap-[var(--btn-gap)]
      bg-[var(--color-bg-alt)]
      text-[var(--color-text)]
      hover:bg-[var(--color-surface-alt)]
    `,

    // Destructive action
    danger: `
      ${baseButtonLayout}
      gap-[var(--btn-gap)]
      bg-[var(--action-destructive)]
      text-white
      shadow-[0_6px_16px_rgba(229,72,77,0.22)]
      hover:bg-[var(--action-destructive-hover)]
      hover:shadow-[0_8px_20px_rgba(229,72,77,0.28)]
    `,

    // Soft destructive action
    ghost: `
      ${baseButtonLayout}
      gap-[var(--btn-gap)]
      bg-red-50
      text-red-600
      hover:bg-red-100
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
