import { Navigate, Route, Routes } from "react-router-dom";
import { PLATFORM_ENABLED } from "./config";
import { GameProvider } from "./context/GameContext";
import AppShell from "./components/AppShell";
import FifLearning from "./pages/FifLearning";
import Register from "./pages/Register";
import Verify from "./pages/Verify";
import Tutorial from "./pages/Tutorial";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Progress from "./pages/Progress";
import Resources from "./pages/Resources";
import Help from "./pages/Help";
import SubjectHub from "./pages/SubjectHub";
import CourseMap from "./pages/CourseMap";
import ExercisePage from "./pages/exercises/ExercisePage";
import CourseComplete from "./pages/CourseComplete";
import TeacherLogin from "./pages/TeacherLogin";
import TeacherPanel from "./pages/TeacherPanel";
import AdminLogin from "./pages/AdminLogin";
import AdminPanel from "./pages/AdminPanel";
import TakeTest from "./pages/TakeTest";
import StudentActivities from "./pages/StudentActivities";
import StudentSchedules from "./pages/StudentSchedules";

function WhenPlatform({ children }) {
  if (!PLATFORM_ENABLED) return <Navigate to="/" replace />;
  return children;
}

export default function PlatformRoutes() {
  return (
    <GameProvider>
      <Routes>
        <Route path="fif-learning" element={<WhenPlatform><FifLearning /></WhenPlatform>} />
        <Route path="login" element={<WhenPlatform><Login /></WhenPlatform>} />
        <Route path="registro" element={<WhenPlatform><Register /></WhenPlatform>} />
        <Route path="verificar" element={<WhenPlatform><Verify /></WhenPlatform>} />
        <Route path="tutorial/:step" element={<WhenPlatform><Tutorial /></WhenPlatform>} />
        <Route path="bienvenida" element={<WhenPlatform><Welcome /></WhenPlatform>} />
        <Route path="profesores" element={<WhenPlatform><TeacherLogin /></WhenPlatform>} />
        <Route path="equipo" element={<WhenPlatform><TeacherPanel /></WhenPlatform>} />
        <Route path="profesores/panel" element={<Navigate to={PLATFORM_ENABLED ? "/equipo" : "/"} replace />} />
        <Route path="admin" element={<AdminLogin />} />
        <Route path="admin/panel" element={<AdminPanel />} />
        <Route path="coordinacion" element={<Navigate to="/admin/panel" replace />} />
        <Route path="app" element={<WhenPlatform><AppShell /></WhenPlatform>}>
          <Route index element={<Navigate to="cursos" replace />} />
          <Route path="cursos" element={<Dashboard />} />
          <Route path="progreso" element={<Progress />} />
          <Route path="recursos" element={<Resources />} />
          <Route path="asistencia" element={<Help />} />
          <Route path="prueba" element={<TakeTest />} />
          <Route path="actividades" element={<StudentActivities />} />
          <Route path="horarios" element={<StudentSchedules />} />
          <Route path="materia/:subjectId" element={<SubjectHub />} />
          <Route path="curso/:courseId" element={<CourseMap />} />
          <Route path="curso/:courseId/leccion/:lessonId" element={<ExercisePage />} />
          <Route path="curso/:courseId/completado" element={<CourseComplete />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </GameProvider>
  );
}
