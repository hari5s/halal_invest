import { BarChart3, Bot, Database, Newspaper, Scale, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";

const steps = [
  { title: "Données de marché", detail: "Prix, volumes, variations et historique depuis un fournisseur fiable.", icon: BarChart3 },
  { title: "Données financières", detail: "Bilans, revenus, dette, croissance et ratios normalisés.", icon: Database },
  { title: "Actualités", detail: "Flux d'informations avec sources, horaires et classification d'impact.", icon: Newspaper },
  { title: "Score IA", detail: "Synthèse structurée séparant données, interprétation et risques.", icon: Bot },
  { title: "Analyse conformité externe", detail: "Connexion à Musaffa, AAOIFI ou une méthodologie validée.", icon: ShieldCheck },
  { title: "Risques et sources", detail: "Affichage transparent des limites, sources et dates de vérification.", icon: Scale }
];

const limits = [
  "Cette plateforme n'est pas un conseiller financier personnalisé.",
  "Les données doivent être vérifiées auprès de sources fiables.",
  "Une conformité islamique doit être reliée à une méthodologie et une date de vérification.",
  "Les performances passées ne garantissent pas les performances futures."
];

export default function MethodologiePage() {
  return (
    <div className="space-y-8">
      <PageHero
        eyebrow="Méthodologie"
        title="Fonctionnement cible"
        description="Le prototype montre le parcours produit. Une vraie version devra tracer les sources, les dates, les critères de conformité et les limites réglementaires."
        icon={ShieldCheck}
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {steps.map(function (step, index) {
          const Icon = step.icon;
          return (
            <article key={step.title} className="surface-card surface-card-hover p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-emerald-350/20 bg-emerald-350/10 text-emerald-350">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <span className="value-mono text-sm text-zinc-500">0{index + 1}</span>
              </div>
              <h2 className="mt-5 font-semibold text-zinc-50">{step.title}</h2>
              <p className="mt-3 text-sm leading-6 text-zinc-400">{step.detail}</p>
            </article>
          );
        })}
      </section>

      <section className="surface-panel halal-rail p-5 pl-6 sm:p-6 sm:pl-7">
        <h2 className="text-xl font-semibold text-zinc-50">Limites importantes</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {limits.map(function (limit) {
            return (
              <div key={limit} className="surface-card p-4 text-sm leading-6 text-zinc-300">
                {limit}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
