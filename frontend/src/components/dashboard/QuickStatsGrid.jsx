import StatCard from "../StatCard";

export default function QuickStatsGrid({ stats = [] }) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-[var(--space-3-5)]">
      {stats.map((card) => (
        <StatCard key={card.label} {...card} />
      ))}
    </section>
  );
}
