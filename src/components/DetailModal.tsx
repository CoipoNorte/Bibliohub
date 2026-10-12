import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BookMarked,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Eye,
  GitFork,
  Globe,
  Loader2,
  ScanSearch,
  Star,
  X,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { Cover, GenerativeCover } from "@/components/Cover";
import { GhIcon } from "@/components/icons";
import {
  demoUrl,
  fmtDate,
  fmtRelative,
  fmtSize,
  scanRepoImages,
  type Repo,
} from "@/lib/github";

const pad = (n: number) => String(n + 1).padStart(3, "0");

function Field({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-line/70 py-1.5 last:border-b-0">
      <dt className="shrink-0 font-mono text-[9.5px] uppercase tracking-[0.2em] text-ink-3">{k}</dt>
      <dd className="truncate text-right text-[0.8rem] text-ink">{v}</dd>
    </div>
  );
}

export function DetailModal({
  repo,
  index,
  total,
  onClose,
  onPrev,
  onNext,
  onEnrich,
}: {
  repo: Repo;
  index: number;
  total: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onEnrich: (name: string, imgs: string[]) => void;
}) {
  const [activeImg, setActiveImg] = useState(0);
  const [scanning, setScanning] = useState(false);
  const [copied, setCopied] = useState(false);
  const demo = demoUrl(repo);
  const images = repo.gallery ?? (repo.img ? [repo.img] : []);
  const showGallery = images.length > 1;

  useEffect(() => {
    setActiveImg(0);
    setCopied(false);
  }, [repo.name]);

  // escaneo perezoso del README para descubrir imágenes
  useEffect(() => {
    if (repo.scanned) return;
    let alive = true;
    setScanning(true);
    scanRepoImages(repo).then((imgs) => {
      if (!alive) return;
      setScanning(false);
      onEnrich(repo.name, imgs);
    });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repo.name]);

  const copyClone = async () => {
    try {
      await navigator.clipboard.writeText(`git clone ${repo.html_url}.git`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* portapapeles bloqueado */
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/55 p-3 backdrop-blur-[3px] sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Ficha de ${repo.name}`}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 34, scale: 0.97, rotate: -0.4 }}
        animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
        exit={{ opacity: 0, y: 22, scale: 0.98, transition: { duration: 0.18 } }}
        transition={{ type: "spring", stiffness: 240, damping: 26 }}
        className="relative my-[3vh] w-full max-w-[920px] rounded-[4px] border border-ink/70 bg-card shadow-[10px_10px_0_rgba(30,27,20,0.85)]"
      >
        {/* cabecera de ficha */}
        <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3">
          <div className="flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-3">
            <BookMarked size={12} className="text-accent" />
            <span>
              Ficha catalográfica · <span className="text-ink">Nº {pad(index)}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="stamp-frame hidden rotate-2 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.25em] text-accent sm:block">
              Biblioteca del Coipo
            </span>
            <button
              onClick={onClose}
              aria-label="Cerrar ficha"
              className="flex h-7 w-7 items-center justify-center rounded-full border border-line-2 text-ink-2 transition-colors hover:border-accent hover:bg-accent hover:text-card"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        <div className="grid gap-0 md:grid-cols-[1.02fr_1fr]">
          {/* columna visual */}
          <div className="border-b border-line md:border-r md:border-b-0">
            <div className="relative p-4 pb-2">
              {images.length ? (
                <Cover
                  repo={{ ...repo, img: images[activeImg] ?? images[0] }}
                  tag={`exp. ${pad(index)}`}
                  className="aspect-[4/3] w-full rounded-[3px] border border-line-2"
                />
              ) : (
                <GenerativeCover name={repo.name} tag={`exp. ${pad(index)}`} className="aspect-[4/3] w-full rounded-[3px] border border-line-2" />
              )}
              {scanning && (
                <div className="absolute right-6 top-6 flex items-center gap-1.5 rounded-full bg-ink/75 px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest text-paper backdrop-blur-sm">
                  <Loader2 size={10} className="animate-spin" /> escaneando archivo
                </div>
              )}
            </div>

            {showGallery && (
              <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-3">
                {images.map((src, i) => (
                  <button
                    key={src + i}
                    onClick={() => setActiveImg(i)}
                    aria-label={`Ver pieza visual ${i + 1}`}
                    className={cn(
                      "relative h-14 w-20 shrink-0 overflow-hidden rounded-[2px] border transition-all",
                      i === activeImg ? "border-accent ring-1 ring-accent" : "border-line-2 opacity-60 hover:opacity-100"
                    )}
                  >
                    <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between gap-2 border-t border-line px-4 py-3">
              <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-ink-3">
                <span className="flex items-center gap-1 text-ink-2">
                  <Star size={11} className="fill-gold text-gold" /> {repo.stargazers_count}
                </span>
                <span className="flex items-center gap-1">
                  <GitFork size={11} /> {repo.forks_count}
                </span>
                <span className="flex items-center gap-1">
                  <Eye size={11} /> {fmtSize(repo.size)}
                </span>
              </div>
              {!images.length && !scanning && (
                <span className="flex items-center gap-1 font-mono text-[9px] uppercase tracking-widest text-ink-3">
                  <ScanSearch size={10} /> sin registro visual
                </span>
              )}
            </div>
          </div>

          {/* columna datos */}
          <div className="flex flex-col p-5">
            <h2 className="font-display text-[2rem] font-semibold leading-[1.02] tracking-[-0.01em] text-ink">
              {repo.name}
            </h2>
            <p className="mt-2 text-[0.9rem] leading-relaxed text-ink-2">
              {repo.description ?? "Registro sin descripción archivada."}
            </p>

            {repo.topics.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {repo.topics.slice(0, 8).map((t) => (
                  <span key={t} className="rounded-full border border-line bg-paper px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-wider text-ink-2">
                    {t}
                  </span>
                ))}
              </div>
            )}

            <dl className="mt-4 rounded-[3px] border border-line bg-paper px-3 py-1.5">
              <Field k="Clasificación" v={repo.language ?? "texto plano"} />
              <Field k="Incorporación" v={fmtDate(repo.created_at)} />
              <Field k="Última revisión" v={`${fmtDate(repo.pushed_at)} (${fmtRelative(repo.pushed_at)})`} />
              <Field k="Volumen" v={fmtSize(repo.size)} />
              <Field k="Licencia" v={repo.license?.spdx_id && repo.license.spdx_id !== "NOASSERTION" ? repo.license.spdx_id : "sin registrar"} />
              <Field k="Estado" v={repo.archived ? "archivado" : "en circulación"} />
            </dl>

            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href={repo.html_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-sm border border-accent bg-accent px-3.5 py-2 font-mono text-[11px] font-bold uppercase tracking-widest text-card transition-all hover:bg-accent-deep"
              >
                <GhIcon size={13} /> Ver en GitHub <ArrowUpRight size={12} />
              </a>
              {demo && (
                <a
                  href={demo}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 rounded-sm border border-ink/60 bg-card px-3.5 py-2 font-mono text-[11px] font-bold uppercase tracking-widest text-ink transition-all hover:bg-ink hover:text-paper"
                >
                  <Globe size={13} /> Demo en vivo
                </a>
              )}
            </div>

            <div className="mt-auto pt-4">
              <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-ink-3">Préstamo de ejemplar</div>
              <div className="mt-1.5 flex items-center gap-2 rounded-[3px] border border-line-2 bg-ink px-3 py-2">
                <code className="min-w-0 flex-1 truncate font-mono text-[11px] text-paper">
                  <span className="text-paper/50">$</span> git clone {repo.html_url}.git
                </code>
                <button
                  onClick={copyClone}
                  aria-label="Copiar comando de clonación"
                  className="shrink-0 rounded-sm border border-paper/25 p-1.5 text-paper/80 transition-colors hover:bg-paper/10 hover:text-paper"
                >
                  {copied ? <Check size={12} className="text-moss" /> : <Copy size={12} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* navegación entre fichas */}
        <div className="flex items-center justify-between border-t border-line px-5 py-2.5">
          <button
            onClick={onPrev}
            disabled={total < 2}
            className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-ink-2 transition-colors hover:text-accent disabled:opacity-30"
          >
            <ChevronLeft size={13} /> ficha anterior
          </button>
          <span className="font-mono text-[10px] tracking-[0.25em] text-ink-3">
            {index + 1} / {total}
          </span>
          <button
            onClick={onNext}
            disabled={total < 2}
            className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-ink-2 transition-colors hover:text-accent disabled:opacity-30"
          >
            ficha siguiente <ChevronRight size={13} />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
