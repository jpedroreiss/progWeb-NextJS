import { BACKEND_BASE_URL, tccsApi, alunosApi, professoresApi } from "@/services/api";
import type { Aluno, Professor } from "@/types";
import TCCsClient from "./TCCsClient";

const BACKEND_URL = BACKEND_BASE_URL;

export default async function TCCsPage() {
  const [tccs, alunos, professores] = await Promise.all([
    tccsApi.listar(),
    alunosApi.listar(),
    professoresApi.listar(),
  ]);

  const alunoMap    = Object.fromEntries(alunos.map((a: Aluno) => [a.id, a]));
  const professorMap = Object.fromEntries(professores.map((p: Professor) => [p.id, p]));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">TCCs</h2>
      </div>
      <TCCsClient
        tccs={tccs}
        alunoMap={alunoMap}
        professorMap={professorMap}
        backendUrl={BACKEND_URL}
      />
    </div>
  );
}
