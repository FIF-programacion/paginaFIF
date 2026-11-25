import { Link } from "react-router-dom";

export function AdminSideNav({ title, meta, tabs, tab, onTab, onLogout }) {
  return (
    <aside className="ad-side">
      <div className="ad-side-nav">
        <strong>{title}</strong>
        {meta}
        {tabs.map((item) => (
          <button key={item.id} type="button" className={tab === item.id ? "is-on" : ""} onClick={() => onTab(item.id)}>
            {item.label}
          </button>
        ))}
      </div>
      <div className="ad-side-footer">
        <Link to="/app/cursos">LEARNING</Link>
        <Link to="/">Portal público</Link>
        <button type="button" onClick={onLogout}>Cerrar sesión</button>
      </div>
    </aside>
  );
}
