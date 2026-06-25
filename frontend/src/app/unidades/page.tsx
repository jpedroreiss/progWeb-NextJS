import { unidadesAcademicasApi, departamentosApi } from "@/services/api";
import type { UnidadeAcademica, Departamento } from "@/types";

export default async function UnidadesPage() {
  const [unidades, departamentos] = await Promise.all([
    unidadesAcademicasApi.listar(),
    departamentosApi.listar(),
  ]);

  // Agrupa departamentos por unidade para exibir quantos cada uma tem
  const depsPorUnidade: Record<number, Departamento[]> = {};
  departamentos.forEach((d: Departamento) => {
    if (!depsPorUnidade[d.unidade_academica]) depsPorUnidade[d.unidade_academica] = [];
    depsPorUnidade[d.unidade_academica].push(d);
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Unidades Acadêmicas</h2>
        <p className="text-slate-500 mt-1">{unidades.length} unidade{unidades.length !== 1 ? "s" : ""} cadastrada{unidades.length !== 1 ? "s" : ""}</p>
      </div>

      {unidades.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 py-16 text-center">
          <p className="text-4xl mb-3">🏫</p>
          <p className="text-slate-600 font-medium">Nenhuma unidade acadêmica cadastrada.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {unidades.map((unidade: UnidadeAcademica) => {
            const deps = depsPorUnidade[unidade.id] ?? [];
            return (
              <div key={unidade.id} className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 hover:shadow-sm transition-shadow">
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
