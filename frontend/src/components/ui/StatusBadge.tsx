import type { TCCStatus } from "@/types";

interface Props {
  status: TCCStatus;
  label: string;
}

// Cada status tem uma identidade visual própria para facilitar leitura rápida
const variantMap: Record<TCCStatus, string> = {
  "0": "bg-yellow-100 text-yellow-800 border-yellow-300",
  "1": "bg-blue-100   text-blue-800   border-blue-300",
  "2": "bg-green-100  text-green-800  border-green-300",
  "3": "bg-red-100    text-red-800    border-red-300",
};

export default function StatusBadge({ status, label }: Props) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variantMap[status]}`}
    >
      {label}
    </span>
  );
}
