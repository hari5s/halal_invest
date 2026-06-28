import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { Impact } from "@/data/market";
import type { RiskLevel, Sentiment } from "@/data/assets";

type BadgeProps = {
  children: ReactNode;
  className?: string;
};

function BaseBadge({ children, className }: BadgeProps) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold leading-none", className)}>
      {children}
    </span>
  );
}

function Dot({ className }: { className: string }) {
  return <span className={cn("h-1.5 w-1.5 rounded-full", className)} aria-hidden="true" />;
}

export function DemoBadge() {
  return (
    <BaseBadge className="border-gold-400/35 bg-gold-400/10 text-gold-200">
      <Dot className="bg-gold-300" />
      Données de démonstration
    </BaseBadge>
  );
}

export function SentimentBadge({ value }: { value: Sentiment }) {
  var className = "border-zinc-600 bg-zinc-500/10 text-zinc-200";
  var dot = "bg-zinc-400";
  if (value === "Favorable") {
    className = "border-emerald-350/35 bg-emerald-350/10 text-emerald-200";
    dot = "bg-emerald-350";
  }
  if (value === "Prudent") {
    className = "border-gold-400/35 bg-gold-400/10 text-gold-200";
    dot = "bg-gold-300";
  }
  if (value === "Défavorable") {
    className = "border-rose-400/35 bg-rose-400/10 text-rose-200";
    dot = "bg-rose-400";
  }
  return (
    <BaseBadge className={className}>
      <Dot className={dot} />
      {value}
    </BaseBadge>
  );
}

export function RiskBadge({ value }: { value: RiskLevel }) {
  var className = "border-emerald-350/35 bg-emerald-350/10 text-emerald-200";
  var dot = "bg-emerald-350";
  if (value === "Moyen") {
    className = "border-gold-400/35 bg-gold-400/10 text-gold-200";
    dot = "bg-gold-300";
  }
  if (value === "Élevé") {
    className = "border-rose-400/35 bg-rose-400/10 text-rose-200";
    dot = "bg-rose-400";
  }
  return (
    <BaseBadge className={className}>
      <Dot className={dot} />
      Risque {value}
    </BaseBadge>
  );
}

export function ImpactBadge({ value }: { value: Impact }) {
  var className = "border-zinc-600 bg-zinc-500/10 text-zinc-200";
  var dot = "bg-zinc-400";
  if (value === "positif") {
    className = "border-emerald-350/35 bg-emerald-350/10 text-emerald-200";
    dot = "bg-emerald-350";
  }
  if (value === "négatif") {
    className = "border-rose-400/35 bg-rose-400/10 text-rose-200";
    dot = "bg-rose-400";
  }
  return (
    <BaseBadge className={className}>
      <Dot className={dot} />
      {value}
    </BaseBadge>
  );
}

export function StatusBadge({ children }: { children: ReactNode }) {
  return <BaseBadge className="border-white/10 bg-white/[0.045] text-zinc-300">{children}</BaseBadge>;
}
