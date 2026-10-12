import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RefreshCw, RotateCcw, Stamp } from "lucide-react";
import { Hero } from "@/components/Hero";
import { Controls } from "@/components/Controls";
import { ProjectCard } from "@/components/ProjectCard";
import { ProjectRow } from "@/components/ProjectRow";
import { DetailModal } from "@/components/DetailModal";
import { Footer } from "@/components/Footer";
import {
  fetchRepos,
  fmtRelative,
  getFallbackRepos,
  getLastSync,
  haystack,
  sortRepos,
  type Repo,
  type SortId,
  type ViewMode,
} from "@/lib/github";

const PAGE = 24;

export default function App() {
  const [repos, setRepos] = useState<Repo[]>(() => getFallbackRepos());
  const [live, setLive] = useState(false);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortId>("recent");
  const [onlyImg, setOnlyImg] = useState(false);
  const [lang, setLang] = useState<string | null>(null);
  const [view, setView] = useState<ViewMode>("grid");
  const [limit, setLimit] = useState(PAGE);
  const [selected, setSelected] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [syncAt, setSyncAt] = useState<number | null>(() => getLastSync());
  const searchRef = useRef<HTMLInputElement | null>(null);

  // ── sincronización con GitHub (al cargar y bajo demanda) ──
  const doSync = useCallback(() => {
    setSyncing(true);
    fetchRepos()
      .then(({ repos }) => {
        setRepos(repos);
        setLive(true);
        setSyncAt(Date.now());
      })
      .catch(() => setLive(false))
      .finally(() => setSyncing(false));
  }, []);

  useEffect(() => {
    doSync();
  }, [doSync]);

  // reloj suave para refrescar los textos relativos ("hace 3 min")
  const [, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((x) => x + 1), 45_000);
    return () => clearInterval(t);
  }, []);

  // reinicia la paginación al cambiar filtros
  useEffect(() => {
    setLimit(PAGE);
  }, [query, sort, onlyImg, lang, view]);

  // ── derivados ──
  const langs = useMemo(() => {
    const map = new Map<string, number>();
    repos.forEach((r) => {
      const l = r.language;
      if (l) map.set(l, (map.get(l) ?? 0) + 1);
    });
    return [...map.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }, [repos]);

  const imgCount = useMemo(() => repos.filter((r) => r.img).length, [repos]);

  const lastPush = useMemo(
    () =>
      repos.reduce(
        (max, r) => (r.pushed_at > max ? r.pushed_at : max),
        repos[0]?.pushed_at ?? new Date().toISOString()
      ),
    [repos]
  );

  const filtered = useMemo(() => {
    const tokens = query.trim().split(/\s+/).filter(Boolean).map((t) => t);
    let out = repos;
    if (lang) out = out.filter((r) => r.language === lang);
    if (onlyImg) out = out.filter((r) => Boolean(r.img));
    if (tokens.length) {
      const normed = tokens.map((t) =>
        t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
      );
      out = out.filter((r) => {
        const h = haystack(r);
        return normed.every((t) => h.includes(t));
      });
    }
    return sortRepos(out, sort);
  }, [repos, query, sort, onlyImg, lang]);

  const visible = filtered.slice(0, limit);
  const hasFilters = query.trim() !== "" || onlyImg || lang !== null;

  // ── ficha seleccionada ──
  const selectedIndex = selected ? filtered.findIndex((r) => r.name === selected) : -1;
  const selectedRepo = selectedIndex >= 0 ? filtered[selectedIndex] : null;

  const openRepo = useCallback((r: Repo) => setSelected(r.name), []);

  const gotoIndex = useCallback(
    (i: number) => {
      if (!filtered.length) return;
      const next = ((i % filtered.length) + filtered.length) % filtered.length;
      setSelected(filtered[next].name);
    },
    [filtered]
  );

  // ── teclado ──
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName) || target.isContentEditable;
      if (e.key === "/" && !typing) {
        e.preventDefault();
        searchRef.current?.focus();
      } else if (e.key === "Escape" && selected) {
        setSelected(null);
      } else if (selected && e.key === "ArrowRight") {
        gotoIndex(selectedIndex + 1);
      } else if (selected && e.key === "ArrowLeft") {
        gotoIndex(selectedIndex - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, selectedIndex, gotoIndex]);

  // bloquea el scroll del fondo cuando hay ficha abierta
  useEffect(() => {
    document.body.style.overflow = selected ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [selected]);

  const handleEnrich = useCallback((name: string, imgs: string[]) => {
    setRepos((rs) =>
      rs.map((r) =>
        r.name === name
          ? {
              ...r,
              scanned: true,
              gallery: r.gallery ?? (imgs.length ? imgs : undefined),
              img: r.img ?? imgs[0] ?? null,
            }
          : r
      )
    );
  }, []);

  const resetFilters = () => {
    setQuery("");
    setOnlyImg(false);
    setLang(null);
  };

  const sortLabel = useMemo(
    () => ({ recent: "última actividad", oldest: "más antiguos primero", az: "A → Z", za: "Z → A", stars: "más estrellas" })[sort],
    [sort]
  );

  return (
    <div className="min-h-screen">
      <div className="grain-overlay" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />

      <Hero total={repos.length} imgCount={imgCount} langCount={langs.length} lastPush={lastPush} live={live} />

      <main id="catalogo" className="scroll-mt-4">
        <Controls
          query={query}
          onQuery={setQuery}
          sort={sort}
          onSort={setSort}
          onlyImg={onlyImg}
          onOnlyImg={setOnlyImg}
          imgCount={imgCount}
          langs={langs}
          lang={lang}
          onLang={setLang}
          view={view}
          onView={setView}
          searchRef={searchRef}
        />

        <section className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12" aria-live="polite">
          {/* línea de estado */}
          <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line py-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-3">
              Mostrando{" "}
              <span className="text-ink">{filtered.length ? `1–${Math.min(visible.length, filtered.length)}` : "0"}</span> de{" "}
              <span className="text-ink">{filtered.length}</span> registros · orden {sortLabel}
              {lang && <span className="text-accent"> · {lang}</span>}
              {onlyImg && <span className="text-accent"> · solo con imagen</span>}
            </p>
            <div className="flex items-center gap-4">
              {hasFilters && (
                <button
                  onClick={resetFilters}
                  className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-ink-2 transition-colors hover:text-accent"
                >
                  <RotateCcw size={10} /> limpiar filtros
                </button>
              )}
              <button
                onClick={doSync}
                disabled={syncing}
                title={live ? "Volver a sincronizar con GitHub" : "Reintentar sincronización con GitHub"}
                className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-ink-2 transition-colors hover:text-accent disabled:opacity-50"
              >
                <RefreshCw size={11} className={syncing ? "animate-spin" : ""} />
                {syncAt ? `sync ${fmtRelative(new Date(syncAt).toISOString())}` : "sincronizar"}
              </button>
            </div>
          </div>

          {/* resultados */}
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center py-24 text-center"
            >
              <div className="stamp-frame flex rotate-[-4deg] items-center gap-2.5 rounded-[3px] px-5 py-3 text-accent">
                <Stamp size={18} />
                <span className="font-mono text-sm font-bold uppercase tracking-[0.3em]">Sin resultados</span>
              </div>
              <p className="mt-6 max-w-xs text-[0.9rem] leading-relaxed text-ink-2">
                Ningún registro del catálogo coincide con esa consulta. Prueba
                con otro término o retira algún filtro.
              </p>
              <button
                onClick={resetFilters}
                className="mt-5 flex items-center gap-2 rounded-sm border border-ink/70 px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-ink transition-all hover:bg-ink hover:text-paper"
              >
                <RotateCcw size={12} /> Restablecer catálogo
              </button>
            </motion.div>
          ) : view === "grid" ? (
            <motion.div layout className="grid grid-cols-1 gap-5 py-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <AnimatePresence>
                {visible.map((repo, i) => (
                  <ProjectCard key={repo.name} repo={repo} index={i} onOpen={openRepo} />
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div layout className="py-5">
              <div className="hidden grid-cols-[3.6rem_minmax(0,1.2fr)_minmax(0,1fr)_7rem_6.5rem] gap-x-4 border-b border-ink/40 px-2 pb-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-ink-3 sm:grid">
                <span>Nº</span>
                <span>Título</span>
                <span>Reseña</span>
                <span>Clasif.</span>
                <span className="text-right">Revisión</span>
              </div>
              <AnimatePresence>
                {visible.map((repo, i) => (
                  <ProjectRow key={repo.name} repo={repo} index={i} onOpen={openRepo} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {/* cargar más */}
          {visible.length < filtered.length && (
            <div className="flex justify-center pb-6">
              <button
                onClick={() => setLimit((l) => l + PAGE)}
                className="group flex items-center gap-3 rounded-sm border border-line-2 bg-card px-6 py-3 font-mono text-[11px] uppercase tracking-[0.25em] text-ink transition-all hover:border-ink hover:bg-ink hover:text-paper"
              >
                Cargar más registros
                <span className="rounded-sm bg-paper-2 px-1.5 py-0.5 text-[9px] text-ink-3 group-hover:bg-paper/15 group-hover:text-paper/70">
                  +{Math.min(PAGE, filtered.length - visible.length)}
                </span>
              </button>
            </div>
          )}
        </section>
      </main>

      <Footer langs={langs} total={repos.length} />

      {/* ficha */}
      <AnimatePresence>
        {selectedRepo && (
          <DetailModal
            key={selectedRepo.name}
            repo={selectedRepo}
            index={selectedIndex}
            total={filtered.length}
            onClose={() => setSelected(null)}
            onPrev={() => gotoIndex(selectedIndex - 1)}
            onNext={() => gotoIndex(selectedIndex + 1)}
            onEnrich={handleEnrich}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
