type Color = "blue" | "green" | "yellow" | "red";

const colorMap: Record<Color, { card: string; value: string; label: string; bar: string }> = {
  blue:   { card: "bg-white border-slate-200",       value: "text-blue-600",   label: "text-slate-600", bar: "bg-blue-500"   },
  green:  { card: "bg-white border-slate-200",       value: "text-green-600",  label: "text-slate-600", bar: "bg-green-500"  },
  yellow: { card: "bg-white border-slate-200",       value: "text-amber-600",  label: "text-slate-600", bar: "bg-amber-400"  },
  red:    { card: "bg-white border-slate-200",       value: "text-red-600",    label: "text-slate-600", bar: "bg-red-500"    },
};

interface StatCardProps {
  label: string;
  value: number;
  color: Color;
}

export default function StatCard({ label, value, color }: StatCardProps) {
  const c = colorMap[color];
  return (
    <div className={`rounded-xl border shadow-sm p-5 ${c.card} relative overflow-hidden`}>
      {/* Barra de cor no topo do card */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${c.bar}`} />
      <p className={`text-xs font-semibold uppercase tracking-wide mt-1 ${c.label}`}>{label}</p>
      <p className={`text-4xl font-bold mt-2 ${c.value}`}>{value}</p>
    </div>
  );
}
