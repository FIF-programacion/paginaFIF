import { ACCESS_PRESETS } from "../data/staff";

export function staffAccess(user) {
  if (!user) return {};
  if (user.role === "admin") return { ...ACCESS_PRESETS.admin };
  return {
    ...(ACCESS_PRESETS[user.staffKind] || ACCESS_PRESETS.teacher),
    ...(user.access || {}),
  };
}

export function homePath(user) {
  if (!user) return "/login";
  if (user.role === "admin") return "/coordinacion";
  if (user.role === "teacher") return "/profesores/panel";
  return "/app/cursos";
}
