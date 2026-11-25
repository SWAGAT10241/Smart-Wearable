import { Card } from "../ui/card";

export default function AuthCard({ children, className = "" }) {
  return (
    <Card
      className={`w-full border border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-slate-900/90 shadow-2xl backdrop-blur-2xl transition-all duration-300 ${className}`}
    >
      {children}
    </Card>
  );
}
