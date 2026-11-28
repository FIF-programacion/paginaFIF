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
4. [Infraestructura, dominio y datos](#4-infraestructura-dominio-y-datos)
5. [Flujos](#5-flujos)
6. [Mapa de archivos: qué editar](#6-mapa-de-archivos-qué-editar)
7. [Rutas](#7-rutas)
8. [Cursos y grupos](#8-cursos-y-grupos)
9. [Git y publicación](#9-git-y-publicación)
10. [Convención al cambiar algo](#10-convención-al-cambiar-algo)

Más detalle de publicación y modelo de datos: [docs/DESPLIEGUE.md](docs/DESPLIEGUE.md) y [docs/PLAN-SUPABASE.md](docs/PLAN-SUPABASE.md).

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

## 4. Infraestructura, dominio y datos

Este proyecto no es solo una carpeta de React: forma parte de un **cambio de plataforma** que la fundación ya hizo o está consolidando.

### Migración AWS → Cloudflare + dominio propio

| Antes (AWS) | Ahora |
|---|---|
| Sitio y servicios asociados en la nube de **AWS** | Sitio publicado en **Cloudflare** |
| Dominio y hosting repartidos o en transición | Dominio propio **`fundacionfif.org`** (registrar y DNS en Cloudflare) |
| Base de datos y backend ligados al stack anterior | Base de datos en capa **Postgres** (proyecto **Supabase**), separada del front estático |

Hoy la **cara pública** del repositorio `paginaFIF` es:

- **URL:** https://www.fundacionfif.org (`fundacionfif.org` redirige a `www`)
- **Build y CDN:** **Cloudflare Pages** (cada push a `main` genera `dist/` y despliega)
- **HTTPS, caché y reglas:** panel de Cloudflare (ver [docs/DESPLIEGUE.md](docs/DESPLIEGUE.md))

No hay servidor Node en producción para la landing: es HTML/JS estático generado por Vite.

### Base de datos (sí existe en el diseño del proyecto)

**Sí hay base de datos** en el ecosistema FIF: **Postgres** administrado por **Supabase** (autenticación, tablas con RLS y almacenamiento de archivos). Es el reemplazo de lo que antes vivía en **AWS** para datos compartidos (cuentas, inscripciones, progreso, entregas, etc.). El esquema y las fases de cableado están en [docs/PLAN-SUPABASE.md](docs/PLAN-SUPABASE.md).

Variables previstas en el cliente (públicas por diseño en Supabase):

```text
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Se configuran en `.env.local` para desarrollo y en **Cloudflare Pages → Environment variables** para producción cuando el front ya lea Supabase.

**Qué implica para quien abre este código hoy**

| Capa | Dónde vive ahora en `paginaFIF` |
|---|---|
| Landing, donaciones, legales, assets | Repo + Cloudflare Pages |
| Catálogo de cursos, textos FIF, minijuegos HTML | Código en `src/data/` y `public/` |
| Operación FIF Learning (cuentas, progreso, horarios…) | En producción debe ir a **Supabase**; en desarrollo local el `GameContext` aún puede persistir en el navegador (ver abajo) |
| Portal estudiante en fundacionfif.org | Apagado (`VITE_ENABLE_PLATFORM=false`) hasta que login y datos usen la base compartida de forma estable |

### Persistencia temporal en el navegador (desarrollo)

Mientras el portal se prueba en local, `src/context/GameContext.jsx` puede guardar estado en **`localStorage`**, clave:

```text
fif-learning-state-v2
```

Eso sirve para maquetar y probar sin depender de la red, **no** es el modelo final en producción: los datos no se comparten entre equipos ni con el sitio publicado. Para vaciar pruebas: DevTools → Application → Local Storage → borrar esa clave.

| Campo en `localStorage` | Contenido (mismo modelo que migrará a Postgres) |
|---|---|
| `accounts` | Usuarios `student` / `staff` / `admin` (clave hasheada en cliente) |
| `sessionId` | Sesión actual |
| `progress`, `stats` | Refuerzos y gamificación |
| `tests`, `attempts` | Pruebas con código `FIF-XXXXX` |
| `activities`, `submissions`, `activityDone` | Tareas y entregas |
| `schedules`, `attendance` | Horarios y asistencia |
| `enrollments` | Fichas de inscripción en el dispositivo |
| `boardTasks`, `syllabusItems`, `contentItems` | Tablero, sílabo y contenidos |

### Datos que no van a la base (siguen en el repo)

| Dato | Ubicación |
|---|---|
| Contacto, redes, WhatsApp, podcast | `src/data/org.js` |
| Materias, cursos, refuerzos interactivos | `src/data/courses.js`, `src/data/teacher.js` |
| Minijuegos HTML | `src/data/games.js`, `public/games/` |
| Formulario de inscripción (reglas y becas internas) | `src/data/enrollments.js` |
| Cuentas semilla de demo | `src/data/staff.js` |
| Imágenes y video | `public/images/`, `public/videos/` |

Las inscripciones y donaciones **desde la web pública** siguen coordinándose por **WhatsApp** (`assistanceWhatsAppUrl` en `org.js`); no hay pasarela de pago en el sitio.

### Resumen mental del proyecto

1. **Cloudflare** = dominio `fundacionfif.org` + sitio institucional publicado.  
2. **Supabase (Postgres)** = base de datos institucional tras la migración desde AWS.  
3. **Este repo** = front único; FIF Learning se desarrolla aquí y se conecta a Supabase según [docs/PLAN-SUPABASE.md](docs/PLAN-SUPABASE.md).

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
3. Ve las **materias** de su grupo (no la lista suelta de refuerzos).
4. Dentro de cada materia (`/app/materia/:id`): Inicio, actividades, progreso, contenido (**refuerzos interactivos**), **minijuegos** HTML, sílabo y evaluación.
5. **Minijuegos** también está en el menú general (`/app/minijuegos`): ahí se juega el HTML (por ejemplo Reto InFIFnito / OMEC N2).

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
│   └── PLAN-SUPABASE.md       Postgres / Supabase y cableado del front
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
| Refuerzos interactivos / lecciones | `src/data/courses.js` |
| Minijuegos HTML | `src/data/games.js` y `public/games/` |
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
| `courses.js` | Cada refuerzo interactivo (teoría/práctica/lecturas) y a qué edad aplica |
| `games.js` | Minijuegos HTML (Reto InFIFnito / OMEC y otros) |
| `teacher.js` | Materias visibles (Programación, Matemática, Arte, Música) y tipos de actividad/pregunta |
| `staff.js` | Equipos, permisos, días, cuenta admin y voluntarios de prueba |
| `enrollments.js` | Pasos de inscripción, tarifas, tipos de institución, becas internas |
| `content.js` | Textos de tutorial y Asistencia; reexporta cursos |

### 6.3 `src/pages`

Públicas: `Landing`, `Enrollment`, `DonateIndividual`, `DonatePackages`, `legal/LegalPages`.

Plataforma: `FifLearning`, `Login`, `Register` (cerrado), `Tutorial`, `Welcome`, `Dashboard`, `SubjectHub`, `MiniGames`, `HtmlGame`, `CourseMap`, `TakeTest`, `StudentActivities`, `StudentSchedules`, `TeacherLogin`, `TeacherPanel`, `AdminLogin`, `AdminPanel`.

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
| `certificate.js` | PDF al terminar un refuerzo interactivo |

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
| `/app/materia/:subjectId` | Curso: inicio, refuerzos, minijuegos, sílabo |
| `/app/minijuegos` | Catálogo de minijuegos HTML |
| `/app/minijuegos/:gameId` | Jugar un minijuego HTML |
| `/app/curso/:courseId` | Mapa de un refuerzo interactivo |
| `/app/curso/:id/leccion/:n` | Ejercicio |
| `/app/actividades` | Entregar tareas |
| `/app/prueba` | Ingresar código de prueba |
| `/app/horarios` | Horarios del grupo |
| `/app/progreso` | Kardex y PDF |
| `/app/asistencia` | Ayuda / WhatsApp |

---

## 8. Cursos y grupos

El estudiante **no** ve 16 chips sueltos. Ve 3 o 4 **materias** (`SUBJECTS` en `teacher.js`):

| Materia | Refuerzos interactivos | Quién la ve |
|---|---|---|
| Programación | teoría, práctica, lecturas, programación 2 | Inicial y regular |
| Matemática | Combinatoria, Teoría de números, Geometría, Álgebra (sílabo olímpico FIF Learning) | Inicial y regular |
| Música | teoría, práctica, lecturas | Inicial y regular |
| Arte | teoría, práctica, lecturas, historia | **Solo inicial / nivelación** |

`inicial` en el código se trata como `under12`; `regular` como `over12` (`courseAgeKey` en `courses.js`).

Para añadir un refuerzo interactivo: créalo en `courses.js`, agrégalo al array `COURSES` y enlázalo en `SUBJECTS` de `teacher.js`. Para un minijuego HTML, copia el archivo a `public/games/` y regístralo en `src/data/games.js`. Para quitar Arte del regular no hace falta tocar cada pantalla: basta con que esos cursos tengan `ageGroups: ["under12"]`.

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
