import { motion } from "framer-motion";
import { ArrowDown, LibraryBig, MapPin } from "lucide-react";
import { PROFILE } from "@/data/meta";
import { GhIcon } from "@/components/icons";
import { fmtDate, fmtRelative } from "@/lib/github";

const TITLE = "La Biblioteca";

function Stamp() {
  return (
    <div className="relative h-40 w-40 shrink-0 lg:h-48 lg:w-48" aria-hidden="true">
      <svg viewBox="0 0 200 200" className="stamp-spin absolute inset-0 h-full w-full">
        <defs>
          <path id="sello-ring" d="M 100,100 m -78,0 a 78,78 0 1,1 156,0 a 78,78 0 1,1 -156,0" />
        </defs>
        <circle cx="100" cy="100" r="97" fill="none" stroke="var(--color-accent)" strokeWidth="2.5" opacity="0.9" />
        <circle cx="100" cy="100" r="58" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" opacity="0.55" strokeDasharray="3 5" />
        <text fontFamily="var(--font-mono)" fontSize="13.2" letterSpacing="3.1" fill="var(--color-accent)" fontWeight="600">
          <textPath href="#sello-ring">
            BIBLIOTECA DEL COIPO · IQUIQUE · CHILE · EST. 2021 ·
          </textPath>
        </text>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <LibraryBig size={46} strokeWidth={1.4} className="text-accent" />
      </div>
    </div>
  );
}

export function Hero({
  total,
  imgCount,
  langCount,
  lastPush,
  live,
}: {
  total: number;
  imgCount: number;
  langCount: number;
  lastPush: string;
  live: boolean;
}) {
  return (
    <header className="relative overflow-hidden border-b border-line">
      {/* texto fantasma vertical */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-4 top-1/2 hidden -translate-y-1/2 rotate-90 font-mono text-[11px] uppercase tracking-[0.6em] text-ink-3/50 lg:block"
      >
        Catálogo · 2021 — 2026
      </div>

      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        {/* barra superior */}
        <div className="flex items-center justify-between gap-4 border-b border-line py-3.5">
          <a
            href={PROFILE.htmlUrl}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-3"
          >
            <img
              src={PROFILE.avatar}
              alt="Avatar de CoipoNorte"
              className="h-9 w-9 rounded-full border border-line-2 object-cover duotone"
            />
            <span className="leading-tight">
              <span className="block font-display text-sm font-semibold text-ink group-hover:text-accent-deep transition-colors">
                {PROFILE.name}
              </span>
              <span className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-ink-3">
                <MapPin size={9} /> {PROFILE.location}
              </span>
            </span>
          </a>
          <div className="flex items-center gap-2">
            <span
              className={`hidden items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest sm:flex ${
                live ? "border-moss/40 text-moss" : "border-gold/50 text-gold"
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${live ? "bg-moss animate-pulse" : "bg-gold"}`} />
              {live ? "Sync GitHub" : "Archivo local"}
            </span>
            <a
              href={PROFILE.htmlUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-full border border-ink/70 px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-widest text-ink transition-all hover:bg-ink hover:text-paper"
            >
              <GhIcon size={13} /> @{PROFILE.login}
            </a>
          </div>
        </div>

        {/* titular */}
        <div className="flex items-end justify-between gap-8 pt-10 pb-8 sm:pt-14 sm:pb-10">
          <div className="min-w-0">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-2 sm:text-[11px]"
            >
              Archivo general de proyectos — {total} piezas catalogadas
            </motion.p>

            <h1 className="mt-3 font-display font-semibold leading-[0.92] tracking-[-0.02em] text-ink" style={{ fontSize: "clamp(2.9rem, 8.6vw, 7.6rem)" }}>
              <span className="block overflow-hidden pb-1">
                {TITLE.split("").map((ch, i) => (
                  <motion.span
                    key={i}
                    className="inline-block"
                    initial={{ y: "112%" }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.08 + i * 0.026, type: "spring", stiffness: 210, damping: 26 }}
                  >
                    {ch === " " ? "\u00A0" : ch}
                  </motion.span>
                ))}
              </span>
              <motion.span
                initial={{ opacity: 0, x: -18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.55, type: "spring", stiffness: 160, damping: 22 }}
                className="block italic text-accent"
                style={{ fontSize: "0.52em" }}
              >
                del Coipo
                <motion.span
                  className="mt-1 block h-[2px] bg-accent/60 origin-left"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.85, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                />
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-5 max-w-xl text-[0.95rem] leading-relaxed text-ink-2"
            >
              Juegos de una sola vista, utilidades de escritorio, ajedreces y
              experimentos: todo el software que he ido encuadernando desde 2021.
              Consulta el catálogo por <em className="font-display italic text-ink">orden alfabético</em>, por{" "}
              <em className="font-display italic text-ink">fecha</em> o filtra solo las piezas{" "}
              <em className="font-display italic text-ink">con imagen</em>.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, rotate: -14, scale: 0.85 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            transition={{ delay: 0.75, type: "spring", stiffness: 130, damping: 17 }}
            className="hidden md:block"
          >
            <Stamp />
          </motion.div>
        </div>

        {/* banda estadística */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85 }}
          className="grid grid-cols-2 border-t border-line md:grid-cols-4"
        >
          {[
            { k: "Registros", v: String(total), s: "volúmenes públicos" },
            { k: "Lenguajes", v: String(langCount), s: "clasificaciones" },
            { k: "Con imagen", v: String(imgCount), s: "con registro visual" },
            { k: "Último pulso", v: fmtDate(lastPush), s: fmtRelative(lastPush) },
          ].map((it, i) => (
            <div
              key={it.k}
              className={`px-1 py-4 sm:px-4 ${i > 0 ? "border-l border-line" : ""} ${i >= 2 ? "max-md:border-t max-md:border-line" : ""} ${i === 2 ? "max-md:border-l-0" : ""}`}
            >
              <div className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-ink-3">{it.k}</div>
              <div className="mt-1 font-display text-2xl font-semibold text-ink sm:text-3xl">{it.v}</div>
              <div className="font-mono text-[9.5px] uppercase tracking-widest text-ink-3">{it.s}</div>
            </div>
          ))}
        </motion.div>

        <motion.a
          href="#catalogo"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.05 }}
          className="group flex items-center justify-between border-t border-line py-3 font-mono text-[10px] uppercase tracking-[0.3em] text-ink-3 transition-colors hover:text-accent"
        >
          <span>Consultar el catálogo</span>
          <ArrowDown size={14} className="animate-bounce" />
        </motion.a>
      </div>
    </header>
  );
}
