// ─────────────────────────────────────────────────────────────
//  Metadatos catalográficos curados para los repositorios de
//  CoipoNorte. `img` = portada principal, `fb` = respaldo (logo),
//  `gallery` = piezas visuales adicionales del README.
// ─────────────────────────────────────────────────────────────

export interface RepoMeta {
  img?: string;
  fb?: string;
  gallery?: string[];
}

const R = (path: string) => `https://raw.githubusercontent.com/CoipoNorte/${path}`;

export const REPO_META: Record<string, RepoMeta> = {
  Raton: { img: R("Raton/HEAD/public/og.png") },
  buscaminas: { img: R("buscaminas/HEAD/public/view.jpeg") },
  "Coipo-Chess-offline": { img: R("Coipo-Chess-offline/HEAD/public/favicon.png") },
  "fake-shopping": { img: R("fake-shopping/HEAD/public/fake-shopping.png") },
  BoomSweeper: { img: R("BoomSweeper/HEAD/public/view.png") },
  SnakeGame: {
    img: R("SnakeGame/HEAD/doc/menu-snake-game.jpeg"),
    gallery: [
      R("SnakeGame/HEAD/doc/menu-snake-game.jpeg"),
      R("SnakeGame/HEAD/doc/reiniciar-snake-game.jpeg"),
      R("SnakeGame/HEAD/doc/snake-en-accion.jpeg"),
    ],
  },
  CoipyStudio: { img: R("CoipyStudio/HEAD/view.jpeg") },
  "Coipo-Sushi": { img: R("Coipo-Sushi/HEAD/public/view.png") },
  pikaflor: { img: R("pikaflor/HEAD/assets/Picaflor.png") },
  "churrin-timer": {
    img: R("churrin-timer/HEAD/assets/view.png"),
    fb: R("churrin-timer/HEAD/assets/Churrin.png"),
  },
  picaflor: {
    img: R("picaflor/HEAD/assets/view.png"),
    fb: R("picaflor/HEAD/assets/Picaflor.png"),
  },
  "condor-desktop": {
    img: R("condor-desktop/HEAD/assets/view.png"),
    fb: R("condor-desktop/HEAD/assets/Condor.png"),
  },
  churrin: {
    img: R("churrin/HEAD/doc/image1.png"),
    fb: R("churrin/HEAD/assets/Churrin.png"),
    gallery: [R("churrin/HEAD/doc/image1.png"), R("churrin/HEAD/doc/image2.png")],
  },
  kondor: {
    img: R("kondor/HEAD/assets/view.png"),
    fb: R("kondor/HEAD/assets/Condor.png"),
  },
  ranita: { img: R("ranita/HEAD/electron/Ranita.png") },
  huillin: { img: R("huillin/HEAD/assets/Nutria.png") },
  choike: { img: R("choike/HEAD/view.png") },
  zorro: {
    img: R("zorro/HEAD/assets/view.png"),
    fb: R("zorro/HEAD/assets/zorro.png"),
  },
  colo: {
    img: R("colo/HEAD/assets/view.png"),
    fb: R("colo/HEAD/assets/colocolo.png"),
  },
  "Gestion-Bodega": { img: R("Gestion-Bodega/HEAD/src/config/schema.jpeg") },
  Carrito: {
    img: "https://dojiw2m9tvv09.cloudfront.net/60480/product/X_1809-07245.png?84&time=1724047840",
  },
  "Libreria-Online": {
    img: R("Libreria-Online/HEAD/assets/main.png"),
    gallery: [
      R("Libreria-Online/HEAD/assets/main.png"),
      R("Libreria-Online/HEAD/assets/libro.png"),
      R("Libreria-Online/HEAD/assets/buscar.png"),
      R("Libreria-Online/HEAD/assets/categorias.png"),
      R("Libreria-Online/HEAD/assets/tablero.png"),
      R("Libreria-Online/HEAD/assets/editar.png"),
      R("Libreria-Online/HEAD/assets/carro.png"),
      R("Libreria-Online/HEAD/assets/comprar.png"),
    ],
  },
  Recycleway: {
    img: R("Recycleway/HEAD/assets/1.jpeg"),
    gallery: [R("Recycleway/HEAD/assets/1.jpeg"), R("Recycleway/HEAD/assets/2.jpeg")],
  },
  "gif-pato": { img: R("gif-pato/HEAD/doc/image.png") },
  "structure-generator": { img: R("structure-generator/HEAD/doc/app.png") },
  "logos-css": {
    img: R("logos-css/HEAD/doc/netflix.png"),
    gallery: [R("logos-css/HEAD/doc/netflix.png"), R("logos-css/HEAD/doc/instagram.png")],
  },
  pudu: {
    img: R("pudu/HEAD/assets/view.png"),
    fb: R("pudu/HEAD/assets/Pudu.png"),
  },
};

