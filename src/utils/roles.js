import { ACCESS_PRESETS, accessForDuty } from "../data/staff";

export function isStaff(user) {
  return user?.role === "staff" || user?.role === "teacher";
}

export function staffAccess(user) {
  if (!user) return {};
  if (user.role === "admin") return { ...ACCESS_PRESETS.admin };
  return {
    ...accessForDuty(user.duty || "teacher", user.teamId),
    ...(ACCESS_PRESETS[user.staffKind] || {}),
    ...(user.access || {}),
  };
}

export function homePath(user) {
  if (!user) return "/login";
  if (user.role === "admin") return "/admin/panel";
  if (isStaff(user)) return "/equipo";
  if (user.role === "student" && !user.tutorialSeen) return "/tutorial/1";
  return "/app/cursos";
}
