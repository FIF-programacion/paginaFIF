import { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { getCourse, getLesson } from "../../data/courses";
import { useGame } from "../../context/GameContext";
import MatchingExercise from "./MatchingExercise";
import TimedMathExercise from "./TimedMathExercise";
import DeductorExercise from "./DeductorExercise";

export default function ExercisePage() {
  const { courseId, lessonId } = useParams();
  const { completeLesson, isLessonOpen, user } = useGame();
  const course = getCourse(courseId, user?.ageGroup);
  const lesson = getLesson(courseId, lessonId, user?.ageGroup);
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  if (!course || !lesson) return <Navigate to="/app/cursos" replace />;
  if (!isLessonOpen(course.id, lesson.number)) return <Navigate to={`/app/curso/${course.id}`} replace />;

  const handleSubmit = (ok) => {
    if (!ok || busy) return;
    setBusy(true);
    const finished = completeLesson(course.id, lesson.id, lesson.exercise.type === "timed" ? 20 : 15);
    window.setTimeout(() => {
      if (finished) navigate(`/app/curso/${course.id}/completado`);
      else navigate(`/app/curso/${course.id}`);
    }, 900);
  };

  const Exercise =
    lesson.exercise.type === "timed"
      ? TimedMathExercise
      : lesson.exercise.type === "deductor"
        ? DeductorExercise
        : MatchingExercise;

  return (
    <div>
      <h2 className="course-title">{course.title}</h2>
      <p className="lesson-prompt">- {lesson.exercise.prompt}</p>
      <Exercise exercise={lesson.exercise} onSubmit={handleSubmit} />
    </div>
  );
}
