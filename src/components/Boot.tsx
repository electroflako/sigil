import { motion } from "framer-motion";
import { useEffect } from "react";

const LINES = [
  "> interceptación recibida · 32 glifos",
  "> juego de carácteres fijado :: 0-9 a-f",
  "> compilando las pruebas forenses",
  "> mostrando los resultados del laboratorio",
];

export default function Boot({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1750);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-8 bg-void"
      exit={{ y: "-100%" }}
      transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="flex w-72 flex-col gap-2 font-mono text-[11px] tracking-widest text-fog sm:w-96 sm:text-xs">
        {LINES.map((l, i) => (
          <motion.p
            key={l}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.18 * i + 0.1, duration: 0.3 }}
            className={i === LINES.length - 1 ? "text-acid" : ""}
          >
            {l}
          </motion.p>
        ))}
      </div>
      <div className="h-px w-72 overflow-hidden bg-line sm:w-96">
        <motion.div
          className="h-full bg-acid"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.45, ease: "easeInOut", delay: 0.15 }}
        />
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="font-display text-[10px] font-light tracking-[0.5em] text-dim"
      >
        SIGIL / LAB
      </motion.p>
    </motion.div>
  );
}
