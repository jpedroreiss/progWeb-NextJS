import { cursosApi } from "@/services/api";
import type { Curso } from "@/types";

export default async function CursosPage() {
  const cursos = await cursosApi.listar();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Cursos</h2>
        <p className="text-slate-500 mt-1">{cursos.length} curso{cursos.length !== 1 ? "s" : ""} cadastrado{cursos.length !== 1 ? "s" : ""}</p>
      </div>

      {cursos.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 py-16 text-center">
          <p className="text-4xl mb-3">📚</p>
          <p className="text-slate-600 font-medium">Nenhum curso cadastrado.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cursos.map((curso: Curso) => (
            <div key={curso.id} className="bg-white rounded-xl border border-slate-200 p-5 space-y-2 hover:shadow-sm transition-shadow">
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
