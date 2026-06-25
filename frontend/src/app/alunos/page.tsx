import { alunosApi, cursosApi } from "@/services/api";
import type { Curso } from "@/types";
import AlunosClient from "./AlunosClient";

export default async function AlunosPage() {
  const [alunos, cursos] = await Promise.all([
    alunosApi.listar(),
    cursosApi.listar(),
  ]);

  const cursoMap = Object.fromEntries(cursos.map((c: Curso) => [c.id, c.nome]));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Alunos</h2>
      </div>
      <AlunosClient alunos={alunos} cursoMap={cursoMap} />
    </div>
  );
}
