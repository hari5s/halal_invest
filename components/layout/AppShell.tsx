"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState, type ReactNode } from "react";
import { signOut, useSession } from "next-auth/react";
import {
  BarChart3,
  Bell,
  Bot,
  ChevronRight,
  Eye,
  LayoutDashboard,
  LogIn,
  LogOut,
  Newspaper,
  Search,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  UserRound
} from "lucide-react";
import { searchAssets } from "@/data/assets";
import { AssetLogo } from "@/components/ui/AssetLogo";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/marches", label: "Marchés", icon: BarChart3 },
  { href: "/watchlist", label: "Watchlist", icon: Eye },
  { href: "/analyse-ia", label: "Analyse IA", icon: Bot },
  { href: "/actualites", label: "Actualités", icon: Newspaper },
  { href: "/methodologie", label: "Méthodologie", icon: ShieldCheck },
  { href: "/parametres", label: "Paramètres", icon: Settings }
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

function TopSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const results = useMemo(function () {
    return searchAssets(query).slice(0, 6);
  }, [query]);

  function openAsset(slug: string) {
    setQuery("");
    router.push("/assets/" + slug);
  }

  return (
    <form
      className="relative w-full max-w-3xl"
      onSubmit={function (event) {
        event.preventDefault();
        if (results[0]) openAsset(results[0].slug);
      }}
      role="search"
    >
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" aria-hidden="true" />
      <input
        value={query}
        onChange={function (event) { setQuery(event.target.value); }}
        placeholder="Ticker, entreprise, ETF..."
        aria-label="Rechercher une action, un ETF ou une crypto"
        name="asset-search"
        autoComplete="off"
        className="h-11 w-full rounded-lg border border-white/10 bg-[#071018]/80 pl-10 pr-4 text-sm text-zinc-100 shadow-inner shadow-black/20 outline-none transition-colors placeholder:text-zinc-600 focus-visible:border-emerald-350/60"
      />
      {query && results.length > 0 ? (
        <div className="absolute left-0 right-0 top-12 z-40 overflow-hidden rounded-lg border border-white/10 bg-[#071018] shadow-panel">
          {results.map(function (asset) {
            return (
              <button
                type="button"
                key={asset.slug}
                onClick={function () { openAsset(asset.slug); }}
                className="grid w-full grid-cols-[auto_1fr_auto] items-center gap-3 border-b border-white/[0.06] px-3 py-3 text-left transition-colors last:border-b-0 hover:bg-white/[0.055]"
              >
                <AssetLogo name={asset.name} ticker={asset.ticker} tone={asset.logoTone} size="sm" />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-zinc-100">{asset.name}</span>
                  <span className="value-mono text-xs text-zinc-500">{asset.ticker} / {asset.type}</span>
                </span>
                <ChevronRight className="h-4 w-4 text-zinc-600" aria-hidden="true" />
              </button>
            );
          })}
        </div>
      ) : null}
    </form>
  );
}

function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-3 rounded-lg px-2 py-2">
      <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg border border-emerald-350/35 bg-[#0a1515] font-black text-emerald-300 shadow-card">
        <span className="absolute inset-x-0 top-0 h-px bg-gold-300/70" aria-hidden="true" />
        EI
      </div>
      {compact ? null : (
        <div className="min-w-0">
          <p className="truncate font-semibold text-zinc-50">Ethiq Invest AI</p>
          <p className="text-xs text-zinc-500">Halal market intelligence</p>
        </div>
      )}
    </Link>
  );
}

function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[268px] border-r border-white/10 bg-[#05070b]/95 px-4 py-5 backdrop-blur-xl lg:flex lg:flex-col">
      <BrandMark />

      <div className="mt-5 rounded-lg border border-white/10 bg-white/[0.035] p-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-zinc-500">Session</span>
          <span className="value-mono text-emerald-300">DEMO</span>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-md border border-emerald-350/20 bg-emerald-350/[0.07] px-2 py-2 text-emerald-200">Actions</div>
          <div className="rounded-md border border-gold-400/20 bg-gold-400/[0.07] px-2 py-2 text-gold-200">ETF halal</div>
        </div>
      </div>

      <nav className="mt-6 space-y-1" aria-label="Navigation principale">
        {navItems.map(function (item) {
          const Icon = item.icon;
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                active
                  ? "border border-emerald-350/25 bg-emerald-350/[0.11] text-emerald-200"
                  : "border border-transparent text-zinc-500 hover:border-white/10 hover:bg-white/[0.045] hover:text-zinc-100"
              )}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              <span className="min-w-0 flex-1 truncate">{item.label}</span>
              {active ? <span className="h-1.5 w-1.5 rounded-full bg-emerald-350" aria-hidden="true" /> : null}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto halal-rail overflow-hidden rounded-lg border border-gold-400/20 bg-gold-400/[0.055] p-4 pl-5 text-xs leading-5 text-gold-100/90">
        <p className="font-semibold text-gold-200">Prototype</p>
        <p className="mt-1 text-gold-100/70">Données de démonstration. Aucun conseil financier ni verdict religieux définitif.</p>
      </div>
    </aside>
  );
}

