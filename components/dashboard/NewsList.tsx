import { Clock3 } from "lucide-react";
import { importantNews } from "@/data/market";
import { ImpactBadge } from "@/components/ui/Badge";

export function NewsList() {
  return (
    <div className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.035]">
      {importantNews.map(function (item, index) {
        return (
          <article key={item.title} className="ticker-row grid gap-3 border-b border-white/10 p-4 last:border-b-0 md:grid-cols-[1fr_auto_auto] md:items-center">
            <div className="min-w-0">
              <h3 className="font-medium text-zinc-100">{item.title}</h3>
              <p className="mt-1 text-sm text-zinc-500">{item.source}</p>
            </div>
            <div className="value-mono flex items-center gap-2 text-sm text-zinc-500">
              <Clock3 className="h-4 w-4" aria-hidden="true" />
              {item.time}
            </div>
            <ImpactBadge value={item.impact} />
          </article>
        );
      })}
    </div>
  );
}
