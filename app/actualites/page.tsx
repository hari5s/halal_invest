import { Newspaper } from "lucide-react";
import { NewsList } from "@/components/dashboard/NewsList";
import { PageHero } from "@/components/ui/PageHero";

export default function ActualitesPage() {
  return (
    <div className="space-y-6">
      <PageHero
        eyebrow="Actualités"
        title="Flux important mocké"
        description="Sources, horaires et impacts sont fictifs, conçus pour valider le futur parcours produit et la lecture des catalyseurs."
        icon={Newspaper}
      />
      <NewsList />
    </div>
  );
}
