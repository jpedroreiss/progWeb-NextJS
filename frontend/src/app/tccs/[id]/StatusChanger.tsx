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
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
      <div>
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Status do TCC</h3>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-sm text-slate-600">Situação atual:</span>
          <StatusBadge status={currentStatus} label={currentStatusDisplay} />
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-slate-700">Selecione o novo status:</p>
        <div className="flex flex-wrap gap-2">
          {TCC_STATUS.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => { setSelectedStatus(s.value as TCCStatus); setSuccess(false); }}
              className={`
                px-4 py-2 rounded-lg text-sm font-semibold border transition-all
                ${selectedStatus === s.value
                  ? "bg-slate-800 text-white border-slate-800 shadow-sm"
                  : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50 hover:border-slate-400"
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
          className="px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
        >
          {isSaving ? "Salvando..." : "Salvar alteração"}
        </button>

        {success && (
          <p className="text-emerald-700 text-sm font-semibold bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
            ✓ Status atualizado com sucesso.
          </p>
        )}
        {error && (
          <p className="text-red-700 text-sm font-medium bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            ⚠ {error}
          </p>
        )}
      </div>
    </div>
  );
}
