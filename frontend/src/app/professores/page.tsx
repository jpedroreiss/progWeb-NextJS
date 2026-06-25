import { professoresApi, departamentosApi } from "@/services/api";
import type { Departamento } from "@/types";
import ProfessoresClient from "./ProfessoresClient";

export default async function ProfessoresPage() {
  const [professores, departamentos] = await Promise.all([
    professoresApi.listar(),
    departamentosApi.listar(),
  ]);

  const depMap = Object.fromEntries(departamentos.map((d: Departamento) => [d.id, d]));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Professores</h2>
      </div>
      <ProfessoresClient professores={professores} depMap={depMap} />
    </div>
  );
}
