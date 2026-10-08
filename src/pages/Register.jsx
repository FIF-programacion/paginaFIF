import { Link } from "react-router-dom";
import "./Admin.css";

export default function Register() {
  return (
    <div className="ad-login">
      <div className="ad-login-card">
        <p className="ad-kicker">FIF Learning</p>
        <h1>El alta está cerrada</h1>
        <p className="ad-lead">
          Las cuentas de estudiantes y del equipo las crea coordinación FIF.
          Si ya te inscribiste, espera tus datos de acceso. Si ya los tienes, entra con tu correo y clave.
        </p>
        <Link className="ad-btn" to="/login" style={{ textAlign: "center", textDecoration: "none" }}>Iniciar sesión</Link>
        <Link to="/inscripciones">Ir a inscripciones</Link>
        <Link to="/fif-learning">Volver al portal</Link>
      </div>
    </div>
  );
}
