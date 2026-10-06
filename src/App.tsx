import { AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";
import Analysis from "./components/Analysis";
import Boot from "./components/Boot";
import Bytes from "./components/Bytes";
import Footer from "./components/Footer";
import Hashes from "./components/Hashes";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import TopBar from "./components/TopBar";
import { analyze } from "./lib/crypto";

const SPECIMEN = "00000000000000002331cbd81c832ed1";
const NOISE_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 220 220' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E")`;

export default function App() {
  const [booted, setBooted] = useState(false);
  const [specimen, setSpecimen] = useState(SPECIMEN);
  const analysis = useMemo(() => analyze(specimen), [specimen]);

  const marqueeItems = [
    "ESPECIMEN 001",
    `${analysis.length} GLIFOS DETENIDOS`,
    `REGISTRO DE ${analysis.bitLength} BITS`,
    `${analysis.leadingZeros} CEROS INICIALES`,
    analysis.isHex ? "CADENA HEXADECIMAL" : "CANAL UTF-8",
    `ENTROPÍA ${analysis.entropy.toFixed(2)} BITS`,
    "ORIGEN DESCONOCIDO",
    "ESTADO // VERIFICADO",
  ];

  return (
    <div className="relative min-h-screen bg-void font-mono text-bone">
      {/* boot overlay */}
      <AnimatePresence>
        {!booted && <Boot onDone={() => setBooted(true)} />}
      </AnimatePresence>

      {/* atmosphere layers */}
      <div className="bg-grid pointer-events-none fixed inset-0 z-0" />
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 65% at 50% -10%, rgba(215,255,62,0.06), transparent 60%), radial-gradient(ellipse 70% 55% at 50% 115%, rgba(215,255,62,0.045), transparent 60%)",
        }}
      />
      <div className="pointer-events-none fixed inset-x-0 z-0 h-16 bg-gradient-to-b from-acid/10 to-transparent blur-xl scanline" />
      <div
        className="pointer-events-none fixed inset-0 z-[60] opacity-[0.05] mix-blend-overlay"
        style={{ backgroundImage: NOISE_SVG }}
      />

      <TopBar />

      <main className="relative z-10">
        <Hero specimen={specimen} setSpecimen={setSpecimen} analysis={analysis} />
        <Marquee items={marqueeItems} />
        <Analysis a={analysis} />
        <Hashes specimen={specimen} />
        <Bytes analysis={analysis} specimen={specimen} />
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
