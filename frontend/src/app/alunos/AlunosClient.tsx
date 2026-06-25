"use client";

import { useState } from "react";
import type { Aluno, Curso } from "@/types";

interface Props {
  alunos: Aluno[];
  cursoMap: Record<number, string>;
}

export default function AlunosClient({ alunos, cursoMap }: Props) {
  const [busca, setBusca] = useState("");

  const resultado = alunos.filter((a) =>
    `${a.nome} ${a.matricula}`.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <input
        type="search"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        placeholder="Buscar por nome ou matrícula..."
        className={inputCls}
      />

      <p className="text-sm text-slate-500">
        {resultado.length} aluno{resultado.length !== 1 ? "s" : ""} encontrado{resultado.length !== 1 ? "s" : ""}
        {busca && <span className="text-blue-600"> para &ldquo;{busca}&rdquo;</span>}
      </p>

      {resultado.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 py-16 text-center">
          <p className="text-4xl mb-3">🎓</p>
          <p className="text-slate-600 font-medium">
            {busca ? `Nenhum aluno encontrado para "${busca}"` : "Nenhum aluno cadastrado."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {["Nome", "Matrícula", "Curso"].map((col) => (
                  <th key={col} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {resultado.map((aluno) => (
                <tr key={aluno.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-800">{aluno.nome}</td>
                  <td className="px-4 py-3 text-slate-500 font-mono text-xs">{aluno.matricula}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {cursoMap[aluno.curso] ?? <span className="text-slate-400 italic">—</span>}
                  </td>
                </tr>
              ))}
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
