"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  label: string;
  href: string;
  icon: string;
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: "📊" },
  { label: "TCCs", href: "/tccs", icon: "📄" },
  { label: "Alunos", href: "/alunos", icon: "🎓" },
  { label: "Professores", href: "/professores", icon: "👨‍🏫" },
  { label: "Cursos", href: "/cursos", icon: "📚" },
  { label: "Departamentos", href: "/departamentos", icon: "🏛️" },
  { label: "Unidades Acadêmicas", href: "/unidades", icon: "🏫" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      <div className="px-6 py-5 border-b border-slate-700">
        <h1 className="text-lg font-bold leading-tight">Gestão de TCCs</h1>
        <p className="text-xs text-slate-400 mt-0.5">Sistema de Gerenciamento</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          // Ativo se o pathname inicia com o href do item (exceto root)
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                transition-colors duration-150
                ${isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }
              `}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-6 py-4 border-t border-slate-700">
        <p className="text-xs text-slate-500">Backend: Django REST Framework</p>
      </div>
    </aside>
  );
}
