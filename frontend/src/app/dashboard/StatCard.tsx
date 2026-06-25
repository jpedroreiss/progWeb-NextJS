type Color = "blue" | "green" | "yellow" | "red";

const colorMap: Record<Color, string> = {
  blue:   "bg-blue-50 text-blue-700 border-blue-200",
  green:  "bg-green-50 text-green-700 border-green-200",
  yellow: "bg-yellow-50 text-yellow-700 border-yellow-200",
  red:    "bg-red-50 text-red-700 border-red-200",
};

interface StatCardProps {
  label: string;
  value: number;
  color: Color;
}

export default function StatCard({ label, value, color }: StatCardProps) {
  return (
    <div className={`rounded-xl border p-5 ${colorMap[color]}`}>
      <p className="text-sm font-medium opacity-80">{label}</p>
      <p className="text-4xl font-bold mt-2">{value}</p>
    </div>
  );
}
