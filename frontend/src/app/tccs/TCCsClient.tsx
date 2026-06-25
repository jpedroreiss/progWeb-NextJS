"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import StatusBadge from "@/components/ui/StatusBadge";
import type { TCC, Aluno, Professor } from "@/types";

interface Props {
  tccs: TCC[];
  alunoMap: Record<number, Aluno>;
  professorMap: Record<number, Professor>;
  backendUrl: string;
}

export default function TCCsClient({ tccs, alunoMap, professorMap, backendUrl }: Props) {
  const router = useRouter();
  const [busca, setBusca] = useState("");

  const resultado = tccs.filter((t) =>
    `${t.titulo} ${t.resumo}`.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <input
          type="search"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por título ou resumo..."
          className={inputCls}
        />
        <Link
          href="/tccs/novo"
          className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm whitespace-nowrap"
        >
          + Novo TCC
        </Link>
      </div>

      <p className="text-sm text-slate-500">
        {resultado.length} trabalho{resultado.length !== 1 ? "s" : ""} encontrado{resultado.length !== 1 ? "s" : ""}
        {busca && <span className="text-blue-600"> para &ldquo;{busca}&rdquo;</span>}
      </p>

      {resultado.length === 0 ? (
        <EmptyState busca={busca} />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {["Título", "Aluno", "Orientador", "Tipo", "Semestre", "Status", "Arquivo"].map((col) => (
                    <th key={col} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {resultado.map((tcc) => (
                  <tr
                    key={tcc.id}
                    onClick={() => router.push(`/tccs/${tcc.id}`)}
                    className="hover:bg-blue-50 cursor-pointer transition-colors group"
                    title={`Ver detalhes: ${tcc.titulo}`}
                  >
                    <td className="px-4 py-3 max-w-xs">
                      <p className="font-semibold text-slate-800 group-hover:text-blue-700 transition-colors line-clamp-2">
                        {tcc.titulo}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                      {alunoMap[tcc.aluno]?.nome ?? <span className="text-slate-400 italic">—</span>}
                    </td>
                    <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                      {professorMap[tcc.orientador]?.nome ?? <span className="text-slate-400 italic">—</span>}
                    </td>
                    <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{tcc.tipo_display}</td>
                    <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                      {tcc.semestre_letivo_defesa ?? <span className="text-slate-400 italic">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={tcc.status} label={tcc.status_display} />
                    </td>
                    <td
                      className="px-4 py-3"
                      // Impede que o clique no PDF dispare a navegação para detalhes
                      onClick={(e) => e.stopPropagation()}
                    >
                      {tcc.arquivo ? (
                        <a
                          href={`${backendUrl}${tcc.arquivo}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 font-medium underline underline-offset-2 text-xs"
                        >
                          Ver PDF
                        </a>
                      ) : (
                        <span className="text-slate-400 italic text-xs">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function EmptyState({ busca }: { busca: string }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 py-16 text-center">
      <p className="text-4xl mb-3">📄</p>
      <p className="text-slate-600 font-medium">
        {busca ? `Nenhum TCC encontrado para "${busca}"` : "Nenhum TCC cadastrado ainda."}
      </p>
      {!busca && (
        <Link
          href="/tccs/novo"
          className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          Cadastrar primeiro TCC
        </Link>
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
