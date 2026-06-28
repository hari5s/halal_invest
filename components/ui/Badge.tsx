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
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium", className)}>
      {children}
    </span>
  );
}

export function DemoBadge() {
  return <BaseBadge className="border-gold-400/35 bg-gold-400/10 text-gold-300">Données de démonstration</BaseBadge>;
}

export function SentimentBadge({ value }: { value: Sentiment }) {
  var className = "border-zinc-600 bg-zinc-500/10 text-zinc-200";
  if (value === "Favorable") className = "border-emerald-350/35 bg-emerald-350/10 text-emerald-350";
  if (value === "Prudent") className = "border-gold-400/35 bg-gold-400/10 text-gold-300";
  if (value === "Défavorable") className = "border-rose-400/35 bg-rose-400/10 text-rose-300";
  return <BaseBadge className={className}>{value}</BaseBadge>;
}

export function RiskBadge({ value }: { value: RiskLevel }) {
  var className = "border-emerald-350/35 bg-emerald-350/10 text-emerald-350";
  if (value === "Moyen") className = "border-gold-400/35 bg-gold-400/10 text-gold-300";
  if (value === "Élevé") className = "border-rose-400/35 bg-rose-400/10 text-rose-300";
  return <BaseBadge className={className}>Risque {value}</BaseBadge>;
}

export function ImpactBadge({ value }: { value: Impact }) {
  var className = "border-zinc-600 bg-zinc-500/10 text-zinc-200";
  if (value === "positif") className = "border-emerald-350/35 bg-emerald-350/10 text-emerald-350";
  if (value === "négatif") className = "border-rose-400/35 bg-rose-400/10 text-rose-300";
  return <BaseBadge className={className}>{value}</BaseBadge>;
}

export function StatusBadge({ children }: { children: ReactNode }) {
  return <BaseBadge className="border-white/10 bg-white/5 text-zinc-300">{children}</BaseBadge>;
}
