import { marketCards } from "@/data/market";
import { changeTone, formatPercent } from "@/lib/format";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

export function MarketStrip() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5 xl:gap-5 stagger-children">
      {marketCards.map(function (market) {
        const positive = market.change >= 0;
        const Icon = positive ? ArrowUpRight : ArrowDownRight;
        return (
          <div
            key={market.label}
            className="group rounded-xl border border-white/10 bg-white/[0.045] p-4 transition-all duration-200 hover:border-white/20 hover:bg-white/[0.065] hover:shadow-card"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-medium text-zinc-400">{market.label}</p>
              <Icon
                className={changeTone(market.change) + " h-4 w-4 transition-transform duration-200 group-hover:scale-110"}
                aria-hidden="true"
              />
            </div>
            <div className="mt-3 flex items-end justify-between gap-3">
              <p className="text-xl font-semibold text-zinc-50">{market.value}</p>
              <p className={changeTone(market.change) + " text-sm font-medium"}>{formatPercent(market.change)}</p>
            </div>
            {/* Live indicator */}
            <div className="mt-2 flex items-center gap-1.5">
              <span className={positive ? "h-1.5 w-1.5 rounded-full bg-emerald-350 animate-dot-blink" : "h-1.5 w-1.5 rounded-full bg-rose-400 animate-dot-blink"} aria-hidden="true" />
              <span className="text-[10px] text-zinc-600">Donnée fictive</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
