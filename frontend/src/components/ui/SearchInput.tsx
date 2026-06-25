"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTransition } from "react";

interface Props {
  placeholder?: string;
}

/**
 * Input de busca que reflete o termo no URL (?q=...).
 * O Server Component pai re-renderiza com o novo parâmetro, sem estado local.
 * useTransition mantém a UI responsiva enquanto a navegação ocorre.
 */
export default function SearchInput({ placeholder = "Buscar..." }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const term = e.target.value;
    const params = new URLSearchParams(searchParams.toString());

    if (term) {
      params.set("q", term);
    } else {
      params.delete("q");
    }

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <input
      type="search"
      defaultValue={searchParams.get("q") ?? ""}
      onChange={handleChange}
      placeholder={placeholder}
      className={[
        "w-full sm:w-72 px-4 py-2 rounded-lg border text-sm",
        "bg-white text-slate-900 placeholder:text-slate-400",
        "border-slate-300 shadow-sm",
        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
        "transition-all",
        isPending ? "opacity-60" : "opacity-100",
      ].join(" ")}
    />
  );
}
