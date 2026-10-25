# FIF Learning y Fundación Integral de Familias

Plataforma web de la **Fundación Integral de Familias (FIF)** en Ecuador. Incluye el sitio institucional (landing con scroll y animaciones) y **FIF Learning**, el portal digital de refuerzo académico para estudiantes y docentes.

Sitio publicado: https://www.fundacionfif.org (Cloudflare Pages)

> **Estado actual:** en producción solo se publica el sitio institucional (landing, donaciones, inscripciones y legales). La plataforma FIF Learning está apagada con `VITE_ENABLE_PLATFORM=false` hasta migrarla a Supabase. Para trabajar en ella en local, crea `.env.local` con `VITE_ENABLE_PLATFORM=true`.
> Guías: [docs/DESPLIEGUE.md](docs/DESPLIEGUE.md) (Cloudflare Pages + dominio) y [docs/PLAN-SUPABASE.md](docs/PLAN-SUPABASE.md).

Repositorio en GitHub: [https://github.com/FIF-programacion/paginaFIF.git](https://github.com/FIF-programacion/paginaFIF.git)

Es una aplicación de una sola página (SPA) que corre en el navegador: landing de la fundación, portal de aprendizaje, registro, cursos gamificados, zona de docentes, donaciones, certificados PDF y páginas legales.

---

## 1. Qué tecnologías se usan (y cuáles no)

| Tecnología | ¿Se usa? | Para qué |
|---|---|---|
| **HTML** | Sí | Cascarón (`index.html`) y el marcado que React genera |
| **CSS** | Sí | Diseño global en `src/index.css` y la landing institucional en `src/pages/Landing.css` |
| **JavaScript** | Sí | Lógica, estado, ejercicios, PDF, almacenamiento |
| **React 19** | Sí | Componentes, pantallas y estado de la interfaz |
| **React Router 7** | Sí | Rutas (`/`, `/fif-learning`, `/app/cursos`, `/dona/...`, `/profesores`, `/legal/...`) |
| **Vite 7** | Sí | Servidor de desarrollo, empaquetado y recarga en caliente |
| **Framer Motion** | Sí | Kinetic text, split + flip de eventos, revelados al scroll |
| **jsPDF** | Sí | Certificado descargable |
| **Fontsource (Fredoka y Nunito)** | Sí | Tipografías empaquetadas en el sitio |
| **Web Crypto (navegador)** | Sí | Resumen SHA-256 de la contraseña |
| **localStorage** | Sí | Cuenta, progreso, pruebas y avisos en este dispositivo |
| **Git / GitHub** | Sí | Control de versiones y remoto `FIF-WEB` |
| **Java** | **No** | Este proyecto **no usa Java**. Usa **JavaScript**. |

No hay backend ni base de datos. Los datos de la plataforma educativa viven en el navegador. Las donaciones se coordinan por WhatsApp; no hay cobro en línea.

---

## 2. GitHub: clonar, commit y push (Bash)

Remoto: `https://github.com/FIF-programacion/paginaFIF.git`

Requisitos: Git instalado y una cuenta de GitHub con acceso al repositorio. En la primera subida GitHub pedirá autenticación (navegador, `gh auth login` o un personal access token).

### 2.1 Primera vez: crear el repositorio local y subirlo

Desde la carpeta del proyecto (`FIF LEARNING WEB`):

```bash
cd "/c/Users/ariel/OneDrive/Documentos/Fundacion/FIF LEARNING WEB"

git init
git add .
git status
git commit -m "Sitio institucional FIF y portal FIF Learning"
git branch -M main
git remote add origin https://github.com/FIF-programacion/paginaFIF.git
git push -u origin main
```

Si `git remote add` dice que `origin` ya existe:

```bash
git remote set-url origin https://github.com/FIF-programacion/paginaFIF.git
git push -u origin main
```

Si el remoto de GitHub ya tiene un commit inicial (README automático) y el push es rechazado:

```bash
git pull origin main --allow-unrelated-histories
git push -u origin main
```

### 2.2 Cada vez que haya cambios (commit y push)

```bash
git status
git add .
git commit -m "Describe el cambio"
git push
```

Ejemplos de mensaje:

```bash
git commit -m "Ajustar alineación de Nosotros y espacio entre secciones"
git commit -m "Corregir flip de eventos y wordmark del portal"
```

Para añadir solo archivos concretos:

```bash
git add README.md src/pages/Landing.jsx src/pages/Landing.css
git commit -m "Documentar landing y actualizar Nosotros"
git push
```

### 2.3 Ver historial y remoto

```bash
git log --oneline
git remote -v
```

### 2.4 Clonar el repo en otra máquina

```bash
git clone https://github.com/FIF-programacion/paginaFIF.git
cd paginaFIF
npm install
npm run dev
```

### 2.5 Qué no se versiona (`.gitignore`)

- `node_modules/` — se regenera con `npm install`
- `dist/` — se regenera con `npm run build`
- `_design-preview/` y `_design-pdfs/` — temporales de diseño
- `.DS_Store` — metadatos de macOS

No hay `.env` con claves. Las cuentas de estudiantes y docentes se guardan solo en el navegador.

---

## 3. Cómo arrancar el proyecto

Requisitos: **Node.js** y **npm**.

```bash
npm install
npm run dev
```

La app queda en `http://127.0.0.1:5173/`.

| Script | Qué hace |
|---|---|
| `npm run dev` | Vite con recarga automática |
| `npm run build` | Genera `dist/` para publicar |
| `npm run preview` | Sirve `dist/` en local |

### 3.1 Accesos de prueba

Solo existen con la plataforma encendida (`VITE_ENABLE_PLATFORM=true`, en local); se eliminarán al migrar a Supabase. Estas cuentas se crean solas la primera vez que se abre la app en un navegador (`src/data/staff.js`). Las claves **no** se muestran en las pantallas de login. Si ya había datos en `localStorage` y faltan estas cuentas, recarga la página: el seed las vuelve a insertar.

No hay estudiante de demostración: hay que crear uno en `/registro`.

| Rol | Entrada | Correo | Contraseña |
|---|---|---|---|
| Coordinación (admin) | `/admin` | `coordinacion@fif.org` | `FIFCoord2026` |
| Voluntario temporal 1 | `/profesores` | `voluntario1@fif.org` | `FIFVoluntario2026` |
| Voluntario temporal 2 | `/profesores` | `voluntario2@fif.org` | `FIFVoluntario2026` |
| Voluntario temporal 3 | `/profesores` | `voluntario3@fif.org` | `FIFVoluntario2026` |

Dónde está el acceso de coordinación (discreto):

- Pie del sitio: enlace **Coordinación**
- Landing `/`: en Contacto, texto bajo el RUC
- Portal `/fif-learning`: al lado de **Docentes**

Docentes y coordinación no comparten login. Un admin no entra por `/profesores`; un docente no entra por `/admin`. Tras iniciar sesión, coordinación va a `/admin/panel` y el docente a `/profesores/panel`.

---

## 4. Dos entradas: fundación y portal

| Ruta | Qué es |
|---|---|
| `/` | Landing institucional de la **Fundación Integral de Familias** |
| `/fif-learning` | Landing **FIF Learning**: portal de aprendizaje, registro e inicio de sesión |
| `/login` y `/registro` | Acceso de estudiantes (se entra desde FIF Learning) |
| `/inscripciones` | Formulario público de inscripción (5 pasos) |
| `/profesores` | Acceso de docentes |
| `/admin` | Acceso de coordinación (escondido; ver 3.1) |
| `/dona/individual` | Formulario de donación individual |
| `/dona/paquetes` | Paquetes para organizaciones |

El menú lateral de la fundación incluye **FIF Learning**. Desde esa sección se entra al portal. Login y registro siguen en las mismas rutas de antes.

Video del hero: `public/videos/videoInicio.mp4` (cubre todo el recuadro, `object-fit: cover`). Fotos de la landing: `public/images/Image1.jpg` … `Image5.jpg`.

---

## 5. Landing institucional (`/`): qué hay ahora

Fondo blanco, menú lateral de líneas (hover muestra el título), chip **Dona hoy**. Scroll de página suavizado y más lento (`src/hooks/useSlowPageScroll.js`).

| Sección | Qué hace |
|---|---|
| **Inicio** | Recuadro redondeado con `videoInicio.mp4` a fill. Título *Fundación Integral de Familias* en Nunito (tres líneas). Al hacer scroll el recuadro se encoge al centro y desaparece. |
| **Nosotros** | Zigzag con foto: Quiénes somos (texto izq. / foto der.), Misión (foto izq. / texto der.), Nuestro trabajo, Visión. El texto entra con **Kinetic Text Reveal** (palabras, blur, dirección). |
| **Proyectos** | Título centrado y carrusel infinito tipo fisheye de fotos de talleres. |
| **Eventos** | **Scroll Split Card**: 1) una imagen completa, 2) se parte en tres, 3) las tarjetas se voltean y muestran los tres eventos (Soul Concert, Modern Ballet, Album Launch). *More info* va a contacto; *Register Now* abre WhatsApp. |
| **Dona ahora** | Franja dorada `DONA AHORA` + tarjetas de donación individual y organización. |
| **Colaboradores** | Carrusel continuo de logos (USFQ PASEC, Mil Travesuras, K-School, ALEKS, Donkey Burritos). |
| **Multimedia** | Enlaces a podcast *Conversando con los Profes* y canal de YouTube. |
| **FIF Learning (portal)** | Recuadro con foto de taller y wordmark de colores **FIF LEARNING**. Botón al portal `/fif-learning`. |
| **Contacto** | Tres tarjetas: datos, horarios y redes. |

