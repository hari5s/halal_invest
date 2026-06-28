import { Bell, Database, Settings, ShieldCheck } from "lucide-react";
import { MetricCard } from "@/components/ui/MetricCard";
import { PageHero } from "@/components/ui/PageHero";

export default function ParametresPage() {
  return (
    <div className="space-y-6">
      <PageHero
        eyebrow="Paramètres"
        title="Préférences fictives"
        description="Préparation des réglages qui pourront être reliés plus tard à un compte utilisateur et à de vraies sources de données."
        icon={Settings}
      />
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Notifications" value="Activées" detail="État d'interface uniquement, sans service réel." icon={Bell} tone="emerald" />
        <MetricCard label="Sources" value="Mock" detail="Les clés API futures sont listées dans .env.example." icon={Database} tone="gold" />
        <MetricCard label="Conformité" value="Externe" detail="Aucun verdict n'est stocké dans ce prototype." icon={ShieldCheck} />
      </div>
    </div>
  );
}
