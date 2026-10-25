"use client";

import { useMemo, useState, useEffect } from "react";
import {
  PACKING_CATEGORIES,
  PACKING_ITEMS,
  PACKING_STORAGE_KEY,
  sourceLabel,
  type PackingCategory,
  type PackingItem,
  type PackingSource,
} from "@/data/packing";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Backpack,
  Check,
  CheckCheck,
  Compass,
  ExternalLink,
  Flame,
  HeartPulse,
  Luggage,
  RotateCcw,
  Search,
  ShoppingBag,
  Sparkles,
  Tent,
  Trophy,
  Waves,
  X,
} from "lucide-react";

type QuickScopeFilter = "all" | "remaining" | "vegas-buy" | "carry-on";

const CATEGORY_FILTER_PILLS: {
  id: "all" | PackingCategory;
  label: string;
}[] = [
  { id: "all", label: "All" },
  { id: "marathon", label: "NYC Marathon" },
  { id: "recovery", label: "Flight & Recovery" },
  { id: "hiking", label: "Canyon Hiking" },
  { id: "camping", label: "8yo Daughter & Road Kit" },
  { id: "ocean-general", label: "Ocean, Pools & Docs" },
];

const SCOPE_FILTER_PILLS: {
  id: QuickScopeFilter;
  label: string;
}[] = [
  { id: "all", label: "All Items" },
  { id: "remaining", label: "Remaining" },
  { id: "vegas-buy", label: "Buy in Vegas Day 1" },
  { id: "carry-on", label: "Carry-On Musts" },
];

function categoryIcon(category: PackingCategory) {
  switch (category) {
    case "marathon":
      return Trophy;
    case "recovery":
      return HeartPulse;
    case "hiking":
      return Compass;
    case "camping":
      return Tent;
    case "ocean-general":
      return Waves;
  }
}

function sourceBadgeStyle(source: PackingSource): string {
  switch (source) {
    case "carry-on":
      return "border-amber-400/35 bg-amber-400/12 text-amber-300";
    case "checked-bag":
      return "border-sky-400/30 bg-sky-400/10 text-sky-300";
    case "buy-in-vegas":
      return "border-emerald-400/35 bg-emerald-400/12 text-emerald-300";
    case "rent-in-zion":
      return "border-rose-400/35 bg-rose-400/12 text-rose-300";
  }
}

