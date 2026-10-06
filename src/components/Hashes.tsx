import { motion } from "framer-motion";
import { Check, Copy, Lock } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { md5, sha } from "../lib/crypto";

interface Row {
  name: string;
  bits: number;
  note: string;
  value: string | null | undefined;
}

export default function Hashes({ specimen }: { specimen: string }) {
  const md5v = useMemo(() => md5(specimen), [specimen]);
  const [sha1, setSha1] = useState<string | null | undefined>(undefined);
  const [sha256, setSha256] = useState<string | null | undefined>(undefined);
  const [sha512, setSha512] = useState<string | null | undefined>(undefined);
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (key: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1200);
  };

  useEffect(() => {
    let alive = true;
    setSha1(undefined);
    setSha256(undefined);
    setSha512(undefined);
    sha("SHA-1", specimen).then((v) => alive && setSha1(v));
    sha("SHA-256", specimen).then((v) => alive && setSha256(v));
    sha("SHA-512", specimen).then((v) => alive && setSha512(v));
    return () => {
      alive = false;
    };
  }, [specimen]);

  const rows: Row[] = [
    { name: "MD5", bits: 128, note: "RFC 1321 · local", value: md5v },
    { name: "SHA-1", bits: 160, note: "Web Crypto", value: sha1 },
    { name: "SHA-256", bits: 256, note: "Web Crypto", value: sha256 },
    { name: "SHA-512", bits: 512, note: "Web Crypto", value: sha512 },
  ];

  return (
    <section id="hashes" className="relative border-t border-line bg-panel/40">
      <div className="mx-auto max-w-7xl px-5 py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mb-14 flex flex-wrap items-end justify-between gap-6"
        >
          <div>
            <p className="font-mono text-[10px] tracking-[0.4em] text-acid">
              02 / FORJA
            </p>
            <h2 className="mt-3 font-display text-4xl font-extrabold uppercase tracking-tight text-bone md:text-6xl">
              Banco de Hashes
            </h2>
          </div>
          <p className="flex max-w-sm items-start gap-3 font-mono text-xs leading-relaxed text-fog">
            <Lock className="mt-0.5 size-4 shrink-0 text-acid" strokeWidth={1.5} />
            Cada resumen se calcula en el propio dispositivo. Cero servidores intermediarios.
          </p>
        </motion.div>

        <div>
          {rows.map((r, i) => (
            <div
              key={r.name}
              className={`grid items-center gap-x-6 gap-y-3 border-t border-line px-1 py-5 transition-colors hover:bg-panel2 md:grid-cols-[170px_minmax(0,1fr)_auto] ${
                i === rows.length - 1 ? "border-b" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="font-display text-sm font-semibold tracking-wider text-bone">
                  {r.name}
                </span>
                <span className="border border-line px-1.5 py-0.5 font-mono text-[9px] text-dim">
                  {r.bits}b
                </span>
              </div>
              <div className="min-w-0">
                {r.value === undefined ? (
                  <span className="font-mono text-sm text-dim">
                    calculando<span className="animate-blink">...</span>
                  </span>
                ) : r.value === null ? (
                  <span className="font-mono text-sm text-ember">
                    no disponible
                  </span>
                ) : (
                  <p className="break-all font-mono text-[13px] leading-6 tracking-wider text-bone/85">
                    <span className="text-acid">{r.value.slice(0, 8)}</span>
                    {r.value.slice(8)}
                  </p>
                )}
                <p className="mt-1 font-mono text-[9px] tracking-[0.25em] text-dim">
                  {r.note}
                </p>
              </div>
              <button
                onClick={() => r.value && copy(r.name, r.value)}
                disabled={!r.value}
                className={`flex items-center gap-2 justify-self-start border px-3 py-2 font-mono text-[10px] tracking-[0.25em] transition-all md:justify-self-end ${
                  copied === r.name
                    ? "border-acid bg-acid text-black"
                    : "border-line text-fog hover:border-acid/60 hover:text-acid"
                } disabled:cursor-not-allowed disabled:opacity-40`}
              >
                {copied === r.name ? (
                  <Check className="size-3.5" strokeWidth={2} />
                ) : (
                  <Copy className="size-3.5" strokeWidth={1.5} />
                )}
                {copied === r.name ? "COPIADO" : "COPIAR"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
