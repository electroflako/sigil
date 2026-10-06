import { motion } from "framer-motion";
import type { ReactNode } from "react";
import type { Analysis, Verdict } from "../lib/crypto";

const TONE: Record<Verdict["tone"], string> = {
  acid: "border-acid/50 bg-acid/5 text-acid",
  bone: "border-line bg-panel text-fog",
  ember: "border-ember/60 bg-ember/5 text-ember",
};

function Stat({
  label,
  value,
  sub,
  delay,
}: {
  label: string;
  value: string;
  sub?: ReactNode;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className="group flex flex-col justify-between gap-6 bg-void p-5 transition-colors hover:bg-panel2"
    >
      <p className="font-mono text-[9px] tracking-[0.3em] text-dim group-hover:text-fog">
        {label}
      </p>
      <div>
        <p className="font-display text-3xl font-semibold text-bone tabular-nums lg:text-4xl">
          {value}
        </p>
        {sub && <div className="mt-2">{sub}</div>}
      </div>
    </motion.div>
  );
}

export default function Analysis({ a }: { a: Analysis }) {
  const max = Math.max(1, ...a.histogram.map((h) => h.count));
  const findings =
    a.length === 0
      ? "El espécimen está vacío. Escribe arriba para ejecutar el análisis."
      : a.leadingZeros > 0
        ? `Los primeros ${a.leadingZeros} glifos son ceros: una secuencia que anula los ${a.leadingZeros * 4} bits superiores del registro. El resto contiene ${a.payload || "—"}.`
        : `Sin ceros iniciales: ${a.length} glifos de señal continua a ${a.entropy.toFixed(2)} bits de entropía por carácter.`;

  return (
    <section id="analysis" className="relative mx-auto max-w-7xl px-5 py-24 md:py-32">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="mb-14 flex flex-wrap items-end justify-between gap-6"
      >
        <div>
          <p className="font-mono text-[10px] tracking-[0.4em] text-acid">
            01 / AUTOPSIA
          </p>
          <h2 className="mt-3 font-display text-4xl font-extrabold uppercase tracking-tight text-bone md:text-6xl">
            Disección
          </h2>
        </div>
        <p className="max-w-sm font-mono text-xs leading-relaxed text-fog">
          Evaluación analítica en tiempo real del espécimen procesado localmente en tu navegador.
        </p>
      </motion.div>

      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div className="grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-3">
            <Stat label="LONGITUD" value={String(a.length)} delay={0} sub={<span className="font-mono text-[10px] text-fog">glifos</span>} />
            <Stat label="REGISTRO" value={String(a.bitLength)} delay={0.05} sub={<span className="font-mono text-[10px] text-fog">bits · {a.bytes.length} bytes</span>} />
            <Stat label="ALFABETO" value={String(a.unique)} delay={0.1} sub={<span className="font-mono text-[10px] text-fog">glifos distintos</span>} />
            <Stat label="SERIE MAYOR" value={String(a.longestRun)} delay={0.15} sub={<span className="font-mono text-[10px] text-fog">repeticiones</span>} />
            <Stat label="PREFIJO NULO" value={String(a.leadingZeros)} delay={0.2} sub={<span className="font-mono text-[10px] text-fog">ceros iniciales</span>} />
            <Stat
              label="ENTROPÍA SHANNON"
              value={a.entropy.toFixed(2)}
              delay={0.25}
              sub={
                <div className="h-1 w-full bg-line">
                  <div
                    className="h-full bg-acid transition-all duration-500"
                    style={{ width: `${Math.min(100, (a.entropy / 4) * 100)}%` }}
                  />
                </div>
              }
            />
          </div>

          <motion.blockquote
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-8 border-l-2 border-acid pl-6"
          >
            <p className="font-mono text-sm leading-7 text-bone/90">
              <span className="text-acid">RESULTADOS //</span> {findings}
            </p>
          </motion.blockquote>
        </div>

        <div className="lg:col-span-5">
          <p className="mb-4 font-mono text-[10px] tracking-[0.35em] text-dim">
            VEREDICTOS
          </p>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-wrap gap-2"
          >
            {a.verdicts.map((v) => (
              <span
                key={v.label}
                className={`flex items-center gap-2 border px-3 py-1.5 font-mono text-[10px] tracking-[0.25em] ${TONE[v.tone]}`}
              >
                <span className="size-1 rounded-full bg-current" />
                {v.label}
              </span>
            ))}
          </motion.div>

          <p className="mt-10 mb-4 font-mono text-[10px] tracking-[0.35em] text-dim">
            ESPECTRO DE FRECUENCIAS
          </p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="border border-line bg-panel p-5"
          >
            <div className="flex h-44 items-end gap-[6px]">
              {a.histogram.map((h) => (
                <div key={h.ch} className="group relative flex h-full flex-1 flex-col justify-end">
                  <span className="pointer-events-none absolute -top-1 left-1/2 -translate-x-1/2 -translate-y-full font-mono text-[9px] text-acid opacity-0 transition-opacity group-hover:opacity-100">
                    {h.count}
                  </span>
                  <div
                    className={`w-full transition-all duration-500 ${
                      h.count > 0 ? "bg-acid/80 group-hover:bg-acid" : "hatch bg-panel2"
                    }`}
                    style={{
                      height: h.count > 0 ? `${(h.count / max) * 100}%` : "4%",
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="mt-2 flex gap-[6px]">
              {a.histogram.map((h) => (
                <span
                  key={h.ch}
                  className={`flex-1 text-center font-mono text-[10px] uppercase ${
                    h.count > 0 ? "text-bone" : "text-dim"
                  }`}
                >
                  {h.ch}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
