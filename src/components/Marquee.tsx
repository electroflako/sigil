import { Diamond } from "lucide-react";

export default function Marquee({ items }: { items: string[] }) {
  const row = [...items, ...items];
  return (
    <div className="overflow-hidden border-y border-line bg-panel/60 py-3">
      <div className="animate-marquee flex w-max items-center gap-8">
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-8">
            <span className="font-mono text-[10px] tracking-[0.35em] whitespace-nowrap text-fog">
              {t}
            </span>
            <Diamond
              className="size-2 text-acid"
              strokeWidth={2}
              fill="currentColor"
            />
          </span>
        ))}
      </div>
    </div>
  );
}
