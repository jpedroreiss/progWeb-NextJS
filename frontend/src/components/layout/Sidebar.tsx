"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  label: string;
  href: string;
  icon: string;
}

const navGroups = [
  {
    label: "Geral",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: "📊" },
      { label: "TCCs",      href: "/tccs",      icon: "📄" },
    ],
  },
  {
    label: "Cadastros",
    items: [
      { label: "Alunos",              href: "/alunos",        icon: "🎓" },
      { label: "Professores",         href: "/professores",   icon: "👨‍🏫" },
      { label: "Cursos",              href: "/cursos",        icon: "📚" },
      { label: "Departamentos",       href: "/departamentos", icon: "🏛️" },
      { label: "Unidades Acadêmicas", href: "/unidades",      icon: "🏫" },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-slate-800 text-white flex flex-col shrink-0">

      {/* Cabeçalho */}
      <div className="px-5 py-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
            G
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-tight">Gestão de TCCs</p>
            <p className="text-xs text-slate-400 leading-tight">Painel Acadêmico</p>
          </div>
        </div>
      </div>

      {/* Navegação agrupada */}
      <nav className="flex-1 px-3 pb-4 space-y-5 overflow-y-auto">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
              {group.label}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const isActive =
                  pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`
                        flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium
                        transition-all duration-150
                        ${isActive
                          ? "bg-blue-600 text-white shadow-sm"
                          : "text-slate-300 hover:bg-slate-700 hover:text-white"
                        }
                      `}
                    >
                      <span className="text-xs opacity-70">{item.icon}</span>
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="px-5 py-4 border-t border-slate-700">
        <p className="text-[11px] text-slate-500">Django REST Framework · API v1</p>
      </div>
    </aside>
  );
}
