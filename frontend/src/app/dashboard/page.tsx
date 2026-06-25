import { tccsApi } from "@/services/api";
import StatCard from "./StatCard";
import ChartPorStatus from "./ChartPorStatus";
import ChartPorTipo from "./ChartPorTipo";
import ChartPorCurso from "./ChartPorCurso";
import ChartPorSemestre from "./ChartPorSemestre";

/**
 * Página de Dashboard.
 * Server Component: busca os dados no servidor e os passa para os gráficos client-side.
 * Não usa useEffect — o fetch acontece no render do servidor, sem flash de carregamento.
 */
export default async function DashboardPage() {
  const stats = await tccsApi.estatisticas();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>
        <p className="text-slate-500 mt-1">Visão geral dos Trabalhos de Conclusão de Curso</p>
      </div>

      {/* Cartões de resumo no topo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total de TCCs"
          value={stats.total_geral}
          color="blue"
        />
        <StatCard
          label="Aprovados"
          value={stats.por_status["Aprovado"] ?? 0}
          color="green"
        />
        <StatCard
          label="Em Elaboração"
          value={stats.por_status["Em Elaboração"] ?? 0}
          color="yellow"
        />
        <StatCard
          label="Reprovados"
          value={stats.por_status["Reprovado"] ?? 0}
          color="red"
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartPorStatus data={stats.por_status} />
        <ChartPorTipo data={stats.por_tipo} />
        <ChartPorCurso data={stats.por_curso} />
        <ChartPorSemestre data={stats.por_semestre} />
      </div>
    </div>
  );
}
