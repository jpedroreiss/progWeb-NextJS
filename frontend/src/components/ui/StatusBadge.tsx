import type { TCCStatus } from "@/types";

interface Props {
  status: TCCStatus;
  label: string;
}

// Cores sólidas garantem contraste suficiente independente do tema do sistema
const variantMap: Record<TCCStatus, { bg: string; text: string; dot: string }> = {
  "0": { bg: "bg-amber-100",  text: "text-amber-800",  dot: "bg-amber-500"  },
  "1": { bg: "bg-blue-100",   text: "text-blue-800",   dot: "bg-blue-500"   },
  "2": { bg: "bg-emerald-100",text: "text-emerald-800",dot: "bg-emerald-500" },
  "3": { bg: "bg-red-100",    text: "text-red-800",    dot: "bg-red-500"    },
};

export default function StatusBadge({ status, label }: Props) {
  const v = variantMap[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${v.bg} ${v.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${v.dot}`} />
      {label}
    </span>
  );
}
