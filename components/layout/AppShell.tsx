"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState, type ReactNode } from "react";
import { useSession, signOut } from "next-auth/react";
import { BarChart3, Bell, Bot, Eye, LayoutDashboard, Newspaper, Search, Settings, ShieldCheck, SlidersHorizontal, UserRound, LogOut, LogIn } from "lucide-react";
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
      className="relative w-full max-w-2xl"
      onSubmit={function (event) {
        event.preventDefault();
        if (results[0]) openAsset(results[0].slug);
      }}
    >
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" aria-hidden="true" />
      <input
        value={query}
        onChange={function (event) { setQuery(event.target.value); }}
        placeholder="Rechercher une action, ETF ou crypto"
        className="h-11 w-full rounded-lg border border-white/10 bg-white/[0.055] pl-10 pr-4 text-sm text-zinc-100 outline-none transition focus:border-emerald-350/50 focus:bg-white/[0.075]"
      />
      {query && results.length > 0 ? (
        <div className="absolute left-0 right-0 top-12 z-40 overflow-hidden rounded-lg border border-white/10 bg-ink-900 shadow-panel">
          {results.map(function (asset) {
            return (
              <button
                type="button"
                key={asset.slug}
                onClick={function () { openAsset(asset.slug); }}
                className="flex w-full items-center gap-3 px-3 py-3 text-left transition hover:bg-white/[0.06]"
              >
                <AssetLogo name={asset.name} ticker={asset.ticker} tone={asset.logoTone} size="sm" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-zinc-100">{asset.name}</span>
                  <span className="text-xs text-zinc-500">{asset.ticker} · {asset.type}</span>
                </span>
              </button>
            );
          })}
        </div>
      ) : null}
    </form>
  );
}

function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-white/10 bg-ink-950/[0.92] px-4 py-5 backdrop-blur lg:flex lg:flex-col">
      <Link href="/" className="flex items-center gap-3 rounded-lg px-2 py-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-350 to-gold-400 font-black text-ink-950">EI</div>
        <div>
          <p className="font-semibold text-zinc-50">Ethiq Invest AI</p>
          <p className="text-xs text-zinc-500">Analyse éthique & IA</p>
        </div>
      </Link>

      <nav className="mt-8 space-y-1">
        {navItems.map(function (item) {
          const Icon = item.icon;
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition",
                active ? "bg-emerald-350/12 text-emerald-350" : "text-zinc-400 hover:bg-white/[0.055] hover:text-zinc-100"
              )}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-lg border border-gold-400/25 bg-gold-400/[0.08] p-4 text-xs leading-5 text-gold-100/90">
        Prototype — données de démonstration — ne constitue pas un conseil en investissement.
      </div>
    </aside>
  );
}

function MobileNav() {
  const pathname = usePathname();
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-ink-950/95 px-2 py-2 backdrop-blur lg:hidden">
      <div className="custom-scrollbar flex gap-1 overflow-x-auto">
        {navItems.map(function (item) {
          const Icon = item.icon;
          const active = isActive(pathname, item.href);
          return (
            <Link key={item.href} href={item.href} className={cn("flex min-w-20 flex-col items-center gap-1 rounded-lg px-2 py-2 text-[11px]", active ? "bg-emerald-350/12 text-emerald-350" : "text-zinc-500")}>
              <Icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <div className="min-h-screen text-zinc-100">
      <Sidebar />
      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-white/10 bg-ink-950/[0.82] px-4 py-3 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* Left side (mobile logo + spacing to balance center) */}
            <div className="flex items-center lg:w-[200px] shrink-0">
              <Link href="/" className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-350 to-gold-400 font-black text-ink-950 lg:hidden">EI</Link>
            </div>

            {/* Center (Search) */}
            <div className="flex-1 flex justify-center max-w-2xl">
              <div className="w-full">
                <TopSearch />
              </div>
            </div>

            {/* Right side (Actions & Auth) */}
            <div className="flex items-center justify-end gap-2 shrink-0 lg:w-[350px]">
              <button className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.045] text-zinc-300 transition hover:text-zinc-50 md:flex" aria-label="Filtres">
                <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
              </button>
              <button className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.045] text-zinc-300 transition hover:text-zinc-50 sm:flex" aria-label="Notifications">
                <Bell className="h-4 w-4" aria-hidden="true" />
              </button>
              
              {session ? (
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => router.push("/parametres")}
                    className="flex h-11 shrink-0 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.045] px-3 text-sm text-zinc-200 transition hover:text-zinc-50"
                  >
                    <UserRound className="h-4 w-4" aria-hidden="true" />
                    <span className="hidden xl:inline">{(session.user as any)?.name || session.user?.email || (session.user as any)?.phoneNumber || "Mon Profil"}</span>
                  </button>
                  <button 
                    onClick={() => signOut()}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.045] text-zinc-300 transition hover:text-rose-400" 
                    aria-label="Déconnexion"
                  >
                    <LogOut className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => router.push("/login")}
                  className="flex h-11 shrink-0 items-center gap-2 rounded-lg bg-emerald-500 px-4 text-sm font-semibold text-ink-950 transition hover:bg-emerald-400"
                >
                  <LogIn className="h-4 w-4" aria-hidden="true" />
                  <span className="hidden md:inline">Connexion / Inscription</span>
                </button>
              )}
            </div>
          </div>
        </header>
        <main className="px-4 pb-28 pt-6 sm:px-8 md:px-12 lg:px-16 xl:px-24 2xl:px-32 lg:pb-16">
          <div className="w-full">{children}</div>
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
