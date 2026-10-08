import { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useGame } from "../context/GameContext";
import { COURSES, courseAgeKey } from "../data/courses";
import { ageLabel } from "../data/org";
import { ACTIVITY_TYPES, QUESTION_TYPES, SUBJECTS, coursesForSubject, emptyQuestion, isQuestionReady, normalizeQuestion } from "../data/teacher";
import { BOARD_COLUMNS, CONTENT_KINDS, TEAMS, WEEKDAYS, teamById, teamLabel } from "../data/staff";
import { parseTestCode } from "../utils/parseTestCode";
import { isStaff, staffAccess } from "../utils/roles";
import { makeTestCode } from "../utils/security";
import "./Admin.css";

function todayInput() {
  return new Date().toISOString().slice(0, 10);
}

function formatWhen(value) {
  if (!value) return "—";
  return new Date(value).toLocaleString("es-EC", { dateStyle: "short", timeStyle: "short" });
}

export default function TeacherPanel() {
  const {
    user,
    hydrated,
    students,
    tests,
    attempts,
    attendance,
    activities,
    schedules,
    submissions,
    saveTest,
    saveAttendance,
    saveActivity,
    gradeSubmission,
    boardTasks,
    syllabusItems,
    contentItems,
    saveBoardTask,
    removeBoardTask,
    saveSyllabusItem,
    removeSyllabusItem,
    saveContentItem,
    removeContentItem,
    logout,
  } = useGame();
  const access = useMemo(() => staffAccess(user), [user]);
  const team = teamById(user?.teamId);
  const teaches = Boolean(team?.teaches && (user?.duty || "teacher") === "teacher");
  const tabs = useMemo(() => {
    const next = [{ id: "tablero", label: "Tablero" }];
    if (team?.teaches) next.push({ id: "silabo", label: "Sílabo" });
    if (team?.id === "multimedia") next.push({ id: "contenido", label: "Contenido" });
    if (teaches) {
      next.push(
        ...[
          { id: "crear", key: "tests", label: "Crear prueba" },
          { id: "codigo", key: "tests", label: "Crear con código" },
          { id: "notas", key: "grades", label: "Calificaciones" },
          { id: "asistencia", key: "attendance", label: "Asistencia" },
          { id: "actividades", key: "activities", label: "Actividades" },
          { id: "revisar", key: "activities", label: "Entregas" },
          { id: "horarios", key: "schedules", label: "Horarios" },
        ].filter((item) => access[item.key]),
      );
    }
    return next;
  }, [access, team, teaches]);
  const [tab, setTab] = useState("tablero");
  const [subjectId, setSubjectId] = useState(SUBJECTS[0].id);
  const [courseId, setCourseId] = useState(SUBJECTS[0].courses[0]);
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([emptyQuestion()]);
  const [codeText, setCodeText] = useState(`TITULO: Prueba de ejemplo

PREGUNTA: ¿Cuánto es 2+2?
A) 3
B) 4
C) 5
CORRECTA: B`);
  const [feedback, setFeedback] = useState("");
  const [attendDate, setAttendDate] = useState(todayInput());
  const [marks, setMarks] = useState({});
  const [activityTitle, setActivityTitle] = useState("");
  const [activityType, setActivityType] = useState("tarea");
  const [activityDue, setActivityDue] = useState("");
  const [activityText, setActivityText] = useState("");
  const [reviewDrafts, setReviewDrafts] = useState({});
  const [taskDraft, setTaskDraft] = useState({ title: "", notes: "", status: "todo" });
  const [syllabusDraft, setSyllabusDraft] = useState({ title: "", body: "" });
  const [contentDraft, setContentDraft] = useState({ title: "", kind: "podcast", url: "", notes: "" });

  const courseOptions = coursesForSubject(subjectId);
  const mine = tests.filter((test) => test.teacherEmail === user?.email);
  const myAttempts = attempts.filter((item) => item.teacherEmail === user?.email || mine.some((test) => test.code === item.code));
  const published = useMemo(() => mine.slice().sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)), [mine]);
  const myActivities = activities.filter((item) => item.teacherEmail === user?.email).slice().reverse();
  const mySchedules = schedules.filter((item) => !item.teacherEmail || item.teacherEmail === user?.email);
  const visibleStudents = students.filter((student) => {
    const course = COURSES.find((item) => item.id === courseId);
    if (!course) return true;
    return course.ageGroups.includes(courseAgeKey(student.ageGroup));
  });

  useEffect(() => {
    if (tab !== "asistencia" || !user) return;
    const saved = attendance.find((item) => item.teacherEmail === user.email && item.courseId === courseId && item.date === attendDate);
    if (!saved) {
      setMarks({});
      return;
    }
    const next = {};
    saved.records.forEach((row) => { next[row.studentId] = row.status; });
    setMarks(next);
  }, [tab, courseId, attendDate, attendance, user]);

  useEffect(() => {
    if (tabs.length && !tabs.some((item) => item.id === tab)) {
      setTab(tabs[0].id);
    }
  }, [tabs, tab]);

  if (!hydrated) return null;
  if (!user || !isStaff(user)) return <Navigate to={user?.role === "admin" ? "/admin/panel" : "/profesores"} replace />;

  const teamTasks = boardTasks.filter((item) => item.teamId === (user.teamId || ""));
  const teamSyllabus = syllabusItems.filter((item) => item.teamId === (user.teamId || "")).slice().reverse();
  const teamContent = contentItems.filter((item) => item.teamId === (user.teamId || "")).slice().reverse();

  const changeSubject = (nextId) => {
    setSubjectId(nextId);
    const nextCourses = coursesForSubject(nextId);
    setCourseId(nextCourses[0]?.id || "");
  };

  const updateQuestion = (index, patch) => {
    setQuestions((current) => current.map((question, qi) => (qi === index ? { ...question, ...patch } : question)));
  };

  const publishFromForm = () => {
    const clean = questions.map(normalizeQuestion).filter(isQuestionReady);
    if (!title.trim() || !clean.length) {
      setFeedback("Pon un título y al menos una pregunta lista, con respuesta correcta y puntaje.");
      return;
    }
    const test = {
      code: makeTestCode(),
      title: title.trim(),
      subjectId,
      courseId,
      teacherEmail: user.email,
      teacherName: `${user.firstName} ${user.lastName}`,
      questions: clean,
      createdAt: Date.now(),
    };
    saveTest(test);
    setFeedback(`Prueba publicada. Código para estudiantes: ${test.code}`);
    setTitle("");
    setQuestions([emptyQuestion()]);
  };

  const publishFromCode = () => {
    try {
      const parsed = parseTestCode(codeText);
      const test = {
        code: makeTestCode(),
        title: parsed.title,
        subjectId,
        courseId,
        questions: parsed.questions.map((question) => normalizeQuestion({ ...question, type: "choice", points: 1 })),
        teacherEmail: user.email,
        teacherName: `${user.firstName} ${user.lastName}`,
        createdAt: Date.now(),
      };
      saveTest(test);
      setFeedback(`Prueba publicada. Código para estudiantes: ${test.code}`);
    } catch (error) {
      setFeedback(error.message);
    }
  };

  const saveClassAttendance = () => {
    if (!visibleStudents.length) {
      setFeedback("No hay estudiantes registrados en este dispositivo para ese curso.");
      return;
    }
    const records = visibleStudents.map((student) => ({
      studentId: student.id,
      studentName: `${student.firstName} ${student.lastName}`,
      studentEmail: student.email,
      status: marks[student.id] || "present",
    }));
    saveAttendance({
      id: `${user.email}|${courseId}|${attendDate}`,
      teacherEmail: user.email,
      subjectId,
      courseId,
      date: attendDate,
      records,
      createdAt: Date.now(),
    });
    setFeedback(`Asistencia guardada para ${attendDate}.`);
  };

  const publishActivity = () => {
    if (!activityTitle.trim() || !activityText.trim()) {
      setFeedback("La actividad necesita título e instrucciones.");
      return;
    }
    saveActivity({
      id: crypto.randomUUID(),
      title: activityTitle.trim(),
      type: activityType,
      dueDate: activityDue,
      description: activityText.trim(),
      subjectId,
      courseId,
      teacherEmail: user.email,
      teacherName: `${user.firstName} ${user.lastName}`,
      createdAt: Date.now(),
    });
    setFeedback("Actividad publicada. Los estudiantes la verán en Actividades.");
    setActivityTitle("");
    setActivityText("");
    setActivityDue("");
  };

  const loadSavedAttendance = () => {
    const saved = attendance.find((item) => item.teacherEmail === user.email && item.courseId === courseId && item.date === attendDate);
    if (!saved) {
      setMarks({});
      return;
    }
    const next = {};
    saved.records.forEach((row) => { next[row.studentId] = row.status; });
    setMarks(next);
  };

  return (
    <div className="ad-shell">
      <aside className="ad-side">
        <strong>EQUIPO FIF</strong>
        <p className="ad-side-meta">{teamLabel(user.teamId)} · {user.firstName}</p>
        {tabs.map((item) => (
          <button key={item.id} type="button" className={tab === item.id ? "is-on" : ""} onClick={() => setTab(item.id)}>
            {item.label}
          </button>
        ))}
        <Link to="/fif-learning">Portal público</Link>
        <button type="button" onClick={logout}>Cerrar sesión</button>
      </aside>
      <div className="ad-main">
        <div className="ad-top">
          <div>
            <p className="ad-kicker">{team?.blurb || "Coordinación asigna tu equipo y accesos."}</p>
            <h1>{tabs.find((item) => item.id === tab)?.label}</h1>
          </div>
          <p>{TEAMS.find((item) => item.id === user.teamId)?.label || "Sin equipo asignado"}</p>
        </div>
      {feedback && <p className="ad-error" role="status" style={{ color: "#166534" }}>{feedback}</p>}
      {!user.teamId && (
        <section className="ad-card">
          <p>Coordinación aún no te asignó un equipo (Artes, Programación, Matemática o Multimedia). Cuando lo haga verás el tablero y las herramientas de ese equipo.</p>
        </section>
      )}

      {tab === "tablero" && user.teamId && (
        <section className="ad-card">
          <h2>Organización del equipo</h2>
          <div className="teacher-filters">
            <label>
              Tarea
              <input value={taskDraft.title} onChange={(event) => setTaskDraft((current) => ({ ...current, title: event.target.value }))} />
            </label>
            <label>
              Columna
              <select value={taskDraft.status} onChange={(event) => setTaskDraft((current) => ({ ...current, status: event.target.value }))}>
                {BOARD_COLUMNS.map((column) => <option key={column.id} value={column.id}>{column.label}</option>)}
              </select>
            </label>
          </div>
          <label>
            Notas
            <textarea value={taskDraft.notes} onChange={(event) => setTaskDraft((current) => ({ ...current, notes: event.target.value }))} />
          </label>
          <button
            className="ad-btn"
            type="button"
            onClick={() => {
              if (!taskDraft.title.trim()) {
                setFeedback("La tarjeta necesita un título.");
                return;
              }
              saveBoardTask({
                id: crypto.randomUUID(),
                teamId: user.teamId,
                title: taskDraft.title.trim(),
                notes: taskDraft.notes.trim(),
                status: taskDraft.status,
                ownerEmail: user.email,
                ownerName: `${user.firstName} ${user.lastName}`,
                createdAt: Date.now(),
              });
              setTaskDraft({ title: "", notes: "", status: "todo" });
              setFeedback("Tarjeta añadida al tablero.");
            }}
          >
            Añadir al tablero
          </button>
          <div className="ad-kanban">
            {BOARD_COLUMNS.map((column) => (
              <div key={column.id} className="ad-kanban-col">
                <h3>{column.label}</h3>
                {teamTasks.filter((item) => item.status === column.id).map((item) => (
                  <article key={item.id} className="ad-kanban-card">
                    <strong>{item.title}</strong>
                    {item.notes && <p>{item.notes}</p>}
                    <small>{item.ownerName}</small>
                    <select
                      value={item.status}
                      onChange={(event) => saveBoardTask({ ...item, status: event.target.value })}
                    >
                      {BOARD_COLUMNS.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
                    </select>
                    <button className="ad-btn ad-btn-ghost" type="button" onClick={() => removeBoardTask(item.id)}>Quitar</button>
                  </article>
                ))}
              </div>
            ))}
          </div>
        </section>
      )}

      {tab === "silabo" && (
        <section className="ad-card">
          <h2>Sílabo colaborativo · {teamLabel(user.teamId)}</h2>
          <p>El equipo carga unidades, objetivos y secuencia. Programación también puede anotar el desarrollo de la web aquí o en el tablero.</p>
          <label>
            Unidad / bloque
            <input value={syllabusDraft.title} onChange={(event) => setSyllabusDraft((current) => ({ ...current, title: event.target.value }))} />
          </label>
          <label>
            Contenido
            <textarea rows={5} value={syllabusDraft.body} onChange={(event) => setSyllabusDraft((current) => ({ ...current, body: event.target.value }))} />
          </label>
          <button
            className="ad-btn"
            type="button"
            onClick={() => {
              if (!syllabusDraft.title.trim() || !syllabusDraft.body.trim()) {
                setFeedback("Completa título y contenido de la unidad.");
                return;
              }
              saveSyllabusItem({
                id: crypto.randomUUID(),
                teamId: user.teamId,
                title: syllabusDraft.title.trim(),
                body: syllabusDraft.body.trim(),
                updatedBy: `${user.firstName} ${user.lastName}`,
                updatedAt: Date.now(),
              });
              setSyllabusDraft({ title: "", body: "" });
              setFeedback("Unidad añadida al sílabo.");
            }}
          >
            Publicar unidad
          </button>
          {teamSyllabus.length === 0 && <p>Aún no hay unidades en este sílabo.</p>}
          {teamSyllabus.map((item) => (
            <article key={item.id} className="cred-card">
              <strong>{item.title}</strong>
              <p>{item.body}</p>
              <small>{item.updatedBy} · {formatWhen(item.updatedAt)}</small>
              <button className="ad-btn ad-btn-ghost" type="button" onClick={() => removeSyllabusItem(item.id)}>Quitar</button>
            </article>
          ))}
        </section>
      )}

      {tab === "contenido" && (
        <section className="ad-card">
          <h2>Producción multimedia</h2>
          <p>Podcast, video, redes y piezas. Multimedia no da clases; este es el seguimiento de contenidos.</p>
          <div className="teacher-filters">
            <label>
              Título
              <input value={contentDraft.title} onChange={(event) => setContentDraft((current) => ({ ...current, title: event.target.value }))} />
            </label>
            <label>
              Tipo
              <select value={contentDraft.kind} onChange={(event) => setContentDraft((current) => ({ ...current, kind: event.target.value }))}>
                {CONTENT_KINDS.map((kind) => <option key={kind.id} value={kind.id}>{kind.label}</option>)}
              </select>
            </label>
          </div>
          <label>
            Enlace
            <input value={contentDraft.url} onChange={(event) => setContentDraft((current) => ({ ...current, url: event.target.value }))} />
          </label>
          <label>
            Notas
            <textarea value={contentDraft.notes} onChange={(event) => setContentDraft((current) => ({ ...current, notes: event.target.value }))} />
          </label>
          <button
            className="ad-btn"
            type="button"
            onClick={() => {
              if (!contentDraft.title.trim()) {
                setFeedback("Pon un título al contenido.");
                return;
              }
              saveContentItem({
                id: crypto.randomUUID(),
                teamId: user.teamId || "multimedia",
                ...contentDraft,
                title: contentDraft.title.trim(),
                ownerName: `${user.firstName} ${user.lastName}`,
                createdAt: Date.now(),
              });
              setContentDraft({ title: "", kind: "podcast", url: "", notes: "" });
              setFeedback("Pieza cargada.");
            }}
          >
            Registrar pieza
          </button>
          {teamContent.length === 0 && <p>Aún no hay piezas registradas.</p>}
          <ul className="activity-list">
            {teamContent.map((item) => (
              <li key={item.id}>
                <strong>{item.title}</strong>
                <p>{CONTENT_KINDS.find((kind) => kind.id === item.kind)?.label} · {item.ownerName}</p>
                {item.url && <p><a href={item.url} target="_blank" rel="noreferrer">{item.url}</a></p>}
                {item.notes && <p>{item.notes}</p>}
                <button className="ad-btn ad-btn-ghost" type="button" onClick={() => removeContentItem(item.id)}>Quitar</button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {tab === "crear" && (
        <section className="ad-card">
          <div className="teacher-filters">
            <label>
              Materia
              <select className="pill-select" value={subjectId} onChange={(event) => changeSubject(event.target.value)}>
                {SUBJECTS.map((subject) => <option key={subject.id} value={subject.id}>{subject.label}</option>)}
              </select>
            </label>
            <label>
              Curso
              <select className="pill-select" value={courseId} onChange={(event) => setCourseId(event.target.value)}>
                {courseOptions.map((course) => <option key={course.id} value={course.id}>{course.title}</option>)}
              </select>
            </label>
          </div>
          <label htmlFor="test-title">Título prueba</label>
          <input id="test-title" className="pill-input" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="TÍTULO PRUEBA" />
          {questions.map((question, qi) => (
            <article key={qi} className="teacher-question">
              <label htmlFor={`q-${qi}`}>Pregunta / enunciado</label>
              <input id={`q-${qi}`} className="pill-input" value={question.prompt} onChange={(event) => updateQuestion(qi, { prompt: event.target.value })} />
              <div className="teacher-filters">
                <label>
                  Tipo de pregunta
                  <select className="pill-select" value={question.type} onChange={(event) => updateQuestion(qi, { type: event.target.value })}>
                    {QUESTION_TYPES.map((type) => <option key={type.id} value={type.id}>{type.label}</option>)}
                  </select>
                </label>
                <label>
                  Ponderación
                  <input className="pill-input" type="number" min="1" value={question.points} onChange={(event) => updateQuestion(qi, { points: Number(event.target.value) })} />
                </label>
              </div>
              {question.type === "choice" && question.options.map((option, oi) => (
                <label key={oi} htmlFor={`q-${qi}-o-${oi}`}>
                  Opción {String.fromCharCode(65 + oi)}
                  <input id={`q-${qi}-o-${oi}`} className="pill-input" value={option} onChange={(event) => {
                    const options = [...question.options];
                    options[oi] = event.target.value;
                    updateQuestion(qi, { options });
                  }} />
                </label>
              ))}
              {(question.type === "choice" || question.type === "truefalse") && (
                <label>
                  Respuesta correcta
                  <select className="pill-select" value={question.correctIndex} onChange={(event) => updateQuestion(qi, { correctIndex: Number(event.target.value) })}>
                    {(question.type === "truefalse" ? ["Verdadero", "Falso"] : question.options).map((option, oi) => (
                      <option key={oi} value={oi}>{question.type === "truefalse" ? option : `${String.fromCharCode(65 + oi)} ${option || ""}`}</option>
                    ))}
                  </select>
                </label>
              )}
              {(question.type === "complete" || question.type === "short") && (
                <label>
                  Respuesta correcta
                  <input className="pill-input" value={question.correctText} onChange={(event) => updateQuestion(qi, { correctText: event.target.value })} placeholder="Texto que se considera correcto" />
                </label>
              )}
            </article>
          ))}
          <div className="actions-row">
            <button className="btn btn-blue" type="button" onClick={() => setQuestions((current) => [...current, emptyQuestion()])}>Añadir pregunta +</button>
            <button className="btn btn-green" type="button" onClick={publishFromForm}>Publicar prueba</button>
          </div>
        </section>
      )}

      {tab === "codigo" && (
        <section className="ad-card">
          <h2>Pegar prueba en código de texto</h2>
          <p>Usa TITULO, PREGUNTA, opciones A) B) C) y CORRECTA. Separa preguntas con una línea en blanco.</p>
          <label htmlFor="code-test">Código de la prueba</label>
          <textarea id="code-test" className="code-editor" value={codeText} onChange={(event) => setCodeText(event.target.value)} />
          <button className="btn btn-green" type="button" onClick={publishFromCode}>Publicar desde código</button>
        </section>
      )}

      {tab === "notas" && (
        <section className="ad-card">
          <h2>Calificaciones</h2>
          {published.length === 0 && <p>Todavía no hay pruebas publicadas en este dispositivo.</p>}
          {published.map((test) => {
            const rows = myAttempts
              .filter((item) => item.code === test.code)
              .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
            const maxPoints = (test.questions || []).reduce((sum, question) => sum + (Number(question.points) || 1), 0);
            return (
              <article key={test.code} className="grade-block">
                <header>
                  <h3>{test.title}</h3>
                  <p>Código {test.code} · {maxPoints} pts · {COURSES.find((course) => course.id === test.courseId)?.title || "Curso"}</p>
                </header>
                <table className="progress-table">
                  <thead>
                    <tr>
                      <th>Estudiante</th>
                      <th>Correo</th>
                      <th>Fecha</th>
                      <th>Puntaje</th>
                      <th>Nota</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.length === 0 && (
                      <tr><td colSpan={5}>Nadie ha enviado esta prueba todavía.</td></tr>
                    )}
                    {rows.map((item) => (
                      <tr key={item.id}>
                        <td>{item.studentName || "Estudiante"}</td>
                        <td>{item.studentEmail || "—"}</td>
                        <td>{formatWhen(item.createdAt)}</td>
                        <td>{item.score ?? 0}/{item.total || maxPoints}</td>
                        <td>{item.percent != null ? `${item.percent}%` : (item.total ? `${Math.round((item.score / item.total) * 100)}%` : "—")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </article>
            );
          })}
        </section>
      )}

      {tab === "asistencia" && (
        <section className="ad-card">
          <div className="teacher-filters">
            <label>
              Materia
              <select className="pill-select" value={subjectId} onChange={(event) => changeSubject(event.target.value)}>
                {SUBJECTS.map((subject) => <option key={subject.id} value={subject.id}>{subject.label}</option>)}
              </select>
            </label>
            <label>
              Curso
              <select className="pill-select" value={courseId} onChange={(event) => setCourseId(event.target.value)}>
                {courseOptions.map((course) => <option key={course.id} value={course.id}>{course.title}</option>)}
              </select>
            </label>
            <label>
              Fecha
              <input className="pill-input" type="date" value={attendDate} onChange={(event) => setAttendDate(event.target.value)} />
            </label>
          </div>
          <h2>Asistencia en clase</h2>
          <div className="attend-list">
            <div className="attend-head">
              <span>Estudiante</span>
              <span>Asistencia</span>
            </div>
            {visibleStudents.length === 0 && <p>No hay estudiantes de este curso registrados en este dispositivo.</p>}
            {visibleStudents.map((student) => (
              <div className="attend-row" key={student.id}>
                <strong>{student.firstName} {student.lastName}</strong>
                <span className="chip-age">{ageLabel(student.ageGroup)}</span>
                <div className="attend-radios">
                  <label>
                    <input type="radio" name={`att-${student.id}`} checked={(marks[student.id] || "present") === "present"} onChange={() => setMarks((current) => ({ ...current, [student.id]: "present" }))} />
                    Presente
                  </label>
                  <label>
                    <input type="radio" name={`att-${student.id}`} checked={marks[student.id] === "absent"} onChange={() => setMarks((current) => ({ ...current, [student.id]: "absent" }))} />
                    Falta
                  </label>
                </div>
              </div>
            ))}
          </div>
          <div className="actions-row">
            <button className="btn btn-blue" type="button" onClick={loadSavedAttendance}>Cargar lista guardada</button>
            <button className="btn btn-green" type="button" onClick={saveClassAttendance}>Guardar asistencia</button>
          </div>
        </section>
      )}

      {tab === "actividades" && (
        <section className="ad-card">
          <div className="teacher-filters">
            <label>
              Materia
              <select className="pill-select" value={subjectId} onChange={(event) => changeSubject(event.target.value)}>
                {SUBJECTS.map((subject) => <option key={subject.id} value={subject.id}>{subject.label}</option>)}
              </select>
            </label>
            <label>
              Curso
              <select className="pill-select" value={courseId} onChange={(event) => setCourseId(event.target.value)}>
                {courseOptions.map((course) => <option key={course.id} value={course.id}>{course.title}</option>)}
              </select>
            </label>
            <label>
              Tipo
              <select className="pill-select" value={activityType} onChange={(event) => setActivityType(event.target.value)}>
                {ACTIVITY_TYPES.map((type) => <option key={type.id} value={type.id}>{type.label}</option>)}
              </select>
            </label>
          </div>
          <label htmlFor="act-title">Título de la actividad</label>
          <input id="act-title" className="pill-input" value={activityTitle} onChange={(event) => setActivityTitle(event.target.value)} />
          <label htmlFor="act-due">Fecha de entrega (opcional)</label>
          <input id="act-due" className="pill-input" type="date" value={activityDue} onChange={(event) => setActivityDue(event.target.value)} />
          <label htmlFor="act-text">Instrucciones</label>
          <textarea id="act-text" className="code-editor" value={activityText} onChange={(event) => setActivityText(event.target.value)} placeholder="Qué deben hacer los alumnos." />
          <button className="btn btn-green" type="button" onClick={publishActivity}>Publicar actividad</button>

          <h2>Actividades publicadas</h2>
          {myActivities.length === 0 && <p>Aún no hay actividades.</p>}
          <ul className="activity-list">
            {myActivities.map((item) => (
              <li key={item.id}>
                <strong>{item.title}</strong>
                <p>{ACTIVITY_TYPES.find((type) => type.id === item.type)?.label} · {COURSES.find((course) => course.id === item.courseId)?.title} {item.dueDate ? `· Entrega ${item.dueDate}` : ""}</p>
                <p>{item.description}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {tab === "revisar" && (
        <section className="ad-card">
          <h2>Entregas de estudiantes</h2>
          <p>Revisa el texto y los archivos. Pon una nota de 0 a 10; el estudiante la verá en Actividades.</p>
          {submissions.filter((item) => item.teacherEmail === user.email).length === 0 && <p>Aún no hay entregas para tus actividades.</p>}
          <ul className="activity-list">
            {submissions.filter((item) => item.teacherEmail === user.email).slice().reverse().map((item) => {
              const draft = reviewDrafts[item.id] || { grade: item.grade ?? "", comment: item.teacherComment || "" };
              return (
                <li key={item.id}>
                  <strong>{item.activityTitle || "Actividad"}</strong>
                  <p>{item.studentName} · {item.studentEmail}</p>
                  <div className="work-preview" dangerouslySetInnerHTML={{ __html: item.textHtml || "<p>Sin texto.</p>" }} />
                  <div className="work-files">
                    {(item.files || []).map((file) => (
                      file.type?.startsWith("image/")
                        ? <img key={file.name} src={file.dataUrl} alt={file.name} />
                        : <a key={file.name} href={file.dataUrl} download={file.name}>{file.name}</a>
                    ))}
                  </div>
                  {item.grade != null && <p>Nota actual: <span className="grade-pill">{item.grade}/10</span></p>}
                  <div className="teacher-filters">
                    <label>
                      Nota /10
                      <input
                        className="pill-input"
                        type="number"
                        min="0"
                        max="10"
                        value={draft.grade}
                        onChange={(event) => setReviewDrafts((current) => ({ ...current, [item.id]: { ...draft, grade: event.target.value } }))}
                      />
                    </label>
                    <label>
                      Comentario
                      <input
                        className="pill-input"
                        value={draft.comment}
                        onChange={(event) => setReviewDrafts((current) => ({ ...current, [item.id]: { ...draft, comment: event.target.value } }))}
                      />
                    </label>
                  </div>
                  <button
                    className="btn btn-green"
                    type="button"
                    onClick={() => {
                      const result = gradeSubmission(item.id, draft.grade, draft.comment, user.email);
                      setFeedback(result.ok ? `Nota ${draft.grade}/10 enviada a ${item.studentName}.` : result.message);
                    }}
                  >
                    Guardar calificación
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {tab === "horarios" && (
        <section className="ad-card">
          <h2>Horarios asignados</h2>
          {mySchedules.length === 0 && <p>Coordinación aún no te asignó horarios en este dispositivo.</p>}
          <ul className="activity-list">
            {mySchedules.map((item) => (
              <li key={item.id}>
                <strong>{item.title}</strong>
                <p>
                  {WEEKDAYS.find((day) => day.id === item.day)?.label} · {item.startTime}–{item.endTime} · {item.ageGroup === "all" ? "Todos los grupos" : ageLabel(item.ageGroup)}
                </p>
                {item.notes && <p>{item.notes}</p>}
              </li>
            ))}
          </ul>
        </section>
      )}
      </div>
    </div>
  );
}
