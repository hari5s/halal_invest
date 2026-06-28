import type { LucideIcon } from "lucide-react";
import { ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  icon?: LucideIcon;
  children?: ReactNode;
  className?: string;
};

export function PageHero({ eyebrow, title, description, icon: Icon = ShieldCheck, children, className }: PageHeroProps) {
  return (
    <section className={cn("surface-panel terminal-grid halal-rail p-5 pl-6 sm:p-6 sm:pl-7", className)}>
      <div className="relative grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold-400/20 bg-gold-400/[0.075] px-3 py-1 text-xs font-semibold text-gold-200">
            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
            {eyebrow}
          </div>
          <h1 className="mt-4 text-3xl font-semibold text-pretty text-zinc-50 sm:text-4xl">{title}</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-400 sm:text-base">{description}</p>
        </div>
        {children ? <div className="relative flex flex-wrap gap-3 lg:justify-end">{children}</div> : null}
      </div>
    </section>
  );
}
