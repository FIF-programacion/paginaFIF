import { useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useGame } from "../context/GameContext";
import { AGE_GROUPS, ageLabel } from "../data/org";
import { ACCESS_KEYS, ACCESS_PRESETS, DEFAULT_ADMIN, DEFAULT_TEMP_PASSWORD, STAFF_KIND_LABEL, WEEKDAYS } from "../data/staff";
import { ACTIVITY_TYPES, SUBJECTS, coursesForSubject } from "../data/teacher";
import { COURSES } from "../data/courses";

const TABS = [
  { id: "grupos", label: "Grupos de niños" },
  { id: "horarios", label: "Horarios" },
  { id: "delegar", label: "Delegar actividades" },
  { id: "credenciales", label: "Credenciales" },
];

function emptyAccess(kind) {
  return { ...(ACCESS_PRESETS[kind] || ACCESS_PRESETS.permanent) };
}

export default function AdminPanel() {
  const {
    user,
    hydrated,
    students,
    staff,
    activities,
    schedules,
    updateStudentGroup,
    saveSchedule,
    removeSchedule,
    saveActivity,
    delegateActivity,
    createStaff,
    resetStaffPassword,
    updateStaffAccess,
    logout,
  } = useGame();

  const [tab, setTab] = useState("grupos");
  const [feedback, setFeedback] = useState("");
  const [schedule, setSchedule] = useState({
    title: "",
    day: "martes",
    startTime: "15:00",
    endTime: "17:00",
    ageGroup: "all",
    teacherEmail: "",
    notes: "",
  });
  const [activity, setActivity] = useState({
    title: "",
    type: "tarea",
    dueDate: "",
    description: "",
    subjectId: SUBJECTS[0].id,
    courseId: SUBJECTS[0].courses[0],
    teacherEmail: "",
  });
  const [permanent, setPermanent] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    access: emptyAccess("permanent"),
  });
  const [resets, setResets] = useState({});

  const teachers = useMemo(() => staff.filter((item) => item.role === "teacher"), [staff]);
  const temps = teachers.filter((item) => item.staffKind === "temporary" || item.lockedUsername);
  const permanents = teachers.filter((item) => item.staffKind !== "temporary" && !item.lockedUsername);
  const activityCourses = coursesForSubject(activity.subjectId);

  if (!hydrated) return null;
  if (!user || user.role !== "admin") return <Navigate to="/profesores" replace />;

  const teacherName = (email) => {
    const found = teachers.find((item) => item.email === email);
    return found ? `${found.firstName} ${found.lastName}` : email;
  };

  const onGroupChange = (student, ageGroup) => {
    updateStudentGroup(student.id, ageGroup);
    setFeedback(`${student.firstName} ahora recibe el grupo ${ageLabel(ageGroup)}.`);
  };

  const onSaveSchedule = () => {
    if (!schedule.title.trim()) {
      setFeedback("El horario necesita un título.");
      return;
    }
    saveSchedule({
      id: crypto.randomUUID(),
      ...schedule,
      title: schedule.title.trim(),
      teacherName: schedule.teacherEmail ? teacherName(schedule.teacherEmail) : "",
      createdAt: Date.now(),
    });
    setSchedule((current) => ({ ...current, title: "", notes: "" }));
    setFeedback("Horario publicado.");
  };

  const onDelegateExisting = (activityId, teacherEmail) => {
    if (!teacherEmail) return;
    delegateActivity(activityId, teacherEmail, teacherName(teacherEmail));
    setFeedback(`Actividad asignada a ${teacherName(teacherEmail)}.`);
  };

  const onCreateAssigned = () => {
    if (!activity.title.trim() || !activity.description.trim() || !activity.teacherEmail) {
      setFeedback("Completa título, instrucciones y el profesor responsable.");
      return;
    }
    saveActivity({
      id: crypto.randomUUID(),
      title: activity.title.trim(),
      type: activity.type,
      dueDate: activity.dueDate,
      description: activity.description.trim(),
      subjectId: activity.subjectId,
      courseId: activity.courseId,
      teacherEmail: activity.teacherEmail,
      teacherName: teacherName(activity.teacherEmail),
      assignedBy: user.email,
      createdAt: Date.now(),
    });
    setActivity((current) => ({ ...current, title: "", description: "", dueDate: "" }));
    setFeedback("Actividad delegada al profesor.");
  };

  const onCreatePermanent = async () => {
    if (!permanent.firstName || !permanent.lastName || !permanent.email || !permanent.password) {
      setFeedback("Completa nombre, correo y clave del voluntario permanente.");
      return;
    }
    const result = await createStaff({
      ...permanent,
      staffKind: "permanent",
    });
    setFeedback(result.ok ? `Credencial creada para ${permanent.email}.` : result.message);
    if (result.ok) {
      setPermanent({ firstName: "", lastName: "", email: "", password: "", access: emptyAccess("permanent") });
    }
  };

  const onReset = async (email) => {
    const password = (resets[email] || "").trim();
    const result = await resetStaffPassword(email, password);
    setFeedback(result.ok ? `Clave actualizada para ${email}. El usuario se mantiene.` : result.message);
    if (result.ok) setResets((current) => ({ ...current, [email]: "" }));
  };

  return (
    <div className="app-shell teacher-shell">
      <header className="app-header">
        <div className="app-header-top">
          <h1 className="course-title" style={{ margin: 0 }}>COORDINACIÓN FIF</h1>
          <div className="header-actions">
            <Link className="btn btn-blue login-chip" to="/fif-learning">Volver al portal</Link>
            <button className="btn btn-green login-chip" type="button" onClick={logout}>Cerrar sesión</button>
          </div>
        </div>
        <p>Hola, {user.firstName}. Gestiona grupos, horarios, actividades de profesores y credenciales del equipo.</p>
      </header>
      <nav className="app-nav">
        {TABS.map((item) => (
          <button key={item.id} type="button" className={tab === item.id ? "active" : ""} onClick={() => setTab(item.id)}>
            {item.label}
          </button>
        ))}
      </nav>

      {feedback && <p className="feedback ok" role="status">{feedback}</p>}

      {tab === "grupos" && (
        <section className="teacher-board">
          <h2>Grupo de aprendizaje</h2>
          <p>Si un niño corresponde al grupo de los grandes (o al contrario), cámbialo para que reciba esas actividades y horarios.</p>
          {students.length === 0 && <p>Aún no hay estudiantes registrados en este dispositivo.</p>}
          <table className="progress-table admin-table">
            <thead>
              <tr>
                <th>Estudiante</th>
                <th>Correo</th>
                <th>Grupo actual</th>
                <th>Cambiar a</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>{student.firstName} {student.lastName}</td>
                  <td>{student.email}</td>
                  <td>{ageLabel(student.ageGroup)}</td>
                  <td>
                    <select
                      className="pill-select"
                      value={student.ageGroup || "over12"}
                      onChange={(event) => onGroupChange(student, event.target.value)}
                    >
                      {AGE_GROUPS.map((group) => (
                        <option key={group.id} value={group.id}>{group.label}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {tab === "horarios" && (
        <section className="teacher-board">
          <h2>Horarios de la plataforma</h2>
          <div className="teacher-filters">
            <label>
              Título
              <input className="pill-input" value={schedule.title} onChange={(event) => setSchedule((current) => ({ ...current, title: event.target.value }))} />
            </label>
            <label>
              Día
              <select className="pill-select" value={schedule.day} onChange={(event) => setSchedule((current) => ({ ...current, day: event.target.value }))}>
                {WEEKDAYS.map((day) => <option key={day.id} value={day.id}>{day.label}</option>)}
              </select>
            </label>
            <label>
              Inicio
              <input className="pill-input" type="time" value={schedule.startTime} onChange={(event) => setSchedule((current) => ({ ...current, startTime: event.target.value }))} />
            </label>
            <label>
              Fin
              <input className="pill-input" type="time" value={schedule.endTime} onChange={(event) => setSchedule((current) => ({ ...current, endTime: event.target.value }))} />
            </label>
            <label>
              Grupo
              <select className="pill-select" value={schedule.ageGroup} onChange={(event) => setSchedule((current) => ({ ...current, ageGroup: event.target.value }))}>
                <option value="all">Todos los grupos</option>
                {AGE_GROUPS.map((group) => <option key={group.id} value={group.id}>{group.label}</option>)}
              </select>
            </label>
            <label>
              Profesor
              <select className="pill-select" value={schedule.teacherEmail} onChange={(event) => setSchedule((current) => ({ ...current, teacherEmail: event.target.value }))}>
                <option value="">Sin asignar</option>
                {teachers.map((item) => (
                  <option key={item.email} value={item.email}>{item.firstName} {item.lastName}</option>
                ))}
              </select>
            </label>
          </div>
          <label htmlFor="sched-notes">Notas</label>
          <textarea id="sched-notes" className="code-editor" value={schedule.notes} onChange={(event) => setSchedule((current) => ({ ...current, notes: event.target.value }))} />
          <button className="btn btn-green" type="button" onClick={onSaveSchedule}>Publicar horario</button>

          <h2>Publicados</h2>
          {schedules.length === 0 && <p>No hay horarios todavía.</p>}
          <ul className="activity-list">
            {schedules.slice().reverse().map((item) => (
              <li key={item.id}>
                <strong>{item.title}</strong>
                <p>
                  {WEEKDAYS.find((day) => day.id === item.day)?.label} · {item.startTime}–{item.endTime} · {item.ageGroup === "all" ? "Todos los grupos" : ageLabel(item.ageGroup)}
                  {item.teacherName ? ` · ${item.teacherName}` : ""}
                </p>
                {item.notes && <p>{item.notes}</p>}
                <button className="btn btn-blue" type="button" onClick={() => removeSchedule(item.id)}>Quitar</button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {tab === "delegar" && (
        <section className="teacher-board">
          <h2>Nueva actividad para un profesor</h2>
          <div className="teacher-filters">
            <label>
              Materia
              <select className="pill-select" value={activity.subjectId} onChange={(event) => {
                const subjectId = event.target.value;
                setActivity((current) => ({ ...current, subjectId, courseId: coursesForSubject(subjectId)[0]?.id || "" }));
              }}>
                {SUBJECTS.map((subject) => <option key={subject.id} value={subject.id}>{subject.label}</option>)}
              </select>
            </label>
            <label>
              Curso
              <select className="pill-select" value={activity.courseId} onChange={(event) => setActivity((current) => ({ ...current, courseId: event.target.value }))}>
                {activityCourses.map((course) => <option key={course.id} value={course.id}>{course.title}</option>)}
              </select>
            </label>
            <label>
              Tipo
              <select className="pill-select" value={activity.type} onChange={(event) => setActivity((current) => ({ ...current, type: event.target.value }))}>
                {ACTIVITY_TYPES.map((type) => <option key={type.id} value={type.id}>{type.label}</option>)}
              </select>
            </label>
            <label>
              Profesor
              <select className="pill-select" value={activity.teacherEmail} onChange={(event) => setActivity((current) => ({ ...current, teacherEmail: event.target.value }))}>
                <option value="">Elige un profesor</option>
                {teachers.map((item) => (
                  <option key={item.email} value={item.email}>{item.firstName} {item.lastName} · {STAFF_KIND_LABEL[item.staffKind] || "Profesor"}</option>
                ))}
              </select>
            </label>
          </div>
          <label htmlFor="adm-act-title">Título</label>
          <input id="adm-act-title" className="pill-input" value={activity.title} onChange={(event) => setActivity((current) => ({ ...current, title: event.target.value }))} />
          <label htmlFor="adm-act-due">Entrega</label>
          <input id="adm-act-due" className="pill-input" type="date" value={activity.dueDate} onChange={(event) => setActivity((current) => ({ ...current, dueDate: event.target.value }))} />
          <label htmlFor="adm-act-text">Instrucciones</label>
          <textarea id="adm-act-text" className="code-editor" value={activity.description} onChange={(event) => setActivity((current) => ({ ...current, description: event.target.value }))} />
          <button className="btn btn-green" type="button" onClick={onCreateAssigned}>Delegar actividad</button>

          <h2>Actividades ya publicadas</h2>
          {activities.length === 0 && <p>Nadie ha publicado actividades todavía.</p>}
          <ul className="activity-list">
            {activities.slice().reverse().map((item) => (
              <li key={item.id}>
                <strong>{item.title}</strong>
                <p>{ACTIVITY_TYPES.find((type) => type.id === item.type)?.label} · {COURSES.find((course) => course.id === item.courseId)?.title || "Curso"} · {item.teacherName || item.teacherEmail}</p>
                <label>
                  Reasignar a
                  <select className="pill-select" value={item.teacherEmail || ""} onChange={(event) => onDelegateExisting(item.id, event.target.value)}>
                    <option value="">Elige un profesor</option>
                    {teachers.map((teacher) => (
                      <option key={teacher.email} value={teacher.email}>{teacher.firstName} {teacher.lastName}</option>
                    ))}
                  </select>
                </label>
              </li>
            ))}
          </ul>
        </section>
      )}

      {tab === "credenciales" && (
        <section className="teacher-board">
          <article className="cred-card">
            <h2>Coordinación FIF</h2>
            <p>Usuario fijo de administradores: <strong>{DEFAULT_ADMIN.email}</strong>. Clave inicial de este dispositivo: <strong>{DEFAULT_ADMIN.password}</strong>.</p>
          </article>

          <article className="cred-card">
            <h2>Voluntarios temporales</h2>
            <p>El usuario se mantiene entre períodos. Solo cambia la clave por seguridad. Clave inicial: <strong>{DEFAULT_TEMP_PASSWORD}</strong>.</p>
            {temps.map((item) => (
              <div className="cred-row" key={item.email}>
                <div>
                  <strong>{item.email}</strong>
                  <p>{item.firstName} {item.lastName} · usuario bloqueado</p>
                </div>
                <input
                  className="pill-input"
                  type="password"
                  placeholder="Nueva clave del período"
                  value={resets[item.email] || ""}
                  onChange={(event) => setResets((current) => ({ ...current, [item.email]: event.target.value }))}
                />
                <button className="btn btn-blue" type="button" onClick={() => onReset(item.email)}>Cambiar clave</button>
              </div>
            ))}
          </article>

          <article className="cred-card">
            <h2>Voluntarios permanentes</h2>
            <p>Credenciales propias y accesos definidos por coordinación.</p>
            <div className="teacher-filters">
              <label>
                Nombre
                <input className="pill-input" value={permanent.firstName} onChange={(event) => setPermanent((current) => ({ ...current, firstName: event.target.value }))} />
              </label>
              <label>
                Apellidos
                <input className="pill-input" value={permanent.lastName} onChange={(event) => setPermanent((current) => ({ ...current, lastName: event.target.value }))} />
              </label>
              <label>
                Correo
                <input className="pill-input" type="email" value={permanent.email} onChange={(event) => setPermanent((current) => ({ ...current, email: event.target.value }))} />
              </label>
              <label>
                Contraseña
                <input className="pill-input" type="password" value={permanent.password} onChange={(event) => setPermanent((current) => ({ ...current, password: event.target.value }))} />
              </label>
            </div>
            <fieldset className="access-grid">
              <legend>Accesos</legend>
              {ACCESS_KEYS.map((key) => (
                <label key={key.id}>
                  <input
                    type="checkbox"
                    checked={Boolean(permanent.access[key.id])}
                    onChange={(event) => setPermanent((current) => ({
                      ...current,
                      access: { ...current.access, [key.id]: event.target.checked },
                    }))}
                  />
                  {key.label}
                </label>
              ))}
            </fieldset>
            <button className="btn btn-green" type="button" onClick={onCreatePermanent}>Crear credencial permanente</button>
          </article>

          <h2>Equipo con acceso propio</h2>
          {permanents.length === 0 && <p>Todavía no hay profesores o voluntarios permanentes en este dispositivo.</p>}
          {permanents.map((item) => (
            <article className="cred-card" key={item.email}>
              <strong>{item.firstName} {item.lastName}</strong>
              <p>{item.email} · {STAFF_KIND_LABEL[item.staffKind] || "Profesor"}</p>
              <fieldset className="access-grid">
                <legend>Accesos</legend>
                {ACCESS_KEYS.map((key) => (
                  <label key={key.id}>
                    <input
                      type="checkbox"
                      checked={Boolean((item.access || ACCESS_PRESETS[item.staffKind] || ACCESS_PRESETS.teacher)[key.id])}
                      onChange={(event) => updateStaffAccess(item.email, {
                        ...(item.access || ACCESS_PRESETS[item.staffKind] || ACCESS_PRESETS.teacher),
                        [key.id]: event.target.checked,
                      })}
                    />
                    {key.label}
                  </label>
                ))}
              </fieldset>
              <div className="cred-row">
                <input
                  className="pill-input"
                  type="password"
                  placeholder="Nueva clave"
                  value={resets[item.email] || ""}
                  onChange={(event) => setResets((current) => ({ ...current, [item.email]: event.target.value }))}
                />
                <button className="btn btn-blue" type="button" onClick={() => onReset(item.email)}>Cambiar clave</button>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
