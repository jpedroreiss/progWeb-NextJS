import { departamentosApi, unidadesAcademicasApi } from "@/services/api";
import type { UnidadeAcademica } from "@/types";
import DepartamentosClient from "./DepartamentosClient";

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
      </div>
      <DepartamentosClient departamentos={departamentos} unidadeMap={unidadeMap} />
    </div>
  );
}
