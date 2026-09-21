import { Navigate, useNavigate, useParams } from "react-router-dom";
import { getCourse } from "../data/courses";
import { useGame } from "../context/GameContext";
import { downloadCertificate } from "../utils/certificate";

export default function CourseComplete() {
  const { courseId } = useParams();
  const { user, courseStats, visibleCourses } = useGame();
  const course = getCourse(courseId, user?.ageGroup);
  const navigate = useNavigate();

  if (!course) return <Navigate to="/app/cursos" replace />;
  const stats = courseStats(course.id);
  if (!stats.done) return <Navigate to={`/app/curso/${course.id}`} replace />;

  const catalog = visibleCourses;
  const index = catalog.findIndex((item) => item.id === course.id);
  const next = catalog.slice(index + 1).find((item) => courseStats(item.id).unlocked) || catalog[index + 1];

  const pdf = () => downloadCertificate({
    studentName: `${user.firstName} ${user.lastName}`,
    courseTitle: course.title,
  });

  return (
    <div className="complete-card">
      <div>
        <h2>
          FELICIDADES
          <br />
          HAS CULMINADO UNA ETAPA
        </h2>
        <h3>{course.title}</h3>
        <p className="by">CURSO COMPLETADO POR {user?.firstName?.toUpperCase()}</p>
        <p className="note">
          DE PARTE DEL EQUIPO DE FIF ESTAMOS ORGULLOSOS
          <br />
          DE TU PROGRESO, SIGUE ASI!
        </p>
        <div className="actions-row" style={{ justifyContent: "center" }}>
          <button className="btn btn-blue" type="button" onClick={pdf}>Descargar certificado PDF</button>
          <button
            className="btn btn-green"
            type="button"
            onClick={() => navigate(next ? `/app/curso/${next.id}` : "/app/cursos")}
          >
            Ir al siguiente curso
          </button>
        </div>
      </div>
    </div>
  );
}
