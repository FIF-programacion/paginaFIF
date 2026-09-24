import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { COURSES, coursesForAge, getCourse } from "../data/courses";
import { ACCESS_PRESETS, DEFAULT_ADMIN, DEFAULT_TEMP_PASSWORD, DEFAULT_TEMP_VOLUNTEERS } from "../data/staff";
import { hashSecret } from "../utils/security";

const STORAGE_KEY = "fif-learning-state-v2";
const NOTICE_KEY = "fif-learning-notice-v1";

const GameContext = createContext(null);

function emptyProgress() {
  return Object.fromEntries(COURSES.map((course) => [course.id, { completed: [], unlocked: course.unlockedByDefault }]));
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function ensureDefaultStaff(accounts) {
  const next = [...accounts];
  const hasEmail = (email) => next.some((item) => item.email === email);

  if (!hasEmail(DEFAULT_ADMIN.email)) {
    next.push({
      id: "staff-admin-default",
      role: "admin",
      staffKind: "admin",
      firstName: DEFAULT_ADMIN.firstName,
      lastName: DEFAULT_ADMIN.lastName,
      email: DEFAULT_ADMIN.email,
      passwordHash: await hashSecret(DEFAULT_ADMIN.password, DEFAULT_ADMIN.email),
      access: ACCESS_PRESETS.admin,
      lockedUsername: true,
      createdAt: Date.now(),
    });
  }

  for (const slot of DEFAULT_TEMP_VOLUNTEERS) {
    if (hasEmail(slot.email)) continue;
    next.push({
      id: `staff-temp-${slot.slot}`,
      role: "teacher",
      staffKind: "temporary",
      firstName: slot.firstName,
      lastName: slot.lastName,
      email: slot.email,
      passwordHash: await hashSecret(DEFAULT_TEMP_PASSWORD, slot.email),
      access: ACCESS_PRESETS.temporary,
      lockedUsername: true,
      slot: slot.slot,
      createdAt: Date.now(),
    });
  }

  return next;
}

export function GameProvider({ children }) {
  const [accounts, setAccounts] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [stats, setStats] = useState({ points: 0, badges: 0, days: 0, lastActive: null, earnedBadges: [] });
  const [progress, setProgress] = useState(emptyProgress);
  const [tests, setTests] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [activities, setActivities] = useState([]);
  const [activityDone, setActivityDone] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [noticeSeen, setNoticeSeen] = useState(true);
  const [hydrated, setHydrated] = useState(false);

  const user = accounts.find((item) => item.id === sessionId) || null;

  useEffect(() => {
    let cancelled = false;
    const preview = new URLSearchParams(window.location.search).get("preview") === "1";
    const saved = loadState();
    setNoticeSeen(localStorage.getItem(NOTICE_KEY) === "1");

    const hydrate = async () => {
      if (preview) {
        const demo = {
          id: "demo-student",
          role: "student",
          firstName: "Ariel",
          lastName: "Estudiante",
          email: "ariel@correo.com",
          passwordHash: "preview",
          ageGroup: "over12",
          dailyGoal: "5 minutos",
          createdAt: Date.now(),
        };
        if (cancelled) return;
        setAccounts([demo]);
        setSessionId(demo.id);
        setStats({ points: 45, badges: 1, days: 1, lastActive: todayKey(), earnedBadges: ["primera-leccion"] });
        setProgress({
          ...emptyProgress(),
          "matematica-practica": { completed: ["1"], unlocked: true },
          "musica-teoria": { completed: [], unlocked: true },
          "arte-practica": { completed: [], unlocked: true },
          "programacion-teoria": { completed: [], unlocked: true },
        });
        setHydrated(true);
        return;
      }

      const accounts = await ensureDefaultStaff(saved?.accounts || []);
      if (cancelled) return;
      setAccounts(accounts);
      setSessionId(saved?.sessionId || null);
      setStats(saved?.stats || { points: 0, badges: 0, days: 0, lastActive: null, earnedBadges: [] });
      setProgress({ ...emptyProgress(), ...(saved?.progress || {}) });
      setTests(saved?.tests || []);
      setAttempts(saved?.attempts || []);
      setMessages(saved?.messages || []);
      setAttendance(saved?.attendance || []);
      setActivities(saved?.activities || []);
      setActivityDone(saved?.activityDone || []);
      setSchedules(saved?.schedules || []);
      setSubmissions(saved?.submissions || []);
      setHydrated(true);
    };

    hydrate();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (new URLSearchParams(window.location.search).get("preview") === "1") return;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        accounts,
        sessionId,
        stats,
        progress,
        tests,
        attempts,
        messages,
        attendance,
        activities,
        activityDone,
        schedules,
        submissions,
      }),
    );
  }, [accounts, sessionId, stats, progress, tests, attempts, messages, attendance, activities, activityDone, schedules, submissions, hydrated]);

  const acknowledgeNotice = () => {
    localStorage.setItem(NOTICE_KEY, "1");
    setNoticeSeen(true);
  };

  const register = async (profile) => {
    const email = profile.email.trim().toLowerCase();
    const passwordHash = await hashSecret(profile.password, email);
    const existing = accounts.find((item) => item.email === email);
    const id = existing?.id || crypto.randomUUID();
    const role = profile.role === "admin" ? "teacher" : (profile.role || "student");
    const staffKind = role === "teacher" ? (profile.staffKind || "teacher") : null;
    const nextUser = {
      id,
      role,
      staffKind,
      firstName: profile.firstName.trim(),
      lastName: profile.lastName.trim(),
      email,
      passwordHash,
      ageGroup: profile.ageGroup || null,
      dailyGoal: profile.dailyGoal || null,
      tutorName: profile.tutorName || "",
      tutorEmail: profile.tutorEmail || "",
      access: role === "teacher" ? (profile.access || ACCESS_PRESETS[staffKind] || ACCESS_PRESETS.teacher) : undefined,
      lockedUsername: Boolean(profile.lockedUsername),
      consents: profile.consents || {},
      createdAt: existing?.createdAt || Date.now(),
    };
    setAccounts((current) => {
      const others = current.filter((item) => item.email !== email);
      return [...others, nextUser];
    });
    setSessionId(id);
    if (!existing || existing.role !== nextUser.role) {
      setProgress(emptyProgress());
      setStats({ points: 0, badges: 0, days: 0, lastActive: null, earnedBadges: [] });
    }
    return nextUser;
  };

  const login = async (email, password) => {
    const account = accounts.find((item) => item.email === email.trim().toLowerCase());
    if (!account) return { ok: false, message: "No encontramos ese correo en este dispositivo." };
    const passwordHash = await hashSecret(password, account.email);
    if (account.passwordHash !== passwordHash) {
      return { ok: false, message: "La contraseña no coincide." };
    }
    setSessionId(account.id);
    return { ok: true, account };
  };

  const logout = () => setSessionId(null);

  const markAttendance = () => {
    const today = todayKey();
    setStats((current) => {
      if (current.lastActive === today) return current;
      const nextDays = current.days + 1;
      const earned = new Set(current.earnedBadges);
      if (nextDays >= 3) earned.add("racha-3");
      return { ...current, days: nextDays, lastActive: today, earnedBadges: [...earned], badges: earned.size };
    });
  };

  const visibleCourses = coursesForAge(user?.ageGroup || "over12");

  const completeLesson = (courseId, lessonId, points = 15) => {
    markAttendance();
    const course = getCourse(courseId, user?.ageGroup);
    const entry = progress[courseId] || { completed: [], unlocked: true };
    const already = entry.completed.includes(String(lessonId));
    const completed = already ? entry.completed : [...entry.completed, String(lessonId)];
    const finishedCourse = Boolean(course && completed.length >= course.lessons.length);

    setProgress((current) => {
      const currentEntry = current[courseId] || { completed: [], unlocked: true };
      const nextCompleted = currentEntry.completed.includes(String(lessonId))
        ? currentEntry.completed
        : [...currentEntry.completed, String(lessonId)];
      const next = { ...current, [courseId]: { ...currentEntry, completed: nextCompleted, unlocked: true } };
      if (course && nextCompleted.length >= course.lessons.length) {
        const catalog = coursesForAge(user?.ageGroup || "over12");
        const index = catalog.findIndex((item) => item.id === courseId);
        const following = catalog[index + 1];
        if (following) {
          next[following.id] = { ...(next[following.id] || { completed: [] }), unlocked: true };
        }
      }
      return next;
    });

    if (!already) {
      setStats((current) => {
        const earned = new Set(current.earnedBadges);
        const nextPoints = current.points + points;
        if (nextPoints >= 15) earned.add("primera-leccion");
        if (nextPoints >= 75) earned.add("constancia");
        if (finishedCourse) earned.add(`curso-${courseId}`);
        return { ...current, points: nextPoints, earnedBadges: [...earned], badges: earned.size };
      });
    }
    return finishedCourse;
  };

  const isLessonOpen = (courseId, lessonNumber) => {
    const entry = progress[courseId];
    if (lessonNumber === 1) return Boolean(entry?.unlocked || getCourse(courseId, user?.ageGroup)?.unlockedByDefault);
    return Boolean(entry?.completed.includes(String(lessonNumber - 1)));
  };

  const isLessonDone = (courseId, lessonId) => Boolean(progress[courseId]?.completed.includes(String(lessonId)));

  const courseStats = (courseId) => {
    const course = getCourse(courseId, user?.ageGroup);
    const completed = progress[courseId]?.completed.length || 0;
    const total = course?.lessons.length || 0;
    const unlocked = Boolean(progress[courseId]?.unlocked || course?.unlockedByDefault);
    const done = total > 0 && completed >= total;
    return {
      completed,
      total,
      unlocked,
      done,
      status: done ? "Culminado" : unlocked || completed > 0 ? "En curso" : "Bloqueado",
      certificate: done ? "Descargar certificado" : completed > 0 ? "En progreso" : "Pendiente",
    };
  };

  const saveTest = (test) => setTests((current) => [...current.filter((item) => item.code !== test.code), test]);

  const saveAttempt = (attempt) => setAttempts((current) => [...current.filter((item) => item.id !== attempt.id), attempt]);

  const saveMessage = (message) => setMessages((current) => [...current, { ...message, createdAt: Date.now() }]);

  const saveAttendance = (record) => {
    setAttendance((current) => {
      const key = (item) => `${item.teacherEmail}|${item.courseId}|${item.date}`;
      return [...current.filter((item) => key(item) !== key(record)), record];
    });
  };

  const saveActivity = (activity) => {
    setActivities((current) => [...current.filter((item) => item.id !== activity.id), activity]);
  };

  const completeActivity = (activityId, studentEmail) => {
    const submitted = submissions.some((item) => item.activityId === activityId && item.studentEmail === studentEmail);
    if (!submitted) return { ok: false, message: "Primero sube tu tarea." };
    setActivityDone((current) => {
      if (current.some((item) => item.activityId === activityId && item.studentEmail === studentEmail)) return current;
      return [...current, { activityId, studentEmail, completedAt: Date.now() }];
    });
    return { ok: true };
  };

  const submitActivityWork = (payload) => {
    const id = `${payload.activityId}|${payload.studentEmail}`;
    setSubmissions((current) => {
      const previous = current.find((item) => item.id === id);
      return [
        ...current.filter((item) => item.id !== id),
        {
          ...previous,
          ...payload,
          id,
          submittedAt: Date.now(),
          grade: previous?.grade ?? null,
          teacherComment: previous?.teacherComment || "",
        },
      ];
    });
    return { ok: true };
  };

  const gradeSubmission = (submissionId, grade, teacherComment, gradedBy) => {
    const score = Math.min(10, Math.max(0, Number(grade)));
    if (Number.isNaN(score)) return { ok: false, message: "Pon una nota de 0 a 10." };
    setSubmissions((current) => current.map((item) => (
      item.id === submissionId
        ? { ...item, grade: score, teacherComment, gradedBy, gradedAt: Date.now() }
        : item
    )));
    return { ok: true };
  };

  const updateStudentGroup = (studentId, ageGroup) => {
    setAccounts((current) => current.map((item) => (
      item.id === studentId && item.role === "student" ? { ...item, ageGroup } : item
    )));
  };

  const saveSchedule = (schedule) => {
    setSchedules((current) => [...current.filter((item) => item.id !== schedule.id), schedule]);
  };

  const removeSchedule = (scheduleId) => {
    setSchedules((current) => current.filter((item) => item.id !== scheduleId));
  };

  const delegateActivity = (activityId, teacherEmail, teacherName) => {
    setActivities((current) => current.map((item) => (
      item.id === activityId ? { ...item, teacherEmail, teacherName } : item
    )));
  };

  const createStaff = async (profile) => {
    const email = profile.email.trim().toLowerCase();
    const existing = accounts.find((item) => item.email === email);
    if (existing?.role === "student") {
      return { ok: false, message: "Ese correo ya pertenece a un estudiante." };
    }
    if (existing?.lockedUsername && profile.staffKind !== "temporary" && existing.staffKind === "temporary") {
      return { ok: false, message: "Ese usuario temporal se mantiene entre períodos. Solo cambia la clave." };
    }
    if (!profile.password && !existing?.passwordHash) {
      return { ok: false, message: "Define una contraseña." };
    }
    const passwordHash = profile.password
      ? await hashSecret(profile.password, email)
      : existing.passwordHash;
    const staffKind = profile.staffKind || "permanent";
    const next = {
      id: existing?.id || crypto.randomUUID(),
      role: staffKind === "admin" ? "admin" : "teacher",
      staffKind,
      firstName: (profile.firstName || existing?.firstName || "").trim(),
      lastName: (profile.lastName || existing?.lastName || "").trim(),
      email,
      passwordHash,
      access: profile.access || existing?.access || ACCESS_PRESETS[staffKind] || ACCESS_PRESETS.teacher,
      lockedUsername: staffKind === "temporary" || Boolean(existing?.lockedUsername),
      slot: existing?.slot || profile.slot || null,
      createdAt: existing?.createdAt || Date.now(),
    };
    setAccounts((current) => [...current.filter((item) => item.email !== email), next]);
    return { ok: true };
  };

  const resetStaffPassword = async (email, password) => {
    const account = accounts.find((item) => item.email === email.trim().toLowerCase());
    if (!account || account.role === "student") {
      return { ok: false, message: "No hay esa credencial de equipo." };
    }
    if (!password || password.length < 6) {
      return { ok: false, message: "La clave nueva debe tener al menos 6 caracteres." };
    }
    const passwordHash = await hashSecret(password, account.email);
    setAccounts((current) => current.map((item) => (item.email === account.email ? { ...item, passwordHash } : item)));
    return { ok: true };
  };

  const updateStaffAccess = (email, access) => {
    setAccounts((current) => current.map((item) => (item.email === email ? { ...item, access } : item)));
  };

  const students = useMemo(
    () => accounts
      .filter((item) => item.role === "student")
      .map(({ passwordHash, ...rest }) => rest),
    [accounts],
  );

  const staff = useMemo(
    () => accounts
      .filter((item) => item.role === "teacher" || item.role === "admin")
      .map(({ passwordHash, ...rest }) => rest),
    [accounts],
  );

  const value = useMemo(
    () => ({
      hydrated,
      user,
      students,
      staff,
      stats,
      progress,
      tests,
      attempts,
      messages,
      attendance,
      activities,
      activityDone,
      schedules,
      submissions,
      noticeSeen,
      visibleCourses,
      acknowledgeNotice,
      register,
      login,
      logout,
      completeLesson,
      isLessonOpen,
      isLessonDone,
      courseStats,
      saveTest,
      saveAttempt,
      saveMessage,
      saveAttendance,
      saveActivity,
      completeActivity,
      submitActivityWork,
      gradeSubmission,
      updateStudentGroup,
      saveSchedule,
      removeSchedule,
      delegateActivity,
      createStaff,
      resetStaffPassword,
      updateStaffAccess,
    }),
    [hydrated, user, students, staff, stats, progress, tests, attempts, messages, attendance, activities, activityDone, schedules, submissions, noticeSeen, visibleCourses],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used inside GameProvider");
  return ctx;
}
