export default function Field({ label, error, leadingIcon, trailingIcon, ...inputProps }) {
  const hasLeading = Boolean(leadingIcon);
  const hasTrailing = Boolean(trailingIcon);

  return (
    <label className="flex w-full flex-col gap-1.5">
      <span className="text-[12px] font-semibold text-slate-500">{label}</span>
      <span className={`relative ${hasLeading ? 'pl-10' : ''} ${hasTrailing ? 'pr-10' : ''}`}>
        {hasLeading ? <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400">{leadingIcon}</span> : null}
        <input
          className={`w-full rounded-xl border px-3.5 py-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition ${
            hasLeading ? 'pl-10' : ''
          } ${hasTrailing ? 'pr-10' : ''} ${
            error ? 'border-red-400 bg-red-50 focus:border-red-500' : 'border-slate-300 bg-white/90 focus:border-sky-500 focus:bg-white'
          } focus:shadow-[0_0_0_4px_rgba(16,42,67,0.08),0_4px_12px_rgba(16,42,67,0.1)]`}
          {...inputProps}
        />
        {hasTrailing ? <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400">{trailingIcon}</span> : null}
      </span>
      {error && <span className="text-[11.5px] font-medium text-red-600">{error}</span>}
    </label>
  );
}
