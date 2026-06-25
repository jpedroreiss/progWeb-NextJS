/**
 * Camada de acesso à API Django REST Framework.
 * Toda comunicação com o backend passa por aqui — nenhuma página chama fetch diretamente.
 */

import type {
  UnidadeAcademica,
  Departamento,
  Curso,
  Aluno,
  Professor,
  TCC,
  TCCPayload,
  TCCStatus,
  Estatisticas,
} from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
export const BACKEND_BASE_URL = BASE_URL.replace(/\/api\/?$/, "");

// ─── Utilitário interno ────────────────────────────────────────────────────────

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, init);
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API ${res.status}: ${body}`);
  }
  // DELETE retorna 204 No Content
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

// ─── Unidades Acadêmicas ───────────────────────────────────────────────────────

export const unidadesAcademicasApi = {
  listar: () => request<UnidadeAcademica[]>("/unidades-academicas/"),
};

// ─── Departamentos ─────────────────────────────────────────────────────────────

export const departamentosApi = {
  listar: () => request<Departamento[]>("/departamentos/"),
};

// ─── Cursos ────────────────────────────────────────────────────────────────────

export const cursosApi = {
  listar: () => request<Curso[]>("/cursos/"),
};

// ─── Alunos ────────────────────────────────────────────────────────────────────

export const alunosApi = {
  listar: (busca?: string) => {
    const params = busca ? `?search=${encodeURIComponent(busca)}` : "";
    return request<Aluno[]>(`/alunos/${params}`);
  },
};

// ─── Professores ───────────────────────────────────────────────────────────────

export const professoresApi = {
  listar: (busca?: string) => {
    const params = busca ? `?search=${encodeURIComponent(busca)}` : "";
    return request<Professor[]>(`/professores/${params}`);
  },
};

// ─── TCCs ──────────────────────────────────────────────────────────────────────

export const tccsApi = {
  listar: (busca?: string) => {
    const params = busca ? `?search=${encodeURIComponent(busca)}` : "";
    return request<TCC[]>(`/tccs/${params}`);
  },

  buscarPorId: (id: number) => request<TCC>(`/tccs/${id}/`),

  /**
   * Cria um TCC. Usa FormData para suportar o upload do arquivo PDF.
   * O DRF exige multipart/form-data quando há FileField.
   */
  criar: (payload: TCCPayload, arquivo?: File) => {
    const form = buildTCCFormData(payload, arquivo);
    return request<TCC>("/tccs/", { method: "POST", body: form });
  },

  /** PATCH parcial — apenas o campo status é alterado nesta operação. */
  alterarStatus: (id: number, status: TCCStatus) =>
    request<TCC>(`/tccs/${id}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    }),

  estatisticas: () => request<Estatisticas>("/tccs/estatisticas/"),
};

// ─── Helper ────────────────────────────────────────────────────────────────────

/**
 * Monta o FormData que o DRF espera para criar/editar um TCC.
 * Campos nulos são omitidos para evitar strings "null" no banco.
 */
function buildTCCFormData(payload: TCCPayload, arquivo?: File): FormData {
  const form = new FormData();

  const stringFields: Array<keyof TCCPayload> = [
    "titulo",
    "resumo",
    "palavras_chave",
    "tipo",
    "idioma",
    "status",
  ];

  stringFields.forEach((key) => {
    const value = payload[key];
    if (value !== null && value !== undefined) {
      form.append(key, String(value));
    }
  });

  const numericFields: Array<keyof TCCPayload> = [
    "aluno",
    "orientador",
    "presidente",
    "primeiro_membro",
    "segundo_membro",
  ];

  numericFields.forEach((key) => {
    const value = payload[key];
    if (value !== null && value !== undefined) {
      form.append(key, String(value));
    }
  });

  // Opcionais: só envia se preenchidos
  if (payload.coorientador !== null && payload.coorientador !== undefined) {
    form.append("coorientador", String(payload.coorientador));
  }
  if (payload.semestre_letivo_defesa) {
    form.append("semestre_letivo_defesa", payload.semestre_letivo_defesa);
  }
  if (arquivo) {
    form.append("arquivo", arquivo);
  }

  return form;
}
