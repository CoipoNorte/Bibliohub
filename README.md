# 📚 [Bibliohub · La Biblioteca del Coipo](https://coiponorte.github.io/Bibliohub/)

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-4-38BDF8?logo=tailwindcss&logoColor=white)
![Pages](https://img.shields.io/badge/GitHub%20Pages-%2FBibliohub%2F-222?logo=github)

**[➜ Ver la biblioteca en línea · coiponorte.github.io/Bibliohub](https://coiponorte.github.io/Bibliohub/)**

Catálogo **vivo** de todos mis proyectos públicos de GitHub, encuadernado como
una biblioteca personal: fichas catalográficas numeradas, sellos, grano de
papel y cubiertas tipográficas. El sitio se sincroniza solo con la API de
GitHub en cada carga — si publico un repo nuevo, aparece en la estantería sin
tocar el código.

---

## ✨ Características

- **Sincronización en vivo** — lee `api.github.com/users/CoipoNorte/repos` al
  abrir; muestra repos nuevos, descripciones, estrellas y última actividad.
  Indicador de estado `Sync GitHub` / `Archivo local` y botón de re-sync manual.
- **Respaldo a prueba de apagones** — caché en `localStorage` (la última
  copia buena) + snapshot embebido si la API no responde. La biblioteca siempre abre.
- **Filtros de biblioteca** — búsqueda por texto, orden **A→Z / Z→A**, por
  **fecha** (recientes / antiguos), por **estrellas**, interruptor **"Con imagen"**
  y chips por **lenguaje** con contadores.
- **Dos vistas** — *fichas* (tarjetas catalográficas) e *índice* (lista de estantería).
- **Ficha completa por proyecto** — portada, galería de capturas (si el README
  las tiene), datos bibliográficos (clasificación, incorporación, última
  revisión, licencia, volumen), link a GitHub + demo en vivo, y *préstamo de
  ejemplar* (`git clone` con copia en 1 clic).
- **Portadas reales** — detectadas de los READMEs; las piezas sin imagen reciben
  una **cubierta tipográfica generativa** (5 patrones × 6 paletas, deterministas).
- **Escaneo perezoso** — al abrir una ficha sin imagen conocida, se analiza su
  README en el momento buscando capturas/logos y se guarda en caché.
- **Detalles** — teclado (`/` busca, `Esc` cierra, `←/→` cambia de ficha),
  imágenes en duo-tono que cobran color al hover, marquee de lenguajes,
  sello circular giratorio, diseño responsive.

## 🔎 Los filtros, explicados

| Control | Qué hace |
| --- | --- |
| Buscador (`/`) | Coincide nombre, descripción, lenguaje, tópicos y año |
| Recientes / Antiguos | Ordena por última actividad (`pushed_at`) |
| A→Z / Z→A | Orden alfabético español (`localeCompare es`) |
| Estrellas | Los más estrellados primero |
| Con imagen | Solo piezas con captura/logo conocido |
| Clasificación | Chips por lenguaje (TS, JS, Python, Rust…) |

## 🖼️ De dónde salen las imágenes

1. **Mapa curado** (`src/data/meta.ts`) — portadas y galerías revisadas a mano
   (screenshots `view.png`, logos, og images…).
2. **Escaneo perezoso del README** — `GET /repos/{repo}/readme`, se extraen las
   imágenes `![alt](url)` / `<img>` (descartando badges de shields) y se
   resuelven rutas relativas a `raw.githubusercontent.com`. Se cachea por navegador.
3. **Cubierta generativa** — si no hay nada, se dibuja una portada tipográfica
   con las iniciales del proyecto. Ningún libro queda sin lomo.

## 🛠️ Stack

| Capa | Tecnología |
| --- | --- |
| Framework | React 19 + TypeScript (strict) |
| Bundler | Vite 7 + `vite-plugin-singlefile` (todo en un `index.html`) |
| Estilos | Tailwind CSS 4 (`@theme`, sin config) |
| Animación | framer-motion (filtros con `layout`, ficha con spring) |
| Iconos | lucide-react |
| Datos | GitHub REST API + caché `localStorage` |
| Fuentes | Fraunces · Space Grotesk · JetBrains Mono |
| Deploy | gh-pages (rama `gh-pages`, build single-file) |

Sin SSR ni code-splitting por diseño: con *singlefile* el sitio entero viaja en
un único `index.html`, así que GitHub Pages lo sirve sin configurar rutas.

## 📁 Estructura

```
Bibliohub/
├─ deploy.bat              ← config + build + deploy automáticos
├─ index.html              ← título, fuentes, favicon SVG
├─ vite.config.ts          ← base "/Bibliohub/" (la pone deploy.bat)
├─ src/
│  ├─ App.tsx              ← estado global: filtros, sync, ficha
│  ├─ index.css            ← tema papel/tinta, grano, sellos
│  ├─ data/meta.ts         ← portadas curadas + snapshot offline
│  ├─ lib/github.ts        ← API, caché, escaneo de READMEs, orden/filtros
│  └─ components/
│     ├─ Hero.tsx          ← titular, sello giratorio, estadísticas
│     ├─ Controls.tsx      ← buscador, orden, "Con imagen", lenguajes, vistas
│     ├─ Cover.tsx         ← portada real (con respaldo) o cubierta generativa
│     ├─ ProjectCard.tsx   ← ficha en cuadrícula
│     ├─ ProjectRow.tsx    ← fila del índice
│     ├─ DetailModal.tsx   ← ficha catalográfica completa + galería
│     ├─ Footer.tsx        ← marquee de lenguajes + créditos
│     └─ icons.tsx         ← GitHub mark (lucide ya no lo trae)
└─ dist/                   ← build (lo publica gh-pages)
```

## 🚀 Desarrollo local

```bash
npm install
npm run dev      # servidor con hot-reload
npm run build    # compila a dist/ (index.html autocontenido)
npm run preview  # previsualiza la build
```

## 📦 Despliegue en GitHub Pages

El repositorio vive en
[github.com/CoipoNorte/Bibliohub](https://github.com/CoipoNorte/Bibliohub).
Hay **dos caminos**:

### Opción A — doble clic a `deploy.bat` (recomendada)

El script es auto-suficiente e idempotente. Hace los 6 pasos solo:

1. Verifica Node.js y npm.
2. Añade a `package.json` los scripts `predeploy` / `deploy`.
3. Escribe `base: "/Bibliohub/"` en `vite.config.ts` (si ya existe, la refresca).
4. Instala `gh-pages` si no está como devDependency.
5. `npm install` → `npm run build` (genera `dist/`).
6. Inicializa git si falta, conecta `origin` con el repo, sube `main`
   (si puede) y publica `dist/` en la rama **`gh-pages`**.

> Si es la primera vez con git en la máquina, antes hay que identificarse:
> ```bash
> git config --global user.name  "Tu Nombre"
> git config --global user.email "tu@email.com"
> ```

### Opción B — a mano (o macOS/Linux)

```bash
npm install
npm i -D gh-pages
npm run build
npx gh-pages -d dist
```

### Activa Pages (solo una vez)

1. Abre **[Settings → Pages](https://github.com/CoipoNorte/Bibliohub/settings/pages)**.
2. **Source:** rama `gh-pages`, carpeta `/ (root)` → **Save**.
3. Espera 1–2 minutos y abre **https://coiponorte.github.io/Bibliohub/**

### Solución: "me sale la página en blanco"

| Síntoma | Causa | Solución |
| --- | --- | --- |
| En blanco total | Pages apunta a `main` en vez de `gh-pages` | Settings → Pages → Source: rama **`gh-pages`** / **(root)** |
| 404 al abrir la URL | El despliegue aún no propaga | Espera 1–2 min y recarga forzada con **Ctrl+F5** |
| Datos viejos | Caché del navegador/Pages | Ctrl+F5; la app re-sincroniza sola al cargar |

> La build usa `vite-plugin-singlefile`, así que todo (JS + CSS) viaja dentro
> del `index.html`: en cuanto Pages sirva la rama correcta, funciona sin tocar
> nada más.

## ⚠️ Límite de la API de GitHub

Sin token, la API permite **60 peticiones/hora por IP**. El sitio gasta **1 por
carga** + 1 por cada README que escanea por primera vez (luego usa caché). Si
se agota el límite, nada se rompe: la biblioteca pasa a *Archivo local* mostrando
la última copia sincronizada (o el snapshot embebido).

## 📄 Licencia

MIT — cataloga, comparte y remezcla libremente.
Hecho con papel, tinta y React desde Iquique, Chile. 🦫
