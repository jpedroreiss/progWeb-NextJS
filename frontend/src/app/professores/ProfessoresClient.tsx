"use client";

import { useState } from "react";
import type { Professor, Departamento } from "@/types";

interface Props {
  professores: Professor[];
  depMap: Record<number, Departamento>;
}

export default function ProfessoresClient({ professores, depMap }: Props) {
  const [busca, setBusca] = useState("");

  const resultado = professores.filter((p) => {
    const dep = depMap[p.departamento];
    return `${p.nome} ${dep?.nome ?? ""} ${dep?.sigla ?? ""}`
      .toLowerCase()
      .includes(busca.toLowerCase());
  });

  return (
    <div className="space-y-4">
      <input
        type="search"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        placeholder="Buscar por nome ou departamento..."
        className={inputCls}
      />

      <p className="text-sm text-slate-500">
        {resultado.length} professor{resultado.length !== 1 ? "es" : ""} encontrado{resultado.length !== 1 ? "s" : ""}
        {busca && <span className="text-blue-600"> para &ldquo;{busca}&rdquo;</span>}
      </p>

      {resultado.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 py-16 text-center">
          <p className="text-4xl mb-3">👨‍🏫</p>
          <p className="text-slate-600 font-medium">
            {busca ? `Nenhum professor encontrado para "${busca}"` : "Nenhum professor cadastrado."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {["Nome", "Departamento", "Sigla"].map((col) => (
                  <th key={col} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {resultado.map((prof) => {
                const dep = depMap[prof.departamento];
                return (
                  <tr key={prof.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-800">{prof.nome}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {dep?.nome ?? <span className="text-slate-400 italic">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      {dep ? (
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-xs font-mono">
                          {dep.sigla}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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
