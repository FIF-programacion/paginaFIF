import { Navigate, Route, Routes } from "react-router-dom";
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

export default function PlatformRoutes() {
  return (
    <GameProvider>
      <Routes>
        <Route path="fif-learning" element={<FifLearning />} />
        <Route path="login" element={<Login />} />
        <Route path="registro" element={<Register />} />
        <Route path="verificar" element={<Verify />} />
        <Route path="tutorial/:step" element={<Tutorial />} />
        <Route path="bienvenida" element={<Welcome />} />
        <Route path="profesores" element={<TeacherLogin />} />
        <Route path="equipo" element={<TeacherPanel />} />
        <Route path="profesores/panel" element={<Navigate to="/equipo" replace />} />
        <Route path="admin" element={<AdminLogin />} />
        <Route path="admin/panel" element={<AdminPanel />} />
        <Route path="coordinacion" element={<Navigate to="/admin/panel" replace />} />
        <Route path="app" element={<AppShell />}>
          <Route index element={<Navigate to="cursos" replace />} />
          <Route path="cursos" element={<Dashboard />} />
          <Route path="progreso" element={<Progress />} />
          <Route path="recursos" element={<Resources />} />
          <Route path="asistencia" element={<Help />} />
          <Route path="prueba" element={<TakeTest />} />
          <Route path="actividades" element={<StudentActivities />} />
          <Route path="horarios" element={<StudentSchedules />} />
          <Route path="curso/:courseId" element={<CourseMap />} />
          <Route path="curso/:courseId/leccion/:lessonId" element={<ExercisePage />} />
          <Route path="curso/:courseId/completado" element={<CourseComplete />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </GameProvider>
  );
}
