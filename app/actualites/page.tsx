import { NewsList } from "@/components/dashboard/NewsList";

export default function ActualitesPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-white/10 bg-white/[0.045] p-5 shadow-panel">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-gold-300/80">Actualités</p>
        <h1 className="mt-2 text-3xl font-semibold text-zinc-50">Flux important mocké</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-400">Sources, horaires et impacts sont fictifs, conçus pour valider le futur parcours produit.</p>
      </section>
      <NewsList />
    </div>
  );
}
