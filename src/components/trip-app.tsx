"use client";

import { useMemo, useState, type ReactNode } from "react";
import { DayDetail } from "@/components/day-detail";
import { PackingList } from "@/components/packing-list";
import { RouteMap } from "@/components/route-map";
import { StopDetail } from "@/components/stop-detail";
import { WeatherDashboard } from "@/components/weather-dashboard";
import initialWeather from "@/data/live-weather.json";
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
import { DAY_GUIDES } from "@/data/day-guides";
import {
  BOOKED_LOGISTICS,
  STOPS,
  TRIP,
  formatHours,
  kindLabel,
} from "@/data/route";
import { allDayRoutePlans } from "@/lib/gmaps";
import { cn } from "@/lib/utils";
import {
  Backpack,
  BedDouble,
  CalendarDays,
  Car,
  CheckCircle2,
  CloudSun,
  Compass,
  ExternalLink,
  Footprints,
  ListOrdered,
  MapPinned,
  Moon,
  Navigation,
  Plane,
  Sun,
  Thermometer,
  Ticket,
  Waves,
} from "lucide-react";

type MainTab = "days" | "stops" | "weather" | "packing" | "bookings";

export function TripApp() {
  const [selectedId, setSelectedId] = useState(STOPS[0].id);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDay, setOpenDay] = useState<number | null>(null);
  const [tab, setTab] = useState<MainTab>("days");

  const selectedIndex = STOPS.findIndex((stop) => stop.id === selectedId);
  const selected = STOPS[selectedIndex] ?? STOPS[0];

  function select(id: string) {
    setSelectedId(id);
    const isMobile =
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 1023px)").matches;
    if (isMobile) setMobileOpen(true);
  }

  function openDaySheet(day: number) {
    setOpenDay(day);
    const firstStop = STOPS.find((s) => s.day === day);
    if (firstStop) setSelectedId(firstStop.id);
  }

  function closeDaySheet() {
    setOpenDay(null);
  }

  const dayPlans = useMemo(() => allDayRoutePlans(), []);

  return (
    <div className="flex min-h-full flex-col pb-16 lg:pb-0">
      <header className="relative overflow-hidden border-b border-white/10">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(251,191,36,0.16)_0%,transparent_38%,rgba(14,165,233,0.16)_100%)]" />
        <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-[0.68rem] font-medium tracking-[0.24em] text-amber-300 uppercase">
              Nov 2 – Nov 12, 2026 · {TRIP.highways}
            </p>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[0.68rem] font-semibold text-emerald-300 ring-1 ring-emerald-400/30">
              <CheckCircle2 className="size-3" />
              Flights, SUV & Night 1 Locked
            </span>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <h1 className="font-display text-5xl leading-[0.88] tracking-wide text-zinc-50 sm:text-6xl md:text-7xl">
              LAS
              <span className="mx-2 bg-linear-to-r from-amber-300 via-rose-400 to-sky-400 bg-clip-text text-transparent">
                → CANYONS →
              </span>
              LAX
            </h1>
            <p className="max-w-md text-xs leading-relaxed text-zinc-300 sm:text-right sm:text-sm">
              {TRIP.tagline}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <StatChip>{TRIP.miles.toLocaleString()} miles</StatChip>
            <StatChip>{TRIP.days} days (Nov 2–12)</StatChip>
            <StatChip>{TRIP.driveHours} hrs driving</StatChip>
            <StatChip>7 Canyons + 3 Ocean Days</StatChip>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar">
            <span className="shrink-0 text-[0.65rem] font-semibold tracking-wider text-zinc-400 uppercase mr-1">
              Quick Day:
            </span>
            {dayPlans.map((plan) => {
              const isOcean = plan.day >= 8 && plan.day <= 10;
              return (
                <button
                  key={plan.day}
                  type="button"
                  onClick={() => openDaySheet(plan.day)}
                  className={cn(
                    "shrink-0 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors ring-1",
                    openDay === plan.day
                      ? "bg-amber-400 text-zinc-950 ring-amber-400"
                      : isOcean
                      ? "bg-sky-500/15 text-sky-200 ring-sky-400/30 hover:bg-sky-500/25"
                      : "bg-zinc-900/90 text-zinc-200 ring-white/10 hover:bg-zinc-800"
                  )}
                >
                  D{plan.day}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-6xl flex-1 gap-6 px-4 py-5 sm:px-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(21rem,0.95fr)] lg:px-8 lg:py-8">
        <section className="flex min-w-0 flex-col gap-4">
          <div
            role="tablist"
            aria-label="Road trip sections"
            className="grid grid-cols-2 gap-1.5 rounded-xl bg-zinc-900/90 p-1.5 ring-1 ring-white/10 sm:grid-cols-5"
          >
            {(
              [
                { id: "days", label: "Daily Plan (1–11)", icon: CalendarDays },
                { id: "stops", label: `All Stops (${STOPS.length})`, icon: MapPinned },
                {
                  id: "weather",
                  label:
                    initialWeather.alertCount > 0
                      ? `Live Weather (${initialWeather.alertCount})`
                      : "Live Weather",
                  icon: CloudSun,
                },
                { id: "packing", label: "Packing List", icon: Backpack },
                { id: "bookings", label: "Flights & SUV", icon: Ticket },
              ] as const
            ).map((t) => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setTab(t.id)}
                  className={cn(
                    "inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors sm:text-sm",
                    active
                      ? "bg-amber-400 text-zinc-950 shadow-sm"
                      : "text-zinc-300 hover:bg-zinc-800/80 hover:text-zinc-50"
                  )}
                >
                  <Icon className="size-3.5 shrink-0" />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>

          {(tab === "days" || tab === "stops") && (
            <RouteMap selectedId={selected.id} onSelect={select} />
          )}

          <div
            role="tabpanel"
            hidden={tab !== "days"}
            className={cn("outline-none", tab !== "days" && "hidden")}
          >
            <div className="grid gap-3.5 sm:grid-cols-2">
              {dayPlans.map((plan) => {
                const guide = DAY_GUIDES[plan.day];
                const active = selected.day === plan.day;
                const isOcean = plan.day >= 8 && plan.day <= 10;
                const stopCount = plan.waypoints.length + 1;
                return (
                  <div
                    key={plan.day}
                    data-day={plan.day}
                    className={cn(
                      "flex flex-col justify-between gap-3 rounded-2xl p-4 ring-1 transition-colors",
                      active
                        ? "bg-amber-400/10 ring-amber-400/35"
                        : isOcean
                        ? "bg-sky-950/20 ring-sky-400/20 hover:bg-sky-950/30"
                        : "bg-zinc-950/60 ring-white/10 hover:bg-zinc-900/80"
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => openDaySheet(plan.day)}
                      className="text-left"
                      aria-label={`View Day ${plan.day} full guide`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "rounded-md px-2 py-0.5 text-[0.65rem] font-bold tracking-[0.18em] uppercase",
                              isOcean
                                ? "bg-sky-400/15 text-sky-300"
                                : "bg-amber-400/15 text-amber-300"
                            )}
                          >
                            Day {plan.day}
                          </span>
                          <span className="text-xs font-medium text-zinc-400">
                            {guide?.date}
                          </span>
                        </div>
                        {isOcean ? (
                          <Waves className="size-4 text-sky-300" />
                        ) : (
                          <CalendarDays className="size-4 text-zinc-500" />
                        )}
                      </div>

                      <p className="mt-2 text-base font-semibold leading-snug text-zinc-50">
                        {guide?.title ?? plan.title}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-zinc-300">
                        {guide?.routeSummary ??
                          `${plan.origin.city} → ${plan.destination.city}`}
                      </p>

                      {guide ? (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          <span className="inline-flex items-center gap-1 rounded-md bg-zinc-900/90 px-2 py-1 text-[11px] text-zinc-200 ring-1 ring-white/10">
                            <Thermometer className="size-3 text-amber-300" />
                            {guide.tempDay} / {guide.tempNight}
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-md bg-zinc-900/90 px-2 py-1 text-[11px] text-zinc-200 ring-1 ring-white/10">
                            <Sun className="size-3 text-orange-300" />
                            Sunset {guide.sunset}
                          </span>
                          {guide.hikes.length > 0 ? (
                            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/15 px-2 py-1 text-[11px] font-medium text-emerald-200 ring-1 ring-emerald-400/25">
                              <Footprints className="size-3" />
                              {guide.hikes.length} hike option
                              {guide.hikes.length > 1 ? "s" : ""}
                            </span>
                          ) : null}
                        </div>
                      ) : null}

                      <p className="mt-2.5 text-xs text-zinc-400">
                        {plan.driveMiles} mi · {formatHours(plan.driveHours)}{" "}
                        drive · {stopCount} stops
                      </p>
                    </button>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => openDaySheet(plan.day)}
                        className={cn(
                          "inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-colors",
                          active
                            ? "bg-amber-400 text-zinc-950 hover:bg-amber-300"
                            : "bg-zinc-900 text-zinc-100 ring-1 ring-white/15 hover:bg-zinc-800"
                        )}
                      >
                        <ListOrdered className="size-3.5" />
                        Full Day Guide
                      </button>
                      <a
                        href={plan.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl bg-zinc-900 px-3 py-2 text-xs font-semibold text-amber-300 ring-1 ring-amber-400/30 transition-colors hover:bg-zinc-800"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Navigation className="size-3.5" />
                        Google Maps
                        <ExternalLink className="size-3 opacity-70" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div
            role="tabpanel"
            hidden={tab !== "stops"}
            className={cn("outline-none", tab !== "stops" && "hidden")}
          >
            <ul className="divide-y divide-white/8 overflow-hidden rounded-2xl ring-1 ring-white/10">
              {STOPS.map((stop, index) => (
                <li key={stop.id}>
                  <button
                    type="button"
                    data-stop-id={stop.id}
                    onClick={() => select(stop.id)}
                    className={cn(
                      "flex w-full items-center gap-3 px-3.5 py-3.5 text-left transition-colors",
                      stop.id === selected.id
                        ? "bg-amber-400/12"
                        : "bg-zinc-950/50 hover:bg-zinc-900/80"
                    )}
                  >
                    <span className="font-display w-8 text-lg text-amber-300/80">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium text-zinc-100">
                        {stop.city}
                        <span className="ml-1.5 font-normal text-zinc-400">
                          {stop.state}
                        </span>
                      </span>
                      <span className="text-xs text-zinc-400">
                        {stop.day === 0 ? "Day 1 Start" : `Day ${stop.day}`} ·{" "}
                        {stop.milesFromStart.toLocaleString()} mi
                        {stop.driveFromPrevMiles
                          ? ` · +${stop.driveFromPrevMiles} mi · ${formatHours(stop.driveFromPrevHours)}`
                          : " · 11:30 AM LAS pick-up"}
                      </span>
                    </span>
                    <Badge
                      variant="outline"
                      className="border-white/15 text-zinc-300"
                    >
                      {kindLabel(stop.kind)}
                    </Badge>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div
            role="tabpanel"
            hidden={tab !== "weather"}
            className={cn("outline-none", tab !== "weather" && "hidden")}
          >
            <WeatherDashboard onOpenDay={openDaySheet} />
          </div>

          <div
            role="tabpanel"
            hidden={tab !== "packing"}
            className={cn("outline-none", tab !== "packing" && "hidden")}
          >
            <PackingList />
          </div>

          <div
            role="tabpanel"
            hidden={tab !== "bookings"}
            className={cn("outline-none", tab !== "bookings" && "hidden")}
          >
            <div className="flex flex-col gap-4">
              <div className="rounded-2xl bg-zinc-950/70 p-5 ring-1 ring-white/10">
                <p className="text-xs font-semibold tracking-[0.2em] text-amber-300 uppercase">
                  Confirmed Reservations & Critical Numbers
                </p>
                <h2 className="font-display mt-1 text-3xl tracking-wide text-zinc-50">
                  Flights, SUV Rental & National Park Pass
                </h2>
                <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                  Keep this tab handy at JFK, LAS Rental Car Center, Zion South
                  Entrance, and LAX Tom Bradley International Terminal.
                </p>

                <div className="mt-4 grid gap-3">
                  {BOOKED_LOGISTICS.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col gap-2 rounded-xl bg-zinc-900/80 p-4 ring-1 ring-emerald-500/25"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500/15 px-2.5 py-0.5 text-[0.68rem] font-bold tracking-wider text-emerald-300 uppercase">
                          <CheckCircle2 className="size-3.5" />
                          {item.status} · {item.label}
                        </span>
                        {item.cost ? (
                          <span className="text-xs font-semibold text-amber-300">
                            {item.cost}
                          </span>
                        ) : null}
                      </div>
                      <p className="text-base font-semibold text-zinc-50">
                        {item.summary}
                      </p>
                      <p className="text-xs font-medium text-amber-200/90">
                        {item.window}
                        {item.confirmation ? ` · ${item.confirmation}` : ""}
                      </p>
                      <p className="text-xs leading-relaxed text-zinc-300">
                        {item.details}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl bg-zinc-950/70 p-5 ring-1 ring-amber-400/25">
                <div className="flex items-center gap-2">
                  <Ticket className="size-4 text-amber-300" />
                  <h3 className="text-xs font-semibold tracking-[0.2em] text-amber-300 uppercase">
                    Passes & Permits Quick Cheat Sheet
                  </h3>
                </div>
                <ul className="mt-3 flex flex-col gap-2 text-xs leading-relaxed text-zinc-300">
                  <li>
                    •{" "}
                    <strong className="text-zinc-100">
                      $80 America the Beautiful Pass:
                    </strong>{" "}
                    Buy in person at the{" "}
                    <strong className="text-amber-300">
                      Zion South Entrance booth on Day 2 morning
                    </strong>{" "}
                    (open to international visitors with passport). Covers{" "}
                    <strong className="text-emerald-300">100% FREE entry</strong>{" "}
                    to Zion ($35), Bryce Canyon ($35), Lake Powell / Glen Canyon
                    ($30), Grand Canyon ($35), Sedona Red Rock Pass ($5), and
                    Joshua Tree ($30).
                  </li>
                  <li>
                    •{" "}
                    <strong className="text-zinc-100">
                      Not Covered by Federal Pass (Pay Separately):
                    </strong>{" "}
                    Valley of Fire NV State Park ($15 at gate, Day 1), Wire Pass
                    / Buckskin Gulch BLM Permit ($6 on Recreation.gov, Day 4),
                    Horseshoe Bend City of Page Parking ($10 at gate, Day 4),
                    Antelope Canyon Navajo Guided Tour (~$55–$95 pre-booked, Day
                    5), and Monument Valley Navajo Tribal Park ($8, Day 5).
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <aside className="hidden lg:block">
          <div className="sticky top-6 rounded-2xl bg-zinc-950/75 p-5 ring-1 ring-white/10 backdrop-blur-sm">
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

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-[#0b1220]/95 px-3 py-2.5 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-lg items-center gap-2">
          <Button
            className="min-h-11 flex-1 bg-amber-400 text-xs font-semibold text-zinc-950 hover:bg-amber-300"
            onClick={() => openDaySheet(selected.day || 1)}
          >
            <CalendarDays className="mr-1.5 size-4" />
            Day {selected.day || 1} Guide
          </Button>
          <Button
            variant="outline"
            className="min-h-11 flex-1 border-white/15 bg-zinc-900 text-xs font-semibold text-zinc-100 hover:bg-zinc-800"
            onClick={() => setMobileOpen(true)}
          >
            <MapPinned className="mr-1.5 size-4 text-amber-300" />
            {selected.city.split(" (")[0]}
          </Button>
          <Button
            variant="outline"
            className={cn(
              "min-h-11 px-3 border-white/15 text-xs font-semibold",
              tab === "weather"
                ? "bg-sky-500/20 text-sky-200 border-sky-400/40"
                : "bg-zinc-900 text-zinc-200"
            )}
            onClick={() =>
              setTab(tab === "weather" ? "days" : "weather")
            }
            aria-label="Live Weather"
          >
            <CloudSun className="size-4 text-sky-300" />
          </Button>
          <Button
            variant="outline"
            className={cn(
              "min-h-11 px-3 border-white/15 text-xs font-semibold",
              tab === "packing"
                ? "bg-emerald-500/20 text-emerald-200 border-emerald-400/40"
                : "bg-zinc-900 text-zinc-200"
            )}
            onClick={() =>
              setTab(tab === "packing" ? "days" : "packing")
            }
            aria-label="Packing List"
          >
            <Backpack className="size-4" />
          </Button>
        </div>
      </div>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="full"
          showCloseButton={false}
          className="fixed inset-0 z-50 h-[100dvh] max-h-[100dvh] w-full overflow-y-auto bg-zinc-950 p-0"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>
              {selected.city}, {selected.state}
            </SheetTitle>
            <SheetDescription>{selected.note}</SheetDescription>
          </SheetHeader>
          <div className="mx-auto w-full max-w-2xl px-4 py-5 pb-16 sm:px-6 sm:py-7">
            <StopDetail
              stop={selected}
              index={selectedIndex}
              total={STOPS.length}
              onClose={() => setMobileOpen(false)}
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

      <Sheet
        open={openDay !== null}
        onOpenChange={(open) => {
          if (!open) closeDaySheet();
        }}
      >
        <SheetContent
          side="full"
          showCloseButton={false}
          className="fixed inset-0 z-50 h-[100dvh] max-h-[100dvh] w-full overflow-y-auto bg-zinc-950 p-0"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Day {openDay ?? ""}</SheetTitle>
            <SheetDescription>
              Full timetable, AllTrails links, temperatures, permits, and Google Maps navigation.
            </SheetDescription>
          </SheetHeader>
          {openDay !== null ? (
            <DayDetail
              day={openDay}
              onClose={closeDaySheet}
              onPrevDay={() => setOpenDay(Math.max(1, openDay - 1))}
              onNextDay={() => setOpenDay(Math.min(11, openDay + 1))}
              onSelectStop={(id) => {
                closeDaySheet();
                select(id);
              }}
            />
          ) : null}
        </SheetContent>
      </Sheet>

      <footer className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-2 px-4 py-6 text-xs text-zinc-500 sm:px-6 lg:px-8">
        <Moon className="size-3.5" />
        10 nights · 7 Southwest Parks + 3 Pacific Ocean Days.
        <Separator orientation="vertical" className="mx-1 h-3 bg-white/15" />
        <Navigation className="size-3.5" />
        Tap any day or stop to open turn-by-turn Google Maps & AllTrails on your phone.
      </footer>
    </div>
  );
}

function StatChip({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full bg-zinc-900/80 px-3 py-1 text-xs tracking-wide text-zinc-200 ring-1 ring-white/10">
      {children}
    </span>
  );
}
