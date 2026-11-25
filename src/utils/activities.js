/** Actividades que coordinación delega a docentes; no se muestran a estudiantes. */
export function isStudentActivity(activity) {
  if (!activity) return false;
  if (activity.delegation === true) return false;
  if (activity.audience === "staff") return false;
  return true;
}
