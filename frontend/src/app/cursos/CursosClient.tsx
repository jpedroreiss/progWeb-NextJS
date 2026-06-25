"use client";

import { useState } from "react";
import type { Curso } from "@/types";

interface Props {
  cursos: Curso[];
}

export default function CursosClient({ cursos }: Props) {
  const [busca, setBusca] = useState("");

  // Filtragem local — o backend não expõe search para cursos
  const resultado = cursos.filter((c) =>
    `${c.nome} ${c.sigla} ${c.codigo}`.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <input
        type="search"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        placeholder="Buscar por nome, sigla ou código..."
        className={inputCls}
      />

      <p className="text-sm text-slate-500">
        {resultado.length} curso{resultado.length !== 1 ? "s" : ""} encontrado{resultado.length !== 1 ? "s" : ""}
        {busca && <span className="text-blue-600"> para &ldquo;{busca}&rdquo;</span>}
      </p>

      {resultado.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 py-16 text-center">
          <p className="text-4xl mb-3">📚</p>
          <p className="text-slate-600 font-medium">
            {busca ? `Nenhum curso encontrado para "${busca}"` : "Nenhum curso cadastrado."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {resultado.map((curso) => (
            <div
              key={curso.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-2 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold text-slate-800 leading-snug">{curso.nome}</p>
                <span className="shrink-0 px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded text-xs font-mono">
                  {curso.sigla}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">Cód. {curso.codigo}</p>
            </div>
          ))}
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
