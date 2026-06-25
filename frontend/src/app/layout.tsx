import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Sidebar from "@/components/layout/Sidebar";
import "./globals.css";

export const dynamic = "force-dynamic";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gestão de TCCs",
  description: "Sistema de gerenciamento de Trabalhos de Conclusão de Curso",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${geist.className} bg-slate-800`}>
        <div className="flex min-h-screen">
          <Sidebar />
          {/* bg e text explícitos aqui — background-color não herda em CSS */}
          <main className="flex-1 p-8 overflow-y-auto min-w-0 bg-slate-100 text-slate-900">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
