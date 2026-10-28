"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getDayGuide } from "@/data/day-guides";
import { formatHours, kindLabel } from "@/data/route";
import { dayRoutePlan, stopDirectionsUrl } from "@/lib/gmaps";
import {
  DAY_DATES,
  DAY_ORIGIN_DETAILS,
  dayTimetable,
  formatTime12,
  formatTimeParts,
} from "@/lib/timetable";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  BedDouble,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Compass,
  ExternalLink,
  Footprints,
  Landmark,
  MapPin,
  Moon,
  Navigation,
  ShieldCheck,
  Sun,
  Sunrise,
  Sunset,
  Tent,
  Thermometer,
  Ticket,
  Utensils,
  Waves,
  X,
} from "lucide-react";

type DayDetailProps = {
  day: number;
  onSelectStop: (id: string) => void;
  onClose?: () => void;
  onPrevDay?: () => void;
  onNextDay?: () => void;
};

export function DayDetail({
  day,
  onSelectStop,
  onClose,
  onPrevDay,
  onNextDay,
}: DayDetailProps) {
  const plan = dayRoutePlan(day);
  const timetable = dayTimetable(day);
  const guide = getDayGuide(day);
  if (!plan || timetable.length === 0) return null;

  const isRestDay =
    plan.origin.id === plan.destination.id && plan.waypoints.length === 0;
  const stopCount = plan.waypoints.length + 1;
  const dayDate = guide?.date ?? DAY_DATES[day];
  const arrivalEntry = timetable[timetable.length - 1];

  return (
    <div className="flex min-h-full flex-col bg-zinc-950 text-zinc-100">
      {/* Sticky Full-Screen Top Navigation Bar */}
      {onClose ? (
        <header className="sticky top-0 z-30 flex items-center justify-between gap-2 border-b border-white/10 bg-zinc-950/95 px-3 py-2.5 backdrop-blur sm:px-6 sm:py-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-9 gap-1.5 rounded-xl px-2.5 text-xs font-semibold text-zinc-300 hover:bg-zinc-900 hover:text-zinc-50"
          >
            <X className="size-4" />
            <span className="hidden sm:inline">Close</span>
          </Button>

          {/* Center Day Switcher */}
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              disabled={day <= 1}
              onClick={onPrevDay}
              className="h-8 rounded-lg border-white/15 bg-zinc-900/80 px-2 text-xs font-medium text-zinc-200 hover:bg-zinc-800 disabled:opacity-35"
              aria-label="Previous day"
            >
              <ChevronLeft className="size-3.5" />
              <span className="hidden sm:inline">Day {day - 1}</span>
            </Button>
            <span className="rounded-lg bg-amber-400/15 px-2.5 py-1 text-xs font-bold tracking-wider text-amber-300 ring-1 ring-amber-400/30 sm:text-sm">
              Day {day} of 11
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={day >= 11}
              onClick={onNextDay}
              className="h-8 rounded-lg border-white/15 bg-zinc-900/80 px-2 text-xs font-medium text-zinc-200 hover:bg-zinc-800 disabled:opacity-35"
              aria-label="Next day"
            >
              <span className="hidden sm:inline">Day {day + 1}</span>
              <ChevronRight className="size-3.5" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="size-9 rounded-full text-zinc-400 hover:bg-zinc-900 hover:text-zinc-50"
            aria-label="Close day guide"
          >
            <X className="size-5" />
          </Button>
        </header>
      ) : null}

      {/* Main Reading Container (Centered & Generously Spaced) */}
      <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-5 sm:px-6 sm:py-7">
        <div className="flex flex-col gap-6">
          {/* Header Title Section */}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-amber-400/20 px-2.5 py-0.5 text-[0.72rem] font-bold tracking-[0.2em] text-amber-300 uppercase ring-1 ring-amber-400/40">
                Day {day} of 11
              </span>
              {dayDate ? (
                <span className="text-xs font-medium text-zinc-400 sm:text-sm">
                  {dayDate}
                </span>
              ) : null}
            </div>
            <h2 className="font-display mt-2 text-3xl font-bold leading-tight tracking-wide text-zinc-50 sm:text-4xl lg:text-5xl">
              {guide?.title ?? plan.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-300 sm:text-base">
              {guide?.routeSummary ??
                `${plan.origin.city} → ${plan.destination.city}`}
            </p>
          </div>

          {/* Confirmed Booking Banner */}
          {guide?.bookedBanner ? (
            <div className="flex items-start gap-3 rounded-2xl bg-emerald-500/12 p-4 text-xs leading-relaxed text-emerald-100 ring-1 ring-emerald-500/35 sm:text-sm">
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-400" />
              <div>
                <span className="font-bold tracking-wide text-emerald-300 uppercase">
                  Confirmed Booking:{" "}
                </span>
                {guide.bookedBanner}
              </div>
            </div>
          ) : null}

          {/* 8-Year-Old Daughter & Family Highlight Banner */}
          {guide?.kidFriendlyPick ? (
            <div className="flex items-start gap-3.5 rounded-2xl bg-rose-500/12 p-4 text-xs leading-relaxed text-rose-100 ring-1 ring-rose-400/35 sm:text-sm sm:leading-relaxed">
              <span className="mt-0.5 text-xl leading-none">👧</span>
              <div>{guide.kidFriendlyPick}</div>
            </div>
          ) : null}

          {/* Time Zone Change Alert */}
          {guide?.timeZoneNote ? (
            <div className="flex items-start gap-3 rounded-2xl bg-amber-400/12 p-4 text-xs leading-relaxed text-amber-100 ring-1 ring-amber-400/35 sm:text-sm">
              <Clock className="mt-0.5 size-5 shrink-0 text-amber-300" />
              <div>
                <span className="font-bold tracking-wide text-amber-300 uppercase">
                  Clock / Time Zone Alert:{" "}
                </span>
                {guide.timeZoneNote}
              </div>
            </div>
          ) : null}

          {/* Primary CTA: Full-Day Turn-by-Turn Google Maps */}
          <a
            href={plan.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-14 items-center justify-center gap-2.5 rounded-2xl bg-amber-400 px-5 py-3.5 text-base font-bold text-zinc-950 shadow-lg shadow-amber-500/15 transition-all hover:bg-amber-300 active:scale-[0.99] sm:text-lg"
          >
            <Navigation className="size-5 shrink-0" />
            {isRestDay
              ? "Open Day Location in Google Maps"
              : `Start Day ${day} Turn-by-Turn in Google Maps`}
            <ExternalLink className="size-4 shrink-0 opacity-75" />
          </a>

          {/* Drive Stats Dashboard */}
          <div className="grid grid-cols-3 gap-3 rounded-2xl bg-zinc-900/80 p-4 ring-1 ring-white/10 sm:p-5">
            <Stat label="Total Drive" value={`${plan.driveMiles} mi`} />
            <Stat label="Road Time" value={formatHours(plan.driveHours)} />
            <Stat label="Total Stops" value={String(stopCount)} />
          </div>

          {/* Weather, Sun & Water Dashboard */}
          {guide ? (
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              <div className="flex items-center gap-3 rounded-2xl bg-zinc-900/70 p-3.5 ring-1 ring-white/8">
                <Thermometer className="size-5 shrink-0 text-amber-300" />
                <div className="min-w-0">
                  <p className="text-[0.65rem] font-semibold tracking-wider text-zinc-400 uppercase">
                    Day / Night Temp
                  </p>
                  <p className="truncate text-xs font-bold text-zinc-100 sm:text-sm">
                    {guide.tempDay} · {guide.tempNight}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl bg-zinc-900/70 p-3.5 ring-1 ring-white/8">
                <Sunrise className="size-5 shrink-0 text-orange-300" />
                <div className="min-w-0">
                  <p className="text-[0.65rem] font-semibold tracking-wider text-zinc-400 uppercase">
                    Sunrise / Sunset
                  </p>
                  <p className="truncate text-xs font-bold text-zinc-100 sm:text-sm">
                    {guide.sunrise} · {guide.sunset}
                  </p>
                </div>
              </div>

              {guide.waterTemp ? (
                <div className="col-span-2 flex items-center gap-3 rounded-2xl bg-sky-500/12 p-3.5 ring-1 ring-sky-400/30 sm:col-span-1">
                  <Waves className="size-5 shrink-0 text-sky-300" />
                  <div className="min-w-0">
                    <p className="text-[0.65rem] font-semibold tracking-wider text-sky-300 uppercase">
                      Water Temp
                    </p>
                    <p className="truncate text-xs font-bold text-sky-100 sm:text-sm">
                      {guide.waterTemp}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="col-span-2 flex items-center gap-3 rounded-2xl bg-zinc-900/70 p-3.5 ring-1 ring-white/8 sm:col-span-1">
                  <Sun className="size-5 shrink-0 text-amber-300" />
                  <div className="min-w-0">
                    <p className="text-[0.65rem] font-semibold tracking-wider text-zinc-400 uppercase">
                      Daylight Window
                    </p>
                    <p className="truncate text-xs font-bold text-zinc-100 sm:text-sm">
                      {guide.daylightHours}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : null}

          {/* Pass & Permit Rules */}
          {guide?.passAndPermitSummary ? (
            <div className="flex items-start gap-3 rounded-2xl bg-zinc-900/75 p-4 text-xs leading-relaxed text-zinc-200 ring-1 ring-white/10 sm:text-sm">
              <Ticket className="mt-0.5 size-5 shrink-0 text-amber-300" />
              <div>
                <span className="font-bold tracking-wide text-amber-300 uppercase">
                  Passes &amp; Permits:{" "}
                </span>
                {guide.passAndPermitSummary}
              </div>
            </div>
          ) : null}

          {/* Hikes & Trail Options with 1-Tap AllTrails Links */}
          {guide && guide.hikes.length > 0 ? (
            <section className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Footprints className="size-5 text-amber-300" />
                <h3 className="text-xs font-bold tracking-[0.2em] text-amber-300 uppercase sm:text-sm">
                  Trail &amp; Hike Options (Choose on the Day)
                </h3>
              </div>
              <div className="flex flex-col gap-3.5">
                {guide.hikes.map((hike, idx) => (
                  <div
                    key={`${hike.name}-${idx}`}
                    className="flex flex-col gap-2.5 rounded-2xl bg-zinc-900/80 p-4 ring-1 ring-white/10 sm:p-5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="rounded-md bg-amber-400/15 px-2.5 py-1 text-xs font-bold tracking-wider text-amber-300 uppercase">
                        {hike.optionLabel}
                      </span>
                      <span className="text-xs font-semibold text-zinc-300 sm:text-sm">
                        {hike.distance} · {hike.elevation} · {hike.duration}
                      </span>
                    </div>
                    <p className="text-base font-bold text-zinc-50 sm:text-lg">
                      {hike.name}
                    </p>
                    <p className="text-xs leading-relaxed text-zinc-300 sm:text-sm sm:leading-relaxed">
                      {hike.highlights}
                    </p>
                    <p className="text-xs font-medium text-amber-200/90 sm:text-sm">
                      <ShieldCheck className="mr-1 inline size-4 text-amber-300" />
                      {hike.permitNote}
                    </p>
                    <div className="mt-1 flex flex-wrap gap-2.5">
                      <a
                        href={hike.allTrailsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500/20 px-4 py-2 text-xs font-bold text-emerald-200 ring-1 ring-emerald-400/35 transition-colors hover:bg-emerald-500/30 sm:text-sm"
                      >
                        <Compass className="size-4" />
                        Open on AllTrails
                        <ExternalLink className="size-3.5 opacity-75" />
                      </a>
                      {hike.permitUrl ? (
                        <a
                          href={hike.permitUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-amber-400/15 px-4 py-2 text-xs font-bold text-amber-200 ring-1 ring-amber-400/35 transition-colors hover:bg-amber-400/25 sm:text-sm"
                        >
                          <Ticket className="size-4" />
                          Permit / Booking
                          <ExternalLink className="size-3.5 opacity-75" />
                        </a>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          <Separator className="bg-white/10" />

          {/* Stop-by-Stop Driving Timetable */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold tracking-[0.2em] text-amber-300 uppercase sm:text-sm">
                Stop-by-Stop Driving Timetable
              </p>
              <p className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
                {formatTime12(timetable[0].arriveMinutes)}
                <span className="mx-1 text-zinc-600">–</span>
                {formatTime12(arrivalEntry.arriveMinutes)}
              </p>
            </div>

            <ol className="flex flex-col gap-3.5">
              {timetable.map((entry, idx) => {
                const showLeg =
                  !entry.isOrigin && entry.stop.driveFromPrevMiles > 0;
                const originDetail = entry.isOrigin ? DAY_ORIGIN_DETAILS[day] : null;
                const timeParts = formatTimeParts(entry.arriveMinutes);
                const subLabel = entry.isOrigin
                  ? day === 1
                    ? "Trip Start"
                    : "Depart Hotel"
                  : entry.isDestination
                  ? day === 11
                    ? "Flight"
                    : "Overnight"
                  : `${entry.stopMinutes}m stop`;

                return (
                  <li
                    key={`${entry.stop.id}-${idx}`}
                    className={cn(
                      "rounded-2xl p-4 ring-1 transition-colors sm:p-5",
                      entry.isOrigin
                        ? "bg-zinc-900/40 ring-white/8"
                        : entry.isDestination
                        ? "bg-amber-400/10 ring-amber-400/30"
                        : "bg-zinc-900/75 ring-white/10"
                    )}
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-20 shrink-0 sm:w-24">
                        <div className="flex items-baseline gap-1">
                          <span className="font-display text-2xl font-bold leading-none text-amber-300 sm:text-3xl">
                            {timeParts.time}
                          </span>
                          <span className="text-[0.68rem] font-bold tracking-wider text-amber-400/90 uppercase sm:text-xs">
                            {timeParts.period}
                          </span>
                        </div>
                        <p className="mt-1 text-[0.62rem] font-semibold tracking-wider text-zinc-400 uppercase sm:text-xs">
                          {subLabel}
                        </p>
                      </div>
                      <div className="min-w-0 flex-1">
                        <button
                          type="button"
                          onClick={() => onSelectStop(entry.stop.id)}
                          className="text-left"
                        >
                          <p className="text-base font-bold text-zinc-50 hover:text-amber-200 sm:text-lg">
                            {originDetail ? originDetail.title : entry.stop.city}
                            {!originDetail ? (
                              <span className="ml-2 font-normal text-zinc-400">
                                {entry.stop.state}
                              </span>
                            ) : null}
                          </p>
                        </button>
                        <p className="mt-0.5 text-xs font-medium tracking-wide text-zinc-400 uppercase">
                          {entry.isOrigin && day > 1
                            ? `Morning departure from Night ${day - 1} hotel`
                            : entry.stop.highway}
                        </p>
                        {entry.stop.address ? (
                          <p className="mt-1 text-xs leading-relaxed text-zinc-400 sm:text-sm">
                            📍 {entry.stop.address}
                          </p>
                        ) : null}
                        <div className="mt-2.5 flex flex-wrap items-center gap-2">
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-xs",
                              entry.isOrigin
                                ? "border-amber-400/40 bg-amber-400/10 text-amber-300"
                                : entry.isDestination
                                ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-300"
                                : "border-white/15 text-zinc-200"
                            )}
                          >
                            {originDetail
                              ? originDetail.badge
                              : entry.isDestination && day < 11
                              ? `Night ${day} Hotel Base`
                              : entry.isDestination && day === 11
                              ? "Trip Finish · LAX & LH 457"
                              : kindLabel(entry.stop.kind)}
                          </Badge>
                          {showLeg ? (
                            <span className="text-xs text-zinc-300">
                              +{entry.stop.driveFromPrevMiles} mi ·{" "}
                              {formatHours(entry.stop.driveFromPrevHours)}
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-2.5 text-xs leading-relaxed text-zinc-100 sm:text-sm sm:leading-relaxed">
                          {originDetail ? originDetail.note : entry.stop.note}
                        </p>
                        <div className="mt-3 flex flex-col gap-2">
                          {entry.isOrigin && day > 1 ? (
                            <NoteLine
                              icon={BedDouble}
                              text={`Departing Night ${day - 1} overnight hotel base after breakfast to start Day ${day}.`}
                            />
                          ) : null}
                          {!entry.isOrigin && entry.stop.eat ? (
                            <NoteLine icon={Utensils} text={entry.stop.eat} />
                          ) : null}
                          {!entry.isOrigin && entry.stop.see ? (
                            <NoteLine icon={Landmark} text={entry.stop.see} />
                          ) : null}
                          {entry.isDestination && day < 11 ? (
                            <NoteLine
                              icon={Moon}
                              text={`Overnight hotel base for Night ${day} — ${entry.stop.city}.`}
                            />
                          ) : null}
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2.5">
                          <a
                            href={stopDirectionsUrl(entry.stop)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-amber-400 px-3.5 py-2 text-xs font-bold text-zinc-950 transition-colors hover:bg-amber-300 sm:text-sm"
                          >
                            <MapPin className="size-4" />
                            {entry.isOrigin
                              ? day === 1
                                ? "Navigate to LAS Rental Center"
                                : "Hotel Location & Directions"
                              : entry.isDestination
                              ? day === 11
                                ? "Navigate to LAX Return"
                                : "Navigate to Tonight's Hotel"
                              : "Navigate Here"}
                            <ExternalLink className="size-3.5 opacity-75" />
                          </a>
                          {entry.stop.links?.map((link, lIdx) => (
                            <a
                              key={`${link.url}-${lIdx}`}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-zinc-800 px-3 py-2 text-xs font-medium text-zinc-100 ring-1 ring-white/10 transition-colors hover:bg-zinc-700 sm:text-sm"
                            >
                              {link.label}
                              <ExternalLink className="size-3 opacity-70" />
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Food, Meals & Snack Stops */}
          {guide && guide.foodAndWater.length > 0 ? (
            <>
              <Separator className="bg-white/10" />
              <section className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Utensils className="size-5 text-amber-300" />
                  <h3 className="text-xs font-bold tracking-[0.2em] text-amber-300 uppercase sm:text-sm">
                    Coffee, Meals &amp; Snack Stops
                  </h3>
                </div>
                <div className="flex flex-col gap-3">
                  {guide.foodAndWater.map((item, idx) => (
                    <div
                      key={`${item.name}-${idx}`}
                      className="flex flex-col gap-2 rounded-2xl bg-zinc-900/70 p-4 ring-1 ring-white/10 sm:p-5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold tracking-wider text-amber-300 uppercase">
                          {item.time} · {item.kind}
                        </span>
                      </div>
                      <p className="text-base font-bold text-zinc-100 sm:text-lg">
                        {item.name}
                      </p>
                      <p className="text-xs leading-relaxed text-zinc-300 sm:text-sm sm:leading-relaxed">
                        {item.notes}
                      </p>
                      <div className="mt-1 flex flex-wrap gap-2.5">
                        <a
                          href={item.mapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-10 items-center gap-1.5 rounded-xl bg-zinc-800 px-3 py-1.5 text-xs font-semibold text-zinc-100 ring-1 ring-white/10 hover:bg-zinc-700 sm:text-sm"
                        >
                          <MapPin className="size-3.5 text-amber-300" />
                          Google Maps Pin
                          <ExternalLink className="size-3 opacity-70" />
                        </a>
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-10 items-center gap-1.5 rounded-xl bg-zinc-800 px-3 py-1.5 text-xs font-semibold text-zinc-200 ring-1 ring-white/10 hover:bg-zinc-700 sm:text-sm"
                        >
                          Website / Menu
                          <ExternalLink className="size-3 opacity-70" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </>
          ) : null}

          {/* Hotels, Cabins & Pools */}
          {guide && guide.sleepOptions.length > 0 ? (
            <>
              <Separator className="bg-white/10" />
              <section className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <BedDouble className="size-5 text-amber-300" />
                  <h3 className="text-xs font-bold tracking-[0.2em] text-amber-300 uppercase sm:text-sm">
                    Overnight Hotel, Cabin &amp; Heated Pool Options
                  </h3>
                </div>
                <div className="flex flex-col gap-3.5">
                  {guide.sleepOptions.map((sleep, idx) => (
                    <div
                      key={`${sleep.name}-${idx}`}
                      className={cn(
                        "flex flex-col gap-2.5 rounded-2xl p-4 ring-1 sm:p-5",
                        sleep.booked
                          ? "bg-emerald-500/12 ring-emerald-400/40"
                          : "bg-zinc-900/70 ring-white/10"
                      )}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <BedDouble className="size-4 text-amber-300" />
                          <span className="text-xs font-bold tracking-wider text-amber-300 uppercase">
                            {sleep.optionLabel} · {sleep.type}
                          </span>
                        </div>
                        <span className="rounded-md bg-white/10 px-2.5 py-0.5 text-xs font-bold text-zinc-100 sm:text-sm">
                          {sleep.price}
                        </span>
                      </div>
                      <p className="text-base font-bold text-zinc-100 sm:text-lg">
                        {sleep.name}
                        {sleep.booked ? (
                          <span className="ml-2.5 inline-flex items-center gap-1 rounded bg-emerald-500/20 px-2.5 py-0.5 text-xs font-bold text-emerald-300 uppercase">
                            ✓ Booked
                          </span>
                        ) : null}
                      </p>
                      <p className="text-xs leading-relaxed text-zinc-300 sm:text-sm sm:leading-relaxed">
                        {sleep.notes}
                      </p>
                      <div className="mt-1 flex flex-wrap gap-2.5">
                        <a
                          href={sleep.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-amber-400/15 px-4 py-2 text-xs font-bold text-amber-200 ring-1 ring-amber-400/35 hover:bg-amber-400/25 sm:text-sm"
                        >
                          Booking / Info Page
                          <ExternalLink className="size-3.5 opacity-75" />
                        </a>
                        <a
                          href={sleep.mapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl bg-zinc-800 px-3.5 py-2 text-xs font-medium text-zinc-100 ring-1 ring-white/10 hover:bg-zinc-700 sm:text-sm"
                        >
                          <MapPin className="size-4 text-amber-300" />
                          Map Pin
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </>
          ) : null}

          {/* Pro Hints & Nuances */}
          {guide && guide.nuances.length > 0 ? (
            <>
              <Separator className="bg-white/10" />
              <section className="flex flex-col gap-2.5 rounded-2xl bg-amber-400/8 p-4 ring-1 ring-amber-400/25 sm:p-5">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="size-4 text-amber-300" />
                  <h3 className="text-xs font-bold tracking-[0.2em] text-amber-300 uppercase sm:text-sm">
                    Day {day} Family Nuances &amp; Pro Hints
                  </h3>
                </div>
                <ul className="flex flex-col gap-2 text-xs leading-relaxed text-zinc-200 sm:text-sm sm:leading-relaxed">
                  {guide.nuances.map((n, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-amber-400" />
                      <span>{n}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="font-display text-2xl font-bold tracking-wide text-zinc-50 sm:text-3xl">
        {value}
      </div>
      <div className="text-[0.65rem] font-semibold tracking-[0.18em] text-zinc-400 uppercase sm:text-xs">
        {label}
      </div>
    </div>
  );
}

function NoteLine({
  icon: Icon,
  text,
}: {
  icon: typeof Utensils;
  text: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="mt-0.5 size-4 shrink-0 text-amber-300/80" />
      <p className="text-xs leading-relaxed text-zinc-300 sm:text-sm sm:leading-relaxed">
        {text}
      </p>
    </div>
  );
}
