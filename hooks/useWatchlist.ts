"use client";

import { useCallback, useEffect, useState } from "react";
import { defaultWatchlistSlugs } from "@/data/assets";

const STORAGE_KEY = "ethiq-invest-ai-watchlist";
const CHANGE_EVENT = "ethiq-watchlist-change";

function readWatchlist() {
  if (typeof window === "undefined") return defaultWatchlistSlugs;
  try {
    var raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultWatchlistSlugs;
    var parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.filter(function (item) { return typeof item === "string"; });
  } catch {
    return defaultWatchlistSlugs;
  }
  return defaultWatchlistSlugs;
}

export function useWatchlist() {
  const [slugs, setSlugs] = useState<string[]>(defaultWatchlistSlugs);

  useEffect(function () {
    setSlugs(readWatchlist());

    function sync() {
      setSlugs(readWatchlist());
    }

    window.addEventListener("storage", sync);
    window.addEventListener(CHANGE_EVENT, sync);
    return function () {
      window.removeEventListener("storage", sync);
      window.removeEventListener(CHANGE_EVENT, sync);
    };
  }, []);

  const commit = useCallback(function (next: string[]) {
    var unique = Array.from(new Set(next));
    setSlugs(unique);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(unique));
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  const add = useCallback(function (slug: string) {
    commit(slugs.includes(slug) ? slugs : slugs.concat(slug));
  }, [commit, slugs]);

  const remove = useCallback(function (slug: string) {
    commit(slugs.filter(function (item) { return item !== slug; }));
  }, [commit, slugs]);

  const toggle = useCallback(function (slug: string) {
    if (slugs.includes(slug)) remove(slug);
    else add(slug);
  }, [add, remove, slugs]);

  const has = useCallback(function (slug: string) {
    return slugs.includes(slug);
  }, [slugs]);

  return { slugs, add, remove, toggle, has };
}
