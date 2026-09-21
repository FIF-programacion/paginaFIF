export const ORG = {
  name: "Fundación Integral de Familias",
  shortName: "FIF",
  product: "FIF Learning",
  country: "Ecuador",
  jurisdiction: "República del Ecuador",
  legalAddress: "Domicilio legal pendiente de publicación oficial por la fundación",
  ruc: "RUC pendiente de publicación oficial por la fundación",
  email: "fundacionintegralfif@gmail.com",
  phone: "+593 96 265 9309",
  whatsappNumber: "593962659309",
  lastUpdated: "20 de septiembre de 2026",
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

export function assistanceWhatsAppUrl(text) {
  const encoded = encodeURIComponent(text);
  const digits = String(ORG.whatsappNumber || "").replace(/\D/g, "");
  if (digits.length >= 10) return `https://wa.me/${digits}?text=${encoded}`;
  return `https://wa.me/?text=${encoded}`;
}

export const AGE_GROUPS = [
  { id: "under12", label: "Menos de 12 años" },
  { id: "over12", label: "12 años o más" },
];

export function ageLabel(id) {
  return AGE_GROUPS.find((item) => item.id === id)?.label || "Nivel no indicado";
}
