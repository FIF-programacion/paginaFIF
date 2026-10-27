export const ENROLLMENT_STATUSES = [
  { id: "en_revision", label: "En revisión" },
  { id: "pendiente", label: "Pendiente" },
  { id: "pagado", label: "Pagado" },
  { id: "inactivo", label: "Inactivo" },
];

export const ACADEMIC_GOALS = [
  { id: "fortalecer", label: "Fortalecer conocimientos matemáticos" },
  { id: "razonamiento", label: "Desarrollar razonamiento y resolución de problemas" },
  { id: "olimpiadas", label: "Prepararse para olimpiadas o concursos" },
  { id: "talento", label: "Potenciar interés o talento matemático" },
  { id: "dificultades", label: "Superar dificultades en Matemática" },
  { id: "otro", label: "Otro" },
];

// Documento que se exige al inscribir. Aún no hay dónde guardar archivos: se envía por WhatsApp.
export const ENROLLMENT_DOCUMENT = "Certificado de matrícula / declaración de homeschooling";

export const GRADES = [
  "3ero EGB",
  "4to EGB",
  "5to EGB",
  "6to EGB",
  "7mo EGB",
  "8vo EGB",
  "9no EGB",
  "10mo EGB",
  "1ero de Bachillerato",
  "Homeschooling",
];

export const SCHOOL_TYPES = [
  { id: "fiscal", label: "Fiscal" },
  { id: "particular", label: "Particular" },
];

export const ENROLLMENT_FEES = {
  fiscal: {
    inscription: 30,
    extraLabel: "Plataforma ALEKS (un solo pago)",
    extra: 40,
  },
  particular: {
    inscription: 20,
    extraLabel: "Mensualidad",
    extra: 100,
  },
};

export const SCHOLARSHIPS = [
  { id: "olimpiadas40", label: "Participación en olimpiadas: 40%" },
  { id: "olimpiadas100", label: "Ganar olimpiadas: 100%" },
];

export function emptyEnrollment() {
  return {
    guardianName: "",
    guardianId: "",
    relationship: "",
    guardianPhone: "",
    guardianEmail: "",
    studentName: "",
    studentId: "",
    birthDate: "",
    school: "",
    schoolType: "",
    grade: "",
    city: "",
    sector: "",
    contests: "",
    extraPrep: "",
    goals: [],
    otherGoal: "",
    modality: "",
    emergencyName: "",
    emergencyRelation: "",
    emergencyPhone: "",
    emergencyNotes: "",
    scholarships: [],
    payName: "",
    payPhone: "",
    payEmail: "",
    payAmount: "",
    payNotes: "",
    documentWhatsApp: false,
  };
}

export function statusLabel(id) {
  return ENROLLMENT_STATUSES.find((item) => item.id === id)?.label || id;
}
