import { Fingerprint } from "lucide-react";
import { useEffect, useState } from "react";

const LINKS = [
  { label: "AUTOPSIA", href: "#analysis" },
  { label: "HASHES", href: "#hashes" },
  { label: "CAMPO", href: "#bytes" },
  { label: "SIGILO", href: "#bytes" },
];

export default function TopBar() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const p = (n: number) => String(n).padStart(2, "0");
      setTime(
        `${p(d.getUTCHours())}:${p(d.getUTCMinutes())}:${p(d.getUTCSeconds())} UTC`,
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-void/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5">
        <a href="#top" className="group flex items-center gap-3">
          <span className="grid size-8 place-items-center border border-line bg-panel transition-colors group-hover:border-acid">
            <Fingerprint className="size-4 text-acid" strokeWidth={1.5} />
          </span>
          <span className="font-display text-xs font-semibold tracking-[0.3em] text-bone">
            SIGIL<span className="text-dim">/</span>
            <span className="text-acid">0X</span>
          </span>
        </a>

        <nav className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="font-mono text-[10px] tracking-[0.25em] text-fog transition-colors hover:text-acid"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <span className="size-1.5 animate-pulse-dot rounded-full bg-acid" />
          <span className="font-mono text-[10px] tracking-[0.2em] text-fog tabular-nums">
            {time}
          </span>
        </div>
      </div>
    </header>
  );
}
