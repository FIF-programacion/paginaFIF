export const ORG = {
  name: "Fundación Integral de Familias",
  shortName: "FIF",
  product: "FIF Learning",
  country: "Ecuador",
  jurisdiction: "República del Ecuador",
  legalAddress: "Quito, cantón Quito, provincia de Pichincha, Ecuador",
  ruc: "RUC no publicado en fuentes abiertas. Personería jurídica: Acuerdo Ministerial N.º 203 del 15 de octubre de 2010 (MIES)",
  email: "fundacionintegralfif@gmail.com",
  phone: "+593 99 833 4440",
  whatsappNumber: "593998334440",
  lastUpdated: "25 de octubre de 2026",
  social: {
    facebook: "https://www.facebook.com/fundacionfif/",
    tiktok: "https://www.tiktok.com/@fundacionfif",
    linkedin: "https://www.linkedin.com/company/fundaci%C3%B3n-integral-de-familias",
    instagram: "https://www.instagram.com/fundacionfif/",
    youtube: "https://www.youtube.com/@FundacionIntegralFIF",
    podcast: "https://open.spotify.com/show/2v44qnqooskw9bfnlnxdl4",
  },
};

export function formatAssistanceMessage({ guardianName, studentName, body }) {
  return [
    "FIF Learning — Mensaje desde la plataforma",
    "Fundación Integral de Familias",
    "",
    `Madre, padre o tutor: ${guardianName}`,
    `Estudiante: ${studentName}`,
    "",
    "Consulta:",
    body,
  ].join("\n");
}

export function formatDonationMessage({ fullName, phone, email, amount, notes, packageName }) {
  return [
    "FIF — Solicitud de donación",
    "Fundación Integral de Familias",
    "",
    `Nombre: ${fullName}`,
    `Celular: ${phone}`,
    `Correo: ${email}`,
    packageName ? `Opción: ${packageName}` : null,
    `Cantidad a donar: $${amount}`,
    notes ? `Notas: ${notes}` : "Notas: —",
    "",
    "No es un pago en línea. Coordinar el aporte con el equipo FIF.",
  ].filter(Boolean).join("\n");
}

export function formatEnrollmentPaymentMessage(form) {
  return [
    "FIF — Pago de inscripción",
    "Fundación Integral de Familias",
    "",
    `Estudiante: ${form.studentName}`,
    `Institución: ${form.schoolType === "fiscal" ? "Fiscal" : "Particular"} · ${form.school}`,
    `Representante: ${form.payName || form.guardianName}`,
    `Celular: ${form.payPhone || form.guardianPhone}`,
    `Correo: ${form.payEmail || form.guardianEmail}`,
    `Cantidad: $${form.payAmount}`,
    form.scholarshipLabels?.length ? `Becas solicitadas: ${form.scholarshipLabels.join(", ")}` : null,
    "Documento: certificado de matrícula / declaración de homeschooling (se envía por este chat)",
    form.payNotes ? `Notas: ${form.payNotes}` : null,
  ].filter(Boolean).join("\n");
}

export function assistanceWhatsAppUrl(text) {
  const encoded = encodeURIComponent(text);
  const digits = String(ORG.whatsappNumber || "").replace(/\D/g, "");
  if (digits.length >= 10) return `https://wa.me/${digits}?text=${encoded}`;
  return `https://wa.me/?text=${encoded}`;
}

export const AGE_GROUPS = [
  { id: "inicial", label: "Grupo inicial / nivelación" },
  { id: "regular", label: "Grupo Regular" },
];

export function normalizeGroup(id) {
  if (id === "under12") return "inicial";
  if (id === "over12") return "regular";
  return id || "regular";
}

export function needsGuardianConsent(id) {
  return normalizeGroup(id) === "inicial";
}

export function ageLabel(id) {
  return AGE_GROUPS.find((item) => item.id === normalizeGroup(id))?.label || "Grupo no indicado";
}
