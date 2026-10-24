import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { CookieNotice } from "./components/CookieNotice";
import Landing from "./pages/Landing";
import DonateIndividual from "./pages/DonateIndividual";
import DonatePackages from "./pages/DonatePackages";
import Enrollment from "./pages/Enrollment";
import { PrivacyPage, TermsPage, CookiesPage, RefundsPage, NoticesPage, ContactPage } from "./pages/legal/LegalPages";

// La comparación se resuelve al compilar: con la plataforma apagada, su código (y las cuentas semilla) no entra al bundle.
const PlatformRoutes = import.meta.env.VITE_ENABLE_PLATFORM === "true" ? lazy(() => import("./PlatformRoutes")) : null;

export default function App() {
  return (
    <>
      <CookieNotice />
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
          <Route path="*" element={PlatformRoutes ? <PlatformRoutes /> : <Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </>
  );
}
