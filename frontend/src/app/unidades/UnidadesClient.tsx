"use client";

import { useState } from "react";
import type { UnidadeAcademica, Departamento } from "@/types";

interface Props {
  unidades: UnidadeAcademica[];
  depsPorUnidade: Record<number, Departamento[]>;
}

export default function UnidadesClient({ unidades, depsPorUnidade }: Props) {
  const [busca, setBusca] = useState("");

  const resultado = unidades.filter((u) =>
    `${u.nome} ${u.sigla}`.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <input
        type="search"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        placeholder="Buscar por nome ou sigla..."
        className={inputCls}
      />

      <p className="text-sm text-slate-500">
        {resultado.length} unidade{resultado.length !== 1 ? "s" : ""} encontrada{resultado.length !== 1 ? "s" : ""}
        {busca && <span className="text-blue-600"> para &ldquo;{busca}&rdquo;</span>}
      </p>

      {resultado.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 py-16 text-center">
          <p className="text-4xl mb-3">🏫</p>
          <p className="text-slate-600 font-medium">
            {busca ? `Nenhuma unidade encontrada para "${busca}"` : "Nenhuma unidade acadêmica cadastrada."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {resultado.map((unidade) => {
            const deps = depsPorUnidade[unidade.id] ?? [];
            return (
              <div
                key={unidade.id}
                className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-slate-800 text-base">{unidade.nome}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded text-xs font-mono">
                      {unidade.sigla}
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-2xl font-bold text-slate-700">{deps.length}</p>
                    <p className="text-xs text-slate-400">departamento{deps.length !== 1 ? "s" : ""}</p>
                  </div>
                </div>

                {deps.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
                    {deps.map((d) => (
                      <span key={d.id} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs font-mono">
                        {d.sigla}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const inputCls = [
  "w-full sm:w-80 px-4 py-2 rounded-lg border text-sm",
  "bg-white text-slate-900 placeholder:text-slate-400",
  "border-slate-300 shadow-sm",
  "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
  "transition-all",
].join(" ");
