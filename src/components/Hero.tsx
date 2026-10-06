import { motion } from "framer-motion";
import { ArrowDown, Terminal } from "lucide-react";
import type { Analysis } from "../lib/crypto";

interface Props {
  specimen: string;
  setSpecimen: (s: string) => void;
  analysis: Analysis;
}

const cellWrap = {
  hidden: {},
  show: { transition: { staggerChildren: 0.022, delayChildren: 0.25 } },
};

const cell = {
  hidden: { opacity: 0, y: 16, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function Hero({ specimen, setSpecimen, analysis }: Props) {
  const chars = specimen.split("");
  const cols =
    analysis.length > 64 ? "grid-cols-8 md:grid-cols-13" : "grid-cols-8 md:grid-cols-16";

  return (
    <section id="top" className="relative overflow-hidden pt-32 pb-16 md:pt-40">
      <div
        aria-hidden
        className="pointer-events-none absolute top-24 right-0 hidden select-none xl:block"
      >
        <p className="font-display text-[11px] font-light tracking-[0.65em] text-dim uppercase [writing-mode:vertical-rl]">
          cada hash deja una huella · lab 0x2E · {analysis.length} glifos
        </p>
      </div>

      <div className="mx-auto max-w-7xl px-5">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="flex items-center gap-4"
        >
          <span className="border border-acid/40 bg-acid/5 px-3 py-1 font-mono text-[10px] tracking-[0.3em] text-acid">
            TRANSMISIÓN ENTRANTE
          </span>
          <span className="hidden font-mono text-[10px] tracking-[0.3em] text-dim sm:block">
            ESPECIMEN 001 // ORIGEN DESCONOCIDO // CLASE: HEXADECIMAL
          </span>
        </motion.div>

        <h1 className="mt-8 font-display font-extrabold uppercase leading-[0.92] tracking-tight">
          <span className="block overflow-hidden">
            <motion.span
              className="block text-[clamp(3rem,10vw,8.5rem)] text-bone"
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            >
              Cadenas
            </motion.span>
          </span>
          <span className="block overflow-hidden">
            <motion.span
              className="text-outline block text-[clamp(3rem,10vw,8.5rem)]"
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.22 }}
            >
              Forenses
            </motion.span>
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-6 max-w-xl font-mono text-sm leading-relaxed text-fog"
        >
          Una cadena inexplicable. Sin remitente, sin etiqueta, sin piedad.
          Alimenta al laboratorio: analiza su entropía, forja sus hashes y
          genera su sigilo identificador único.
        </motion.p>

        <motion.div
          variants={cellWrap}
          initial="hidden"
          animate="show"
          className="mt-14"
        >
          <div className="mb-3 flex items-center justify-between font-mono text-[10px] tracking-[0.3em] text-dim">
            <span>PRUEBA A · ESPECIMEN ORIGINAL</span>
            <span className="tabular-nums">
              {analysis.length
                ? `${analysis.leadingZeros} NULOS + ${analysis.length - analysis.leadingZeros} VIVOS`
                : "VACÍO"}
            </span>
          </div>

          <div className={`grid ${cols} gap-px border border-line bg-line`}>
            {chars.length === 0 && (
              <div className="col-span-full grid h-24 place-items-center bg-void font-mono text-xs text-dim">
                // ESPECIMEN VACÍO //
              </div>
            )}
            {chars.map((c, i) => {
              const isNull = c === "0" && i < analysis.leadingZeros;
              return (
                <motion.div
                  key={`${i}-${c}`}
                  variants={cell}
                  title={`IDX ${String(i).padStart(2, "0")} · U+${c.codePointAt(0)!.toString(16).toUpperCase().padStart(4, "0")}`}
                  className={`group relative flex aspect-square cursor-crosshair items-center justify-center transition-colors duration-150 ${
                    isNull ? "hatch bg-void" : "bg-void hover:bg-acid"
                  }`}
                >
                  <span
                    className={`font-mono text-base transition-colors duration-150 sm:text-xl md:text-2xl ${
                      isNull
                        ? "text-dim group-hover:text-fog"
                        : "text-bone group-hover:text-black"
                    }`}
                  >
                    {c}
                  </span>
                  <span className="absolute bottom-1 right-1 font-mono text-[7px] text-dim opacity-0 transition-opacity group-hover:opacity-100">
                    {i.toString(16).padStart(2, "0").toUpperCase()}
                  </span>
                </motion.div>
              );
            })}
          </div>

          {analysis.length > 0 && (
            <div className="mt-3 flex gap-4">
              {analysis.leadingZeros > 0 && (
                <div style={{ flexGrow: analysis.leadingZeros }} className="min-w-0">
                  <div className="border-t-2 border-dim/60" />
                  <p className="mt-2 truncate font-mono text-[9px] tracking-[0.25em] text-dim">
                    PREFIJO NULO · {analysis.leadingZeros}
                  </p>
                </div>
              )}
              <div className="min-w-0" style={{ flexGrow: Math.max(1, analysis.length - analysis.leadingZeros) }}>
                <div className="border-t-2 border-acid" />
                <p className="mt-2 truncate font-mono text-[9px] tracking-[0.25em] text-acid">
                  CARGA ÚTIL · {analysis.length - analysis.leadingZeros} · {analysis.payload.slice(0, 20) || "—"}
                </p>
              </div>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="mt-12"
        >
          <p className="mb-2 font-mono text-[10px] tracking-[0.3em] text-dim">
            MUTAR EL ESPECIMEN · EL LABORATORIO RECALCULA EN VIVO
          </p>
          <div className="flex items-center gap-3 border border-line bg-panel px-4 py-3.5 transition-colors focus-within:border-acid/60">
            <Terminal className="size-4 shrink-0 text-acid" strokeWidth={1.5} />
            <input
              value={specimen}
              onChange={(e) => setSpecimen(e.target.value.replace(/\s/g, ""))}
              spellCheck={false}
              autoComplete="off"
              placeholder="introduce una cadena..."
              className="w-full bg-transparent font-mono text-sm tracking-wider text-bone caret-acid outline-none placeholder:text-dim md:text-base"
            />
            <span className="shrink-0 font-mono text-[10px] tracking-[0.2em] text-dim tabular-nums">
              {analysis.length} GLIFOS
            </span>
          </div>
        </motion.div>

        <motion.a
          href="#analysis"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="group mt-12 inline-flex items-center gap-3 font-mono text-[10px] tracking-[0.35em] text-fog transition-colors hover:text-acid"
        >
          INICIAR AUTOPSIA
          <ArrowDown className="size-3.5 animate-bounce" strokeWidth={1.5} />
        </motion.a>
      </div>
    </section>
  );
}
