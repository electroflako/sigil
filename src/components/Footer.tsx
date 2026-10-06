import { ArrowUp, Fingerprint } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line">
      <div className="mx-auto max-w-7xl px-5 pt-20 pb-10">
        <div className="flex flex-col items-start justify-between gap-10 md:flex-row md:items-end">
          <div>
            <p className="font-mono text-[10px] tracking-[0.4em] text-acid">
              DECLARACIÓN DE CLAUSURA
            </p>
            <p className="mt-4 max-w-md font-mono text-sm leading-7 text-fog">
              El espécimen ha sido disecado, resumido y sellado criptográficamente.
              El caso continúa abierto en el navegador.
            </p>
          </div>
          <a
            href="#top"
            className="group flex items-center gap-3 border border-line px-4 py-3 font-mono text-[10px] tracking-[0.3em] text-fog transition-colors hover:border-acid/60 hover:text-acid"
          >
            VOLVER ARRIBA
            <ArrowUp
              className="size-3.5 transition-transform group-hover:-translate-y-1"
              strokeWidth={1.5}
            />
          </a>
        </div>

        <p
          aria-hidden
          className="text-outline pointer-events-none mt-14 text-center font-display text-[22vw] leading-[0.85] font-black uppercase opacity-60 select-none md:text-[16vw]"
        >
          SIGIL
        </p>

        <div className="mt-2 flex flex-col items-center justify-between gap-4 border-t border-line pt-6 md:flex-row">
          <span className="flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] text-dim">
            <Fingerprint className="size-3.5 text-acid" strokeWidth={1.5} />
            CADA HASH DEJA UNA HUELLA
          </span>
          <span className="font-mono text-[10px] tracking-[0.25em] text-dim">
            FORENSE SOLO LOCAL · SIN SERVIDORES · CERO TELEMETRÍA
          </span>
          <span className="font-mono text-[10px] tracking-[0.25em] text-dim">
            © 2026 SIGIL/0X LAB
          </span>
        </div>
      </div>
    </footer>
  );
}
