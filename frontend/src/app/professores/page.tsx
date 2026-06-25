import { Suspense } from "react";
import { professoresApi, departamentosApi } from "@/services/api";
import SearchInput from "@/components/ui/SearchInput";
import type { Professor, Departamento } from "@/types";

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function ProfessoresPage({ searchParams }: PageProps) {
  const { q } = await searchParams;

  const [professores, departamentos] = await Promise.all([
    professoresApi.listar(q),
    departamentosApi.listar(),
  ]);

  const depMap = Object.fromEntries(departamentos.map((d: Departamento) => [d.id, d]));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Professores</h2>
          <p className="text-slate-500 mt-1">
            {professores.length} professor{professores.length !== 1 ? "es" : ""} encontrado{professores.length !== 1 ? "s" : ""}
            {q && <span className="text-blue-600"> para &ldquo;{q}&rdquo;</span>}
          </p>
        </div>
        <Suspense>
          <SearchInput placeholder="Buscar por nome..." />
        </Suspense>
      </div>

      {professores.length === 0 ? (
        <EmptyState query={q} />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
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
              {professores.map((prof: Professor) => {
                const dep = depMap[prof.departamento];
                return (
                  <tr key={prof.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-800">{prof.nome}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {dep?.nome ?? <span className="text-slate-400 italic">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      {dep ? (
                        <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs font-mono">
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

function EmptyState({ query }: { query?: string }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 py-16 text-center">
      <p className="text-4xl mb-3">👨‍🏫</p>
      <p className="text-slate-600 font-medium">
        {query ? `Nenhum professor encontrado para "${query}"` : "Nenhum professor cadastrado."}
      </p>
    </div>
  );
}
