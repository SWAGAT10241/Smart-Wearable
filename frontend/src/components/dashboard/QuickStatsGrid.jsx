import StatCard from "../StatCard";

export default function QuickStatsGrid({ stats = [] }) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-[var(--space-3-5)]">
      {stats.map((card, index) => (
        <div
          key={card.label}
          className="animate-card-entrance"
          style={{ animationDelay: `${index * 45}ms` }}
        >
          <StatCard {...card} />
        </div>
      ))}
    </section>
  );
}
