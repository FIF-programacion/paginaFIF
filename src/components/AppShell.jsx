import { Navigate, Outlet } from "react-router-dom";
import { AppHeader } from "./AppHeader";
import { useGame } from "../context/GameContext";

export default function AppShell() {
  const { user, hydrated } = useGame();
  if (!hydrated) return <p className="sr-only">Cargando</p>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === "teacher") return <Navigate to="/profesores/panel" replace />;

  return (
    <div className="app-shell">
      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      <AppHeader />
      <main id="contenido">
        <Outlet />
      </main>
    </div>
  );
}
