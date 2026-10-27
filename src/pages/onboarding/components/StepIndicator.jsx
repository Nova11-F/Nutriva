import { Check } from "lucide-react";

export default function StepIndicator({ steps, current }) {
  const total = steps.length;
  const percent = Math.round((current / total) * 100); 

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="rounded-full bg-soft px-3 py-1 font-semibold uppercase tracking-wide text-primary">
          {String(current + 1).padStart(2, "0")}/{String(total).padStart(2, "0")} Tahap pengisian data
        </span>
        <span className="font-mono text-gray-500">{percent}% selesai</span>
        <span className="text-gray-500">Estimasi {total - current} menit tersisa</span>
      </div>

      <div
        className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200"
        role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}
      >
        <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${percent}%` }} />
      </div>

      <p className="text-sm font-semibold text-text md:hidden">
        Tahap {current + 1}: {steps[current].title}
      </p>

      <ol className="gap-3 grid" style={{ gridTemplateColumns: `repeat(${total}, minmax(0, 1fr))` }}>
        {steps.map((s, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <li
              key={s.key}
              className={`flex items-center gap-3 rounded-xl border-l-4 p-3 ${
                active ? "border-primary bg-soft" : done ? "border-transparent bg-white" : "border-transparent bg-gray-50"
              }`}
            >
              <span className={`flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                done || active ? "bg-primary text-surface" : "bg-gray-200 text-gray-500"
              }`}>
                {done ? <Check size={16} /> : i + 1}
              </span>
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase text-gray-400">
                  Tahap {i + 1}
                  {active && <span className="ml-1 rounded bg-primary/10 px-1.5 normal-case text-primary">Sedang diisi</span>}
                  {s.optional && !active && <span className="ml-1 normal-case">(opsional)</span>}
                </p>
                <p className="truncate text-sm font-semibold text-text">{s.title}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}