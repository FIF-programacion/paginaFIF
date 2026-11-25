import { useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { useGame } from "../context/GameContext";
import { AGE_GROUPS, ageLabel, normalizeGroup } from "../data/org";
import { ACCESS_KEYS, ACCESS_PRESETS, DEFAULT_ADMIN, DUTIES, STAFF_KIND_LABEL, TEAMS, teamLabel } from "../data/staff";
import { ACTIVITY_TYPES, SUBJECTS, coursesForSubject } from "../data/teacher";
import { COURSES } from "../data/courses";
import { ACADEMIC_GOALS, ENROLLMENT_STATUSES, SCHOLARSHIPS, schoolTypeLabel, statusLabel } from "../data/enrollments";
import { ScheduleForm, ScheduleGrid } from "../components/ScheduleGrid";
import { AdminSideNav } from "../components/AdminSideNav";
import "./Admin.css";

const TABS = [
  { id: "inscripciones", label: "Inscripciones" },
  { id: "grupos", label: "Grupos" },
  { id: "horarios", label: "Horarios" },
  { id: "delegar", label: "Actividades" },
  { id: "noticias", label: "Noticias" },
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
    updateEnrollment,
    logout,
    newsPosts,
    saveNewsPost,
    removeNewsPost,
    removeStaffAccount,
    addNextTempVolunteer,
  } = useGame();

  const [tab, setTab] = useState("inscripciones");
  const [openEnrollment, setOpenEnrollment] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [schedule, setSchedule] = useState({
    title: "",
    day: "sabado",
    startTime: "07:30",
    endTime: "13:00",
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
    source: "manual",
    enrollmentId: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    ageGroup: "regular",
  });
  const [resets, setResets] = useState({});
  const [tempVolunteerPassword, setTempVolunteerPassword] = useState("");
  const [openStaffEmail, setOpenStaffEmail] = useState(null);
  const [newsDraft, setNewsDraft] = useState({ title: "", body: "", ageGroup: "all" });

  const teachers = useMemo(() => staff.filter((item) => item.role !== "admin"), [staff]);
  const temps = teachers.filter((item) => item.staffKind === "temporary" || item.lockedUsername);
  const permanents = teachers.filter((item) => item.staffKind !== "temporary" && !item.lockedUsername);
  const activityCourses = coursesForSubject(activity.subjectId);
  const enrollmentsWithoutAccount = useMemo(
    () => enrollments.filter((item) => !item.studentAccountId),
    [enrollments],
  );
  const delegationActivities = useMemo(
    () => activities.filter((item) => item.delegation),
    [activities],
  );

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
      delegation: true,
      audience: "staff",
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

  const applyEnrollmentToStudentForm = (enrollmentId) => {
    const row = enrollments.find((item) => item.id === enrollmentId);
    if (!row) return;
    const parts = (row.studentName || "").trim().split(/\s+/);
    setStudentForm((current) => ({
      ...current,
      enrollmentId,
      firstName: parts[0] || current.firstName,
      lastName: parts.slice(1).join(" ") || current.lastName,
      email: current.email || (row.guardianEmail || "").trim().toLowerCase(),
      tutorName: row.guardianName || "",
      tutorEmail: row.guardianEmail || "",
    }));
  };

  const onCreateStudent = async () => {
    const payload = {
      ...studentForm,
      enrollmentId: studentForm.source === "enrollment" ? studentForm.enrollmentId : null,
    };
    const result = await createStudent(payload);
    setFeedback(result.ok ? `Cuenta de estudiante creada para ${studentForm.email}.` : result.message);
    if (result.ok) {
      setStudentForm({
        source: "manual",
        enrollmentId: "",
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        ageGroup: "regular",
      });
    }
  };

  const onAddTempVolunteer = async () => {
    const result = await addNextTempVolunteer(tempVolunteerPassword || undefined);
    setFeedback(result.ok ? `Cuenta ${result.email} creada (voluntario ${result.slot}).` : result.message);
    if (result.ok) setTempVolunteerPassword("");
  };

  const onPublishNews = () => {
    if (!newsDraft.title.trim() || !newsDraft.body.trim()) {
      setFeedback("La noticia necesita título y cuerpo.");
      return;
    }
    saveNewsPost({
      id: crypto.randomUUID(),
      title: newsDraft.title.trim(),
      body: newsDraft.body.trim(),
      ageGroup: newsDraft.ageGroup || "all",
      authorEmail: user.email,
      authorName: `${user.firstName} ${user.lastName}`,
      authorRole: "admin",
      createdAt: Date.now(),
    });
    setNewsDraft({ title: "", body: "", ageGroup: "all" });
    setFeedback("Aviso publicado para estudiantes en FIF Learning.");
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
      <AdminSideNav
        title="COORDINACIÓN FIF"
        tabs={TABS}
        tab={tab}
        onTab={setTab}
        onLogout={logout}
      />
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
          <p>Solicitudes enviadas desde el formulario público. Cambia el estado según la revisión. Las becas las define Coordinación aquí, no en el formulario público.</p>
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
                    <td>{schoolTypeLabel(item.schoolType)}</td>
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
                <p><strong>Colegio:</strong> {selected.school} · {schoolTypeLabel(selected.schoolType)} · {selected.grade}</p>
                <p><strong>Pago:</strong> ${selected.payAmount || "—"} · {selected.payName} · {selected.payPhone}</p>
                <p><strong>Becas:</strong> {selected.scholarshipLabels?.length ? selected.scholarshipLabels.join(" · ") : "Ninguna"}</p>
                <p><strong>Porcentaje de beca:</strong> {selected.scholarshipPercent ?? 0}%</p>
                {selected.payNotes && <p><strong>Notas de pago:</strong> {selected.payNotes}</p>}
                <p><strong>Residencia:</strong> {selected.city} · {selected.sector}</p>
                <p><strong>Concursos:</strong> {selected.contests === "si" ? "Sí" : "No"}</p>
                <p><strong>Prep. extra:</strong> {selected.extraPrep === "si" ? "Sí" : "No"}</p>
                <p><strong>Expectativas:</strong> {(selected.goals || []).map((id) => (id === "otro" && selected.otherGoal ? selected.otherGoal : ACADEMIC_GOALS.find((goal) => goal.id === id)?.label)).filter(Boolean).join(", ")}</p>
                <p><strong>Emergencia:</strong> {selected.emergencyName} · {selected.emergencyRelation} · {selected.emergencyPhone}</p>
                {selected.emergencyNotes && <p><strong>Nota:</strong> {selected.emergencyNotes}</p>}
              </div>
              <div className="ad-beca">
                <h3>Beca de Coordinación</h3>
                <label>
                  Porcentaje
                  <input
                    className="pill-input"
                    type="number"
                    min="0"
                    max="100"
                    value={selected.scholarshipPercent ?? 0}
                    onChange={(event) => {
                      const pct = Math.min(100, Math.max(0, Number(event.target.value) || 0));
                      updateEnrollment(selected.id, {
                        scholarshipPercent: pct,
                        scholarshipLabels: pct ? [`Beca ${pct}%`] : [],
                      });
                      setFeedback(pct ? `Beca de ${selected.studentName}: ${pct}%.` : `Beca de ${selected.studentName} en 0%.`);
                    }}
                  />
                </label>
                <div className="ad-beca-presets">
                  {SCHOLARSHIPS.map((item) => (
                    <button
                      key={item.id}
                      className="ad-btn ad-btn-ghost"
                      type="button"
                      onClick={() => {
                        const pct = item.id.includes("100") ? 100 : item.id.includes("40") ? 40 : 10;
                        updateEnrollment(selected.id, {
                          scholarships: [item.id],
                          scholarshipPercent: pct,
                          scholarshipLabels: [item.label],
                        });
                        setFeedback(`Aplicada: ${item.label}`);
                      }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
                <button
                  className="ad-btn"
                  type="button"
                  onClick={() => {
                    updateEnrollment(selected.id, { scholarships: [], scholarshipPercent: 0, scholarshipLabels: [] });
                    setFeedback(`Beca eliminada para ${selected.studentName}.`);
                  }}
                >
                  Quitar beca
                </button>
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
          <p>A la izquierda añades una clase. A la derecha ves el horario como lo verá el estudiante.</p>
          <div className="schedule-split">
            <ScheduleForm
              value={schedule}
              onChange={setSchedule}
              teachers={teachers}
              submitLabel="Añadir al horario"
              onSubmit={onSaveSchedule}
            />
            <ScheduleGrid items={schedules} onRemove={removeSchedule} emptyHint="Todavía no hay clases en la grilla." />
          </div>
        </section>
      )}

      {tab === "delegar" && (
        <section className="ad-card">
          <h2>Delegaciones al equipo docente</h2>
          <p>Instrucciones o recordatorios para voluntarios y profesores. <strong>No</strong> aparecen en la plataforma de estudiantes; el docente las ve en Equipo FIF.</p>
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

          <h2>Delegaciones enviadas</h2>
          {delegationActivities.length === 0 && <p>Aún no hay delegaciones.</p>}
          <ul className="activity-list">
            {delegationActivities.slice().reverse().map((item) => (
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

      {tab === "noticias" && (
        <section className="ad-card ad-form-pro">
          <h2>Avisos para estudiantes</h2>
          <p>Se muestran en el panel <strong>Noticias</strong> del inicio de FIF Learning.</p>
          <label>
            Título
            <input className="pill-input" value={newsDraft.title} onChange={(event) => setNewsDraft((c) => ({ ...c, title: event.target.value }))} />
          </label>
          <label>
            Mensaje
            <textarea className="code-editor" rows={5} value={newsDraft.body} onChange={(event) => setNewsDraft((c) => ({ ...c, body: event.target.value }))} />
          </label>
          <label>
            Grupo (opcional)
            <select className="pill-select" value={newsDraft.ageGroup} onChange={(event) => setNewsDraft((c) => ({ ...c, ageGroup: event.target.value }))}>
              <option value="all">Todos los estudiantes</option>
              {AGE_GROUPS.map((group) => <option key={group.id} value={group.id}>{group.label}</option>)}
            </select>
          </label>
          <button className="ad-btn" type="button" onClick={onPublishNews}>Publicar aviso</button>
          <h2>Publicados</h2>
          {newsPosts.length === 0 && <p>No hay avisos todavía.</p>}
          <ul className="activity-list">
            {newsPosts.slice().reverse().map((item) => (
              <li key={item.id}>
                <strong>{item.title}</strong>
                <p>{item.body}</p>
                <small>{item.authorName} · {new Date(item.createdAt).toLocaleString("es-EC")}</small>
                <button className="ad-btn ad-btn-ghost" type="button" onClick={() => removeNewsPost(item.id)}>Quitar</button>
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

          <article className="cred-card ad-form-pro">
            <h2>Crear estudiante</h2>
            <p>Elige si la cuenta es nueva o proviene de una inscripción aprobada (evita duplicados en grupos).</p>
            <fieldset className="ad-radio-row">
              <legend>Origen</legend>
              <label>
                <input type="radio" name="student-source" checked={studentForm.source === "manual"} onChange={() => setStudentForm((c) => ({ ...c, source: "manual", enrollmentId: "" }))} />
                Desde cero
              </label>
              <label>
                <input type="radio" name="student-source" checked={studentForm.source === "enrollment"} onChange={() => setStudentForm((c) => ({ ...c, source: "enrollment" }))} />
                Desde inscripción
              </label>
            </fieldset>
            {studentForm.source === "enrollment" && (
              <label>
                Inscripción
                <select
                  className="pill-select"
                  value={studentForm.enrollmentId}
                  onChange={(event) => {
                    setStudentForm((c) => ({ ...c, enrollmentId: event.target.value }));
                    applyEnrollmentToStudentForm(event.target.value);
                  }}
                >
                  <option value="">Elige una inscripción sin cuenta</option>
                  {enrollmentsWithoutAccount.map((item) => (
                    <option key={item.id} value={item.id}>{item.studentName} · {item.guardianEmail}</option>
                  ))}
                </select>
              </label>
            )}
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
            <button className="ad-btn" type="button" onClick={onCreateStudent} disabled={studentForm.source === "enrollment" && !studentForm.enrollmentId}>
              Crear cuenta de estudiante
            </button>
          </article>

          <article className="cred-card">
            <h2>Voluntarios temporales</h2>
            <p>El usuario se mantiene entre semestres. Coordinación carga la clave nueva del período y asigna el equipo.</p>
            <div className="cred-row add-volunteer-row">
              <label>
                Clave para el siguiente voluntario
                <input
                  type="password"
                  placeholder="Opcional (usa la clave por defecto)"
                  value={tempVolunteerPassword}
                  onChange={(event) => setTempVolunteerPassword(event.target.value)}
                />
              </label>
              <button className="ad-btn" type="button" onClick={onAddTempVolunteer}>Agregar voluntario siguiente</button>
            </div>
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
            <div className="staff-line" key={item.email}>
              <span>
                <strong>{item.firstName} {item.lastName}</strong>
                {" · "}{item.email}
                {" · "}{teamLabel(item.teamId)}
                {" · "}{DUTIES.find((d) => d.id === item.duty)?.label || "Docente"}
              </span>
              <button className="ad-btn ad-btn-ghost" type="button" onClick={() => setOpenStaffEmail(item.email)}>Ver ficha completa</button>
            </div>
          ))}
          {openStaffEmail && permanents.some((item) => item.email === openStaffEmail) && (() => {
            const item = permanents.find((row) => row.email === openStaffEmail);
            return (
              <article className="cred-card staff-ficha" key={item.email}>
                <h3>{item.firstName} {item.lastName}</h3>
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
                <div className="actions-row">
                  <button className="ad-btn ad-btn-ghost" type="button" onClick={() => setOpenStaffEmail(null)}>Cerrar ficha</button>
                  <button
                    className="ad-btn"
                    type="button"
                    style={{ background: "#b91c1c" }}
                    onClick={() => {
                      const result = removeStaffAccount(item.email);
                      setFeedback(result.ok ? `${item.email} eliminado del equipo.` : result.message);
                      if (result.ok) setOpenStaffEmail(null);
                    }}
                  >
                    Eliminar miembro
                  </button>
                </div>
              </article>
            );
          })()}
        </section>
      )}
      </div>
    </div>
  );
}
