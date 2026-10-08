import { useState } from "react";
import { COURSES, courseAgeKey } from "../data/courses";
import { ACTIVITY_TYPES } from "../data/teacher";
import { TextEditor } from "../components/TextEditor";
import { useGame } from "../context/GameContext";

const MAX_FILE_BYTES = 800 * 1024;

async function readAllowedFiles(fileList) {
  const files = [...fileList].slice(0, 3);
  const next = [];
  for (const file of files) {
    if (file.size > MAX_FILE_BYTES) {
      throw new Error(`${file.name} pesa más de 800 KB. Elige un archivo más liviano.`);
    }
    const dataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("No se pudo leer el archivo."));
      reader.readAsDataURL(file);
    });
    next.push({ name: file.name, type: file.type, dataUrl, size: file.size });
  }
  return next;
}

function fieldsForType(type) {
  if (type === "lectura") return { editor: true, files: false, hint: "Escribe tu lectura o reflexión. Puedes poner título, negrita y cambiar el tamaño." };
  if (type === "practica") return { editor: true, files: true, hint: "Sube fotos o archivos de tu práctica y, si quieres, explica lo que hiciste." };
  if (type === "proyecto") return { editor: true, files: true, hint: "Redacta el proyecto y adjunta imágenes o archivos." };
  return { editor: true, files: true, hint: "Escribe tu tarea y, si el profesor lo pide, adjunta un archivo o una imagen." };
}

export default function StudentActivities() {
  const { user, activities, activityDone, submissions, submitActivityWork, completeActivity } = useGame();
  const [drafts, setDrafts] = useState({});
  const [feedback, setFeedback] = useState("");

  const mine = activities.filter((item) => {
    const course = COURSES.find((course) => course.id === item.courseId);
    if (!course) return true;
    return course.ageGroups.includes(courseAgeKey(user?.ageGroup));
  }).slice().reverse();

  const done = (activityId) => activityDone.some((item) => item.activityId === activityId && item.studentEmail === user.email);
  const work = (activityId) => submissions.find((item) => item.activityId === activityId && item.studentEmail === user.email);
  const draft = (activityId) => drafts[activityId] || { html: "", files: [] };

  const changeDraft = (activityId, patch) => {
    setDrafts((current) => ({ ...current, [activityId]: { ...draft(activityId), ...patch } }));
  };

  const onFiles = async (activityId, fileList) => {
    try {
      const files = await readAllowedFiles(fileList);
      changeDraft(activityId, { files });
      setFeedback("");
    } catch (error) {
      setFeedback(error.message);
    }
  };

  const uploadWork = (item) => {
    const current = draft(item.id);
    const textHtml = current.html || "";
    const files = current.files || [];
    if (!textHtml.replace(/<[^>]+>/g, "").trim() && !files.length) {
      setFeedback("Escribe algo o adjunta un archivo antes de subir la tarea.");
      return;
    }
    submitActivityWork({
      activityId: item.id,
      activityTitle: item.title,
      studentEmail: user.email,
      studentName: `${user.firstName} ${user.lastName}`,
      teacherEmail: item.teacherEmail,
      textHtml,
      files,
    });
    setFeedback("Tarea subida. Ahora puedes marcarla como completada.");
  };

  const markDone = (activityId) => {
    const result = completeActivity(activityId, user.email);
    setFeedback(result.ok ? "Actividad marcada como hecha." : result.message);
  };

  return (
    <section className="panel">
      <h2>Actividades</h2>
      <p>Tareas y prácticas que publicó tu docente. Primero sube tu trabajo y después márcala como hecha. La nota la pone el profesor.</p>
      {feedback && <p className="feedback ok" role="status">{feedback}</p>}
      {mine.length === 0 && <p>Aún no hay actividades asignadas.</p>}
      <ul className="activity-list">
        {mine.map((item) => {
          const finished = done(item.id);
          const submitted = work(item.id);
          const fields = fieldsForType(item.type);
          return (
            <li key={item.id}>
              <strong>{item.title}</strong>
              <p>
                {ACTIVITY_TYPES.find((type) => type.id === item.type)?.label} · {COURSES.find((course) => course.id === item.courseId)?.title}
                {item.dueDate ? ` · Entrega ${item.dueDate}` : ""}
              </p>
              <p>{item.description}</p>
              <p>{fields.hint}</p>
              {fields.editor && !finished && (
                <TextEditor
                  value={draft(item.id).html}
                  onChange={(html) => changeDraft(item.id, { html })}
                  placeholder="Escribe tu respuesta. Selecciona texto para poner negrita o título."
                />
              )}
              {fields.files && !finished && (
                <label>
                  Archivos o imágenes
                  <input className="pill-input" type="file" multiple accept="image/*,.pdf,.doc,.docx,.txt" onChange={(event) => onFiles(item.id, event.target.files)} />
                </label>
              )}
              {(draft(item.id).files || []).length > 0 && (
                <div className="work-files">
                  {draft(item.id).files.map((file) => (
                    file.type.startsWith("image/")
                      ? <img key={file.name} src={file.dataUrl} alt={file.name} />
                      : <span key={file.name}>{file.name}</span>
                  ))}
                </div>
              )}
              {submitted && (
                <div className="work-preview">
                  <p>Tu entrega:</p>
                  <div dangerouslySetInnerHTML={{ __html: submitted.textHtml || "<p>Sin texto.</p>" }} />
                  {submitted.grade != null && (
                    <p>Calificación: <span className="grade-pill">{submitted.grade}/10</span> {submitted.teacherComment}</p>
                  )}
                  {submitted.grade == null && <p>El profesor todavía no califica esta entrega.</p>}
                </div>
              )}
              {!finished && (
                <div className="actions-row">
                  <button className="btn btn-blue" type="button" onClick={() => uploadWork(item)}>Subir tarea</button>
                  <button className="btn btn-green" type="button" onClick={() => markDone(item.id)} disabled={!submitted}>
                    Marcar como hecha
                  </button>
                </div>
              )}
              {finished && <p className="feedback ok">Marcaste esta actividad como hecha.</p>}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
