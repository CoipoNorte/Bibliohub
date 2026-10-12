import { KNOWN_PAGES, PROFILE, REPO_META, SNAPSHOT } from "@/data/meta";

// ───────────────────────── tipos ─────────────────────────

export interface Repo {
  id: number;
  name: string;
  description: string | null;
  language: string | null;
  topics: string[];
  stargazers_count: number;
  forks_count: number;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  html_url: string;
  homepage: string | null;
  archived: boolean;
  size: number;
  license: { spdx_id?: string; name?: string } | null;
  has_pages: boolean;
  default_branch: string;
  /** enriquecido localmente */
  img?: string | null;
  imgFb?: string | null;
  gallery?: string[];
  scanned?: boolean;
}

export type SortId = "recent" | "oldest" | "az" | "za" | "stars";
export type ViewMode = "grid" | "rows";

export const SORTS: { id: SortId; label: string; hint: string }[] = [
  { id: "recent", label: "Recientes", hint: "última actividad primero" },
  { id: "oldest", label: "Antiguos", hint: "los primeros registros" },
  { id: "az", label: "A→Z", hint: "orden alfabético" },
  { id: "za", label: "Z→A", hint: "alfabético inverso" },
  { id: "stars", label: "Estrellas", hint: "más estrellados" },
];

// ──────────────────────── lenguajes ────────────────────────

const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#c9a825",
  Python: "#3572a5",
  Rust: "#b0763f",
  HTML: "#d8492a",
  CSS: "#5a3d8a",
  PHP: "#4f5d95",
  Batchfile: "#7a8a3a",
  EJS: "#a91e50",
  Shell: "#6b8e4e",
};

export const langColor = (lang: string | null) =>
  (lang && LANG_COLORS[lang]) || "#8a8270";

// ─────────────────────── formato ───────────────────────

const dayFmt = new Intl.DateTimeFormat("es-CL", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export function fmtDate(iso: string | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return dayFmt.format(d).replace(/\./g, "");
}

const rtf = new Intl.RelativeTimeFormat("es", { numeric: "auto" });

export function fmtRelative(iso: string | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso).getTime();
  if (Number.isNaN(d)) return "—";
  const diff = d - Date.now();
  const abs = Math.abs(diff);
  const min = 60_000,
    hour = 3_600_000,
    day = 86_400_000;
  if (abs < hour) return rtf.format(Math.round(diff / min), "minute");
  if (abs < day) return rtf.format(Math.round(diff / hour), "hour");
  if (abs < day * 30) return rtf.format(Math.round(diff / day), "day");
  if (abs < day * 365) return rtf.format(Math.round(diff / (day * 30)), "month");
  return rtf.format(Math.round(diff / (day * 365)), "year");
}

export function fmtSize(kb: number): string {
  if (!kb || kb <= 0) return "—";
  if (kb < 1024) return `${kb} KB`;
  return `${(kb / 1024).toFixed(1).replace(".", ",")} MB`;
}

export const normalize = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

// ─────────────────── caché + enriquecido ───────────────────

const REPO_CACHE_KEY = "coipoteca:repos:v2";
const scanKey = (name: string) => `coipoteca:scan:v2:${name}`;

interface ScanRecord {
  imgs: string[];
  ts: number;
}

function readScan(name: string): string[] | null {
  try {
    const raw = localStorage.getItem(scanKey(name));
    if (!raw) return null;
    const rec = JSON.parse(raw) as ScanRecord;
    return Array.isArray(rec.imgs) ? rec.imgs : null;
  } catch {
    return null;
  }
}

function writeScan(name: string, imgs: string[]) {
  try {
    localStorage.setItem(
      scanKey(name),
      JSON.stringify({ imgs, ts: Date.now() } satisfies ScanRecord)
    );
  } catch {
    /* almacenamiento no disponible */
  }
}

