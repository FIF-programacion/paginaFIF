import { Navigate, Route, Routes } from "react-router-dom";
import { GameProvider } from "./context/GameContext";
import AppShell from "./components/AppShell";
import { CookieNotice } from "./components/CookieNotice";
import Landing from "./pages/Landing";
import FifLearning from "./pages/FifLearning";
import DonateIndividual from "./pages/DonateIndividual";
import DonatePackages from "./pages/DonatePackages";
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
import TakeTest from "./pages/TakeTest";
import { PrivacyPage, TermsPage, CookiesPage, RefundsPage, NoticesPage, ContactPage } from "./pages/legal/LegalPages";

export default function App() {
  return (
    <GameProvider>
      <CookieNotice />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/fif-learning" element={<FifLearning />} />
        <Route path="/dona/individual" element={<DonateIndividual />} />
        <Route path="/dona/paquetes" element={<DonatePackages />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/verificar" element={<Verify />} />
        <Route path="/tutorial/:step" element={<Tutorial />} />
        <Route path="/bienvenida" element={<Welcome />} />
        <Route path="/profesores" element={<TeacherLogin />} />
        <Route path="/profesores/panel" element={<TeacherPanel />} />
        <Route path="/legal/privacidad" element={<PrivacyPage />} />
        <Route path="/legal/terminos" element={<TermsPage />} />
        <Route path="/legal/cookies" element={<CookiesPage />} />
        <Route path="/legal/reembolsos" element={<RefundsPage />} />
        <Route path="/legal/avisos" element={<NoticesPage />} />
        <Route path="/legal/contacto" element={<ContactPage />} />
        <Route path="/app" element={<AppShell />}>
          <Route index element={<Navigate to="cursos" replace />} />
          <Route path="cursos" element={<Dashboard />} />
          <Route path="progreso" element={<Progress />} />
          <Route path="recursos" element={<Resources />} />
          <Route path="asistencia" element={<Help />} />
          <Route path="prueba" element={<TakeTest />} />
          <Route path="curso/:courseId" element={<CourseMap />} />
          <Route path="curso/:courseId/leccion/:lessonId" element={<ExercisePage />} />
          <Route path="curso/:courseId/completado" element={<CourseComplete />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </GameProvider>
  );
}
