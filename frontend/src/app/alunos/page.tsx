import { Suspense } from "react";
import { alunosApi, cursosApi } from "@/services/api";
import SearchInput from "@/components/ui/SearchInput";
import type { Aluno, Curso } from "@/types";

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function AlunosPage({ searchParams }: PageProps) {
  const { q } = await searchParams;

  const [alunos, cursos] = await Promise.all([
    alunosApi.listar(q),
    cursosApi.listar(),
  ]);

  const cursoMap = Object.fromEntries(cursos.map((c: Curso) => [c.id, c.nome]));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Alunos</h2>
          <p className="text-slate-500 mt-1">
            {alunos.length} aluno{alunos.length !== 1 ? "s" : ""} encontrado{alunos.length !== 1 ? "s" : ""}
            {q && <span className="text-blue-600"> para &ldquo;{q}&rdquo;</span>}
          </p>
        </div>
        <Suspense>
          <SearchInput placeholder="Buscar por nome ou matrícula..." />
        </Suspense>
      </div>

      {alunos.length === 0 ? (
        <EmptyState query={q} />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
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
              {alunos.map((aluno: Aluno) => (
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

function EmptyState({ query }: { query?: string }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 py-16 text-center">
      <p className="text-4xl mb-3">🎓</p>
      <p className="text-slate-600 font-medium">
        {query ? `Nenhum aluno encontrado para "${query}"` : "Nenhum aluno cadastrado."}
      </p>
    </div>
  );
}
