"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { tccsApi } from "@/services/api";
import { TCC_TIPOS, TCC_IDIOMAS, TCC_SEMESTRES } from "@/lib/constants";
import type { Aluno, Professor, TCCPayload } from "@/types";

interface Props {
  alunos: Aluno[];
  professores: Professor[];
}

const INITIAL_FORM: TCCPayload = {
  titulo: "",
  resumo: "",
  palavras_chave: "",
  tipo: "MONOGRAFIA",
  idioma: "PT",
  aluno: 0,
  orientador: 0,
  coorientador: null,
  presidente: 0,
  primeiro_membro: 0,
  segundo_membro: 0,
  semestre_letivo_defesa: null,
  status: "0",
  arquivo: null,
};

export default function TCCForm({ alunos, professores }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<TCCPayload>(INITIAL_FORM);
  const [arquivo, setArquivo] = useState<File | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      // Campos FK são números; os demais ficam como string
      [name]: ["aluno", "orientador", "coorientador", "presidente", "primeiro_membro", "segundo_membro"].includes(name)
        ? value === "" ? null : Number(value)
        : value || null,
    }));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setArquivo(e.target.files?.[0]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await tccsApi.criar(form, arquivo);
      router.push("/tccs");
      router.refresh(); // invalida o cache do Server Component de listagem
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao cadastrar TCC.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">

      {/* ── Informações Básicas ─────────────────────────────────────── */}
      <Section title="Informações Básicas">
        <Field label="Título" required>
          <input
            name="titulo"
            value={form.titulo}
            onChange={handleChange}
            required
            className={inputCls}
            placeholder="Título do trabalho"
          />
        </Field>

        <Field label="Resumo" required>
          <textarea
            name="resumo"
            value={form.resumo}
            onChange={handleChange}
            required
            rows={4}
            className={inputCls}
            placeholder="Resumo do trabalho..."
          />
        </Field>

        <Field label="Palavras-chave" required hint="Separe por vírgulas">
          <input
            name="palavras_chave"
            value={form.palavras_chave}
            onChange={handleChange}
            required
            className={inputCls}
            placeholder="ex: machine learning, redes neurais, python"
          />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Tipo" required>
            <select name="tipo" value={form.tipo} onChange={handleChange} required className={inputCls}>
              {TCC_TIPOS.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </Field>

          <Field label="Idioma" required>
            <select name="idioma" value={form.idioma} onChange={handleChange} required className={inputCls}>
              {TCC_IDIOMAS.map((i) => (
                <option key={i.value} value={i.value}>{i.label}</option>
              ))}
            </select>
          </Field>

          <Field label="Semestre de Defesa">
            <select
              name="semestre_letivo_defesa"
              value={form.semestre_letivo_defesa ?? ""}
              onChange={handleChange}
              className={inputCls}
            >
              <option value="">— Não definido —</option>
              {TCC_SEMESTRES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </Field>
        </div>
      </Section>

      {/* ── Participantes ───────────────────────────────────────────── */}
      <Section title="Participantes">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Aluno" required>
            <select
              name="aluno"
              value={form.aluno || ""}
              onChange={handleChange}
              required
              className={inputCls}
            >
              <option value="">Selecione um aluno...</option>
              {alunos.map((a) => (
                <option key={a.id} value={a.id}>{a.nome} — {a.matricula}</option>
              ))}
            </select>
          </Field>

          <Field label="Orientador" required>
            <ProfessorSelect name="orientador" value={form.orientador} professores={professores} onChange={handleChange} required />
          </Field>

          <Field label="Coorientador">
            <ProfessorSelect name="coorientador" value={form.coorientador} professores={professores} onChange={handleChange} optional />
          </Field>
        </div>
      </Section>

      {/* ── Banca Examinadora ───────────────────────────────────────── */}
      <Section title="Banca Examinadora">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Presidente" required>
            <ProfessorSelect name="presidente" value={form.presidente} professores={professores} onChange={handleChange} required />
          </Field>
          <Field label="1º Membro" required>
            <ProfessorSelect name="primeiro_membro" value={form.primeiro_membro} professores={professores} onChange={handleChange} required />
          </Field>
          <Field label="2º Membro" required>
            <ProfessorSelect name="segundo_membro" value={form.segundo_membro} professores={professores} onChange={handleChange} required />
          </Field>
        </div>
      </Section>

      {/* ── Arquivo ─────────────────────────────────────────────────── */}
      <Section title="Arquivo">
        <Field label="Arquivo PDF">
          <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
            <div className="flex flex-col items-center gap-1 text-slate-500">
              <span className="text-2xl">📄</span>
              <span className="text-sm font-medium">
                {arquivo ? arquivo.name : "Clique para selecionar o PDF"}
              </span>
              {arquivo
                ? <span className="text-xs text-slate-400">{(arquivo.size / 1024).toFixed(0)} KB</span>
                : <span className="text-xs text-slate-400">Apenas arquivos .pdf</span>
              }
            </div>
            <input
              ref={fileRef}
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </Field>
      </Section>

      {/* ── Feedback e Ações ────────────────────────────────────────── */}
      {error && (
        <div className="bg-red-50 border border-red-300 text-red-700 rounded-lg px-4 py-3 text-sm font-medium">
          ⚠ {error}
        </div>
      )}

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
        >
          {isSubmitting ? "Cadastrando..." : "Cadastrar TCC"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 text-slate-700 text-sm font-medium rounded-lg border border-slate-300 bg-white hover:bg-slate-50 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

// ─── Sub-componentes internos ───────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide border-b border-slate-100 pb-3">
        {title}
      </h3>
      {children}
    </div>
  );
}

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-red-500 ml-1" aria-hidden>*</span>}
        {hint && <span className="text-slate-400 font-normal ml-2 text-xs">{hint}</span>}
      </label>
      {children}
    </div>
  );
}

interface ProfessorSelectProps {
  name: string;
  value: number | null;
  professores: Professor[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
  optional?: boolean;
}

function ProfessorSelect({ name, value, professores, onChange, required, optional }: ProfessorSelectProps) {
  return (
    <select name={name} value={value ?? ""} onChange={onChange} required={required} className={inputCls}>
      <option value="">{optional ? "— Nenhum —" : "Selecione um professor..."}</option>
      {professores.map((p) => (
        <option key={p.id} value={p.id}>{p.nome}</option>
      ))}
    </select>
  );
}

// Cores explícitas para garantir legibilidade independente do tema do sistema
const inputCls = [
  "w-full px-3 py-2.5 text-sm rounded-lg border",
  "bg-white text-slate-900 placeholder:text-slate-400",
  "border-slate-300",
  "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
  "transition-all",
].join(" ");
