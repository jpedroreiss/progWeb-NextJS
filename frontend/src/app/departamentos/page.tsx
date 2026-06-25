import { departamentosApi, unidadesAcademicasApi } from "@/services/api";
import type { Departamento, UnidadeAcademica } from "@/types";

export default async function DepartamentosPage() {
  const [departamentos, unidades] = await Promise.all([
    departamentosApi.listar(),
    unidadesAcademicasApi.listar(),
  ]);

  const unidadeMap = Object.fromEntries(unidades.map((u: UnidadeAcademica) => [u.id, u]));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Departamentos</h2>
        <p className="text-slate-500 mt-1">{departamentos.length} departamento{departamentos.length !== 1 ? "s" : ""} cadastrado{departamentos.length !== 1 ? "s" : ""}</p>
      </div>

      {departamentos.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 py-16 text-center">
          <p className="text-4xl mb-3">🏛️</p>
          <p className="text-slate-600 font-medium">Nenhum departamento cadastrado.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {["Departamento", "Sigla", "Unidade Acadêmica"].map((col) => (
                  <th key={col} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {departamentos.map((dep: Departamento) => {
                const unidade = unidadeMap[dep.unidade_academica];
                return (
                  <tr key={dep.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-800">{dep.nome}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs font-mono">
                        {dep.sigla}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {unidade ? (
                        <span>
                          {unidade.nome}{" "}
                          <span className="text-slate-400 text-xs font-mono">({unidade.sigla})</span>
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