export const hasImage = (name: string) => Boolean(REPO_META[name]?.img);

// ─────────────────────────────────────────────────────────────
//  Snapshot estático (modo archivo) — se usa solo si la API de
//  GitHub no responde. Tupla: [nombre, descripción, lenguaje,
//  actualizado, estrellas, tienePages]
// ─────────────────────────────────────────────────────────────

type Snap = [string, string | null, string | null, string, number, boolean?];

export const SNAPSHOT: Snap[] = [
  ["Raton-Cake", "Crema pastelera", "TypeScript", "2026-10-09", 0, true],
  ["Raton", "Endless runner de 3 carriles: esquiva trampas, come queso y acumula aura. Estética ukiyo-e.", "TypeScript", "2026-10-09", 1, true],
  ["Ruta", "Autopista infinita pseudo-3D: simulación de tránsito sin choques, con biomas y clima.", "TypeScript", "2026-10-09", 1, true],
  ["Asalto", "Cronómetro HIIT / Tabata con entrenador de voz", "TypeScript", "2026-10-06", 0, true],
  ["Volta", "AUTO-ESCUELA · plantilla para cursos de licencias vehiculares", "TypeScript", "2026-10-06", 0, true],
  ["Narra", "Lector de texto a voz FREE", "TypeScript", "2026-10-06", 0, true],
  ["Cara-Sello", "Lanzamiento de moneda animado con física 3D y RNG criptográfico", "TypeScript", "2026-10-06", 1, true],
  ["buscaminas", "Recreación pixel-perfect del Buscaminas de Windows XP", "TypeScript", "2026-08-02", 1, true],
  ["OmniCalculo", "Calculadora científica, LaTeX y extractor de cuentas", "TypeScript", "2026-07-29", 0, true],
  ["Coipo-Chess-offline", "Ajedrez libre vs IA con 5 niveles, puzzles y editor pixel-art. Por amor al arte.", "TypeScript", "2026-07-23", 0, true],
  ["Coipo-Chess-Puzzles", "Generador de puzzles de ajedrez estilo Chess.com, PWA mobile-first", "TypeScript", "2026-07-23", 0, true],
  ["fake-shopping", "Simulador de Compras Online para la dopamina", "TypeScript", "2026-07-22", 0, true],
  ["stomfish-learning", "para aprender pero no aun", "TypeScript", "2026-07-22", 0],
  ["Coipo-Chess", "Ajedrez online P2P sin servidores (PeerJS) + Stockfish", "JavaScript", "2026-07-22", 0, true],
  ["dengu-norte", "usando la terminal de lubuntu", "TypeScript", "2026-07-21", 0],
  ["Auto-Chess", "Asistente de accesibilidad para jugar ajedrez (túnel carpiano)", "Python", "2026-07-20", 0],
  ["Coipo-Chess-3D", "Ajedrez 3D inmersivo con ambiente de cafetería chilena (Three.js)", "TypeScript", "2026-07-20", 1, true],
  ["BoomSweeper", "Buscaminas con poderes especiales para la generación Z", "TypeScript", "2026-07-18", 0, true],
  ["Duelo-de-Espadas", "Juego de esgrima del Siglo de Oro español en 3D claymation", "TypeScript", "2026-07-17", 1, true],
  ["CoipyStudio", "Editor de código web para Python con intérprete", "HTML", "2026-07-09", 0, true],
  ["Herramientas-bat", "Mis atajos personales para toquetear código", "Batchfile", "2026-07-09", 0],
  ["La-Torre", "Roguelike con características RPG, migrado de Java a JS", "TypeScript", "2026-07-05", 1],
  ["Coipo-Sushi", "Demo React de venta de sushi por WhatsApp", "TypeScript", "2026-07-05", 0, true],
  ["pikaflor", "Analiza proyectos y genera contexto IA listo para pegar (CustomTkinter)", "Python", "2026-06-22", 0],
  ["ilearning", "Aprender BI, Análisis de datos, Python/Pandas", "JavaScript", "2026-06-01", 0],
  ["alearning", "Aprender Algoritmos, Recursividad, ML, DL", "JavaScript", "2026-06-01", 0],
  ["plearning", "Aprender Deploy & CI/CD", "JavaScript", "2026-06-01", 0],
  ["dblearning", "Aprender SQL PostgreSQL MongoDB ORMs", "JavaScript", "2026-06-01", 0],
  ["clearning", "Aprender Docker & VMs", "JavaScript", "2026-06-01", 0],
  ["flearning", "Aprender Vue Svelte TypeScript SaaS", "JavaScript", "2026-06-01", 0],
  ["slearning", "Aprender Express SQLite", "JavaScript", "2026-06-01", 0],
  ["hlearning", "Aprende HTML5 CSS3 JS todo en uno", "JavaScript", "2026-06-01", 0],
  ["dlearning", "Aprender Git · VSCode · Batch", "JavaScript", "2026-06-01", 0],
  ["blearning", "Aprende React-Bootstrap", "JavaScript", "2026-05-31", 0],
  ["tlearning", "Para aprender Tailwind 4 sobre React", "JavaScript", "2026-05-31", 0],
  ["rlearning", "Para aprender React con todo el estilo de Tailwind", "JavaScript", "2026-05-31", 0],
  ["Navegacion-React", "Navegación de sidebar, ejemplo práctico", "JavaScript", "2026-05-31", 0],
  ["tarantula", "port manager o algo haci", "JavaScript", "2026-05-27", 0],
  ["zorro", "Generador de paletas de colores con círculo cromático (Electron)", "JavaScript", "2026-05-23", 0],
  ["colo", "Cambia iconos de carpetas en Windows 10 · convierte PNG a ICO", "JavaScript", "2026-05-20", 0],
  ["churrin-timer", "Temporizador de apagado de PC con bandeja del sistema (Tauri)", "TypeScript", "2026-05-08", 0],
  ["picaflor", "Resume proyectos en formato md (Tauri + Rust + React)", "Rust", "2026-05-07", 0],
  ["condor-desktop", "MD a CONSOLE: IDE visual de automatización con Electron + React", "TypeScript", "2026-05-06", 0],
  ["churrin", "Timer PC :: temporizador de apagado, por si me quedo dormido", "Python", "2026-05-06", 0],
  ["pudu", "Generador de árboles ASCII de estructura de archivos", "Python", "2026-05-06", 0],
  ["kondor", "Automatizador de proyectos desde .md (Tkinter)", "Python", "2026-05-06", 0],
  ["ranita", "Convierte PNG a ICO profesional con 7 capas (Electron)", "JavaScript", "2026-05-06", 0],
  ["huillin", "Recortes de pantalla con extracción de texto OCR (Tesseract.js)", "JavaScript", "2026-05-06", 0],
  ["choike", "Lanzador visual de proyectos React (Electron)", "TypeScript", "2026-05-06", 0],
  ["condor", "Convierte .md ETIQUETADOS en instrucciones CMD: de la IA a tu proyecto", "Python", "2026-04-29", 0],
  ["Blogshere", "Ejemplo de blog con React", "JavaScript", "2026-04-24", 0],
  ["wow-autoscroll", "wow autoscroll en bucle para mantener la salud de tu dedo", "Python", "2026-01-09", 0],
  ["Sayen", "Rayen Clínico auto scraping", "Python", "2025-08-26", 0],
  ["skelfolder", "CLI npm: lee estructura de carpetas como árbol ASCII y guarda en Markdown", "JavaScript", "2025-07-29", 0],
  ["Herramientas", "Pequeños programas que me ayudan a ser feliz", "Python", "2025-07-26", 0],
  ["SnakeGame", "Snake clásico modernizado con niveles y animaciones", "JavaScript", "2025-07-24", 1],
  ["logos-css", "Shorts de YouTube que me topé y repliqué (Netflix, Instagram…)", "CSS", "2025-07-23", 0],
  ["gif-pato", "Imagen GIF con panel de texto y micro para explicar tu código", "Python", "2025-07-23", 0],
  ["structure-generator", "Generador visual de estructuras de carpetas mediante texto", "Python", "2025-07-23", 0],
  ["sudoku", "Sudoku con Python (CustomTkinter) y Node.js + Bootstrap", "Python", "2025-07-23", 0],
  ["tic-tac-toe", "Fundamentos de Python 1 (PE1) — Proyecto final de curso", "Python", "2025-07-22", 0],
  ["Gestion-Bodega", "Sistema de gestión de bodega — Misión Jóvenes Programadores PHP 1", "PHP", "2025-07-05", 0],
  ["plantilla-ejs", "Ejemplo del buen Fazt pero con un patopato", "EJS", "2025-07-03", 1],
  ["to-do", "To-do simple y minimalista para enseñar a jóvenes", "JavaScript", "2025-06-30", 0],
  ["Topicos-LSCH", "Tópicos y palabras (Lengua de Señas Chilena)", "Python", "2024-11-23", 0],
  ["Games-of-Drones-", "Solución a Games of Drones, desafío de CodinGame", "Python", "2024-09-03", 0],
  ["Sistema-Experto-Ropa", "Sistema experto para escoger conjuntos de ropa", "Python", "2024-08-22", 0],
  ["Carrito", "Ejercicio de React para Jóvenes Programadores", "JavaScript", "2024-08-21", 0],
  ["Libreria-Online", "Sitio de venta de libros con Bootstrap + PHP + MySQL (UTA)", "PHP", "2024-04-11", 0],
  ["Recycleway", "Sitio web que te enseña a reciclar con diversión", "JavaScript", "2023-12-27", 0],
];

// Repos que declaran demo en vivo (GitHub Pages), vistos en sus READMEs
export const KNOWN_PAGES = new Set([
  "Raton-Cake", "Raton", "Ruta", "Asalto", "Volta", "Narra", "Cara-Sello",
  "buscaminas", "OmniCalculo", "Coipo-Chess-offline", "Coipo-Chess-Puzzles",
  "fake-shopping", "Coipo-Chess", "Coipo-Chess-3D", "BoomSweeper",
  "Duelo-de-Espadas", "CoipyStudio", "Coipo-Sushi",
]);

export const PROFILE = {
  login: "CoipoNorte",
  name: "Christian Marcelo Cáceres Marín",
  avatar: "https://avatars.githubusercontent.com/u/84161501?v=4",
  htmlUrl: "https://github.com/CoipoNorte",
  pagesUrl: "https://coiponorte.github.io/CoipoNorte/",
  company: "DenguNorte",
  location: "Tarapacá · Iquique, Chile",
  bio: "software ing",
  since: "2021",
  followers: 10,
  totalRepos: 94,
};
