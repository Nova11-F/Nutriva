import { Check } from "lucide-react";
import { motion } from "motion/react";

export default function StepIndicator({ steps, current }) {
  const total = steps.length;
  const percent = Math.round(((current + 1) / total) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="flex flex-col gap-4"
    >
      {/* Bagian informasi progres */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] lg:text-xs">
        <span className="rounded-full bg-soft px-3 py-1 font-semibold uppercase tracking-wide text-primary">
          {String(current + 1).padStart(2, "0")}/
          {String(total).padStart(2, "0")} Tahap pengisian data
        </span>

        <span className="font-mono text-gray-500">
          {percent}% selesai
        </span>

        <span className="text-gray-500">
          Estimasi {total - current} menit tersisa
        </span>
      </div>

      {/* Progress bar */}
      <div
        className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <motion.div
          className="h-full rounded-full bg-primary"
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>

      {/* Daftar tahapan */}
      <ol className="steps-grid" style={{ "--total": total }}>
        {steps.map((s, i) => {
          const done = i < current;
          const active = i === current;

          return (
            <motion.li
              key={s.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.35,
                delay: i * 0.07,
              }}
              className={`flex min-w-0 items-center gap-3 rounded-lg border-l-4 p-3 ${
                active
                  ? "border-primary bg-soft"
                  : done
                    ? "border-transparent bg-white"
                    : "border-transparent bg-gray-50"
              }`}
            >
              <motion.span
                key={done ? "done" : "number"}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.25 }}
                className={`flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  done || active
                    ? "bg-primary text-surface"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {done ? <Check size={16} /> : i + 1}
              </motion.span>

              <div className="min-w-0 flex-1">
                <p className="flex flex-wrap items-center gap-1 text-[10px] font-semibold uppercase text-gray-400">
                  Tahap {i + 1}

                  {active && (
                    <span className="rounded bg-primary/10 px-1.5 py-0.5 normal-case text-primary">
                      Sedang diisi
                    </span>
                  )}

                  {s.optional && !active && (
                    <span className="normal-case">(opsional)</span>
                  )}
                </p>

                <p className="truncate text-sm font-semibold text-text">
                  {s.title}
                </p>
              </div>
            </motion.li>
          );
        })}
      </ol>
    </motion.div>
  );
}