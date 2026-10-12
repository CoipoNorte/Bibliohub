import type { RefObject } from "react";
import { Clock, Hourglass, Image as ImageIcon, LayoutGrid, Rows3, Search, Star, X } from "lucide-react";
import { cn } from "@/utils/cn";
import { SORTS, type SortId, type ViewMode } from "@/lib/github";

const SORT_ICONS: Partial<Record<SortId, typeof Clock>> = {
  recent: Clock,
  oldest: Hourglass,
  stars: Star,
};

export interface LangCount {
  name: string;
  count: number;
}

export function Controls({
  query,
  onQuery,
  sort,
  onSort,
  onlyImg,
  onOnlyImg,
  imgCount,
  langs,
  lang,
  onLang,
  view,
  onView,
  searchRef,
}: {
  query: string;
  onQuery: (q: string) => void;
  sort: SortId;
  onSort: (s: SortId) => void;
  onlyImg: boolean;
  onOnlyImg: (b: boolean) => void;
  imgCount: number;
  langs: LangCount[];
  lang: string | null;
  onLang: (l: string | null) => void;
  view: ViewMode;
  onView: (v: ViewMode) => void;
  searchRef: RefObject<HTMLInputElement | null>;
}) {
  return (
    <div className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur-md">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        {/* fila 1: buscador + orden */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2.5 pt-3.5 pb-2.5">
          <label className="flex min-w-[210px] flex-1 items-center gap-2.5 rounded-sm border border-line-2 bg-card px-3 py-2 transition-colors focus-within:border-accent">
            <Search size={15} className="shrink-0 text-ink-3" />
            <input
              ref={searchRef}
              type="search"
              value={query}
              onChange={(e) => onQuery(e.target.value)}
              placeholder="Buscar en el catálogo…"
              aria-label="Buscar proyectos"
              className="w-full bg-transparent font-sans text-[0.9rem] text-ink placeholder:text-ink-3/70 focus:outline-none"
            />
            {query ? (
              <button onClick={() => onQuery("")} aria-label="Limpiar búsqueda" className="text-ink-3 hover:text-accent">
                <X size={14} />
              </button>
            ) : (
              <kbd className="key hidden sm:block">/</kbd>
            )}
          </label>

          <nav aria-label="Ordenar catálogo" className="no-scrollbar flex items-center gap-1 overflow-x-auto">
            {SORTS.map((s) => {
              const Icon = SORT_ICONS[s.id];
              const active = sort === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => onSort(s.id)}
                  title={s.hint}
                  aria-pressed={active}
                  className={cn(
                    "flex shrink-0 items-center gap-1.5 rounded-sm border px-2.5 py-2 font-mono text-[10.5px] uppercase tracking-widest transition-all",
                    active
                      ? "border-ink bg-ink text-paper"
                      : "border-line-2 bg-card text-ink-2 hover:border-ink-3 hover:text-ink"
                  )}
                >
                  {Icon && <Icon size={11} />}
                  {s.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* fila 2: lenguajes + con imagen + vista */}
        <div className="flex items-center gap-3 border-t border-line/70 py-2.5">
          <div className="no-scrollbar flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto" role="group" aria-label="Filtrar por lenguaje">
            <span className="mr-1 hidden shrink-0 font-mono text-[9px] uppercase tracking-[0.2em] text-ink-3 md:inline">
              Clasificación
            </span>
            <button
              onClick={() => onLang(null)}
              aria-pressed={lang === null}
              className={cn(
                "shrink-0 rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider transition-all",
                lang === null ? "border-ink bg-ink text-paper" : "border-line bg-card text-ink-2 hover:border-ink-3"
              )}
            >
              Todos
            </button>
            {langs.map((l) => (
              <button
                key={l.name}
                onClick={() => onLang(lang === l.name ? null : l.name)}
                aria-pressed={lang === l.name}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider transition-all",
                  lang === l.name ? "border-ink bg-ink text-paper" : "border-line bg-card text-ink-2 hover:border-ink-3"
                )}
              >
                {l.name}
                <span className={cn("text-[9px]", lang === l.name ? "text-paper/60" : "text-ink-3")}>{l.count}</span>
              </button>
            ))}
          </div>

          <button
            onClick={() => onOnlyImg(!onlyImg)}
            aria-pressed={onlyImg}
            title="Mostrar solo piezas con imagen"
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-sm border px-2.5 py-2 font-mono text-[10.5px] uppercase tracking-widest transition-all",
              onlyImg ? "border-accent bg-accent text-card" : "border-line-2 bg-card text-ink-2 hover:border-accent hover:text-accent"
            )}
          >
            <ImageIcon size={12} />
            <span className="hidden sm:inline">Con imagen</span>
            <span className={cn("rounded-sm px-1 text-[9px]", onlyImg ? "bg-card/20" : "bg-paper-2")}>{imgCount}</span>
          </button>

          <div className="flex shrink-0 items-center gap-0.5 rounded-sm border border-line-2 bg-card p-0.5" role="group" aria-label="Cambiar vista">
            <button
              onClick={() => onView("grid")}
              aria-pressed={view === "grid"}
              title="Vista de fichas"
              className={cn("rounded-[3px] p-1.5 transition-colors", view === "grid" ? "bg-ink text-paper" : "text-ink-3 hover:text-ink")}
            >
              <LayoutGrid size={13} />
            </button>
            <button
              onClick={() => onView("rows")}
              aria-pressed={view === "rows"}
              title="Vista de índice"
              className={cn("rounded-[3px] p-1.5 transition-colors", view === "rows" ? "bg-ink text-paper" : "text-ink-3 hover:text-ink")}
            >
              <Rows3 size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