Horarios: martes y jueves 3:00 pm – 5:00 pm; sábado 8:00 am – 12:00 pm.

Referencias de animación: [Kinetic Text Reveal](https://componentry.dev/docs/components/kinetic-text-reveal) y [Scroll Split Card](https://componentry.dev/docs/components/scroll-split-card).

---

## 6. Estructura de carpetas

```text
FIF LEARNING WEB/
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── .gitignore
├── README.md
├── Images/                 ← originales de trabajo
├── public/
│   ├── images/             ← logo, ilustraciones, foto de talleres, aliados
│   │   └── allies/         ← logos de colaboradores
│   └── videos/             ← videoInicio.mp4
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css           ← estilos del portal, onboarding y app
│   ├── hooks/
│   │   └── useSlowPageScroll.js
│   ├── components/
│   ├── context/
│   ├── data/
│   ├── pages/
│   │   ├── Landing.jsx     ← sitio de la fundación
│   │   ├── Landing.css
│   │   ├── FifLearning.jsx ← portal de aprendizaje
│   │   ├── DonateIndividual.jsx
│   │   ├── DonatePackages.jsx
│   │   ├── exercises/
│   │   └── legal/
│   └── utils/
├── dist/
└── node_modules/
```

### 6.1 Raíz

| Archivo | Qué maneja |
|---|---|
| `index.html` | Idioma `es`, título, favicon, `#root` y carga de `src/main.jsx` |
| `package.json` | Dependencias y scripts `dev` / `build` / `preview` |
| `package-lock.json` | Versiones exactas de npm |
| `vite.config.js` | Plugin de React, puerto `5173`, host local |
| `.gitignore` | Excluye `node_modules`, `dist` y temporales |

### 6.2 `public/`

Se sirve en la URL raíz. Ejemplo: `public/images/LOGO_COLOR.png` → `/images/LOGO_COLOR.png`.

Incluye el logo, ilustraciones, `Image1.jpg`–`Image5.jpg` para la landing y los recortes de colaboradores en `public/images/allies/`.

### 6.3 `Images/`

Origen de ilustraciones. La web en ejecución lee `public/images/`. Si se cambia un personaje, hay que copiarlo también a `public/images/` con el nombre que usa el código.

### 6.4 `src/`

| Carpeta / archivo | Qué maneja |
|---|---|
| `src/main.jsx` | Arranque: fuentes, CSS, `BrowserRouter`, montaje en `#root` |
| `src/App.jsx` | Rutas y aviso de cookies |
| `src/index.css` | Portal FIF Learning, dashboard, ejercicios, legal |
| `src/pages/Landing.css` | Sitio institucional |
| `src/hooks/` | Scroll lento de la landing |
| `src/components/` | Piezas reutilizables de interfaz |
| `src/context/` | Estado global (cuenta, progreso, pruebas) |
| `src/data/` | Cursos, textos de ayuda y datos de la organización |
| `src/pages/` | Una pantalla por archivo |
| `src/utils/` | PDF, hash, parser de pruebas |

---

## 7. HTML, CSS y React

Hay un solo HTML de verdad: `index.html`. React construye el resto. Los `.jsx` mezclan JavaScript con etiquetas; Vite las transforma.

El diseño del **portal** está en `src/index.css`. El de la **fundación** está en `src/pages/Landing.css`. No hay Tailwind: son clases clásicas (`.btn-green`, `.lp-hero`, `.app-nav`).

Colores institucionales: azul `#1e5bb8` (logo), textos negro o azul, dorado `#e8c36a` / `#f0c014` para DONA AHORA y botones de registro a eventos. Fondo de la landing: blanco. Títulos de Nosotros en Fredoka azul; título de Inicio en Nunito.

Wordmark **FIF LEARNING**: cada letra con el color de marca (azul, verde, teal, cian, púrpura, magenta, rojos).

---

## 8. Componentes (`src/components`) y hooks

| Archivo | Función |
|---|---|
| `Brand.jsx` | Wordmark **FIF LEARNING** (letras de color) y logo de la fundación |
| `AppHeader.jsx` | Cabecera del estudiante: puntos, menú, cierre de sesión |
| `AppShell.jsx` | Envuelve `/app/*`: exige cuenta de estudiante |
| `CourseCover.jsx` | Portadas ilustradas de cursos |
| `SiteFooter.jsx` | Pie: cada ítem en su línea, enlaces a `/` y `/fif-learning` |
| `LegalLayout.jsx` | Plantilla de páginas legales |
| `CookieNotice.jsx` | Aviso de almacenamiento estrictamente necesario |
| `KineticText.jsx` | Reveal por palabras, blur y dirección (Nosotros) |
| `VelocityText.jsx` | Franja DONA AHORA en movimiento |
| `ScrollSplitEvents.jsx` | Imagen unificada → tres paneles → volteo 3D a tarjetas de evento |
| `hooks/useSlowPageScroll.js` | Controla la velocidad del scroll en la landing |

---

## 9. Datos (`src/data`)

| Archivo | Función |
|---|---|
| `org.js` | Nombre, país, correo, teléfono, WhatsApp, redes, grupos de edad |
| `courses.js` | Materias, lecciones y ejercicios por edad |
| `content.js` | Reexporta cursos; tutoriales y textos de Asistencia |

Contacto institucional: `fundacionintegralfif@gmail.com`, `+593 99 833 4440` (WhatsApp `593998334440`).

Redes: Facebook, TikTok, LinkedIn, Instagram, YouTube y podcast en Spotify.

Para añadir un ejercicio: editar `courses.js` y asignarlo al grupo de edad.

---

## 10. Estado global (`src/context/GameContext.jsx`)

Guarda en `localStorage` la clave `fif-learning-state-v2`:

- Cuentas (estudiante o docente)
- Sesión activa
- Progreso, puntos, racha, insignias
- Pruebas de docentes y calificaciones
- Mensajes de asistencia (solo en el dispositivo)

Expone: `register`, `login`, `logout`, `completeLesson`, `courseStats`, `saveTest`, `saveAttempt`.

El aviso de cookies usa `fif-learning-notice-v1`.

---

## 11. Utilidades (`src/utils`)

| Archivo | Función |
|---|---|
| `security.js` | SHA-256 de la contraseña y códigos `FIF-XXXXX` |
| `parseTestCode.js` | Interpreta `TITULO` / `PREGUNTA` / `A)` / `CORRECTA` |
| `certificate.js` | PDF de finalización de curso |

---

## 12. Pantallas (`src/pages`) y rutas

### Públicas — fundación

| Ruta | Archivo | Qué hace |
|---|---|---|
| `/` | `Landing.jsx` | Sitio institucional completo (ver sección 5) |
| `/dona/individual` | `DonateIndividual.jsx` | Frecuencia, monto y envío por WhatsApp |
| `/dona/paquetes` | `DonatePackages.jsx` | Paquetes Taller, Aula, Programa, Comunidad |

### Públicas — portal FIF Learning

| Ruta | Archivo | Qué hace |
|---|---|---|
| `/fif-learning` | `FifLearning.jsx` | Portada del portal, método, cursos, registro |
| `/login` | `Login.jsx` | Inicio de sesión |
| `/registro` | `Register.jsx` | Alta de estudiante, edad, consentimientos |
| `/verificar` | `Verify.jsx` | Confirmación de datos |
| `/tutorial/:step` | `Tutorial.jsx` | Tres diapositivas de uso |
| `/bienvenida` | `Welcome.jsx` | Mensaje de bienvenida |
| `/profesores` | `TeacherLogin.jsx` | Acceso o alta de docente |
| `/profesores/panel` | `TeacherPanel.jsx` | Crear pruebas y ver notas |
| `/legal/privacidad` | `legal/LegalPages.jsx` | Política de privacidad |
| `/legal/terminos` | igual | Términos y condiciones |
| `/legal/cookies` | igual | Cookies y almacenamiento |
| `/legal/reembolsos` | igual | Reembolsos (hoy no hay pagos en línea) |
| `/legal/avisos` | igual | Riesgos y cumplimiento |
| `/legal/contacto` | igual | Contacto |

Los enlaces “volver” del portal apuntan a `/fif-learning`, no a `/`.

### Estudiante (`/app`, protegido)

| Ruta | Archivo | Qué hace |
|---|---|---|
| `/app/cursos` | `Dashboard.jsx` | Cursos en progreso |
| `/app/progreso` | `Progress.jsx` | Kardex y certificado |
| `/app/recursos` | `Resources.jsx` | Cursos de esa edad |
| `/app/asistencia` | `Help.jsx` | Ayuda y WhatsApp |
| `/app/prueba` | `TakeTest.jsx` | Prueba con código de docente |
| `/app/curso/:id` | `CourseMap.jsx` | Mapa de lecciones |
| `/app/curso/:id/leccion/:n` | `exercises/ExercisePage.jsx` | Matching, matemáticas o código |
| `/app/curso/:id/completado` | `CourseComplete.jsx` | Felicitación + PDF |

### Ejercicios

| Archivo | Tipo |
|---|---|
| `MatchingExercise.jsx` | Relacionar frases |
| `TimedMathExercise.jsx` | Operaciones con temporizador |
| `DeductorExercise.jsx` | Completar bloques de código |

---

## 13. Cómo se relacionan las piezas

```text
index.html
    → main.jsx (React + Router + CSS + fuentes)
        → App.jsx (rutas)
            → /                 Landing de la fundación
            → /fif-learning     Portal FIF Learning
            → /dona/*           Donaciones (WhatsApp)
            → /app/*            Estudiante (GameContext + localStorage)
            → /profesores       Docentes
            → public/images     Ilustraciones y aliados
            → utils/certificate.js  PDF al completar un curso
```

1. La persona llega a la fundación (`/`) o entra al portal (`/fif-learning`).
2. El estudiante se registra, elige edad y practica en el mapa de cursos.
3. Cada lección actualiza el progreso en `GameContext`.
4. Al completar un curso puede descargar un PDF de reconocimiento (no es título oficial).
5. El docente publica una prueba; el estudiante la toma con el código.
6. Quien dona elige monto o paquete y el mensaje se abre en WhatsApp.

---

## 14. Librerías (`package.json`)

**App**

- `react` / `react-dom` — interfaz
- `react-router-dom` — navegación
- `framer-motion` — animaciones de la landing
- `jspdf` — PDF
- `@fontsource/fredoka` y `@fontsource/nunito` — fuentes locales

**Desarrollo**

- `vite` — bundler y servidor
- `@vitejs/plugin-react` — JSX y Fast Refresh

No hay analítica de terceros.

---

## 15. Convención al editar

- **Nueva pantalla:** archivo en `src/pages` y ruta en `App.jsx`.
- **Cambio de la landing institucional:** `src/pages/Landing.jsx` y `src/pages/Landing.css`.
- **Cambio del portal FIF Learning:** `src/pages/FifLearning.jsx` y `src/index.css`.
- **Nuevo curso o ejercicio:** `src/data/courses.js`.
- **Nueva ilustración:** copiar a `public/images/` y usar `/images/nombre.ext`.
- **Datos de la fundación o legales:** `src/data/org.js` y `src/pages/legal/LegalPages.jsx`.
- **Video del hero:** `public/videos/videoInicio.mp4`.
- **Fotos de la landing:** `public/images/Image1.jpg` a `Image5.jpg`.
- **Subir cambios:** `git add` → `git commit` → `git push` (sección 2).

Antes de un lanzamiento con pagos reales hay que conectar un procesador; hoy el botón de donar abre WhatsApp con el monto o el paquete elegido.
