import { cursosApi } from "@/services/api";
import CursosClient from "./CursosClient";

export default async function CursosPage() {
  const cursos = await cursosApi.listar();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Cursos</h2>
      </div>
      <CursosClient cursos={cursos} />
    </div>
  );
}
