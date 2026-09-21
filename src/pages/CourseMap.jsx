import { Navigate, useNavigate, useParams } from "react-router-dom";
import { getCourse } from "../data/courses";
import { useGame } from "../context/GameContext";

const PATHS = [
  ["1", "2"],
  ["2", "3"],
  ["3", "4"],
  ["4", "5"],
  ["5", "6"],
  ["6", "7"],
  ["7", "8"],
  ["8", "9"],
];

function nodePos(id) {
  const n = Number(id) - 1;
  const col = n % 3;
  const row = Math.floor(n / 3);
  return { x: 16 + col * 34, y: 18 + row * 32 };
}

export default function CourseMap() {
  const { courseId } = useParams();
  const { isLessonOpen, isLessonDone, courseStats, user } = useGame();
  const course = getCourse(courseId, user?.ageGroup);
  const navigate = useNavigate();

  if (!course) return <Navigate to="/app/cursos" replace />;

  const stats = courseStats(course.id);
  if (!stats.unlocked) return <Navigate to="/app/recursos" replace />;

  return (
    <div>
      <h2 className="course-title">{course.title}</h2>
      <div className="map-wrap">
        <svg className="map-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
          {PATHS.map(([from, to]) => {
            const a = nodePos(from);
            const b = nodePos(to);
            const done = isLessonDone(course.id, from);
            return (
              <line
                key={`${from}-${to}`}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={done ? "#22f08a" : "#8b8b8b"}
                strokeWidth="3.2"
                strokeLinecap="round"
              />
            );
          })}
        </svg>
        <div className="nodes">
          {course.lessons.map((lesson) => {
            const open = isLessonOpen(course.id, lesson.number) || stats.done;
            return (
              <button
                key={lesson.id}
                className={`node ${open ? "open" : "locked"}`}
                type="button"
                disabled={!open}
                aria-label={`Lección ${lesson.number}: ${lesson.title}${open ? "" : ", bloqueada"}`}
                onClick={() => {
                  if (open) navigate(`/app/curso/${course.id}/leccion/${lesson.id}`);
                }}
              >
                {lesson.number}
                <small>“{lesson.title}”</small>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
