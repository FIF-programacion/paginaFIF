import { ageLabel } from "../data/org";
import { useGame } from "../context/GameContext";
import { downloadCertificate } from "../utils/certificate";
import { getCourse } from "../data/courses";

export default function Progress() {
  const { courseStats, user, visibleCourses } = useGame();

  return (
    <section className="panel">
      <h2 style={{ textAlign: "left", color: "#111", fontSize: 28 }}>Programas cursados o en curso</h2>
      <table className="progress-table">
        <thead>
          <tr>
            <th scope="col">Curso</th>
            <th scope="col">Nivel</th>
            <th scope="col">Estado</th>
            <th scope="col">Lecciones</th>
            <th scope="col">Certificado</th>
          </tr>
        </thead>
        <tbody>
          {visibleCourses
            .map((item) => getCourse(item.id, user?.ageGroup))
            .filter((course) => course && (courseStats(course.id).completed > 0 || course.unlockedByDefault))
            .map((course) => {
              const stats = courseStats(course.id);
              return (
                <tr key={course.id}>
                  <td>{course.tableName}</td>
                  <td>{ageLabel(user?.ageGroup)}</td>
                  <td>{stats.status}</td>
                  <td>{stats.completed}/{stats.total}</td>
                  <td>
                    {stats.done ? (
                      <button
                        className="btn btn-green login-chip"
                        type="button"
                        onClick={() => downloadCertificate({
                          studentName: `${user.firstName} ${user.lastName}`,
                          courseTitle: course.title,
                        })}
                      >
                        Descargar certificado
                      </button>
                    ) : (
                      stats.certificate
                    )}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </section>
  );
}
