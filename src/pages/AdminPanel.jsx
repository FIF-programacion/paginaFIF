import { useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useGame } from "../context/GameContext";
import { AGE_GROUPS, ageLabel, normalizeGroup } from "../data/org";
import { ACCESS_KEYS, ACCESS_PRESETS, DEFAULT_ADMIN, DUTIES, STAFF_KIND_LABEL, TEAMS, WEEKDAYS, teamLabel } from "../data/staff";
import { ACTIVITY_TYPES, SUBJECTS, coursesForSubject } from "../data/teacher";
import { COURSES } from "../data/courses";
import { ACADEMIC_GOALS, ENROLLMENT_STATUSES, statusLabel } from "../data/enrollments";
import "./Admin.css";

const TABS = [
  { id: "inscripciones", label: "Inscripciones" },
  { id: "grupos", label: "Grupos" },
  { id: "horarios", label: "Horarios" },
  { id: "delegar", label: "Actividades" },
  { id: "credenciales", label: "Cuentas" },
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
    createStudent,
    resetStaffPassword,
    updateStaffAccess,
    updateStaffTeam,
    enrollments,
    updateEnrollmentStatus,
    logout,
  } = useGame();

  const [tab, setTab] = useState("inscripciones");
  const [openEnrollment, setOpenEnrollment] = useState(null);
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
    staffKind: "permanent",
    duty: "teacher",
    teamId: "matematica",
    access: emptyAccess("permanent"),
  });
  const [studentForm, setStudentForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    ageGroup: "regular",
  });
  const [resets, setResets] = useState({});

  const teachers = useMemo(() => staff.filter((item) => item.role !== "admin"), [staff]);
  const temps = teachers.filter((item) => item.staffKind === "temporary" || item.lockedUsername);
  const permanents = teachers.filter((item) => item.staffKind !== "temporary" && !item.lockedUsername);
  const activityCourses = coursesForSubject(activity.subjectId);

  if (!hydrated) return null;
  if (!user || user.role !== "admin") return <Navigate to="/admin" replace />;

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
      staffKind: permanent.staffKind || "permanent",
    });
    setFeedback(result.ok ? `Cuenta de equipo creada para ${permanent.email}.` : result.message);
    if (result.ok) {
      setPermanent({ firstName: "", lastName: "", email: "", password: "", staffKind: "permanent", duty: "teacher", teamId: "matematica", access: emptyAccess("permanent") });
    }
  };

  const onCreateStudent = async () => {
    const result = await createStudent(studentForm);
    setFeedback(result.ok ? `Cuenta de estudiante creada para ${studentForm.email}.` : result.message);
    if (result.ok) {
      setStudentForm({ firstName: "", lastName: "", email: "", password: "", ageGroup: "regular" });
    }
  };

  const onReset = async (email) => {
    const password = (resets[email] || "").trim();
    const result = await resetStaffPassword(email, password);
    setFeedback(result.ok ? `Clave actualizada para ${email}. El usuario se mantiene.` : result.message);
    if (result.ok) setResets((current) => ({ ...current, [email]: "" }));
  };

  const selected = enrollments.find((item) => item.id === openEnrollment);

  return (
    <div className="ad-shell">
      <aside className="ad-side">
        <strong>COORDINACIÓN FIF</strong>
        {TABS.map((item) => (
          <button key={item.id} type="button" className={tab === item.id ? "is-on" : ""} onClick={() => setTab(item.id)}>
            {item.label}
          </button>
        ))}
        <Link to="/">Sitio público</Link>
        <button type="button" onClick={logout}>Cerrar sesión</button>
      </aside>
      <div className="ad-main">
        <div className="ad-top">
          <div>
            <p className="ad-kicker">Panel interno</p>
            <h1>{TABS.find((item) => item.id === tab)?.label}</h1>
          </div>
          <p>Hola, {user.firstName}</p>
        </div>
      {feedback && <p className="ad-error" role="status" style={{ color: "#166534" }}>{feedback}</p>}

      {tab === "inscripciones" && (
        <section className="ad-card">
          <p>Solicitudes enviadas desde el formulario público. Cambia el estado según la revisión.</p>
          {enrollments.length === 0 && <p>Aún no hay inscripciones en este dispositivo.</p>}
          {enrollments.length > 0 && (
            <table className="ad-table">
              <thead>
                <tr>
                  <th>Estudiante</th>
                  <th>Representante</th>
                  <th>Institución</th>
                  <th>Modalidad</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {enrollments.slice().reverse().map((item) => (
                  <tr key={item.id}>
                    <td>{item.studentName}</td>
                    <td>{item.guardianName}<br /><small>{item.guardianEmail}</small></td>
                    <td>{item.schoolType === "fiscal" ? "Fiscal" : item.schoolType === "particular" ? "Particular" : "—"}</td>
                    <td>{item.modality === "virtual" ? "Virtual" : "Presencial"}</td>
                    <td>{new Date(item.createdAt).toLocaleDateString("es-EC")}</td>
                    <td>
                      <select
                        value={item.status}
                        onChange={(event) => {
                          updateEnrollmentStatus(item.id, event.target.value);
                          setFeedback(`Inscripción de ${item.studentName}: ${statusLabel(event.target.value)}.`);
                        }}
                      >
                        {ENROLLMENT_STATUSES.map((status) => (
                          <option key={status.id} value={status.id}>{status.label}</option>
                        ))}
                      </select>
                      <div className={`ad-status ${item.status}`}>{statusLabel(item.status)}</div>
                    </td>
                    <td>
                      <button className="ad-btn ad-btn-ghost" type="button" onClick={() => setOpenEnrollment(item.id)}>Ver</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {selected && (
            <article className="ad-card" style={{ marginTop: 16 }}>
              <h2>{selected.studentName}</h2>
              <div className="ad-detail">
                <p><strong>Representante:</strong> {selected.guardianName} ({selected.relationship})</p>
                <p><strong>Documento:</strong> {selected.guardianId}</p>
                <p><strong>WhatsApp:</strong> {selected.guardianPhone}</p>
                <p><strong>Correo:</strong> {selected.guardianEmail}</p>
                <p><strong>Documento del estudiante:</strong> {selected.studentId}</p>
                <p><strong>Nacimiento:</strong> {selected.birthDate}</p>
                <p><strong>Colegio:</strong> {selected.school} · {selected.schoolType === "fiscal" ? "Fiscal" : selected.schoolType === "particular" ? "Particular" : "—"} · {selected.grade}</p>
                <p><strong>Pago:</strong> ${selected.payAmount || "—"} · {selected.payName} · {selected.payPhone}</p>
                {selected.scholarshipLabels?.length > 0 && <p><strong>Becas:</strong> {selected.scholarshipLabels.join(" · ")}</p>}
                {selected.payNotes && <p><strong>Notas de pago:</strong> {selected.payNotes}</p>}
                <p><strong>Residencia:</strong> {selected.city} · {selected.sector}</p>
                <p><strong>Concursos:</strong> {selected.contests === "si" ? "Sí" : "No"}</p>
                <p><strong>Prep. extra:</strong> {selected.extraPrep === "si" ? "Sí" : "No"}</p>
                <p><strong>Expectativas:</strong> {(selected.goals || []).map((id) => (id === "otro" && selected.otherGoal ? selected.otherGoal : ACADEMIC_GOALS.find((goal) => goal.id === id)?.label)).filter(Boolean).join(", ")}</p>
                <p><strong>Emergencia:</strong> {selected.emergencyName} · {selected.emergencyRelation} · {selected.emergencyPhone}</p>
                {selected.emergencyNotes && <p><strong>Nota:</strong> {selected.emergencyNotes}</p>}
              </div>
              <button className="ad-btn ad-btn-ghost" type="button" onClick={() => setOpenEnrollment(null)}>Cerrar ficha</button>
            </article>
          )}
        </section>
      )}

      {tab === "grupos" && (
        <section className="ad-card">
          <h2>Grupo de aprendizaje</h2>
          <p>Asigna cada estudiante a Grupo inicial / nivelación o a Grupo Regular. Eso define actividades, horarios y el material que ve en FIF Learning.</p>
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
                      value={normalizeGroup(student.ageGroup)}
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
        <section className="ad-card">
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
        <section className="ad-card">
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
        <section className="ad-card">
          <article className="cred-card">
            <h2>Coordinación FIF</h2>
            <p>Usuario fijo: <strong>{DEFAULT_ADMIN.email}</strong>. Nadie se auto-registra. Todas las cuentas de estudiantes y del equipo las crea esta pantalla.</p>
          </article>

          <article className="cred-card">
            <h2>Crear estudiante</h2>
            <p>FIF Learning queda cerrado al público. El estudiante entra con este correo y clave; en el primer inicio ve el tutorial.</p>
            <div className="teacher-filters">
              <label>Nombre<input value={studentForm.firstName} onChange={(event) => setStudentForm((current) => ({ ...current, firstName: event.target.value }))} /></label>
              <label>Apellidos<input value={studentForm.lastName} onChange={(event) => setStudentForm((current) => ({ ...current, lastName: event.target.value }))} /></label>
              <label>Correo<input type="email" value={studentForm.email} onChange={(event) => setStudentForm((current) => ({ ...current, email: event.target.value }))} /></label>
              <label>Contraseña<input type="password" value={studentForm.password} onChange={(event) => setStudentForm((current) => ({ ...current, password: event.target.value }))} /></label>
              <label>
                Grupo
                <select value={studentForm.ageGroup} onChange={(event) => setStudentForm((current) => ({ ...current, ageGroup: event.target.value }))}>
                  {AGE_GROUPS.map((group) => <option key={group.id} value={group.id}>{group.label}</option>)}
                </select>
              </label>
            </div>
            <button className="ad-btn" type="button" onClick={onCreateStudent}>Crear cuenta de estudiante</button>
          </article>

          <article className="cred-card">
            <h2>Voluntarios temporales</h2>
            <p>El usuario se mantiene entre semestres. Coordinación carga la clave nueva del período y asigna el equipo.</p>
            {temps.map((item) => (
              <div className="cred-row" key={item.email}>
                <div>
                  <strong>{item.email}</strong>
                  <p>{item.firstName} {item.lastName} · {teamLabel(item.teamId)}</p>
                </div>
                <select value={item.teamId || ""} onChange={(event) => updateStaffTeam(item.email, { teamId: event.target.value, duty: item.duty || "member" })}>
                  <option value="">Sin equipo</option>
                  {TEAMS.map((team) => <option key={team.id} value={team.id}>{team.label}</option>)}
                </select>
                <select value={item.duty || "member"} onChange={(event) => updateStaffTeam(item.email, { duty: event.target.value, teamId: item.teamId || "" })}>
                  {DUTIES.map((duty) => <option key={duty.id} value={duty.id}>{duty.label}</option>)}
                </select>
                <input
                  type="password"
                  placeholder="Clave semestral"
                  value={resets[item.email] || ""}
                  onChange={(event) => setResets((current) => ({ ...current, [item.email]: event.target.value }))}
                />
                <button className="ad-btn" type="button" onClick={() => onReset(item.email)}>Guardar clave</button>
              </div>
            ))}
          </article>

          <article className="cred-card">
            <h2>Crear voluntario o docente</h2>
            <p>Permanente o temporal. Elige si da clases o es miembro (multimedia, producción, web, etc.) y a qué equipo pertenece.</p>
            <div className="teacher-filters">
              <label>Nombre<input value={permanent.firstName} onChange={(event) => setPermanent((current) => ({ ...current, firstName: event.target.value }))} /></label>
              <label>Apellidos<input value={permanent.lastName} onChange={(event) => setPermanent((current) => ({ ...current, lastName: event.target.value }))} /></label>
              <label>Correo<input type="email" value={permanent.email} onChange={(event) => setPermanent((current) => ({ ...current, email: event.target.value }))} /></label>
              <label>Contraseña<input type="password" value={permanent.password} onChange={(event) => setPermanent((current) => ({ ...current, password: event.target.value }))} /></label>
              <label>
                Tipo
                <select value={permanent.staffKind} onChange={(event) => setPermanent((current) => ({ ...current, staffKind: event.target.value }))}>
                  <option value="permanent">Permanente</option>
                  <option value="temporary">Temporal</option>
                </select>
              </label>
              <label>
                Rol en FIF
                <select value={permanent.duty} onChange={(event) => setPermanent((current) => ({ ...current, duty: event.target.value }))}>
                  {DUTIES.map((duty) => <option key={duty.id} value={duty.id}>{duty.label}</option>)}
                </select>
              </label>
              <label>
                Equipo
                <select value={permanent.teamId} onChange={(event) => setPermanent((current) => ({ ...current, teamId: event.target.value }))}>
                  {TEAMS.map((team) => <option key={team.id} value={team.id}>{team.label}</option>)}
                </select>
              </label>
            </div>
            {permanent.duty === "teacher" && (
              <fieldset className="access-grid">
                <legend>Permisos de aula</legend>
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
            )}
            <button className="ad-btn" type="button" onClick={onCreatePermanent}>Crear cuenta de equipo</button>
          </article>

          <h2>Equipo con acceso</h2>
          {permanents.length === 0 && <p>Todavía no hay voluntarios permanentes en este dispositivo.</p>}
          {permanents.map((item) => (
            <article className="cred-card" key={item.email}>
              <strong>{item.firstName} {item.lastName}</strong>
              <p>{item.email} · {STAFF_KIND_LABEL[item.staffKind] || "Equipo"} · {teamLabel(item.teamId)}</p>
              <div className="teacher-filters">
                <label>
                  Equipo
                  <select value={item.teamId || ""} onChange={(event) => updateStaffTeam(item.email, { teamId: event.target.value, duty: item.duty || "teacher" })}>
                    <option value="">Sin equipo</option>
                    {TEAMS.map((team) => <option key={team.id} value={team.id}>{team.label}</option>)}
                  </select>
                </label>
                <label>
                  Rol
                  <select value={item.duty || "teacher"} onChange={(event) => updateStaffTeam(item.email, { duty: event.target.value, teamId: item.teamId || "" })}>
                    {DUTIES.map((duty) => <option key={duty.id} value={duty.id}>{duty.label}</option>)}
                  </select>
                </label>
              </div>
              {item.duty === "teacher" && (
                <fieldset className="access-grid">
                  <legend>Permisos de aula</legend>
                  {ACCESS_KEYS.map((key) => (
                    <label key={key.id}>
                      <input
                        type="checkbox"
                        checked={Boolean((item.access || ACCESS_PRESETS.teacher)[key.id])}
                        onChange={(event) => updateStaffAccess(item.email, {
                          ...(item.access || ACCESS_PRESETS.teacher),
                          [key.id]: event.target.checked,
                        })}
                      />
                      {key.label}
                    </label>
                  ))}
                </fieldset>
              )}
              <div className="cred-row">
                <input
                  type="password"
                  placeholder="Nueva clave"
                  value={resets[item.email] || ""}
                  onChange={(event) => setResets((current) => ({ ...current, [item.email]: event.target.value }))}
                />
                <button className="ad-btn" type="button" onClick={() => onReset(item.email)}>Cambiar clave</button>
              </div>
            </article>
          ))}
        </section>
      )}
      </div>
    </div>
  );
}
