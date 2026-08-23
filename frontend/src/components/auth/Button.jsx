export default function Button({
  variant = "primary",
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
      bg-[#2DD4BF]
      px-5
      text-[17px]
      font-semibold
      text-[#102A43]
      shadow-[0_8px_18px_rgba(45,212,191,0.22)]
      transition-all
      hover:bg-[#25BFAF]
      hover:shadow-[0_10px_24px_rgba(45,212,191,0.28)]
      active:scale-[0.99]
      disabled:cursor-not-allowed
      disabled:opacity-60
    `,

    // Dark navy button
    secondary: `
      flex w-full
      h-[64px]
      items-center justify-center
      gap-3
      rounded-[13px]
      border
      border-[#102A43]
      bg-[#102A43]
      px-5
      text-[17px]
      font-semibold
      text-white
      shadow-[0_6px_16px_rgba(16,42,67,0.18)]
      transition-all
      hover:bg-[#1E4D6B]
      hover:border-[#1E4D6B]
      active:scale-[0.99]
      disabled:cursor-not-allowed
      disabled:opacity-60
    `,

    // Blue button
    blue: `
      flex w-full
      h-[64px]
      items-center justify-center
      gap-2
      rounded-[13px]
      bg-[#1E4D6B]
      px-5
      text-[17px]
      font-semibold
      text-white
      shadow-[0_8px_18px_rgba(30,77,107,0.22)]
      transition-all
      hover:bg-[#183F58]
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
      border-[#C7D5E3]
      bg-white
      px-5
      text-[17px]
      font-medium
      text-[#102A43]
      shadow-[0_2px_6px_rgba(16,42,67,0.08)]
      transition-all
      hover:bg-[#F4F9FA]
      hover:border-[#1E4D6B]
      active:scale-[0.99]
      disabled:cursor-not-allowed
      disabled:opacity-60
    `,

    // Soft light button
    light: `
      flex w-full
      h-[64px]
      items-center justify-center
      gap-2
      rounded-[13px]
      bg-[#F4F9FA]
      px-5
      text-[17px]
      font-semibold
      text-[#102A43]
      transition-all
      hover:bg-[#E7F1F3]
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
      bg-[#DC2626]
      px-5
      text-[17px]
      font-semibold
      text-white
      shadow-[0_6px_16px_rgba(220,38,38,0.22)]
      transition-all
      hover:bg-[#B91C1C]
      hover:shadow-[0_8px_20px_rgba(220,38,38,0.28)]
      active:scale-[0.99]
      disabled:cursor-not-allowed
      disabled:opacity-60
    `,

    // Red soft action
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
    `,
  };

  return (
    <button {...props} className={`${variants[variant]} ${className}`.trim()}>
      {children}
    </button>
  );
}
