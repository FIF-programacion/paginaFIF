import { jsPDF } from "jspdf";
import { ORG } from "../data/org";

export function downloadCertificate({ studentName, courseTitle, date = new Date() }) {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();

  doc.setFillColor(249, 168, 212);
  doc.rect(0, 0, w / 3, h, "F");
  doc.setFillColor(147, 197, 253);
  doc.rect(w / 3, 0, w / 3, h, "F");
  doc.setFillColor(134, 239, 172);
  doc.rect((w / 3) * 2, 0, w / 3, h, "F");
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(12, 12, w - 24, h - 24, 8, 8, "F");

  doc.setTextColor(15, 118, 110);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("FIF LEARNING", w / 2, 28, { align: "center" });
  doc.setFontSize(11);
  doc.setTextColor(55, 65, 81);
  doc.text(ORG.name, w / 2, 36, { align: "center" });

  doc.setTextColor(30, 64, 175);
  doc.setFontSize(22);
  doc.text("FELICIDADES", w / 2, 58, { align: "center" });
  doc.text("HAS CULMINADO UNA ETAPA", w / 2, 70, { align: "center" });

  doc.setFontSize(28);
  const title = String(courseTitle || "CURSO").toUpperCase();
  doc.text(title, w / 2, 92, { align: "center", maxWidth: 240 });

  doc.setFontSize(14);
  doc.text(
    `CURSO COMPLETADO POR ${String(studentName || "ESTUDIANTE").toUpperCase()}`,
    w / 2,
    110,
    { align: "center", maxWidth: 240 },
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(30, 64, 175);
  doc.text("De parte del equipo de FIF estamos orgullosos de tu progreso. Sigue así.", w / 2, 124, {
    align: "center",
    maxWidth: 240,
  });

  const when = date.toLocaleDateString("es-EC", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  doc.setTextColor(55, 65, 81);
  doc.setFontSize(11);
  doc.text(`Fecha: ${when}`, w / 2, 140, { align: "center" });
  doc.setFontSize(9);
  doc.text(
    "Este documento reconoce la finalización de un curso en FIF Learning. No sustituye un título oficial ni una certificación ministerial.",
    w / 2,
    154,
    { align: "center", maxWidth: 240 },
  );
  doc.text(`${ORG.country}. ${ORG.legalAddress}.`, w / 2, 168, { align: "center", maxWidth: 240 });

  const safe = String(courseTitle || "curso").toLowerCase().replace(/[^\w]+/g, "-");
  doc.save(`certificado-fif-${safe}.pdf`);
}
