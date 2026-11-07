# Despliegue en Cloudflare Pages + dominio

Objetivo de esta fase: publicar el **sitio institucional** (landing, donaciones, inscripciones y páginas legales) en `https://www.fundacionfif.org`. El portal de estudiantes FIF Learning queda apagado en producción hasta migrar a Supabase (ver [PLAN-SUPABASE.md](PLAN-SUPABASE.md)). Coordinación (`/admin`) sí permanece disponible.

## Qué se publica

| Ruta | Estado |
|---|---|
| `/`, `/dona/*`, `/inscripciones`, `/legal/*` | Públicas |
| `/admin`, `/admin/panel` | Coordinación, siempre disponible |
| `/fif-learning`, `/login`, `/profesores`, `/app/*` | Encendidas solo con `VITE_ENABLE_PLATFORM=true`. En el sitio publicado redirigen a `/` |

El interruptor es la variable `VITE_ENABLE_PLATFORM` (ver `.env.example`). En Cloudflare Pages debe quedar en `false`. El código de la plataforma se carga, pero las rutas de estudiantes y equipo redirigen a `/`.

Para trabajar FIF Learning en local (portal, login, clases, minijuegos): crea `.env.local` con `VITE_ENABLE_PLATFORM=true` y ejecuta `npm run dev`. Esa variable no se sube a git.

## 1. Crear el proyecto en Cloudflare Pages

Requisito: una cuenta de Cloudflare y acceso de administrador al repo `FIF-programacion/paginaFIF` en GitHub.

1. Cloudflare → **Workers & Pages** → **Create** → pestaña **Pages** → **Connect to Git**.
2. Elige el repo `paginaFIF` y la rama `main`.
3. Configuración de build:
   - Framework preset: **Vite** (o React (Vite)).
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Variables de entorno (Production): `VITE_ENABLE_PLATFORM` = `false`
   - La versión de Node la toma del archivo `.node-version` (22).
4. **Save and Deploy**. Al terminar tendrás una URL `https://<proyecto>.pages.dev`.
5. Revisa en esa URL: video del inicio, menú lateral, donaciones (abre WhatsApp), inscripción y páginas legales. Prueba también entrar directo a `/legal/privacidad` y recargar: debe cargar (Pages sirve `index.html` en todas las rutas porque no hay `404.html`).

Cada push a `main` vuelve a desplegar. Las ramas y PR generan URLs de vista previa.

`public/_headers` define caché larga para `/assets/*` y cabeceras básicas de seguridad.

## 2. Conectar el dominio

En el proyecto de Pages → **Custom domains** → **Set up a custom domain**.

**Si el dominio aún no existe:** se puede comprar en Cloudflare Registrar (precio de costo para `.org`, `.com`…). Queda conectado automáticamente. Los `.ec` se compran en NIC.ec u otro registrador local.

**Si el dominio ya existe en otro registrador:**

- **Dominio raíz** (`fundacion.org`): hay que agregar el dominio como sitio en Cloudflare (plan Free) y cambiar los **nameservers** en el registrador por los dos que indica Cloudflare. Puede tardar de minutos a 24 h (los `.ec` suelen tardar más).
- **Solo subdominio** (`www.fundacion.org`): basta con un registro **CNAME** en el DNS actual apuntando a `<proyecto>.pages.dev`.

El certificado HTTPS se emite solo. Agrega tanto `dominio` como `www.dominio` y redirige uno al otro (Rules → Redirect Rules).

## 3. Estado actual del dominio

- Dominio principal: `https://www.fundacionfif.org` (comprado en Cloudflare Registrar).
- `fundacionfif.org` redirige con 301 a `www` mediante una Redirect Rule (`https://fundacionfif.org/*` → `https://www.fundacionfif.org/${1}`, conservando parámetros).
- Vista previa para WhatsApp y redes: `public/images/og-image.jpg` (1200×630) y las etiquetas `og:*` de `index.html`. Si se cambia la imagen, WhatsApp y Facebook la guardan en caché unos días; en Facebook se fuerza con el [Sharing Debugger](https://developers.facebook.com/tools/debug/).
- El sitio público se publica solo desde Cloudflare Pages. No hay otro hosting de este proyecto.

## Medios

- El video del inicio se convirtió de HEVC (no se reproducía en Firefox ni en varios Chrome de Windows) a H.264, 1080×1920, sin audio: de 35,7 MB a 5,6 MB. El original sigue en `Images/Videos/`.
- Cloudflare Pages no acepta archivos de más de **25 MiB**. Videos más largos: subir a YouTube o a Cloudflare R2.
- Las fotos nuevas deben subirse ya optimizadas: ancho máximo 1920 px, JPEG calidad ~78 (o WebP), idealmente < 300 KB.
