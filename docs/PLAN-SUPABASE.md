# Plan de migración de FIF Learning a Supabase

Estado: **propuesta**. Nada de esto está implementado todavía. Hoy la plataforma guarda todo en el `localStorage` de cada navegador, por eso está apagada en producción (`VITE_ENABLE_PLATFORM=false`).

## Por qué migrar

- Los datos no se comparten entre dispositivos: inscripciones, pruebas, actividades y cuentas creadas por coordinación solo existen en el navegador donde se crearon.
- El login y los permisos se validan en el navegador; cualquiera puede editarlos.
- Progreso y puntos son globales, no por estudiante.
- Los adjuntos en base64 llenan el `localStorage` (~5 MB) y rompen la app.

## Servicios

| Necesidad | Supabase |
|---|---|
| Login | Auth (correo + contraseña). Sin registro público: solo coordinación crea cuentas |
| Datos | Postgres con Row Level Security (RLS) |
| Archivos de tareas | Storage, bucket privado `submissions` |
| Crear cuentas, cambiar claves | Edge Function con la `service_role` key (nunca en el navegador) |

Plan gratuito: alcanza para ~250 estudiantes si las fotos se comprimen antes de subir y los archivos se limpian por período. Riesgos: se pausa tras 7 días sin uso (mantener con una consulta programada) y no incluye respaldos (hacer `pg_dump` semanal con GitHub Actions).

## Modelo de datos (borrador)

| Tabla | Reemplaza | Notas |
|---|---|---|
| `profiles` | `accounts` | `id` = `auth.users.id`; `role` (`student`, `staff`, `admin`), `staff_kind`, `duty`, `team_id`, `age_group`, `access` (jsonb) |
| `enrollments` | `enrollments` | Formulario público: `insert` anónimo, solo `admin` lee y actualiza |
| `lesson_progress` | `progress` | Una fila por (`student_id`, `course_id`, `lesson_id`) |
| `student_stats` | `stats` | Puntos, insignias, días activos (fecha en zona `America/Guayaquil`) |
| `tests`, `test_attempts` | `tests`, `attempts` | Las respuestas correctas no deben ser legibles por estudiantes: calificar en una función SQL `security definer` |
| `activities`, `submissions` | `activities`, `submissions`, `activityDone` | `submissions` guarda `text_html` (sanitizado) y rutas de Storage |
| `schedules`, `attendance` | `schedules`, `attendance` | |
| `board_tasks`, `syllabus_items`, `content_items` | mismo nombre | Filtrados por `team_id` |

El catálogo de cursos (`src/data/courses.js`) sigue en el código.

## Reglas de acceso (RLS)

- Estudiante: lee y escribe solo sus filas (`student_id = auth.uid()`); lee actividades, horarios y pruebas de su grupo.
- Equipo: lee y escribe lo de su `team_id`; califica entregas de sus actividades.
- Coordinación (`role = 'admin'`): todo.
- `enrollments`: `insert` para `anon` con validación de campos; nadie más que `admin` puede leer.

## Fases

1. **Base**: crear proyecto, tablas, RLS, bucket y la Edge Function `create-user`. Cuenta de coordinación creada a mano en el panel (las claves fijas de `src/data/staff.js` se eliminan).
2. **Inscripciones**: el formulario público inserta en `enrollments` además de abrir WhatsApp. Coordinación las ve en su panel. Esta fase puede publicarse sola.
3. **Cuentas y login**: reemplazar `register`/`login` de `GameContext` por Supabase Auth; coordinación crea cuentas desde su panel.
4. **Progreso y ejercicios**: `lesson_progress` y `student_stats` por estudiante.
5. **Equipo**: pruebas, actividades, entregas (con compresión de imágenes antes de subir), asistencia, horarios, tablero.
6. **Encender la plataforma** en producción (`VITE_ENABLE_PLATFORM=true`) y actualizar la política de privacidad.

Antes de la fase 2 hay que corregir la política de privacidad: hoy dice que no se piden cédulas ni datos de pago, y el formulario de inscripción sí los pide.

## Variables de entorno

Ver `.env.example`. En Cloudflare Pages se configuran en Settings → Environment variables. La `anon key` es pública por diseño; la `service_role` key solo vive en las Edge Functions.
