import { WEEKDAYS } from "../data/staff";
import { ageLabel } from "../data/org";

const DAY_COLORS = {
  lunes: "#F07167",
  martes: "#D81B60",
  miercoles: "#8E24AA",
  jueves: "#F9A825",
  viernes: "#FB8C00",
  sabado: "#43A047",
  domingo: "#00897B",
};

const HOURS = ["07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00"];

function hourOf(time) {
  return `${String(time || "07:00").slice(0, 2)}:00`;
}

export function ScheduleGrid({ items = [], onRemove, emptyHint }) {
  const byCell = {};
  items.forEach((item) => {
    const key = `${item.day}-${hourOf(item.startTime)}`;
    if (!byCell[key]) byCell[key] = [];
    byCell[key].push(item);
  });

  return (
    <div className="timetable-wrap">
      <h3 className="timetable-title">Horario de clases</h3>
      {items.length === 0 && emptyHint && <p className="timetable-empty">{emptyHint}</p>}
      <div className="timetable" role="table" aria-label="Horario semanal">
        <div className="timetable-row timetable-head" role="row">
          <div className="timetable-cell is-hour" role="columnheader">Hora</div>
          {WEEKDAYS.map((day) => (
            <div
              key={day.id}
              className="timetable-cell is-day"
              role="columnheader"
              style={{ background: DAY_COLORS[day.id] }}
            >
              {day.label}
            </div>
          ))}
        </div>
        {HOURS.map((hour) => (
          <div className="timetable-row" role="row" key={hour}>
            <div className="timetable-cell is-hour" role="rowheader">{hour}</div>
            {WEEKDAYS.map((day) => {
              const cellItems = byCell[`${day.id}-${hour}`] || [];
              return (
                <div className="timetable-cell" role="cell" key={day.id}>
                  {cellItems.map((item) => (
                    <article key={item.id} className="timetable-block">
                      <strong>{item.title}</strong>
                      <span>{item.startTime}–{item.endTime}</span>
                      {item.teacherName && <span>{item.teacherName}</span>}
                      {item.ageGroup && item.ageGroup !== "all" && <span>{ageLabel(item.ageGroup)}</span>}
                      {onRemove && (
                        <button type="button" className="timetable-remove" onClick={() => onRemove(item.id)}>
                          Quitar
                        </button>
                      )}
                    </article>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ScheduleForm({ value, onChange, onSubmit, teachers = [], submitLabel = "Añadir al horario" }) {
  const set = (patch) => onChange({ ...value, ...patch });
  return (
    <form
      className="schedule-form"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <h3>Añadir clase</h3>
      <label>
        Título
        <input className="pill-input" value={value.title} onChange={(event) => set({ title: event.target.value })} required />
      </label>
      <label>
        Día
        <select className="pill-select" value={value.day} onChange={(event) => set({ day: event.target.value })}>
          {WEEKDAYS.map((day) => <option key={day.id} value={day.id}>{day.label}</option>)}
        </select>
      </label>
      <div className="schedule-form-times">
        <label>
          Inicio
          <input className="pill-input" type="time" value={value.startTime} onChange={(event) => set({ startTime: event.target.value })} />
        </label>
        <label>
          Fin
          <input className="pill-input" type="time" value={value.endTime} onChange={(event) => set({ endTime: event.target.value })} />
        </label>
      </div>
      <label>
        Grupo
        <select className="pill-select" value={value.ageGroup} onChange={(event) => set({ ageGroup: event.target.value })}>
          <option value="all">Todos los grupos</option>
          <option value="inicial">Inicial / nivelación</option>
          <option value="regular">Regular</option>
        </select>
      </label>
      {teachers.length > 0 && (
        <label>
          Profesor
          <select className="pill-select" value={value.teacherEmail} onChange={(event) => set({ teacherEmail: event.target.value })}>
            <option value="">Sin asignar</option>
            {teachers.map((item) => (
              <option key={item.email} value={item.email}>{item.firstName} {item.lastName}</option>
            ))}
          </select>
        </label>
      )}
      <label>
        Notas
        <textarea className="code-editor" rows={3} value={value.notes} onChange={(event) => set({ notes: event.target.value })} />
      </label>
      <button className="btn btn-green" type="submit">{submitLabel}</button>
    </form>
  );
}
