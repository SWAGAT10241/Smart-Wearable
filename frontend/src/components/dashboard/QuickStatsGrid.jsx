import StatCard from "../StatCard";

export default function QuickStatsGrid({ stats = [] }) {
  return (
    <section className="grid shrink-0 gap-4 xl:grid-cols-5">
      {stats.map((card) => (
        <StatCard key={card.label} {...card} />
      ))}
    </section>
  );
}
