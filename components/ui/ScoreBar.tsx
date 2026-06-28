export function ScoreBar({ label, value, tone = "emerald" }: { label: string; value: number; tone?: "emerald" | "gold" | "rose" }) {
  var barClass = "bg-emerald-350";
  if (tone === "gold") barClass = "bg-gold-400";
  if (tone === "rose") barClass = "bg-rose-400";

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="text-zinc-300">{label}</span>
        <span className="font-medium text-zinc-100">{value}/100</span>
      </div>
      <div className="h-2 rounded-full bg-white/10">
        <div className={barClass + " h-2 rounded-full"} style={{ width: value + "%" }} />
      </div>
    </div>
  );
}
