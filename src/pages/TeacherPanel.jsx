import { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useGame } from "../context/GameContext";
import { COURSES } from "../data/courses";
import { ageLabel } from "../data/org";
import { ACTIVITY_TYPES, QUESTION_TYPES, SUBJECTS, coursesForSubject, emptyQuestion, isQuestionReady, normalizeQuestion } from "../data/teacher";
import { WEEKDAYS } from "../data/staff";
import { parseTestCode } from "../utils/parseTestCode";
import { staffAccess } from "../utils/roles";
import { makeTestCode } from "../utils/security";

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
    logout,
  } = useGame();
  const access = useMemo(() => staffAccess(user), [user]);
  const tabs = useMemo(() => [
    { id: "crear", key: "tests", label: "Crear prueba" },
    { id: "codigo", key: "tests", label: "Crear con código" },
    { id: "notas", key: "grades", label: "Calificaciones" },
    { id: "asistencia", key: "attendance", label: "Asistencia en clase" },
    { id: "actividades", key: "activities", label: "Actividades" },
    { id: "revisar", key: "activities", label: "Revisar entregas" },
    { id: "horarios", key: "schedules", label: "Horarios" },
  ].filter((item) => access[item.key]), [access]);
  const [tab, setTab] = useState("crear");
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

  const courseOptions = coursesForSubject(subjectId);
  const mine = tests.filter((test) => test.teacherEmail === user?.email);
  const myAttempts = attempts.filter((item) => item.teacherEmail === user?.email || mine.some((test) => test.code === item.code));
  const published = useMemo(() => mine.slice().sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)), [mine]);
  const myActivities = activities.filter((item) => item.teacherEmail === user?.email).slice().reverse();
  const mySchedules = schedules.filter((item) => !item.teacherEmail || item.teacherEmail === user?.email);
  const visibleStudents = students.filter((student) => {
    const course = COURSES.find((item) => item.id === courseId);
    if (!course) return true;
    return course.ageGroups.includes(student.ageGroup || "over12");
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
  if (!user || user.role !== "teacher") return <Navigate to={user?.role === "admin" ? "/coordinacion" : "/profesores"} replace />;

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
    <div className="app-shell teacher-shell">
      <header className="app-header">
        <div className="app-header-top">
          <h1 className="course-title" style={{ margin: 0 }}>DOCENTES FIF</h1>
          <div className="header-actions">
            <Link className="btn btn-blue login-chip" to="/fif-learning">Volver al portal</Link>
            <button className="btn btn-green login-chip" type="button" onClick={logout}>Cerrar sesión</button>
          </div>
        </div>
        <p>Hola, {user.firstName}. Coordinación define tus accesos y las actividades que te delega.</p>
      </header>
      <nav className="app-nav">
        {tabs.map((item) => (
          <button key={item.id} type="button" className={tab === item.id ? "active" : ""} onClick={() => setTab(item.id)}>
            {item.label}
          </button>
        ))}
      </nav>

      {feedback && <p className="feedback ok" role="status">{feedback}</p>}

      {tab === "crear" && (
        <section className="teacher-board">
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
        <section className="teacher-board">
          <h2>Pegar prueba en código de texto</h2>
          <p>Usa TITULO, PREGUNTA, opciones A) B) C) y CORRECTA. Separa preguntas con una línea en blanco.</p>
          <label htmlFor="code-test">Código de la prueba</label>
          <textarea id="code-test" className="code-editor" value={codeText} onChange={(event) => setCodeText(event.target.value)} />
          <button className="btn btn-green" type="button" onClick={publishFromCode}>Publicar desde código</button>
        </section>
      )}

      {tab === "notas" && (
        <section className="teacher-board">
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
        <section className="teacher-board">
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
        <section className="teacher-board">
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
        <section className="teacher-board">
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
        <section className="teacher-board">
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
  );
}
