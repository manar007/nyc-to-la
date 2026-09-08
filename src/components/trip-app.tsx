"use client";

import { useMemo, useState, type ReactNode } from "react";
import { RouteMap } from "@/components/route-map";
import { StopDetail } from "@/components/stop-detail";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DAYS,
  STOPS,
  TRIP,
  formatHours,
  kindLabel,
} from "@/data/route";
import { allDayRoutePlans } from "@/lib/gmaps";
import { cn } from "@/lib/utils";
import { ExternalLink, MapPinned, Moon, Navigation } from "lucide-react";

export function TripApp() {
  const [selectedId, setSelectedId] = useState(STOPS[0].id);
  const [mobileOpen, setMobileOpen] = useState(false);

  const selectedIndex = STOPS.findIndex((stop) => stop.id === selectedId);
  const selected = STOPS[selectedIndex] ?? STOPS[0];

  function select(id: string) {
    setSelectedId(id);
    const isMobile =
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 1023px)").matches;
    if (isMobile) setMobileOpen(true);
  }

  const dayPlans = useMemo(() => allDayRoutePlans(), []);

  return (
    <div className="flex min-h-full flex-col">
      <header className="relative overflow-hidden border-b border-white/10">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(251,191,36,0.16)_0%,transparent_38%,rgba(244,63,94,0.14)_100%)]" />
        <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <p className="text-[0.7rem] tracking-[0.28em] text-amber-300 uppercase">
            Coast to coast · {TRIP.highways}
          </p>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <h1 className="font-display text-6xl leading-[0.85] tracking-wide text-zinc-50 sm:text-7xl md:text-8xl">
              NYC
              <span className="mx-2 bg-linear-to-r from-amber-300 via-rose-400 to-sky-400 bg-clip-text text-transparent">
                →
              </span>
              LA
            </h1>
            <p className="max-w-sm text-sm leading-relaxed text-zinc-400 sm:text-right">
              {TRIP.tagline}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatChip>{TRIP.miles.toLocaleString()} miles</StatChip>
            <StatChip>{TRIP.days} days</StatChip>
            <StatChip>{TRIP.driveHours} hrs of driving</StatChip>
            <StatChip>{TRIP.overnights} overnights</StatChip>
          </div>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-6xl flex-1 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(20rem,0.9fr)] lg:px-8 lg:py-8">
        <section className="flex min-w-0 flex-col gap-4">
          <RouteMap selectedId={selected.id} onSelect={select} />

          <Tabs defaultValue="stops" className="gap-3">
            <TabsList className="bg-zinc-900/80">
              <TabsTrigger value="stops">All stops</TabsTrigger>
              <TabsTrigger value="days">By day</TabsTrigger>
            </TabsList>
            <TabsContent value="stops" className="outline-none">
              <ul className="divide-y divide-white/8 overflow-hidden rounded-xl ring-1 ring-white/10">
                {STOPS.map((stop, index) => (
                  <li key={stop.id}>
                    <button
                      type="button"
                      data-stop-id={stop.id}
                      onClick={() => select(stop.id)}
                      className={cn(
                        "flex w-full items-center gap-3 px-3 py-3 text-left transition-colors",
                        stop.id === selected.id
                          ? "bg-amber-400/10"
                          : "bg-zinc-950/40 hover:bg-zinc-900/80"
                      )}
                    >
                      <span className="font-display w-8 text-lg text-zinc-500">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-medium text-zinc-100">
                          {stop.city}
                          <span className="ml-1 font-normal text-zinc-500">
                            {stop.state}
                          </span>
                        </span>
                        <span className="text-xs text-zinc-500">
                          Day {stop.day} · {stop.milesFromStart.toLocaleString()} mi
                          {stop.driveFromPrevMiles
                            ? ` · +${stop.driveFromPrevMiles} mi · ${formatHours(stop.driveFromPrevHours)}`
                            : " · leave at dawn"}
                        </span>
                      </span>
                      <Badge
                        variant="outline"
                        className="hidden border-white/15 text-zinc-300 sm:inline-flex"
                      >
                        {kindLabel(stop.kind)}
                      </Badge>
                    </button>
                  </li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent value="days" className="outline-none">
              <div className="grid gap-3 sm:grid-cols-2">
                {dayPlans.map((plan) => {
                  const active = selected.day === plan.day;
                  const isRestDay =
                    plan.origin.id === plan.destination.id &&
                    plan.waypoints.length === 0;
                  return (
                    <div
                      key={plan.day}
                      data-day={plan.day}
                      className={cn(
                        "flex flex-col gap-3 rounded-xl p-4 ring-1 transition-colors",
                        active
                          ? "bg-amber-400/10 ring-amber-400/30"
                          : "bg-zinc-950/50 ring-white/10 hover:bg-zinc-900/80"
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => select(plan.destination.id)}
                        className="text-left"
                      >
                        <p className="text-[0.65rem] tracking-[0.2em] text-amber-300 uppercase">
                          Day {plan.day}
                        </p>
                        <p className="mt-1 font-medium text-zinc-50">
                          {plan.title}
                        </p>
                        <p className="mt-1 text-sm text-zinc-400">
                          {plan.origin.city} → {plan.destination.city}
                        </p>
                        <p className="mt-2 text-xs text-zinc-500">
                          {isRestDay
                            ? "Rest / in-park day"
                            : `${plan.driveMiles} mi · ${formatHours(plan.driveHours)} · ${plan.waypoints.length} stop${plan.waypoints.length === 1 ? "" : "s"}`}
                        </p>
                      </button>
                      <a
                        href={plan.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          "inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-xs font-medium transition-colors",
                          active
                            ? "bg-amber-400 text-zinc-950 hover:bg-amber-300"
                            : "bg-zinc-900 text-zinc-100 ring-1 ring-white/10 hover:bg-zinc-800"
                        )}
                      >
                        <Navigation className="size-3.5" />
                        {isRestDay ? "Open in Google Maps" : `Drive Day ${plan.day} in Google Maps`}
                        <ExternalLink className="size-3 opacity-70" />
                      </a>
                    </div>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </section>

        <aside className="hidden lg:block">
          <div className="sticky top-6 rounded-2xl bg-zinc-950/70 p-5 ring-1 ring-white/10 backdrop-blur-sm">
            <StopDetail
              stop={selected}
              index={selectedIndex}
              total={STOPS.length}
              onPrev={() =>
                select(STOPS[Math.max(0, selectedIndex - 1)].id)
              }
              onNext={() =>
                select(
                  STOPS[Math.min(STOPS.length - 1, selectedIndex + 1)].id
                )
              }
            />
          </div>
        </aside>
      </main>

      <div className="sticky bottom-0 z-20 border-t border-white/10 bg-[#0b1220]/95 p-3 backdrop-blur lg:hidden">
        <Button
          className="w-full bg-amber-400 text-zinc-950 hover:bg-amber-300"
          onClick={() => setMobileOpen(true)}
        >
          <MapPinned data-icon="inline-start" />
          Open {selected.city}
        </Button>
      </div>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="bottom"
          className="max-h-[85vh] overflow-y-auto bg-zinc-950 p-0 lg:hidden"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>
              {selected.city}, {selected.state}
            </SheetTitle>
            <SheetDescription>{selected.note}</SheetDescription>
          </SheetHeader>
          <div className="p-5 pb-8">
            <StopDetail
              stop={selected}
              index={selectedIndex}
              total={STOPS.length}
              onPrev={() =>
                select(STOPS[Math.max(0, selectedIndex - 1)].id)
              }
              onNext={() =>
                select(
                  STOPS[Math.min(STOPS.length - 1, selectedIndex + 1)].id
                )
              }
            />
          </div>
        </SheetContent>
      </Sheet>

      <footer className="mx-auto flex w-full max-w-6xl items-center gap-2 px-4 py-6 text-xs text-zinc-500 sm:px-6 lg:px-8">
        <Moon className="size-3.5" />
        Nine overnights. One finish line.
        <Separator orientation="vertical" className="mx-1 h-3 bg-white/15" />
        <Navigation className="size-3.5" />
        Every day pre-loaded into Google Maps. Tap and drive.
      </footer>
    </div>
  );
}

function StatChip({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full bg-zinc-900/80 px-3 py-1 text-xs tracking-wide text-zinc-300 ring-1 ring-white/10">
      {children}
    </span>
  );
}
