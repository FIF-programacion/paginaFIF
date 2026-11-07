import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import DonateIndividual from "./pages/DonateIndividual";
import DonatePackages from "./pages/DonatePackages";
import Enrollment from "./pages/Enrollment";
import { PrivacyPage, TermsPage, CookiesPage, RefundsPage, NoticesPage, ContactPage } from "./pages/legal/LegalPages";

// Coordinación queda disponible en el sitio publicado. El portal de estudiantes
// se oculta en la landing y, en producción, se apaga con VITE_ENABLE_PLATFORM.
const PlatformRoutes = lazy(() => import("./PlatformRoutes"));

export default function App() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dona/individual" element={<DonateIndividual />} />
        <Route path="/dona/paquetes" element={<DonatePackages />} />
        <Route path="/inscripciones" element={<Enrollment />} />
        <Route path="/legal/privacidad" element={<PrivacyPage />} />
        <Route path="/legal/terminos" element={<TermsPage />} />
        <Route path="/legal/cookies" element={<CookiesPage />} />
        <Route path="/legal/reembolsos" element={<RefundsPage />} />
        <Route path="/legal/avisos" element={<NoticesPage />} />
        <Route path="/legal/contacto" element={<ContactPage />} />
        <Route path="*" element={<PlatformRoutes />} />
      </Routes>
    </Suspense>
  );
}
