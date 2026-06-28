export function formatCurrency(value: number, currency = "USD") {
  if (currency === "BTC") {
    return value.toFixed(4) + " BTC";
  }

  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
    maximumFractionDigits: value > 1000 ? 0 : 2
  }).format(value);
}

export function formatCompact(value: number, currency = "USD") {
  return new Intl.NumberFormat("fr-FR", {
    style: currency ? "currency" : "decimal",
    currency: currency || undefined,
    notation: "compact",
    maximumFractionDigits: 1
  }).format(value);
}

export function formatPercent(value: number) {
  var sign = value > 0 ? "+" : "";
  return sign + value.toFixed(2).replace(".", ",") + " %";
}

export function changeTone(value: number) {
  if (value > 0) return "text-emerald-350";
  if (value < 0) return "text-rose-300";
  return "text-zinc-300";
}
