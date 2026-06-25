import Link from "next/link";
import { alunosApi, professoresApi } from "@/services/api";
import TCCForm from "./TCCForm";

export default async function NovoTCCPage() {
  // Busca em paralelo — alunos e professores são independentes entre si
  const [alunos, professores] = await Promise.all([
    alunosApi.listar(),
    professoresApi.listar(),
  ]);

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <nav className="text-sm text-slate-500 mb-2">
          <Link href="/tccs" className="hover:text-blue-600 transition-colors">TCCs</Link>
          <span className="mx-2">›</span>
          <span className="text-slate-800 font-medium">Novo TCC</span>
        </nav>
        <h2 className="text-2xl font-bold text-slate-800">Cadastrar TCC</h2>
        <p className="text-slate-500 mt-1">Preencha os dados do trabalho de conclusão de curso.</p>
      </div>

      <TCCForm alunos={alunos} professores={professores} />
    </div>
  );
}