function MobileNav() {
  const pathname = usePathname();
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#05070b]/95 px-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl lg:hidden">
      <div className="custom-scrollbar flex gap-1 overflow-x-auto">
        {navItems.map(function (item) {
          const Icon = item.icon;
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-w-20 flex-col items-center gap-1 rounded-lg border px-2 py-2 text-[11px] transition-colors",
                active
                  ? "border-emerald-350/25 bg-emerald-350/[0.11] text-emerald-200"
                  : "border-transparent text-zinc-500"
              )}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function StatusRibbon() {
  return (
    <div className="hidden items-center gap-3 text-xs text-zinc-500 xl:flex">
      <span className="flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-350 animate-dot-blink" aria-hidden="true" />
        Marché demo
      </span>
      <span className="h-3 w-px bg-white/10" aria-hidden="true" />
      <span className="value-mono text-zinc-400">EUR / USD</span>
      <span className="h-3 w-px bg-white/10" aria-hidden="true" />
      <span className="text-gold-300">Conformité à vérifier</span>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  if (pathname.startsWith("/login")) {
    return <>{children}</>;
  }

  const user = session?.user as { name?: string | null; email?: string | null; phoneNumber?: string | null } | undefined;
  const userLabel = user?.name || user?.email || user?.phoneNumber || "Mon profil";

  return (
    <div className="min-h-screen text-zinc-100">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-emerald-350 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-ink-950">
        Aller au contenu
      </a>
      <Sidebar />
      <div className="lg:pl-[268px]">
        <header className="sticky top-0 z-20 border-b border-white/10 bg-[#05070b]/88 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex shrink-0 items-center gap-3 lg:hidden">
              <BrandMark compact />
            </div>

            <div className="hidden min-w-[190px] shrink-0 lg:block">
              <StatusRibbon />
            </div>

            <div className="flex min-w-0 flex-1 justify-center">
              <TopSearch />
            </div>

            <div className="flex shrink-0 items-center justify-end gap-2 lg:min-w-[310px]">
              <button className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-zinc-400 transition-colors hover:border-white/20 hover:text-zinc-100 md:flex" aria-label="Ouvrir les filtres">
                <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
              </button>
              <button className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-zinc-400 transition-colors hover:border-white/20 hover:text-zinc-100 sm:flex" aria-label="Voir les notifications">
                <Bell className="h-4 w-4" aria-hidden="true" />
              </button>

              {session ? (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => router.push("/parametres")}
                    aria-label="Ouvrir le profil"
                    className="flex h-11 shrink-0 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm text-zinc-200 transition-colors hover:border-white/20 hover:text-zinc-50"
                  >
                    <UserRound className="h-4 w-4" aria-hidden="true" />
                    <span className="hidden max-w-36 truncate xl:inline">{userLabel}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => signOut()}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-zinc-400 transition-colors hover:border-rose-400/30 hover:text-rose-300"
                    aria-label="Se déconnecter"
                  >
                    <LogOut className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => router.push("/login")}
                  aria-label="Connexion"
                  className="flex h-11 shrink-0 items-center gap-2 rounded-lg bg-emerald-350 px-4 text-sm font-semibold text-ink-950 transition-colors hover:bg-emerald-300"
                >
                  <LogIn className="h-4 w-4" aria-hidden="true" />
                  <span className="hidden md:inline">Connexion</span>
                </button>
              )}
            </div>
          </div>
        </header>

        <main id="main-content" className="px-4 pb-28 pt-5 sm:px-6 md:px-8 lg:pb-16 xl:px-10 2xl:px-12">
          <div className="mx-auto w-full max-w-[1500px]">{children}</div>
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
