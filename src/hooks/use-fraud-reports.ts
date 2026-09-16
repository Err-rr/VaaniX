"use client";

import { useCallback, useEffect, useState } from "react";
import { parseFraudReports } from "@/lib/parse-fraud-reports";
import type { FraudReport, RawEmail } from "@/types/fraud-report";

const STORAGE_KEY = "voxaegis:fraud-reports";

/**
 * Browsers don't expose whether Shift/Ctrl was held during a reload, so a
 * true hard-refresh signal doesn't exist in JS. This is a best-effort proxy:
 * a hard refresh (Ctrl+Shift+R / Ctrl+F5) forces the browser to bypass its
 * HTTP cache, so the navigation entry's transferSize reflects a real network
 * fetch — a plain F5 reload typically serves the document from cache (0
 * bytes) or via a cheap 304 (a few hundred bytes).
 */
function isLikelyHardRefresh(): boolean {
  if (typeof performance === "undefined") return false;
  const [nav] = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];
  return nav?.type === "reload" && nav.transferSize > 1024;
}

/**
 * Loads fraud reports from public/emails.json once, then caches the parsed
 * result in localStorage. Normal loads (client-side navigation, a plain F5)
 * read from that cache instead of re-fetching, so the list stays stable
 * while browsing — only a hard refresh re-reads emails.json and updates it.
 */
export function useFraudReports(): { reports: FraudReport[]; loading: boolean; refetch: () => Promise<void> } {
  const [reports, setReports] = useState<FraudReport[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const res = await fetch("/emails.json", { cache: "no-store" });
    const raw: RawEmail[] = await res.json();
    const parsed = parseFraudReports(raw);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    setReports(parsed);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached && !isLikelyHardRefresh()) {
          setReports(JSON.parse(cached));
        } else {
          await refresh();
        }
      } catch {
        // localStorage unavailable (private mode, etc.) — fall back to a plain fetch.
        await refresh();
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [refresh]);

  return { reports, loading, refetch: refresh };
}
