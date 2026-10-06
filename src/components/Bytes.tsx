import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import type { Analysis } from "../lib/crypto";
import { md5 } from "../lib/crypto";

function Sigil({ hash }: { hash: string }) {
  const cells = useMemo(() => {
    const out: { x: number; y: number; o: number }[] = [];
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 3; c++) {
        const v = parseInt(hash[r * 3 + c] || "0", 16);
        if (v % 3 !== 0) {
          const o = 0.28 + (v / 15) * 0.72;
          out.push({ x: c, y: r, o });
          if (c !== 2) out.push({ x: 4 - c, y: r, o });
        }
      }
    }
    return out;
  }, [hash]);

  return (
    <div className="relative mx-auto w-full max-w-[280px]">
      <svg viewBox="0 0 240 240" className="w-full">
        <circle cx="120" cy="120" r="114" fill="none" stroke="#1e1e24" strokeWidth="1" />
        <circle
          cx="120"
          cy="120"
          r="106"
          fill="none"
          stroke="#1e1e24"
          strokeWidth="1"
          strokeDasharray="2 6"
        />
        <g
          className="animate-spin-slower"
          style={{ transformOrigin: "120px 120px" }}
        >
          <defs>
            <path
              id="sigil-ring"
              d="M120,120 m-96,0 a96,96 0 1,1 192,0 a96,96 0 1,1 -192,0"
              fill="none"
            />
          </defs>
          <text
            fontSize="9"
            letterSpacing="3"
            fill="#8f8d88"
            fontFamily="'JetBrains Mono', monospace"
          >
            <textPath href="#sigil-ring">
              {`SIGILO · 0X${hash.slice(0, 8).toUpperCase()} · LABORATORIO FORENSE DE CADENAS · 2026`}
            </textPath>
          </text>
        </g>
        {cells.map((k, i) => (
          <rect
            key={i}
            x={62 + k.x * 24}
            y={62 + k.y * 24}
            width="20"
            height="20"
            rx="2"
            fill="#d7ff3e"
            opacity={k.o}
          />
        ))}
      </svg>
      <p className="mt-3 text-center font-mono text-[9px] tracking-[0.35em] text-dim">
        IDENTIDAD GENERADA · DESDE MD5
      </p>
    </div>
  );
}

export default function Bytes({
  analysis,
  specimen,
}: {
  analysis: Analysis;
  specimen: string;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const hash = useMemo(() => md5(specimen), [specimen]);
  const { bytes } = analysis;
  const ascii = bytes
    .map((b) => (b >= 32 && b < 127 ? String.fromCharCode(b) : "·"))
    .join("");
  const active = hover !== null ? bytes[hover] : null;

  return (
    <section id="bytes" className="relative mx-auto max-w-7xl px-5 py-24 md:py-32">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="mb-14"
      >
        <p className="font-mono text-[10px] tracking-[0.4em] text-acid">
          03 / CAMPO
        </p>
        <h2 className="mt-3 font-display text-4xl font-extrabold uppercase tracking-tight text-bone md:text-6xl">
          Campo de Bytes
        </h2>
      </motion.div>

      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <div className="mb-3 flex items-center justify-between font-mono text-[10px] tracking-[0.3em] text-dim">
            <span>MAPA DE MEMORIA</span>
            <span>{bytes.length} CELDAS</span>
          </div>
          {bytes.length === 0 ? (
            <div className="grid h-48 place-items-center border border-line font-mono text-xs text-dim">
              // SIN MEMORIA QUE MAPEAR //
            </div>
          ) : (
            <div
              className="grid grid-cols-4 gap-px border border-line bg-line"
              onMouseLeave={() => setHover(null)}
            >
              {bytes.map((b, i) => (
                <div
                  key={i}
                  onMouseEnter={() => setHover(i)}
                  className={`relative flex aspect-square cursor-crosshair flex-col items-center justify-center transition-transform duration-150 ${
                    b === 0 ? "hatch" : ""
                  } ${hover === i ? "z-10 scale-[1.04] outline outline-acid" : ""}`}
                  style={{
                    backgroundColor:
                      b === 0
                        ? "#060607"
                        : `rgba(215,255,62,${0.03 + (b / 255) * 0.34})`,
                  }}
                >
                  <span className="absolute top-1.5 left-1.5 font-mono text-[8px] text-dim">
                    {i.toString(16).padStart(2, "0").toUpperCase()}
                  </span>
                  <span
                    className={`font-mono text-lg font-medium tabular-nums sm:text-2xl ${
                      b === 0 ? "text-dim" : "text-bone"
                    }`}
                  >
                    {b.toString(16).padStart(2, "0").toUpperCase()}
                  </span>
                  <span className="font-mono text-[9px] text-fog tabular-nums">
                    {b}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="mt-3 flex h-9 items-center border border-line bg-panel px-4 font-mono text-[11px] tracking-[0.2em]">
            {active === null || hover === null ? (
              <span className="text-dim">PASA EL CURSOR PARA INTERROGAR UN BYTE</span>
            ) : (
              <span className="text-bone tabular-nums">
                BYTE <span className="text-acid">{String(hover).padStart(2, "0")}</span>
                {" "}0x{active.toString(16).padStart(2, "0").toUpperCase()}
                {" "}DEC {active}
                {" "}BIN {active.toString(2).padStart(8, "0")}
                {" "}CAR {active >= 32 && active < 127 ? String.fromCharCode(active) : "·"}
              </span>
            )}
          </div>

          <p className="mt-10 mb-4 font-mono text-[10px] tracking-[0.35em] text-dim">
            ONDA DE LA SEÑAL
          </p>
          <div className="flex h-40 items-end gap-[5px] border border-line bg-panel p-4">
            {bytes.length === 0 && (
              <p className="m-auto font-mono text-xs text-dim">// SEÑAL VACÍA //</p>
            )}
            {bytes.map((b, i) => (
              <div
                key={i}
                title={`0x${b.toString(16).padStart(2, "0")}`}
                onMouseEnter={() => setHover(i)}
                className={`flex-1 transition-all duration-300 ${
                  b === 0 ? "bg-line" : hover === i ? "bg-bone" : "bg-acid/70 hover:bg-acid"
                }`}
                style={{ height: `${Math.max(3, (b / 255) * 100)}%` }}
              />
            ))}
          </div>

          <p className="mt-10 mb-3 font-mono text-[10px] tracking-[0.35em] text-dim">
            LECTURA ASCII
          </p>
          <p className="break-all border border-line bg-panel px-4 py-3 font-mono text-sm tracking-[0.3em] text-fog">
            {ascii || "// VACÍO //"}
          </p>
        </div>

        <div className="flex flex-col items-center justify-center border border-line bg-panel/40 p-10">
          <Sigil hash={hash} />
          <div className="mt-8 w-full border-t border-line pt-6">
            <div className="flex justify-between font-mono text-[10px] tracking-[0.25em] text-dim">
              <span>SUJETO</span>
              <span className="text-bone">
                0x{hash.slice(24).toUpperCase()}
              </span>
            </div>
            <div className="mt-3 flex justify-between font-mono text-[10px] tracking-[0.25em] text-dim">
              <span>CUSTODIA</span>
              <span className="text-acid">VERIFICADO · SOLO LOCAL</span>
            </div>
            <div className="mt-3 flex justify-between font-mono text-[10px] tracking-[0.25em] text-dim">
              <span>NIVEL DE RUIDO</span>
              <span className="text-bone tabular-nums">
                {(analysis.noiseScore * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
