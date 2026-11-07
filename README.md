# Fundación Integral de Familias — sitio y FIF Learning

Sitio web de la **Fundación Integral de Familias (FIF)**, Ecuador.

- **Sitio publicado:** https://www.fundacionfif.org (Cloudflare Pages)
- **Código:** https://github.com/FIF-programacion/paginaFIF
- **Stack:** React 19, Vite 7, React Router 7, CSS propio, Framer Motion, jsPDF

Este README es la guía de entrada al proyecto: qué hay, dónde está, cómo se enciende FIF Learning, dónde viven los datos y con qué cuentas se prueba.

---

## Índice

1. [Estado del proyecto](#1-estado-del-proyecto)
2. [Arrancar en local](#2-arrancar-en-local)
3. [Usuarios de prueba](#3-usuarios-de-prueba)
4. [Dónde están los datos (no hay base de datos todavía)](#4-dónde-están-los-datos-no-hay-base-de-datos-todavía)
5. [Flujos](#5-flujos)
6. [Mapa de archivos: qué editar](#6-mapa-de-archivos-qué-editar)
7. [Rutas](#7-rutas)
8. [Cursos y grupos](#8-cursos-y-grupos)
9. [Git y publicación](#9-git-y-publicación)
10. [Convención al cambiar algo](#10-convención-al-cambiar-algo)

Más detalle de deploy y de la futura base: [docs/DESPLIEGUE.md](docs/DESPLIEGUE.md) y [docs/PLAN-SUPABASE.md](docs/PLAN-SUPABASE.md).

---

## 1. Estado del proyecto

Hay **dos capas** en el mismo código:

| Capa | En producción (`fundacionfif.org`) | En local (`npm run dev`) |
|---|---|---|
| Sitio institucional (`/`, donaciones, inscripciones, legales) | Sí | Sí |
| Panel **Coordinación** (`/admin`) | Sí (enlace en el pie) | Sí |
| Portal **FIF Learning** (estudiantes, docentes, cursos) | Apagado | Encendido si `.env.local` tiene `VITE_ENABLE_PLATFORM=true` |

El interruptor es `VITE_ENABLE_PLATFORM` (`src/config.js`). En Cloudflare debe quedar en `false` hasta migrar a Supabase. En local se pone `true` para trabajar el portal.

FIF Learning **no aparece** en la landing pública (ni “Muy pronto”). Se entra por URL: `/fif-learning`, `/login`, `/profesores`.

No hay cobro en la web. Inscripciones y donaciones se coordinan por WhatsApp.

---

## 2. Arrancar en local

Requisitos: **Node.js 22** (ver `.node-version`) y npm.

```bash
git clone https://github.com/FIF-programacion/paginaFIF.git
cd paginaFIF
npm install
```

Para el **sitio institucional** basta con:

```bash
npm run dev
```

Abre `http://127.0.0.1:5173/`.

Para **FIF Learning** (cursos, login, docentes), copia `.env.example` a `.env.local` y deja:

```bash
VITE_ENABLE_PLATFORM=true
```

Reinicia Vite (`Ctrl+C` y otra vez `npm run dev`). Vite solo lee `.env.local` al arrancar.

| Script | Qué hace |
|---|---|
| `npm run dev` | Servidor con recarga, puerto `5173` |
| `npm run build` | Genera `dist/` (lo que publica Cloudflare) |
| `npm run preview` | Sirve `dist/` en local |

`.env.local` **no se sube a git**. Nunca pongas claves `service_role` en un `VITE_`*.

---

## 3. Usuarios de prueba

Las cuentas semilla se crean solas la primera vez que se abre una ruta de plataforma en ese navegador (`src/data/staff.js` → `GameContext.jsx`). Las contraseñas **no** se muestran en las pantallas de login.

Solo existen con la plataforma encendida, salvo Coordinación, que también entra en producción.

| Rol | Entrada | Correo | Contraseña |
|---|---|---|---|
| Coordinación (admin) | `/admin` | `coordinacion@fif.org` | `FIFCoord2026` |
| Voluntario temporal 1 | `/profesores` | `voluntario1@fif.org` | `FIFVoluntario2026` |
| Voluntario temporal 2 | `/profesores` | `voluntario2@fif.org` | `FIFVoluntario2026` |
| Voluntario temporal 3 | `/profesores` | `voluntario3@fif.org` | `FIFVoluntario2026` |

No hay estudiante de demostración fijo. El registro público (`/registro`) está **cerrado**. Para probar el portal de alumno:

1. Entra a Coordinación (`/admin`).
2. Pestaña **Cuentas**.
3. Crea un estudiante (nombre, correo, clave, grupo inicial o regular).
4. Cierra sesión y entra en `/login` con esa cuenta.

Grupos:

- **Inicial / nivelación** → ve Programación, Matemática, Música y **Arte**.
- **Regular** → ve Programación, Matemática y Música. **No incluye Arte.**

Si las cuentas semilla no aparecen (por un `localStorage` viejo), recarga `/admin` o `/profesores`. El seed las vuelve a insertar si faltan. Para partir de cero: en DevTools → Application → Local Storage → borrar `fif-learning-state-v2`.

Modo vista previa de estudiante (sin login): `/fif-learning?preview=1` o cualquier ruta de app con `?preview=1`. Usa un alumno ficticio `ariel@correo.com` solo en memoria; no se guarda.

Docentes y coordinación **no** comparten login. Un admin no entra por `/profesores`; un docente no entra por `/admin`. Tras el login, coordinación va a `/admin/panel` y el equipo a `/equipo`.

---

## 4. Dónde están los datos (no hay base de datos todavía)
## 5. Landing institucional (`/`): qué hay ahora

Fondo blanco, menú lateral de líneas (hover muestra el título), chip **Dona hoy**. Scroll de página suavizado y más lento (`src/hooks/useSlowPageScroll.js`).

| Sección | Qué hace |
|---|---|
| **Inicio** | Recuadro redondeado con `videoInicio.mp4` a fill. Título *Fundación Integral de Familias* en Nunito (tres líneas). Al hacer scroll el recuadro se encoge al centro y desaparece. |
| **Nosotros** | Zigzag con foto: Quiénes somos (texto izq. / foto der.), Misión (foto izq. / texto der.), Nuestro trabajo, Visión. El texto entra con **Kinetic Text Reveal** (palabras, blur, dirección). |
| **Proyectos** | Título centrado y carrusel infinito tipo fisheye de fotos de talleres. |
| **Eventos** | **Scroll Split Card**: 1) una imagen completa, 2) se parte en tres, 3) las tarjetas se voltean y muestran los tres eventos (Soul Concert, Modern Ballet, Album Launch). *More info* va a contacto; *Register Now* abre WhatsApp. |
| **Dona ahora** | Franja dorada `DONA AHORA` + tarjetas de donación individual y organización. |
| **Colaboradores** | Carrusel continuo de logos (USFQ PASEC, Mil Travesuras, K-School, ALEKS). |
| **Multimedia** | Enlaces a podcast *Conversa con los Profes* y canal de YouTube. |
| **FIF Learning (portal)** | Recuadro con foto de taller y wordmark de colores **FIF LEARNING**. Botón al portal `/fif-learning`. |
| **Contacto** | Tres tarjetas: datos, horarios y redes. |

Horarios: martes y jueves 3:00 pm – 5:00 pm; sábado 8:30 am – 12:30 pm.

Referencias de animación: [Kinetic Text Reveal](https://componentry.dev/docs/components/kinetic-text-reveal) y [Scroll Split Card](https://componentry.dev/docs/components/scroll-split-card).

**Hoy no hay Postgres, ni API, ni servidor propio.** Todo lo de FIF Learning vive en el **navegador**, en `localStorage`, clave:

```text
fif-learning-state-v2
```

Lo escribe `src/context/GameContext.jsx`. Eso significa:

- Lo que cree Coordinación (estudiantes, horarios, pruebas) **solo existe en ese computador/navegador**.
- Otro dispositivo, otra persona o una ventana privada no lo ve.
- Por eso el portal de estudiantes está apagado en el sitio público.

### Qué se guarda en esa clave

| Campo | Contenido |
|---|---|
| `accounts` | Usuarios: `student`, `staff`, `admin`. La contraseña va hasheada (SHA-256), no en texto |
| `sessionId` | Quién está logueado |
| `progress` | Lecciones hechas por curso (minijuegos) |
| `stats` | Puntos, insignias, racha |
| `tests` / `attempts` | Pruebas con código `FIF-XXXXX` y calificaciones |
| `activities` / `submissions` / `activityDone` | Tareas, deberes, entregas |
| `schedules` / `attendance` | Horarios y asistencia |
| `enrollments` | Solicitudes de inscripción (si se guardan en este dispositivo) |
| `boardTasks` / `syllabusItems` / `contentItems` | Tablero, sílabo y contenidos del equipo |

### Qué no está en localStorage

| Dato | Dónde está |
|---|---|
| Textos de la fundación, WhatsApp, redes | `src/data/org.js` (código) |
| Cursos, lecciones, minijuegos | `src/data/courses.js` y `src/data/teacher.js` |
| Tarifas de inscripción, tipos de colegio, becas internas | `src/data/enrollments.js` |
| Cuentas semilla y equipos | `src/data/staff.js` |
| Fotos, video, logos | `public/images/`, `public/videos/` |

Inscripciones y donaciones **públicas** se van por WhatsApp (`src/data/org.js` → `assistanceWhatsAppUrl`). No se cobran en la web.

### El plan de base de datos (aún no implementado)

Cuando exista, será **Supabase** (Auth + Postgres + Storage). El modelo está en [docs/PLAN-SUPABASE.md](docs/PLAN-SUPABASE.md). Hasta entonces no hay `.env` de base de datos que rellenar: `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` en `.env.example` están vacíos a propósito.

---

## 5. Flujos

### 5.1 Visitante en el sitio público

1. Entra a `/`.
2. Puede donar (`/dona/individual`, `/dona/paquetes`) → formulario → WhatsApp.
3. Puede inscribir a un estudiante (`/inscripciones`, 5 pasos) → WhatsApp. Tipo de institución: Fiscal, Particular, Homeschooling. **No pide becas**; las define Coordinación.
4. Horario público: **sábado 7:30 am – 1:00 pm**.
5. Pie → **Coordinación** → `/admin`.

### 5.2 Coordinación

1. `/admin` con `coordinacion@fif.org`.
2. Revisa inscripciones, asigna grupo (inicial / regular), publica horarios, crea cuentas de estudiantes y de equipo (con equipo: matemática, artes, programación, multimedia; y deber: docente o miembro).

### 5.3 Estudiante (solo local / cuando se encienda FIF Learning)

1. Coordinación crea la cuenta.
2. `/login` → tutorial la primera vez → `/app/cursos`.
3. Ve las **materias** de su grupo (no la lista suelta de minijuegos).
4. Dentro de cada materia (`/app/materia/:id`): pestaña **Aula** (trabajos del profesor), **Minijuegos**, **Código de prueba**.

### 5.4 Equipo / docente

1. Coordinación crea la cuenta con equipo y permisos.
2. `/profesores` → `/equipo`.
3. Según el equipo: tablero, sílabo, contenido, pruebas, asistencia, actividades, horarios.

---

## 6. Mapa de archivos: qué editar

```text
paginaFIF/
├── index.html                 Cascarón HTML, título, #root
├── package.json               Dependencias y scripts
├── vite.config.js             Puerto 5173
├── .env.example               Plantilla de variables (copiar a .env.local)
├── .node-version              Node 22 para Cloudflare
├── README.md                  Esta guía
├── docs/
│   ├── DESPLIEGUE.md          Cloudflare Pages + dominio
│   └── PLAN-SUPABASE.md       Futura base de datos
├── public/
│   ├── images/                Logo, fotos, aliados, equipo
│   ├── videos/                videoInicio.mp4
│   └── _headers               Caché y cabeceras en Pages
└── src/
    ├── main.jsx               Arranque React + Router + fuentes
    ├── App.jsx                Rutas públicas + carga de la plataforma
    ├── PlatformRoutes.jsx     Rutas de FIF Learning y Coordinación
    ├── config.js              PLATFORM_ENABLED
    ├── index.css              Estilos del portal, paneles, legales
    ├── components/            Piezas reutilizables
    ├── context/GameContext.jsx  Estado + localStorage
    ├── data/                  Contenido y catálogos
    ├── pages/                 Una pantalla por archivo
    ├── hooks/                 Scroll de la landing
    └── utils/                 Hash, PDF, roles, parser de pruebas
```

### 6.1 “Quiero cambiar X” → archivo

| Quieres cambiar… | Archivo(s) |
|---|---|
| Textos, horario, WhatsApp, redes, podcast | `src/data/org.js` y, si aplica, `src/pages/Landing.jsx` |
| Secciones de la landing (equipo, eventos, menú) | `src/pages/Landing.jsx` + `src/pages/Landing.css` |
| Tarjetas de eventos (textos, botones, color) | `EVENTS` en `Landing.jsx` y `ScrollSplitEvents.jsx` |
| Formulario de donación | `src/components/RequestFormModal.jsx` |
| Páginas de donación | `DonateIndividual.jsx`, `DonatePackages.jsx` |
| Formulario de inscripción | `src/pages/Enrollment.jsx` + `Enrollment.css` + `src/data/enrollments.js` |
| Legales | `src/pages/legal/LegalPages.jsx` |
| Pie y enlace Coordinación | `src/components/SiteFooter.jsx` |
| Encender/apagar FIF Learning | `.env.local` y `src/config.js` (el flag). Rutas en `App.jsx` / `PlatformRoutes.jsx` |
| Materias que ve el estudiante | `src/data/teacher.js` (`SUBJECTS`) y `ageGroups` en `src/data/courses.js` |
| Minijuegos / lecciones | `src/data/courses.js` |
| Cuentas semilla y equipos | `src/data/staff.js` |
| Lógica de login, progreso, pruebas | `src/context/GameContext.jsx` |
| Panel de coordinación | `src/pages/AdminPanel.jsx` + `Admin.css` |
| Panel de docentes | `src/pages/TeacherPanel.jsx` |
| Hub de una materia (aula / juegos / código) | `src/pages/SubjectHub.jsx` |
| Foto o video | Copiar a `public/images/` o `public/videos/` y usar `/images/archivo.ext` |
| Color de marca de eventos | `--lp-brand` en `Landing.css` (RGB 240, 131, 0) |

### 6.2 `src/data` (catálogos)

| Archivo | Función |
|---|---|
| `org.js` | Nombre, correo, teléfono, WhatsApp, redes, plataformas del podcast, grupos de edad |
| `courses.js` | Cada minijuego (teoría/práctica/lecturas) y a qué edad aplica |
| `teacher.js` | Materias visibles (Programación, Matemática, Arte, Música) y tipos de actividad/pregunta |
| `staff.js` | Equipos, permisos, días, cuenta admin y voluntarios de prueba |
| `enrollments.js` | Pasos de inscripción, tarifas, tipos de institución, becas internas |
| `content.js` | Textos de tutorial y Asistencia; reexporta cursos |

### 6.3 `src/pages`

Públicas: `Landing`, `Enrollment`, `DonateIndividual`, `DonatePackages`, `legal/LegalPages`.

Plataforma: `FifLearning`, `Login`, `Register` (cerrado), `Tutorial`, `Welcome`, `Dashboard`, `SubjectHub`, `CourseMap`, `TakeTest`, `StudentActivities`, `StudentSchedules`, `TeacherLogin`, `TeacherPanel`, `AdminLogin`, `AdminPanel`.

Ejercicios: `pages/exercises/MatchingExercise.jsx`, `TimedMathExercise.jsx`, `DeductorExercise.jsx`.

### 6.4 `src/components`

| Archivo | Función |
|---|---|
| `Brand.jsx` | Wordmark FIF LEARNING y logo |
| `AppHeader.jsx` / `AppShell.jsx` | Marco del estudiante |
| `SiteFooter.jsx` | Pie del sitio |
| `RequestFormModal.jsx` | Formulario de donación → WhatsApp |
| `ScrollSplitEvents.jsx` | Tarjetas de eventos |
| `KineticText.jsx` / `VelocityText.jsx` | Animaciones de la landing |
| `Testimonials.jsx` | Testimonios |
| `CourseCover.jsx` | Portadas de cursos |
| `TextEditor.jsx` | Editor de entregas |
| `LegalLayout.jsx` | Plantilla de páginas legales |
| `CookieNotice.jsx` | Aviso antiguo de almacenamiento; **ya no se muestra** |

### 6.5 `src/utils`

| Archivo | Función |
|---|---|
| `security.js` | SHA-256 de contraseñas y códigos `FIF-XXXXX` |
| `roles.js` | Quién es staff/admin y a qué ruta va después del login |
| `parseTestCode.js` | Interpreta pruebas pegadas como texto |
| `gradeTest.js` | Califica un intento |
| `certificate.js` | PDF al terminar un minijuego/curso |

---

## 7. Rutas

Definidas en `src/App.jsx` (públicas) y `src/PlatformRoutes.jsx` (plataforma).

### Siempre disponibles

| Ruta | Pantalla |
|---|---|
| `/` | Landing institucional |
| `/dona/individual` | Donación individual |
| `/dona/paquetes` | Paquetes |
| `/inscripciones` | Inscripción (5 pasos) |
| `/legal/*` | Privacidad, términos, cookies, reembolsos, avisos, contacto |
| `/admin` | Login de Coordinación |
| `/admin/panel` | Panel de Coordinación |
| `/coordinacion` | Redirige a `/admin/panel` |

### Solo con `VITE_ENABLE_PLATFORM=true`

| Ruta | Pantalla |
|---|---|
| `/fif-learning` | Portada del portal |
| `/login` | Estudiante |
| `/registro` | Cerrado: manda a login o inscripciones |
| `/tutorial/:step` | Tutorial post-login |
| `/profesores` | Login del equipo |
| `/equipo` | Panel del equipo |
| `/app/cursos` | Materias del estudiante |
| `/app/materia/:subjectId` | Aula + minijuegos + código |
| `/app/curso/:courseId` | Mapa de un minijuego |
| `/app/curso/:id/leccion/:n` | Ejercicio |
| `/app/actividades` | Entregar tareas |
| `/app/prueba` | Ingresar código de prueba |
| `/app/horarios` | Horarios del grupo |
| `/app/progreso` | Kardex y PDF |
| `/app/asistencia` | Ayuda / WhatsApp |

---

## 8. Cursos y grupos

El estudiante **no** ve 16 chips sueltos. Ve 3 o 4 **materias** (`SUBJECTS` en `teacher.js`):

| Materia | Minijuegos de refuerzo | Quién la ve |
|---|---|---|
| Programación | teoría, práctica, lecturas, programación 2 | Inicial y regular |
| Matemática | Combinatoria, Teoría de números, Geometría, Álgebra (sílabo olímpico FIF Learning) | Inicial y regular |
| Música | teoría, práctica, lecturas | Inicial y regular |
| Arte | teoría, práctica, lecturas, historia | **Solo inicial / nivelación** |

`inicial` en el código se trata como `under12`; `regular` como `over12` (`courseAgeKey` en `courses.js`).

Para añadir un minijuego: créalo en `courses.js`, agrégalo al array `COURSES` y enlázalo en `SUBJECTS` de `teacher.js`. Para quitar Arte del regular no hace falta tocar cada pantalla: basta con que esos cursos tengan `ageGroups: ["under12"]`.

---

## 9. Git y publicación

Remoto de trabajo: `origin` → `https://github.com/FIF-programacion/paginaFIF.git` (rama `main`).

Cada push a `main` vuelve a desplegar fundacionfif.org (Cloudflare Pages). Build: `npm run build`, salida `dist/`.

```bash
git status
git add archivo1 archivo2 // git add .
git commit -m "Describe el porqué del cambio"
git push
```

No subas `.env.local`, `node_modules/` ni `dist/`.

El repo anterior `ArielBourgeat/FIF-WEB` no es el que alimenta el dominio actual.

Detalle del DNS y de las variables en Cloudflare: [docs/DESPLIEGUE.md](docs/DESPLIEGUE.md). Nota: ese documento es anterior a dejar Coordinación siempre encendida; si hay duda, manda esta guía.

---

## 10. Convención al cambiar algo

1. Identifica si es **sitio público** (Landing, donaciones, inscripción) o **plataforma** (GameContext, paneles, cursos).
2. Cambia datos de contenido en `src/data/`, no los copies en cada página.
3. Estilos de la fundación: `Landing.css`. Estilos del portal y paneles: `index.css` / `Admin.css` / `Enrollment.css`.
4. Nueva pantalla: archivo en `src/pages/` y ruta en `App.jsx` o `PlatformRoutes.jsx`.
5. Prueba en el navegador el flujo, no solo el archivo. Si tocaste la landing, revisa también donación, inscripción, contacto y el pie.
6. FIF Learning: crea un estudiante de prueba en Coordinación y entra como alumno **y** como docente.

Tecnologías que **no** usa este repo: Java, Tailwind, backend propio, pasarela de pago.

Contacto institucional en código: `fundacionintegralfif@gmail.com`, WhatsApp `+593 99 833 4440`.
