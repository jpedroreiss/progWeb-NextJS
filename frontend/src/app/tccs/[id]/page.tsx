import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BACKEND_BASE_URL,
  tccsApi,
  alunosApi,
  professoresApi,
} from "@/services/api";
import StatusBadge from "@/components/ui/StatusBadge";
import StatusChanger from "./StatusChanger";
import type { Aluno, Professor } from "@/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TCCDetailPage({ params }: PageProps) {
  const { id } = await params;
  const numericId = Number(id);

  if (isNaN(numericId)) notFound();

  // Busca TCC e catálogos em paralelo
  const [tcc, alunos, professores] = await Promise.all([
    tccsApi.buscarPorId(numericId).catch(() => null),
    alunosApi.listar(),
    professoresApi.listar(),
  ]);

  if (!tcc) notFound();

  const alunoMap = Object.fromEntries(alunos.map((a: Aluno) => [a.id, a.nome]));
  const profMap  = Object.fromEntries(professores.map((p: Professor) => [p.id, p.nome]));

  const BACKEND_URL = BACKEND_BASE_URL;

  // Função para garantir que a URL do arquivo seja acessível pelo navegador
  const getFileUrl = (url: string | null) => {
    if (!url) return "#";
    
    // Se o Django retornou a URL interna do Docker, trocamos para localhost
    if (url.includes("backend:8000")) {
      return url.replace("backend:8000", "localhost:8000");
    }
    
    // Fallback caso venha sem o host
    return url.startsWith("http") ? url : `${BACKEND_URL}${url}`;
  };

  return (
    <div className="max-w-3xl space-y-6">
      {/* Breadcrumb */}
      <div>
        <nav className="text-sm text-slate-500 mb-2">
          <Link href="/tccs" className="hover:text-blue-600 transition-colors">TCCs</Link>
          <span className="mx-2">›</span>
          <span className="text-slate-800 font-medium line-clamp-1">{tcc.titulo}</span>
        </nav>
        <div className="flex items-start gap-4">
          <h2 className="text-2xl font-bold text-slate-800 flex-1">{tcc.titulo}</h2>
          <StatusBadge status={tcc.status} label={tcc.status_display} />
        </div>
      </div>

      {/* Alteração de status — Client Component isolado */}
      <StatusChanger
        tccId={tcc.id}
        currentStatus={tcc.status}
        currentStatusDisplay={tcc.status_display}
      />

      {/* Detalhes do TCC */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
        <h3 className="font-semibold text-slate-700 border-b border-slate-100 pb-3">Detalhes</h3>

        <InfoRow label="Tipo"    value={tcc.tipo_display} />
        <InfoRow label="Idioma"  value={tcc.idioma_display} />
        <InfoRow label="Semestre de Defesa" value={tcc.semestre_letivo_defesa ?? "—"} />
        <InfoRow label="Palavras-chave"     value={tcc.palavras_chave} />

        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Resumo</p>
          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{tcc.resumo}</p>
        </div>

        {tcc.arquivo && (
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Arquivo</p>
            <a
              href={getFileUrl(tcc.arquivo)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium underline underline-offset-2"
            >
              📄 Baixar / Visualizar PDF
            </a>
          </div>
        )}
      </div>

      {/* Participantes */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <h3 className="font-semibold text-slate-700 border-b border-slate-100 pb-3">Participantes</h3>
        <InfoRow label="Aluno"       value={alunoMap[tcc.aluno] ?? `ID ${tcc.aluno}`} />
        <InfoRow label="Orientador"  value={profMap[tcc.orientador] ?? `ID ${tcc.orientador}`} />
        {tcc.coorientador && (
          <InfoRow label="Coorientador" value={profMap[tcc.coorientador] ?? `ID ${tcc.coorientador}`} />
        )}
      </div>

      {/* Banca */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <h3 className="font-semibold text-slate-700 border-b border-slate-100 pb-3">Banca Examinadora</h3>
        <InfoRow label="Presidente" value={profMap[tcc.presidente]      ?? `ID ${tcc.presidente}`} />
        <InfoRow label="1º Membro"  value={profMap[tcc.primeiro_membro] ?? `ID ${tcc.primeiro_membro}`} />
        <InfoRow label="2º Membro"  value={profMap[tcc.segundo_membro]  ?? `ID ${tcc.segundo_membro}`} />
      </div>
    </div>
  );
}

// ─── Sub-componente ─────────────────────────────────────────────────────────────

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-4">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide w-36 shrink-0 pt-0.5">{label}</p>
      <p className="text-sm text-slate-700">{value}</p>
    </div>
  );
}