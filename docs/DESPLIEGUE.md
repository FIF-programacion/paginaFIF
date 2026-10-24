# Despliegue en Cloudflare Pages + dominio

Objetivo de esta fase: publicar **solo el sitio institucional** (landing, donaciones, inscripciones y páginas legales). La plataforma FIF Learning queda apagada hasta migrar a Supabase (ver [PLAN-SUPABASE.md](PLAN-SUPABASE.md)).

## Qué se publica

| Ruta | Estado |
|---|---|
| `/`, `/dona/*`, `/inscripciones`, `/legal/*` | Públicas |
| `/fif-learning`, `/login`, `/profesores`, `/admin`, `/app/*`… | Apagadas: redirigen a `/` |

El interruptor es la variable `VITE_ENABLE_PLATFORM` (ver `.env.example`). Con `false` (o sin definir), el código de la plataforma ni siquiera entra al bundle, así que las cuentas semilla no quedan expuestas.

Para trabajar en la plataforma en local, crea `.env.local` con `VITE_ENABLE_PLATFORM=true` y ejecuta `npm run dev`.

## 1. Crear el proyecto en Cloudflare Pages

Requisito: una cuenta de Cloudflare y acceso de administrador al repo `ArielBourgeat/FIF-WEB` en GitHub (si no eres el dueño, el dueño debe autorizar la app de Cloudflare o hacer este paso).

1. Cloudflare → **Workers & Pages** → **Create** → pestaña **Pages** → **Connect to Git**.
2. Elige el repo `FIF-WEB` y la rama `main`.
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

## 3. Después de conectar el dominio

- En `index.html`, añadir `og:url` y `og:image` con URL absoluta (`https://dominio/images/...`) para que el enlace se vea bien en WhatsApp y redes.
- Actualizar el enlace del README.
- Decidir qué hacer con el despliegue de Vercel (`fif-web-org.vercel.app`): desconectarlo o dejarlo solo para vistas previas, para no tener dos sitios públicos.

## Medios

- El video del inicio se convirtió de HEVC (no se reproducía en Firefox ni en varios Chrome de Windows) a H.264, 1080×1920, sin audio: de 35,7 MB a 5,6 MB. El original sigue en `Images/Videos/`.
- Cloudflare Pages no acepta archivos de más de **25 MiB**. Videos más largos: subir a YouTube o a Cloudflare R2.
- Las fotos nuevas deben subirse ya optimizadas: ancho máximo 1920 px, JPEG calidad ~78 (o WebP), idealmente < 300 KB.
