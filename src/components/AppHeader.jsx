import { NavLink, Link, useLocation } from "react-router-dom";
import { BrandLockup } from "./Brand";
import { useGame } from "../context/GameContext";
import { getSubject } from "../data/teacher";

export function AppHeader() {
  const { user, stats, logout } = useGame();
  const location = useLocation();
  const firstName = user?.firstName || "Estudiante";
  const subjectMatch = location.pathname.match(/^\/app\/materia\/([^/]+)/);
  const subjectId = subjectMatch?.[1];
  const inCourse = Boolean(subjectId && getSubject(subjectId));
  const base = `/app/materia/${subjectId}`;
  const coursesActive = location.pathname.startsWith("/app/curso") || location.pathname.startsWith("/app/cursos");
  const minigamesActive = location.pathname.startsWith("/app/minijuegos") || location.pathname.includes("/juego/");

  return (
    <header className="app-header">
      <div className="app-header-top">
        <BrandLockup
          to="/app/cursos"
          extra={<span className="mis-cursos-label">MIS CURSOS</span>}
        />
        <div className="stats-row" aria-label="Progreso de gamificación">
          <div className="stat">
            <span className="stat-icon star-blue" aria-hidden="true">★</span>
            <span>
              <strong>{stats.points}</strong>
              <small>Puntos</small>
            </span>
          </div>
          <div className="stat">
            <span className="stat-icon star-blue" aria-hidden="true">★</span>
            <span>
              <strong>{stats.badges}</strong>
              <small>Insignias</small>
            </span>
          </div>
          <div className="stat">
            <span className="stat-icon sun" aria-hidden="true">☀</span>
            <span>
              <strong>{stats.days}</strong>
              <small>Días</small>
            </span>
          </div>
        </div>
      </div>
      {inCourse ? (
        <nav className="app-nav" aria-label="Secciones del curso">
          <NavLink to={base} end>Inicio</NavLink>
          <NavLink to={`${base}/actividades`}>Actividades</NavLink>
          <NavLink to={`${base}/progreso`}>Progreso</NavLink>
          <NavLink to={`${base}/contenido`}>Contenido</NavLink>
          <NavLink
            to={`${base}/minijuegos`}
            className={({ isActive }) => (isActive || location.pathname.includes("/juego/") ? "active" : "")}
          >
            Minijuegos
          </NavLink>
          <NavLink to={`${base}/silabo`}>Sílabo</NavLink>
          <details className="nav-drop">
            <summary className={location.pathname.includes("/evaluacion") || location.pathname.includes("/calificaciones") ? "active" : ""}>
              Evaluación
            </summary>
            <div className="nav-drop-menu">
              <NavLink to={`${base}/calificaciones`}>Calificaciones</NavLink>
              <NavLink to={`${base}/evaluacion`}>Código de prueba</NavLink>
            </div>
          </details>
          <Link to="/app/cursos">Mis cursos</Link>
          <button type="button" onClick={logout}>Cerrar sesión</button>
        </nav>
      ) : (
        <nav className="app-nav" aria-label="Secciones de estudiante">
          <Link to="/fif-learning">Inicio</Link>
          <Link to="/app/cursos" className="nav-name">{firstName.toUpperCase()}</Link>
          <NavLink to="/app/cursos" className={({ isActive }) => (isActive || coursesActive ? "active" : "")}>Cursos</NavLink>
          <NavLink to="/app/minijuegos" className={({ isActive }) => (isActive || minigamesActive ? "active" : "")}>Minijuegos</NavLink>
          <NavLink to="/app/progreso">Progreso</NavLink>
          <NavLink to="/app/recursos">Mis recursos</NavLink>
          <NavLink to="/app/asistencia">Asistencia</NavLink>
          <NavLink to="/app/actividades">Actividades</NavLink>
          <NavLink to="/app/horarios">Horarios</NavLink>
          <NavLink to="/app/prueba" className="nav-test-code">Ingresar código de prueba</NavLink>
          <button type="button" onClick={logout}>Cerrar sesión</button>
        </nav>
      )}
    </header>
  );
}

export function StepBar({ value }) {
  return (
    <div className="step-bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={value}>
      <div className="step-bar-fill" style={{ width: `${value}%` }} />
    </div>
  );
}
