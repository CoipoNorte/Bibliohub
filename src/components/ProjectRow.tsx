import { motion } from "framer-motion";
import { ChevronRight, Globe, Image as ImageIcon, Star } from "lucide-react";
import { demoUrl, fmtDate, langColor, type Repo } from "@/lib/github";

const pad = (n: number) => String(n + 1).padStart(3, "0");

export function ProjectRow({
  repo,
  index,
  onOpen,
}: {
  repo: Repo;
  index: number;
  onOpen: (repo: Repo) => void;
}) {
  const demo = demoUrl(repo);
  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      transition={{ duration: 0.25 }}
    >
      <button
        onClick={() => onOpen(repo)}
        className="group grid w-full cursor-pointer grid-cols-[3.2rem_1fr_auto] items-baseline gap-x-3 border-b border-line px-2 py-3 text-left transition-colors duration-200 hover:bg-card sm:grid-cols-[3.6rem_minmax(0,1.2fr)_minmax(0,1fr)_7rem_6.5rem] sm:gap-x-4 focus:outline-none focus-visible:bg-card"
        aria-label={`Abrir ficha de ${repo.name}`}
      >
        <span className="font-mono text-[10px] tracking-[0.15em] text-ink-3 transition-colors group-hover:text-accent">
          {pad(index)}
        </span>
        <span className="flex min-w-0 items-baseline gap-2">
          <span className="truncate font-display text-[1.06rem] font-semibold leading-tight text-ink transition-all duration-200 group-hover:translate-x-1 group-hover:text-accent-deep">
            {repo.name}
          </span>
          <span className="hidden shrink-0 gap-1.5 sm:flex">
            {repo.img && <ImageIcon size={11} className="text-accent" />}
            {demo && <Globe size={11} className="text-ink-3" />}
          </span>
        </span>
        <span className="hidden truncate text-[0.78rem] text-ink-2 sm:block">
          {repo.description ?? "—"}
        </span>
        <span className="hidden items-center gap-1.5 font-mono text-[10px] uppercase tracking-wide text-ink-3 sm:flex">
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: langColor(repo.language) }} />
          {repo.language ?? "txt"}
          {repo.stargazers_count > 0 && (
            <span className="ml-1 flex items-center gap-0.5 text-ink-2">
              <Star size={9} className="fill-gold text-gold" />
              {repo.stargazers_count}
            </span>
          )}
        </span>
        <span className="flex items-center justify-end gap-1 font-mono text-[10px] text-ink-3">
          {fmtDate(repo.pushed_at)}
          <ChevronRight size={12} className="opacity-0 transition-opacity group-hover:opacity-100" />
        </span>
      </button>
    </motion.div>
  );
}