export function PackingList() {
  const [checkedMap, setCheckedMap] = useState<Record<string, boolean>>({});
  const [hydrated, setHydrated] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<
    "all" | PackingCategory
  >("all");
  const [scopeFilter, setScopeFilter] = useState<QuickScopeFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(PACKING_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Record<string, boolean>;
        if (parsed && typeof parsed === "object") {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setCheckedMap(parsed);
        }
      }
    } catch {
      // Ignore storage access errors in private browsing
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(
        PACKING_STORAGE_KEY,
        JSON.stringify(checkedMap)
      );
    } catch {
      // Ignore storage write errors
    }
  }, [checkedMap, hydrated]);

  function toggleItem(id: string) {
    setCheckedMap((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }

  function checkAllVisible(items: PackingItem[]) {
    setCheckedMap((prev) => {
      const next = { ...prev };
      for (const item of items) {
        next[item.id] = true;
      }
      return next;
    });
  }

  function resetAll() {
    setCheckedMap({});
  }

  const stats = useMemo(() => {
    const total = PACKING_ITEMS.length;
    const packed = PACKING_ITEMS.filter((i) => checkedMap[i.id]).length;
    const pct = total > 0 ? Math.round((packed / total) * 100) : 0;

    const carryOnItems = PACKING_ITEMS.filter((i) => i.source === "carry-on");
    const carryOnPacked = carryOnItems.filter((i) => checkedMap[i.id]).length;

    const checkedBagItems = PACKING_ITEMS.filter(
      (i) => i.source === "checked-bag"
    );
    const checkedBagPacked = checkedBagItems.filter(
      (i) => checkedMap[i.id]
    ).length;

    const vegasBuyItems = PACKING_ITEMS.filter(
      (i) => i.source === "buy-in-vegas"
    );
    const vegasBuyPacked = vegasBuyItems.filter((i) => checkedMap[i.id]).length;

    return {
      total,
      packed,
      pct,
      carryOnTotal: carryOnItems.length,
      carryOnPacked,
      checkedBagTotal: checkedBagItems.length,
      checkedBagPacked,
      vegasBuyTotal: vegasBuyItems.length,
      vegasBuyPacked,
    };
  }, [checkedMap]);

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return PACKING_ITEMS.filter((item) => {
      if (selectedCategory !== "all" && item.category !== selectedCategory) {
        return false;
      }
      if (scopeFilter === "remaining" && checkedMap[item.id]) {
        return false;
      }
      if (scopeFilter === "vegas-buy" && item.source !== "buy-in-vegas") {
        return false;
      }
      if (scopeFilter === "carry-on" && item.source !== "carry-on") {
        return false;
      }
      if (q.length > 0) {
        const haystack =
          `${item.name} ${item.detail} ${sourceLabel(item.source)}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [selectedCategory, scopeFilter, searchQuery, checkedMap]);

  const groupedCategories = useMemo(() => {
    return PACKING_CATEGORIES.map((cat) => {
      const items = filteredItems.filter((i) => i.category === cat.id);
      const totalInCat = PACKING_ITEMS.filter(
        (i) => i.category === cat.id
      ).length;
      const packedInCat = PACKING_ITEMS.filter(
        (i) => i.category === cat.id && checkedMap[i.id]
      ).length;
      return {
        ...cat,
        items,
        totalInCat,
        packedInCat,
      };
    }).filter((group) => group.items.length > 0);
  }, [filteredItems, checkedMap]);

  const allVisibleChecked =
    filteredItems.length > 0 &&
    filteredItems.every((item) => Boolean(checkedMap[item.id]));

  return (
    <div className="flex flex-col gap-5 text-zinc-100">
      <div className="rounded-2xl bg-zinc-950/90 p-4 ring-1 ring-white/10 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[0.68rem] tracking-[0.24em] text-amber-400 uppercase">
              Gear & Logistics Checklist · NYC Marathon ➔ Southwest ➔ LA
            </p>
            <h2 className="font-display mt-1 text-3xl leading-none tracking-wide text-zinc-50 sm:text-4xl">
              {stats.packed} / {stats.total} Packed
              <span className="ml-2.5 text-xl text-amber-300">
                ({stats.pct}%)
              </span>
            </h2>
            <p className="mt-1.5 text-xs leading-relaxed text-zinc-400 sm:text-sm">
              Sun Nov 1 Marathon (3:20 goal) · Mon Nov 2 AA 2356 (JFK ➔ LAS) ·
              Father &amp; 8yo Daughter Canyon &amp; Coast Loop · Thu Nov 12 LH 457
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() =>
                allVisibleChecked
                  ? resetAll()
                  : checkAllVisible(filteredItems)
              }
              className="inline-flex min-h-10 items-center gap-1.5 rounded-xl bg-zinc-900 px-3.5 py-2 text-xs font-medium text-zinc-200 ring-1 ring-white/10 transition-colors hover:bg-zinc-800 active:scale-[0.99]"
            >
              <CheckCheck className="size-3.5 text-amber-400" />
              {allVisibleChecked ? "Uncheck All" : "Check All Shown"}
            </button>
            {stats.packed > 0 ? (
              <button
                type="button"
                onClick={resetAll}
                className="inline-flex min-h-10 items-center gap-1.5 rounded-xl bg-zinc-900/70 px-3.5 py-2 text-xs font-medium text-zinc-400 ring-1 ring-white/10 transition-colors hover:bg-zinc-800 hover:text-zinc-200 active:scale-[0.99]"
              >
                <RotateCcw className="size-3.5" />
                Reset
              </button>
            ) : null}
          </div>
        </div>

        <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-zinc-900 ring-1 ring-white/8">
          <div
            className="h-full rounded-full bg-linear-to-r from-amber-400 via-amber-300 to-emerald-400 transition-all duration-300"
            style={{ width: `${stats.pct}%` }}
          />
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2.5 sm:gap-3">
          <button
            type="button"
            onClick={() =>
              setScopeFilter((prev) =>
                prev === "carry-on" ? "all" : "carry-on"
              )
            }
            className={cn(
              "flex flex-col items-start justify-between rounded-xl p-3 text-left ring-1 transition-colors",
              scopeFilter === "carry-on"
                ? "bg-amber-400/15 ring-amber-400/40"
                : "bg-zinc-900/70 ring-white/8 hover:bg-zinc-900"
            )}
          >
            <div className="flex w-full items-center justify-between gap-1">
              <span className="text-[0.65rem] tracking-[0.16em] text-amber-300 uppercase">
                Carry-On
              </span>
              <Backpack className="size-3.5 text-amber-400/80" />
            </div>
            <p className="font-display mt-1 text-2xl leading-none text-zinc-50 sm:text-3xl">
              {stats.carryOnPacked}/{stats.carryOnTotal}
            </p>
            <p className="mt-1 text-[0.68rem] text-zinc-400">
              Race shoes, iPad &amp; IDs
            </p>
          </button>

          <button
            type="button"
            onClick={() => {
              setScopeFilter("all");
              setSelectedCategory("all");
            }}
            className="flex flex-col items-start justify-between rounded-xl bg-zinc-900/70 p-3 text-left ring-1 ring-white/8 transition-colors hover:bg-zinc-900"
          >
            <div className="flex w-full items-center justify-between gap-1">
              <span className="text-[0.65rem] tracking-[0.16em] text-sky-300 uppercase">
                Checked Bag
              </span>
              <Luggage className="size-3.5 text-sky-400/80" />
            </div>
            <p className="font-display mt-1 text-2xl leading-none text-zinc-50 sm:text-3xl">
              {stats.checkedBagPacked}/{stats.checkedBagTotal}
            </p>
            <p className="mt-1 text-[0.68rem] text-zinc-400">
              Layers, shoes &amp; swimsuits
            </p>
          </button>

          <button
            type="button"
            onClick={() =>
              setScopeFilter((prev) =>
                prev === "vegas-buy" ? "all" : "vegas-buy"
              )
            }
            className={cn(
              "flex flex-col items-start justify-between rounded-xl p-3 text-left ring-1 transition-colors",
              scopeFilter === "vegas-buy"
                ? "bg-emerald-400/15 ring-emerald-400/40"
                : "bg-zinc-900/70 ring-white/8 hover:bg-zinc-900"
            )}
          >
            <div className="flex w-full items-center justify-between gap-1">
              <span className="text-[0.65rem] tracking-[0.16em] text-emerald-300 uppercase">
                Buy in Vegas
              </span>
              <ShoppingBag className="size-3.5 text-emerald-400/80" />
            </div>
            <p className="font-display mt-1 text-2xl leading-none text-zinc-50 sm:text-3xl">
              {stats.vegasBuyPacked}/{stats.vegasBuyTotal}
            </p>
            <p className="mt-1 text-[0.68rem] text-zinc-400">
              $18 Booster &amp; snacks
            </p>
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-zinc-900/60 px-3.5 py-2.5 ring-1 ring-white/8">
          <div className="flex items-center gap-2 text-xs text-zinc-300">
            <Flame className="size-4 shrink-0 text-amber-400" />
            <span>
              <strong className="text-zinc-100">Day 1 Vegas &amp; Zion Setup:</strong>{" "}
              Pick up SUV at LAS (11:30 AM) ➔ grab $18 booster cushion &amp; road
              snacks at Walmart ➔ Kid&apos;s Full Drysuit ($59) at Zion Outfitter
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <a
              href="https://www.google.com/maps/search/?api=1&query=Walmart+Supercenter+6005+S+Eastern+Ave+Las+Vegas+NV+89119"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-lg bg-zinc-950 px-2.5 py-1.5 text-xs font-medium text-amber-300 ring-1 ring-amber-400/30 transition-colors hover:bg-amber-400/10"
            >
              Walmart Eastern Ave
              <ExternalLink className="size-3 opacity-75" />
            </a>
            <a
              href="https://zionoutfitter.com/product/kids-drysuit-package/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-lg bg-zinc-950 px-2.5 py-1.5 text-xs font-medium text-rose-300 ring-1 ring-rose-400/30 transition-colors hover:bg-rose-400/10"
            >
              Zion Outfitter Kid&apos;s Drysuit
              <ExternalLink className="size-3 opacity-75" />
            </a>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl bg-zinc-950/80 p-4 ring-1 ring-white/10">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search gear (e.g., drysuit, booster, Junior Ranger, gels, passport)..."
            aria-label="Search gear items"
            className="h-11 w-full rounded-xl bg-zinc-900/90 pr-10 pl-10 text-sm text-zinc-100 placeholder:text-zinc-500 ring-1 ring-white/10 transition-shadow outline-none focus:ring-2 focus:ring-amber-400/60"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
              className="absolute top-1/2 right-2.5 inline-flex size-7 -translate-y-1/2 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
            >
              <X className="size-4" />
            </button>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {CATEGORY_FILTER_PILLS.map((pill) => {
            const active = selectedCategory === pill.id;
            return (
              <button
                key={pill.id}
                type="button"
                onClick={() => setSelectedCategory(pill.id)}
                className={cn(
                  "inline-flex min-h-9 items-center rounded-xl px-3 py-1.5 text-xs font-medium transition-colors",
                  active
                    ? "bg-amber-400 text-zinc-950 shadow-xs"
                    : "bg-zinc-900/90 text-zinc-300 ring-1 ring-white/10 hover:bg-zinc-800 hover:text-zinc-100"
                )}
              >
                {pill.label}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-1.5 border-t border-white/8 pt-2.5">
          <span className="mr-1 text-[0.65rem] tracking-[0.2em] text-zinc-500 uppercase">
            Filter:
          </span>
          {SCOPE_FILTER_PILLS.map((pill) => {
            const active = scopeFilter === pill.id;
            return (
              <button
                key={pill.id}
                type="button"
                onClick={() => setScopeFilter(pill.id)}
                className={cn(
                  "inline-flex min-h-8 items-center rounded-lg px-2.5 py-1 text-xs font-medium transition-colors",
                  active
                    ? "bg-zinc-800 text-amber-300 ring-1 ring-amber-400/40"
                    : "bg-zinc-900/50 text-zinc-400 ring-1 ring-white/8 hover:bg-zinc-900 hover:text-zinc-200"
                )}
              >
                {pill.label}
              </button>
            );
          })}
        </div>
      </div>

      {groupedCategories.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-zinc-950/70 p-10 text-center ring-1 ring-white/10">
          <Sparkles className="size-7 text-amber-400" />
          <p className="text-base font-medium text-zinc-200">
            No gear items match your current filter.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("all");
              setScopeFilter("all");
              setSearchQuery("");
            }}
            className="inline-flex items-center gap-1.5 rounded-xl bg-amber-400 px-4 py-2 text-xs font-semibold text-zinc-950 transition-colors hover:bg-amber-300"
          >
            Show All Packing Items
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {groupedCategories.map((group) => {
            const Icon = categoryIcon(group.id);
            return (
              <section
                key={group.id}
                className="overflow-hidden rounded-2xl bg-zinc-950/85 ring-1 ring-white/10"
              >
                <div className="flex flex-col gap-1 border-b border-white/10 bg-zinc-900/50 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-amber-400/12 text-amber-300 ring-1 ring-amber-400/25">
                      <Icon className="size-4" />
                    </div>
                    <div>
                      <h3 className="font-medium text-zinc-50 sm:text-base">
                        {group.label}
                      </h3>
                      <p className="mt-0.5 text-xs text-zinc-400">
                        {group.subtitle}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-2 sm:mt-0 sm:shrink-0">
                    <Badge
                      variant="outline"
                      className="border-white/15 bg-zinc-950/80 text-zinc-300"
                    >
                      {group.packedInCat} / {group.totalInCat} packed
                    </Badge>
                  </div>
                </div>

                <ul className="divide-y divide-white/8">
                  {group.items.map((item) => {
                    const isChecked = Boolean(checkedMap[item.id]);
                    return (
                      <li
                        key={item.id}
                        className={cn(
                          "transition-colors",
                          isChecked
                            ? "bg-zinc-950/40"
                            : "bg-zinc-950/80 hover:bg-zinc-900/60"
                        )}
                      >
                        <div className="flex items-start gap-3.5 px-4 py-3.5 sm:px-5">
                          <button
                            type="button"
                            role="checkbox"
                            aria-checked={isChecked}
                            aria-label={`Mark ${item.name} as ${
                              isChecked ? "unpacked" : "packed"
                            }`}
                            onClick={() => toggleItem(item.id)}
                            className={cn(
                              "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-lg transition-all active:scale-95",
                              isChecked
                                ? "bg-amber-400 text-zinc-950 shadow-xs ring-1 ring-amber-300"
                                : "bg-zinc-900 text-transparent ring-1 ring-white/20 hover:ring-amber-400/60"
                            )}
                          >
                            <Check className="size-4 stroke-[2.75]" />
                          </button>

                          <div
                            onClick={() => toggleItem(item.id)}
                            className="min-w-0 flex-1 cursor-pointer select-none"
                          >
                            <div className="flex flex-wrap items-center gap-2">
                              <span
                                className={cn(
                                  "text-sm font-medium transition-colors sm:text-base",
                                  isChecked
                                    ? "text-zinc-500 line-through"
                                    : "text-zinc-100"
                                )}
                              >
                                {item.name}
                              </span>
                              <span
                                className={cn(
                                  "inline-flex items-center rounded-full border px-2 py-0.5 text-[0.68rem] font-medium",
                                  sourceBadgeStyle(item.source)
                                )}
                              >
                                {sourceLabel(item.source)}
                              </span>
                              {item.essential ? (
                                <span className="inline-flex items-center rounded-full bg-white/8 px-2 py-0.5 text-[0.65rem] font-medium tracking-wide text-zinc-300 uppercase">
                                  Essential
                                </span>
                              ) : (
                                <span className="inline-flex items-center rounded-full bg-white/5 px-2 py-0.5 text-[0.65rem] text-zinc-500">
                                  Optional
                                </span>
                              )}
                            </div>

                            <p
                              className={cn(
                                "mt-1 text-xs leading-relaxed sm:text-sm",
                                isChecked ? "text-zinc-600" : "text-zinc-400"
                              )}
                            >
                              {item.detail}
                            </p>

                            {item.link ? (
                              <div className="mt-2.5">
                                <a
                                  href={item.link.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="inline-flex min-h-8 items-center gap-1.5 rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-medium text-amber-300 ring-1 ring-amber-400/25 transition-colors hover:bg-amber-400/15"
                                >
                                  {item.link.label}
                                  <ExternalLink className="size-3 opacity-80" />
                                </a>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default PackingList;