/** Aplica metadatos curados + descubrimientos cacheados a un repo. */
export function enrichOne(r: Repo): Repo {
  const meta = REPO_META[r.name];
  const scanned = readScan(r.name);
  const gallery =
    meta?.gallery && meta.gallery.length
      ? meta.gallery
      : scanned && scanned.length
        ? scanned
        : undefined;
  const img = meta?.img ?? scanned?.[0] ?? null;
  return {
    ...r,
    img,
    imgFb: meta?.fb ?? null,
    gallery,
    scanned: scanned !== null || Boolean(meta),
  };
}

export const repoKey = (r: Repo) => r.name;

// ─────────────────── snapshot estático ───────────────────

function snapshotRepos(): Repo[] {
  return SNAPSHOT.map(([name, description, language, date, stars], i) =>
    enrichOne({
      id: -1000 - i,
      name,
      description,
      language,
      topics: [],
      stargazers_count: stars,
      forks_count: 0,
      created_at: date,
      updated_at: date,
      pushed_at: date,
      html_url: `${PROFILE.htmlUrl}/${name}`,
      homepage: KNOWN_PAGES.has(name)
        ? `https://coiponorte.github.io/${name}/`
        : null,
      archived: false,
      size: 0,
      license: null,
      has_pages: KNOWN_PAGES.has(name),
      default_branch: "main",
    })
  );
}

export function readRepoCache(): Repo[] | null {
  try {
    const raw = localStorage.getItem(REPO_CACHE_KEY);
    if (!raw) return null;
    const { repos } = JSON.parse(raw) as { repos: Repo[] };
    if (!Array.isArray(repos) || !repos.length) return null;
    return repos.map(enrichOne);
  } catch {
    return null;
  }
}

export const getFallbackRepos = (): Repo[] =>
  readRepoCache() ?? snapshotRepos();

/** Marca de tiempo de la última sincronización exitosa con GitHub. */
export function getLastSync(): number | null {
  try {
    const raw = localStorage.getItem(REPO_CACHE_KEY);
    if (!raw) return null;
    const { ts } = JSON.parse(raw) as { ts?: number };
    return typeof ts === "number" ? ts : null;
  } catch {
    return null;
  }
}

export interface FetchResult {
  repos: Repo[];
  live: boolean;
}

/** Trae los repositorios públicos, ordenados por actividad reciente. */
export async function fetchRepos(): Promise<FetchResult> {
  const res = await fetch(
    "https://api.github.com/users/CoipoNorte/repos?per_page=100&sort=pushed&direction=desc",
    { headers: { Accept: "application/vnd.github+json" } }
  );
  if (!res.ok) throw new Error(`GitHub respondió ${res.status}`);
  const data = (await res.json()) as Repo[];
  const slim = data.map((r) => ({ ...r, img: undefined, imgFb: undefined, gallery: undefined, scanned: undefined }));
  try {
    localStorage.setItem(REPO_CACHE_KEY, JSON.stringify({ ts: Date.now(), repos: slim }));
  } catch {
    /* sin espacio */
  }
  return { repos: data.map(enrichOne), live: true };
}

// ─────────────────── escaneo de imágenes del README ───────────────────

const BADGE_HINTS = [
  "shields.io",
  "badgen.net",
  "badge",
  "travis-ci",
  "coveralls",
  "codecov",
  "sonarcloud",
  "codeclimate",
  "hits.dwyl",
  "visitor-badge",
  "/workflows/",
  "github.com/badges",
  "img.shields",
];

function isBadge(url: string, alt: string) {
  const u = url.toLowerCase();
  if (BADGE_HINTS.some((b) => u.includes(b))) return true;
  if (/badge|shield|build|coverage|version|license|licence/i.test(alt)) return true;
  if (/\.ico(\?|$)/i.test(u)) return true;
  return false;
}

