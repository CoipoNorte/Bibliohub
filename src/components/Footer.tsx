import { ArrowUp, BookMarked, MapPin } from "lucide-react";
import { PROFILE } from "@/data/meta";
import { GhIcon } from "@/components/icons";
import type { LangCount } from "@/components/Controls";

function Marquee({ langs }: { langs: LangCount[] }) {
  const items = langs.map((l) => `${l.name} ×${l.count}`);
  const seq = [...items, ...items, ...items];
  return (
    <div className="overflow-hidden border-y border-ink bg-ink py-2.5 text-paper" aria-hidden="true">
      <div className="marquee-track items-center gap-8 pr-8">
        {[0, 1].map((half) => (
          <div key={half} className="flex shrink-0 items-center gap-8">
            {seq.map((t, i) => (
              <span key={`${half}-${i}`} className="flex shrink-0 items-center gap-8 font-mono text-[11px] uppercase tracking-[0.25em]">
                {t}
                <span className="inline-block h-1.5 w-1.5 rotate-45 bg-accent" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function Footer({ langs, total }: { langs: LangCount[]; total: number }) {
  return (
    <footer className="mt-16">
      <Marquee langs={langs} />

      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <div className="grid gap-10 py-12 md:grid-cols-[1.4fr_1fr]">
          <div>
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-ink-3">
              <BookMarked size={12} className="text-accent" /> Fin del catálogo
            </div>
            <p className="mt-4 max-w-md font-display text-[1.7rem] font-medium leading-[1.15] text-ink">
              Cada pieza es un cuaderno de taller:{" "}
              <em className="italic text-accent">{total} volúmenes</em> escritos
              entre juegos, herramientas y ajedreces.
            </p>
            <p className="mt-4 max-w-md text-[0.85rem] leading-relaxed text-ink-2">
              Los datos se sirven en vivo desde la API pública de GitHub y las
              portadas se rescatan del README de cada proyecto. Si una ficha no
              tiene imagen todavía, la biblioteca le encuaderna una cubierta
              tipográfica provisional.
            </p>
          </div>

          <div className="rounded-[3px] border border-line bg-card p-5 card-shadow">
            <div className="flex items-center gap-3">
              <img
                src={PROFILE.avatar}
                alt="Avatar de CoipoNorte"
                className="h-11 w-11 rounded-full border border-line-2 object-cover duotone"
              />
              <div>
                <div className="font-display text-lg font-semibold leading-tight text-ink">{PROFILE.name}</div>
                <div className="flex items-center gap-1 font-mono text-[9.5px] uppercase tracking-widest text-ink-3">
                  <MapPin size={9} /> {PROFILE.location}
                </div>
              </div>
            </div>
            <dl className="mt-4 space-y-1.5 border-t border-line pt-3 font-mono text-[10.5px] text-ink-2">
              <div className="flex justify-between"><dt className="uppercase tracking-widest text-ink-3">Taller</dt><dd>{PROFILE.company}</dd></div>
              <div className="flex justify-between"><dt className="uppercase tracking-widest text-ink-3">Fondo desde</dt><dd>{PROFILE.since}</dd></div>
              <div className="flex justify-between"><dt className="uppercase tracking-widest text-ink-3">Lectores</dt><dd>{PROFILE.followers} seguidores</dd></div>
            </dl>
            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href={PROFILE.htmlUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-sm border border-ink/70 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-ink transition-all hover:bg-ink hover:text-paper"
              >
                <GhIcon size={12} /> Perfil GitHub
              </a>
              <a
                href={PROFILE.pagesUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-sm border border-line-2 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-ink-2 transition-all hover:border-accent hover:text-accent"
              >
                Sitio personal
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line py-4 font-mono text-[9.5px] uppercase tracking-[0.22em] text-ink-3">
          <span>Biblioteca del Coipo — catálogo Nº CN-{total} · Iquique, Chile</span>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-1.5 transition-colors hover:text-accent"
          >
            Volver a la estantería <ArrowUp size={11} />
          </button>
        </div>
      </div>
    </footer>
  );
}
