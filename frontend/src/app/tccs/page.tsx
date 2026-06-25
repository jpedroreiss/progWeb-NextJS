import Link from "next/link";
import { Suspense } from "react";
import { tccsApi, alunosApi, professoresApi } from "@/services/api";
import StatusBadge from "@/components/ui/StatusBadge";
import SearchInput from "@/components/ui/SearchInput";
import type { Aluno, Professor, TCC } from "@/types";

// Next.js injeta searchParams nas páginas Server Component automaticamente
interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function TCCsPage({ searchParams }: PageProps) {
  const { q } = await searchParams;

  // Busca em paralelo para não bloquear uma request na outra
  const [tccs, alunos, professores] = await Promise.all([
    tccsApi.listar(q),
    alunosApi.listar(),
    professoresApi.listar(),
  ]);

  // Índices para lookup O(1) por ID em vez de .find() em cada linha da tabela
  const alunoMap = Object.fromEntries(alunos.map((a: Aluno) => [a.id, a]));
  const professorMap = Object.fromEntries(professores.map((p: Professor) => [p.id, p]));

  const BACKEND_URL = "http://127.0.0.1:8000";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">TCCs</h2>
          <p className="text-slate-500 mt-1">
            {tccs.length} trabalho{tccs.length !== 1 ? "s" : ""} encontrado{tccs.length !== 1 ? "s" : ""}
            {q && <span className="text-blue-600"> para &ldquo;{q}&rdquo;</span>}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* SearchInput é Client Component — precisa de Suspense por usar useSearchParams */}
          <Suspense>
            <SearchInput placeholder="Buscar por título ou resumo..." />
          </Suspense>
          <Link
            href="/tccs/novo"
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
          >
            + Novo TCC
          </Link>
        </div>
      </div>

      {tccs.length === 0 ? (
        <EmptyState query={q} />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {["Título", "Aluno", "Orientador", "Tipo", "Semestre", "Status", "Arquivo", ""].map(
                    (col) => (
                      <th
                        key={col}
                        className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide"
                      >
                        {col}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tccs.map((tcc: TCC) => (
                  <TCCRow
                    key={tcc.id}
                    tcc={tcc}
                    aluno={alunoMap[tcc.aluno]}
                    orientador={professorMap[tcc.orientador]}
                    backendUrl={BACKEND_URL}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Sub-componentes ────────────────────────────────────────────────────────────

interface TCCRowProps {
  tcc: TCC;
  aluno: Aluno | undefined;
  orientador: Professor | undefined;
  backendUrl: string;
}

function TCCRow({ tcc, aluno, orientador, backendUrl }: TCCRowProps) {
  return (
    <tr className="hover:bg-slate-50 transition-colors">
      <td className="px-4 py-3 max-w-xs">
        <p className="font-medium text-slate-800 line-clamp-2">{tcc.titulo}</p>
      </td>
      <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
        {aluno?.nome ?? <span className="text-slate-400 italic">—</span>}
      </td>
      <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
        {orientador?.nome ?? <span className="text-slate-400 italic">—</span>}
      </td>
      <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{tcc.tipo_display}</td>
      <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
        {tcc.semestre_letivo_defesa ?? <span className="text-slate-400 italic">—</span>}
      </td>
      <td className="px-4 py-3">
        <StatusBadge status={tcc.status} label={tcc.status_display} />
      </td>
      <td className="px-4 py-3">
        {tcc.arquivo ? (
          <a
            href={`${backendUrl}${tcc.arquivo}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 font-medium underline underline-offset-2"
          >
            Ver PDF
          </a>
        ) : (
          <span className="text-slate-400 italic text-xs">Sem arquivo</span>
        )}
      </td>
      <td className="px-4 py-3">
        <Link
          href={`/tccs/${tcc.id}`}
          className="text-slate-500 hover:text-blue-600 font-medium text-xs underline underline-offset-2 transition-colors"
        >
          Detalhes →
        </Link>
      </td>
    </tr>
  );
}

function EmptyState({ query }: { query?: string }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 py-16 text-center">
      <p className="text-4xl mb-3">📄</p>
      <p className="text-slate-600 font-medium">
        {query ? `Nenhum TCC encontrado para "${query}"` : "Nenhum TCC cadastrado ainda."}
      </p>
      <Link
        href="/tccs/novo"
        className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
      >
        Cadastrar primeiro TCC
      </Link>
    </div>
  );
}
