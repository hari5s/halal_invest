import { Bell, Database, ShieldCheck } from "lucide-react";
import { MetricCard } from "@/components/ui/MetricCard";

export default function ParametresPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-white/10 bg-white/[0.045] p-5 shadow-panel">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-gold-300/80">Paramètres</p>
        <h1 className="mt-2 text-3xl font-semibold text-zinc-50">Préférences fictives</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-400">Préparation des réglages qui pourront être reliés plus tard à un compte utilisateur.</p>
      </section>
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Notifications" value="Activées" detail="État d'interface uniquement, sans service réel." icon={Bell} tone="emerald" />
        <MetricCard label="Sources" value="Mock" detail="Les clés API futures sont listées dans .env.example." icon={Database} tone="gold" />
        <MetricCard label="Conformité" value="Externe" detail="Aucun verdict n'est stocké dans ce prototype." icon={ShieldCheck} />
      </div>
    </div>
  );
}
