import { unidadesAcademicasApi, departamentosApi } from "@/services/api";
import type { Departamento } from "@/types";
import UnidadesClient from "./UnidadesClient";

export default async function UnidadesPage() {
  const [unidades, departamentos] = await Promise.all([
    unidadesAcademicasApi.listar(),
    departamentosApi.listar(),
  ]);

  // Agrupa departamentos por unidade para exibir as siglas no card
  const depsPorUnidade: Record<number, Departamento[]> = {};
  departamentos.forEach((d: Departamento) => {
    if (!depsPorUnidade[d.unidade_academica]) depsPorUnidade[d.unidade_academica] = [];
    depsPorUnidade[d.unidade_academica].push(d);
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Unidades Acadêmicas</h2>
      </div>
      <UnidadesClient unidades={unidades} depsPorUnidade={depsPorUnidade} />
    </div>
  );
}