function absolutize(url: string, repo: Repo): string | null {
  url = url.trim().replace(/^\)+|\)+$/g, "");
  if (!url || url.startsWith("data:")) return null;
  if (/^https?:\/\//i.test(url)) return url;
  url = url.replace(/^\.?\//, "");
  if (!url) return null;
  return `https://raw.githubusercontent.com/CoipoNorte/${repo.name}/${repo.default_branch}/${url}`;
}

/** Extrae las imágenes "reales" (no badges) de un markdown. */
export function extractImages(md: string, repo: Repo): string[] {
  const found: string[] = [];
  const seen = new Set<string>();
  const push = (url: string, alt: string) => {
    if (isBadge(url, alt)) return;
    const abs = absolutize(url, repo);
    if (!abs || seen.has(abs)) return;
    if (!/\.(png|jpe?g|gif|webp|avif|bmp)(\?|#|$)/i.test(abs) && !abs.startsWith("http")) return;
    seen.add(abs);
    found.push(abs);
  };

  const mdImg = /!\[([^\]]*)\]\(\s*(<[^>]+>|[^)\s]+)(?:\s+"[^"]*")?\s*\)/g;
  let m: RegExpExecArray | null;
  while ((m = mdImg.exec(md))) {
    const raw = m[2].replace(/^<|>$/g, "");
    push(raw, m[1] ?? "");
  }
  const htmlImg = /<img[^>]+src\s*=\s*"([^"]+)"[^>]*>/gi;
  while ((m = htmlImg.exec(md))) {
    const tag = m[0];
    const alt = /alt\s*=\s*"([^"]*)"/i.exec(tag)?.[1] ?? "";
    push(m[1], alt);
  }
  return found.slice(0, 12);
}

function decodeBase64(b64: string): string {
  const bin = atob(b64.replace(/\s/g, ""));
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder("utf-8").decode(bytes);
}

/**
 * Descarga el README del repo y descubre sus imágenes.
 * Persiste el resultado (incluso vacío) en localStorage.
 */
export async function scanRepoImages(repo: Repo): Promise<string[]> {
  const cached = readScan(repo.name);
  if (cached !== null) return cached;
  let imgs: string[] = [];
  try {
    const res = await fetch(
      `https://api.github.com/repos/CoipoNorte/${repo.name}/readme`,
      { headers: { Accept: "application/vnd.github+json" } }
    );
    if (res.ok) {
      const data = (await res.json()) as { content?: string };
      if (data.content) {
        imgs = extractImages(decodeBase64(data.content), repo);
      }
    }
  } catch {
    /* red caída: devolvemos vacío */
  }
  writeScan(repo.name, imgs);
  return imgs;
}

// ─────────────────── filtros y orden ───────────────────

export function haystack(r: Repo): string {
  return normalize(
    [
      r.name,
      r.description ?? "",
      r.language ?? "",
      ...r.topics,
      String(new Date(r.pushed_at || r.updated_at).getFullYear()),
    ].join(" ")
  );
}

export function sortRepos(repos: Repo[], sort: SortId): Repo[] {
  const arr = [...repos];
  switch (sort) {
    case "az":
      arr.sort((a, b) => a.name.localeCompare(b.name, "es"));
      break;
    case "za":
      arr.sort((a, b) => b.name.localeCompare(a.name, "es"));
      break;
    case "oldest":
      arr.sort((a, b) => +new Date(a.pushed_at) - +new Date(b.pushed_at));
      break;
    case "stars":
      arr.sort(
        (a, b) =>
          b.stargazers_count - a.stargazers_count ||
          +new Date(b.pushed_at) - +new Date(a.pushed_at)
      );
      break;
    default:
      arr.sort((a, b) => +new Date(b.pushed_at) - +new Date(a.pushed_at));
  }
  return arr;
}

/** URL de demo en vivo, si existe (homepage o GitHub Pages). */
export function demoUrl(r: Repo): string | null {
  if (r.homepage && r.homepage.trim()) return r.homepage;
  if (r.has_pages || KNOWN_PAGES.has(r.name))
    return `https://coiponorte.github.io/${r.name}/`;
  return null;
}
