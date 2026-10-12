import { motion } from "framer-motion";
import { ArrowUpRight, Globe, Image as ImageIcon, Star } from "lucide-react";
import { Cover } from "@/components/Cover";
import { demoUrl, fmtRelative, langColor, type Repo } from "@/lib/github";

const pad = (n: number) => String(n + 1).padStart(3, "0");

export function ProjectCard({
  repo,
  index,
  onOpen,
}: {
  repo: Repo;
  index: number;
  onOpen: (repo: Repo) => void;
}) {
  const demo = demoUrl(repo);
  const year = new Date(repo.pushed_at || repo.updated_at).getFullYear();

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.18 } }}
      transition={{ type: "spring", stiffness: 260, damping: 30 }}
      className="group relative"
    >
      <button
        onClick={() => onOpen(repo)}
        className="relative block w-full cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
        aria-label={`Abrir ficha de ${repo.name}`}
      >
        {/* lomo del libro */}
        <span className="absolute top-0 left-0 z-10 h-full w-[3px] origin-top scale-y-0 bg-accent transition-transform duration-300 group-hover:scale-y-100" />

        <div className="card-shadow rounded-[3px] border border-line bg-card transition-all duration-300 group-hover:-translate-y-1.5 group-hover:card-shadow-hover overflow-hidden">
          {/* cabecera de ficha */}
          <div className="flex items-center justify-between px-3.5 pt-2.5 pb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-3">
            <span>Ficha Nº {pad(index)}</span>
            <span>{year}</span>
          </div>
          <div className="perfo-line mx-3.5" />

          {/* cubierta */}
          <div className="relative mt-2.5">
            <Cover
              repo={repo}
              className="aspect-[16/10] w-full border-y border-line"
            />
            <span className="absolute right-2.5 bottom-2.5 flex gap-1.5">
              {demo && (
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink/70 text-paper backdrop-blur-sm" title="Tiene demo en vivo">
                  <Globe size={11} strokeWidth={2.2} />
                </span>
              )}
              {repo.img && (
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/90 text-card backdrop-blur-sm" title="Tiene imagen">
                  <ImageIcon size={11} strokeWidth={2.2} />
                </span>
              )}
            </span>
          </div>

          {/* cuerpo */}
          <div className="px-3.5 pt-3 pb-3.5">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-display text-[1.32rem] leading-[1.06] font-semibold tracking-[-0.01em] text-ink transition-colors duration-300 group-hover:text-accent-deep">
                {repo.name}
              </h3>
              <ArrowUpRight
                size={17}
                className="mt-1 shrink-0 text-ink-3 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
              />
            </div>
            <p className="mt-1.5 line-clamp-2 min-h-[2.4em] text-[0.82rem] leading-snug text-ink-2">
              {repo.description ?? "Registro sin descripción archivada."}
            </p>

            <div className="mt-3 flex items-center justify-between border-t border-line pt-2.5 font-mono text-[10px] tracking-wide text-ink-3">
              <span className="flex items-center gap-1.5">
                <span
                  className="inline-block h-2 w-2 rounded-full ring-1 ring-ink/15"
                  style={{ background: langColor(repo.language) }}
                />
                <span className="uppercase">{repo.language ?? "txt"}</span>
              </span>
              <span className="flex items-center gap-3">
                {repo.stargazers_count > 0 && (
                  <span className="flex items-center gap-1 text-ink-2">
                    <Star size={10} className="fill-gold text-gold" />
                    {repo.stargazers_count}
                  </span>
                )}
                <span title={repo.pushed_at}>{fmtRelative(repo.pushed_at)}</span>
              </span>
            </div>
          </div>
        </div>
      </button>
    </motion.article>
  );
}
