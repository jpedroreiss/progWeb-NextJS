import { redirect } from "next/navigation";

// Redireciona a raiz para o dashboard como ponto de entrada padrão
export default function RootPage() {
  redirect("/dashboard");
}
