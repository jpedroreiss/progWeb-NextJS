/**
 * Tipos espelhando os modelos do backend Django.
 * Campos com sufixo _display são lidos mas nunca enviados ao servidor —
 * o DRF os gera via get_*_display() e os retorna como read_only.
 */

export interface UnidadeAcademica {
  id: number;
  nome: string;
  sigla: string;
}

export interface Departamento {
  id: number;
  nome: string;
  sigla: string;
  unidade_academica: number;
}

export interface Curso {
  id: number;
  nome: string;
  sigla: string;
  codigo: string;
}

export interface Aluno {
  id: number;
  nome: string;
  matricula: string;
  curso: number;
}

export interface Professor {
  id: number;
  nome: string;
  departamento: number;
}

/** Status numérico conforme definido no model TCC. */
export type TCCStatus = "0" | "1" | "2" | "3";

export type TCCTipo =
  | "MONOGRAFIA"
  | "RELATORIO_ESTAGIO"
  | "RELATORIO_TECNICO"
  | "ARTIGO";

export type TCCIdioma = "PT" | "EN";

export interface TCC {
  id: number;
  titulo: string;
  resumo: string;
  palavras_chave: string;
  tipo: TCCTipo;
  idioma: TCCIdioma;
  aluno: number;
  orientador: number;
  coorientador: number | null;
  presidente: number;
  primeiro_membro: number;
  segundo_membro: number;
  semestre_letivo_defesa: string | null;
  status: TCCStatus;
  arquivo: string | null;
  // Campos read-only gerados pelo DRF
  status_display: string;
  tipo_display: string;
  idioma_display: string;
}

/** Payload para criar ou editar um TCC (sem campos read-only). */
export type TCCPayload = Omit<TCC, "id" | "status_display" | "tipo_display" | "idioma_display">;

/** Resposta do endpoint /api/tccs/estatisticas/ */
export interface Estatisticas {
  total_geral: number;
  por_status: Record<string, number>;
  por_tipo: Record<string, number>;
  por_idioma: Record<string, number>;
  por_semestre: Record<string, number>;
  por_orientador: Record<string, number>;
  por_coorientador: Record<string, number>;
  por_curso: Record<string, number>;
  por_departamento: Record<string, number>;
  por_unidade_academica: Record<string, number>;
}
