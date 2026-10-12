import { useMemo, useState } from "react";
import { cn } from "@/utils/cn";
import type { Repo } from "@/lib/github";

// Paletas papel/tinta para las portadas tipográficas
const PALETTES: { bg: string; fg: string }[] = [
  { bg: "#262019", fg: "#e9e2d0" },
  { bg: "#a63d22", fg: "#f6ecda" },
  { bg: "#3e5c43", fg: "#eef0dd" },
  { bg: "#2f3e55", fg: "#e9e6d4" },
  { bg: "#8a6d2f", fg: "#f5eedc" },
  { bg: "#241f2e", fg: "#eadfd2" },
];

const hash = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
};

function initials(name: string): string {
  const words = name.replace(/[^a-zA-Z0-9áéíóúñü]+/g, " ").trim().split(/\s+/);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function Pattern({ variant, fg }: { variant: number; fg: string }) {
  if (variant === 0) {
    // medio tono
    const cells = [];
    for (let y = 0; y < 9; y++)
      for (let x = 0; x < 14; x++)
        cells.push(
          <circle key={`${x}-${y}`} cx={x * 25 + (y % 2 ? 12 : 0)} cy={y * 25} r={2.4 + ((x + y) % 3)} fill={fg} opacity={0.16} />
        );
    return <g>{cells}</g>;
  }
  if (variant === 1) {
    // hachurado diagonal
    const lines = [];
    for (let i = -12; i < 32; i++)
      lines.push(<line key={i} x1={i * 16} y1={-20} x2={i * 16 + 120} y2={240} stroke={fg} strokeWidth={1.4} opacity={0.14} />);
    return <g>{lines}</g>;
  }
  if (variant === 2) {
    // arcos concéntricos
    const arcs = [];
    for (let r = 22; r <= 320; r += 26)
      arcs.push(<circle key={r} cx={282} cy={196} r={r} fill="none" stroke={fg} strokeWidth={1.2} opacity={0.16} />);
    return <g>{arcs}</g>;
  }
  if (variant === 3) {
    // cruces
    const plus = [];
    for (let y = 0; y < 8; y++)
      for (let x = 0; x < 13; x++) {
        const px = x * 27 + 14,
          py = y * 27 + 10;
        plus.push(
          <path key={`${x}-${y}`} d={`M ${px - 4} ${py} H ${px + 4} M ${px} ${py - 4} V ${py + 4}`} stroke={fg} strokeWidth={1.6} opacity={0.15} />
        );
      }
    return <g>{plus}</g>;
  }
  // tablero de ajedrez desvanecido
  const sq = [];
  const size = 40;
  for (let y = 0; y < 6; y++)
    for (let x = 0; x < 9; x++)
      if ((x + y) % 2 === 0)
        sq.push(<rect key={`${x}-${y}`} x={x * size} y={y * size} width={size} height={size} fill={fg} opacity={0.10} />);
  return <g>{sq}</g>;
}

export function GenerativeCover({
  name,
  tag,
  tagClassName = "text-[9px]",
  className,
}: {
  name: string;
  tag?: string;
  tagClassName?: string;
  className?: string;
}) {
  const h = hash(name);
  const pal = PALETTES[h % PALETTES.length];
  const variant = (h >> 3) % 5;
  return (
    <div
      className={cn("relative overflow-hidden select-none", className)}
      style={{ background: pal.bg }}
      aria-hidden="true"
    >
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 330 210" preserveAspectRatio="xMidYMid slice">
        <Pattern variant={variant} fg={pal.fg} />
      </svg>
      <div
        className="absolute -bottom-4 left-3 font-display italic leading-none tracking-tight"
        style={{ color: pal.fg, fontSize: "5.4rem", opacity: 0.94 }}
      >
        {initials(name)}
      </div>
      <div
        className="absolute right-2.5 bottom-2.5 font-mono uppercase tracking-widest"
        style={{ color: pal.fg, opacity: 0.6, fontSize: "8px" }}
      >
        registro visual pendiente
      </div>
      {tag && (
        <div className={cn("absolute top-2 left-2.5 font-mono uppercase tracking-widest", tagClassName)} style={{ color: pal.fg, opacity: 0.75 }}>
          {tag}
        </div>
      )}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ boxShadow: "inset 0 0 0 1px rgba(30,27,20,0.25)" }}
      />
    </div>
  );
}

/** Portada inteligente: imagen real (con respaldo) o cubierta tipográfica. */
export function Cover({
  repo,
  tag,
  className,
  imgClassName,
}: {
  repo: Repo;
  tag?: string;
  className?: string;
  imgClassName?: string;
}) {
  const urls = useMemo(
    () => [repo.img, repo.imgFb].filter(Boolean) as string[],
    [repo.img, repo.imgFb]
  );
  const [idx, setIdx] = useState(0);
  const [loaded, setLoaded] = useState(false);

  if (!urls.length || idx >= urls.length) {
    return <GenerativeCover name={repo.name} tag={tag} className={className} />;
  }
  return (
    <div className={cn("relative overflow-hidden", className)}>
      {!loaded && <div className="absolute inset-0 animate-pulse bg-paper-2" />}
      <img
        key={urls[idx]}
        src={urls[idx]}
        alt={`Registro visual de ${repo.name}`}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setIdx((i) => i + 1)}
        className={cn(
          "duotone h-full w-full object-cover transition-all duration-700 group-hover:scale-[1.04]",
          loaded ? "opacity-100" : "opacity-0",
          imgClassName
        )}
      />
      {tag && (
        <div className="absolute top-2 left-2.5 rounded-sm bg-ink/70 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-widest text-paper backdrop-blur-sm">
          {tag}
        </div>
      )}
    </div>
  );
}
