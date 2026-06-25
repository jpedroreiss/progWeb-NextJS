"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { tccsApi } from "@/services/api";
import { TCC_STATUS } from "@/lib/constants";
import StatusBadge from "@/components/ui/StatusBadge";
import type { TCCStatus } from "@/types";

interface Props {
  tccId: number;
  currentStatus: TCCStatus;
  currentStatusDisplay: string;
}

export default function StatusChanger({ tccId, currentStatus, currentStatusDisplay }: Props) {
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState<TCCStatus>(currentStatus);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const hasChanged = selectedStatus !== currentStatus;

  async function handleSave() {
    setError(null);
    setSuccess(false);
    setIsSaving(true);

    try {
      await tccsApi.alterarStatus(tccId, selectedStatus);
      setSuccess(true);
      // Força o Server Component a re-buscar o TCC atualizado
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
      <h3 className="font-semibold text-slate-700">Status do TCC</h3>

      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-500">Atual:</span>
        <StatusBadge status={currentStatus} label={currentStatusDisplay} />
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-slate-700">Alterar para:</label>
        <div className="flex flex-wrap gap-2">
          {TCC_STATUS.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => { setSelectedStatus(s.value as TCCStatus); setSuccess(false); }}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium border transition-all
                ${selectedStatus === s.value
                  ? "bg-slate-800 text-white border-slate-800"
                  : "bg-white text-slate-600 border-slate-300 hover:border-slate-400"
                }
              `}
            >
              {s.label}
            </button>
          ))}
        </div>

        <button
          onClick={handleSave}
          disabled={!hasChanged || isSaving}
          className="mt-2 px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {isSaving ? "Salvando..." : "Salvar status"}
        </button>

        {success && (
          <p className="text-green-600 text-sm font-medium">✓ Status atualizado com sucesso.</p>
        )}
        {error && (
          <p className="text-red-600 text-sm">{error}</p>
        )}
      </div>
    </div>
  );
}
