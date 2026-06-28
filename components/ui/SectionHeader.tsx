import type { ReactNode } from "react";

export function SectionHeader({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: ReactNode }) {
  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow ? <p className="text-xs font-medium uppercase tracking-[0.22em] text-gold-300/80">{eyebrow}</p> : null}
        <h2 className="mt-1 text-xl font-semibold text-zinc-50 sm:text-2xl">{title}</h2>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
