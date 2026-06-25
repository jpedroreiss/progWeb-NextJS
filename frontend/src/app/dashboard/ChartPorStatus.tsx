"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Cores mapeadas manualmente para que cada status tenha uma cor semântica
const STATUS_COLORS: Record<string, string> = {
  "Aprovado":      "#22c55e",
  "Reprovado":     "#ef4444",
  "Em Elaboração": "#f59e0b",
  "Enviado":       "#3b82f6",
};

interface Props {
  data: Record<string, number>;
}

export default function ChartPorStatus({ data }: Props) {
  const chartData = Object.entries(data).map(([name, value]) => ({ name, value }));

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <h3 className="font-semibold text-slate-700 mb-4">TCCs por Status</h3>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={90}
            label={({ name, percent }) =>
              `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`
            }
          >
            {chartData.map((entry) => (
              <Cell
                key={entry.name}
                fill={STATUS_COLORS[entry.name] ?? "#94a3b8"}
              />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value} TCC(s)`, ""]} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
