"use client";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getDayGuide } from "@/data/day-guides";
import { formatHours, kindLabel } from "@/data/route";
import { dayRoutePlan, stopDirectionsUrl } from "@/lib/gmaps";
import { DAY_DATES, dayTimetable, formatHHMM } from "@/lib/timetable";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  BedDouble,
  CheckCircle2,
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
  Tent,
  Thermometer,
  Ticket,
  Utensils,
  Waves,
} from "lucide-react";

type DayDetailProps = {
  day: number;
  onSelectStop: (id: string) => void;
};

export function DayDetail({ day, onSelectStop }: DayDetailProps) {
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
    <div className="flex flex-col gap-5">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-amber-400/15 px-2 py-0.5 text-[0.7rem] font-semibold tracking-[0.2em] text-amber-300 uppercase ring-1 ring-amber-400/30">
            Day {day} of 11
          </span>
          {dayDate ? (
            <span className="text-xs font-medium text-zinc-400">{dayDate}</span>
          ) : null}
        </div>
        <h2 className="font-display mt-2 text-3xl leading-none tracking-wide text-zinc-50 sm:text-4xl">
          {guide?.title ?? plan.title}
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-zinc-300">
          {guide?.routeSummary ??
            `${plan.origin.city} → ${plan.destination.city}`}
        </p>
      </div>

      {guide?.bookedBanner ? (
        <div className="flex items-start gap-2.5 rounded-xl bg-emerald-500/10 p-3 text-xs leading-relaxed text-emerald-200 ring-1 ring-emerald-500/30">
          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-400" />
          <div>
            <span className="font-semibold tracking-wide text-emerald-300 uppercase">
              Confirmed Booking:{" "}
            </span>
            {guide.bookedBanner}
          </div>
        </div>
      ) : null}

      {guide?.kidFriendlyPick ? (
        <div className="flex items-start gap-2.5 rounded-xl bg-rose-500/10 p-3 text-xs leading-relaxed text-rose-100 ring-1 ring-rose-400/30">
          <span className="mt-0.5 text-base leading-none">👧</span>
          <div>{guide.kidFriendlyPick}</div>
        </div>
      ) : null}

      {guide?.timeZoneNote ? (
        <div className="flex items-start gap-2.5 rounded-xl bg-amber-400/10 p-3 text-xs leading-relaxed text-amber-200 ring-1 ring-amber-400/30">
          <Clock className="mt-0.5 size-4 shrink-0 text-amber-300" />
          <div>
            <span className="font-semibold tracking-wide text-amber-300 uppercase">
              Clock / Time Zone Alert:{" "}
            </span>
            {guide.timeZoneNote}
          </div>
        </div>
      ) : null}

      <a
        href={plan.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-xl bg-amber-400 px-4 py-3 text-sm font-semibold text-zinc-950 shadow-md transition-colors hover:bg-amber-300 active:scale-[0.99]"
      >
        <Navigation className="size-4" />
        {isRestDay
          ? "Open Day Location in Google Maps"
          : `Start Day ${day} Turn-by-Turn in Google Maps`}
        <ExternalLink className="size-3.5 opacity-75" />
      </a>

      <div className="grid grid-cols-3 gap-2 rounded-xl bg-zinc-900/80 p-3 ring-1 ring-white/10">
        <Stat label="Drive" value={`${plan.driveMiles} mi`} />
        <Stat label="Road Time" value={formatHours(plan.driveHours)} />
        <Stat label="Stops" value={String(stopCount)} />
      </div>

      {guide ? (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          <div className="flex items-center gap-2.5 rounded-xl bg-zinc-900/60 p-2.5 ring-1 ring-white/8">
            <Thermometer className="size-4 shrink-0 text-amber-300" />
            <div className="min-w-0">
              <p className="text-[0.62rem] tracking-wider text-zinc-500 uppercase">
                Day / Night Temp
              </p>
              <p className="truncate text-xs font-medium text-zinc-100">
                {guide.tempDay} · {guide.tempNight}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 rounded-xl bg-zinc-900/60 p-2.5 ring-1 ring-white/8">
            <Sunrise className="size-4 shrink-0 text-orange-300" />
            <div className="min-w-0">
              <p className="text-[0.62rem] tracking-wider text-zinc-500 uppercase">
                Sunrise / Sunset
              </p>
              <p className="truncate text-xs font-medium text-zinc-100">
                {guide.sunrise} · {guide.sunset}
              </p>
            </div>
          </div>

          {guide.waterTemp ? (
            <div className="col-span-2 flex items-center gap-2.5 rounded-xl bg-sky-500/10 p-2.5 ring-1 ring-sky-400/25 sm:col-span-1">
              <Waves className="size-4 shrink-0 text-sky-300" />
              <div className="min-w-0">
                <p className="text-[0.62rem] tracking-wider text-sky-300/80 uppercase">
                  Water Temp
                </p>
                <p className="truncate text-xs font-medium text-sky-100">
                  {guide.waterTemp}
                </p>
              </div>
            </div>
          ) : (
            <div className="col-span-2 flex items-center gap-2.5 rounded-xl bg-zinc-900/60 p-2.5 ring-1 ring-white/8 sm:col-span-1">
              <Sun className="size-4 shrink-0 text-amber-300" />
              <div className="min-w-0">
                <p className="text-[0.62rem] tracking-wider text-zinc-500 uppercase">
                  Daylight Window
                </p>
                <p className="truncate text-xs font-medium text-zinc-100">
                  {guide.daylightHours}
                </p>
              </div>
            </div>
          )}
        </div>
      ) : null}

      {guide?.passAndPermitSummary ? (
        <div className="flex items-start gap-2.5 rounded-xl bg-zinc-900/70 p-3 text-xs leading-relaxed text-zinc-300 ring-1 ring-white/10">
          <Ticket className="mt-0.5 size-4 shrink-0 text-amber-300" />
          <div>
            <span className="font-semibold tracking-wide text-amber-300 uppercase">
              Passes & Permits:{" "}
            </span>
            {guide.passAndPermitSummary}
          </div>
        </div>
      ) : null}

      {guide && guide.hikes.length > 0 ? (
        <section className="flex flex-col gap-2.5">
          <div className="flex items-center gap-2">
            <Footprints className="size-4 text-amber-300" />
            <h3 className="text-xs font-semibold tracking-[0.2em] text-amber-300 uppercase">
              Hikes & Trail Options (Choose on the Day)
            </h3>
          </div>
          <div className="flex flex-col gap-2.5">
            {guide.hikes.map((hike, idx) => (
              <div
                key={`${hike.name}-${idx}`}
                className="flex flex-col gap-2 rounded-xl bg-zinc-900/70 p-3.5 ring-1 ring-white/10"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="rounded bg-amber-400/15 px-2 py-0.5 text-[0.65rem] font-semibold tracking-wider text-amber-300 uppercase">
                    {hike.optionLabel}
                  </span>
                  <span className="text-xs font-medium text-zinc-400">
                    {hike.distance} · {hike.elevation} · {hike.duration}
                  </span>
                </div>
                <p className="font-medium text-zinc-100">{hike.name}</p>
                <p className="text-xs leading-relaxed text-zinc-300">
                  {hike.highlights}
                </p>
                <p className="text-[11px] text-amber-200/90">
                  <ShieldCheck className="mr-1 inline size-3.5 text-amber-300" />
                  {hike.permitNote}
                </p>
                <div className="mt-1 flex flex-wrap gap-2">
                  <a
                    href={hike.allTrailsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-9 flex-1 items-center justify-center gap-1.5 rounded-lg bg-emerald-500/20 px-3 py-1.5 text-xs font-semibold text-emerald-200 ring-1 ring-emerald-400/30 transition-colors hover:bg-emerald-500/30"
                  >
                    <Compass className="size-3.5" />
                    Open on AllTrails
                    <ExternalLink className="size-3 opacity-75" />
                  </a>
                  {hike.permitUrl ? (
                    <a
                      href={hike.permitUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg bg-amber-400/15 px-3 py-1.5 text-xs font-semibold text-amber-200 ring-1 ring-amber-400/30 transition-colors hover:bg-amber-400/25"
                    >
                      <Ticket className="size-3.5" />
                      Permit / Booking
                      <ExternalLink className="size-3 opacity-75" />
                    </a>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <Separator className="bg-white/10" />

      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold tracking-[0.2em] text-amber-300 uppercase">
          Stop-by-Stop Driving Timetable
        </p>
        <p className="text-[0.65rem] tracking-[0.18em] text-zinc-400 uppercase">
          {formatHHMM(timetable[0].arriveMinutes)}
          <span className="mx-1 text-zinc-600">–</span>
          {formatHHMM(arrivalEntry.arriveMinutes)}
        </p>
      </div>

      <ol className="flex flex-col gap-3">
        {timetable.map((entry, idx) => {
          const showLeg =
            !entry.isOrigin && entry.stop.driveFromPrevMiles > 0;
          return (
            <li
              key={`${entry.stop.id}-${idx}`}
              className={cn(
                "rounded-xl p-3.5 ring-1 transition-colors",
                entry.isOrigin
                  ? "bg-zinc-900/40 ring-white/8"
                  : entry.isDestination
                  ? "bg-amber-400/10 ring-amber-400/30"
                  : "bg-zinc-900/65 ring-white/10"
              )}
            >
              <div className="flex items-start gap-3">
                <div className="w-16 shrink-0">
                  <p className="font-display text-xl leading-none text-amber-300">
                    {entry.stop.timeWindow
                      ? entry.stop.timeWindow.split("–")[0].trim()
                      : formatHHMM(entry.arriveMinutes)}
                  </p>
                  <p className="mt-1 text-[0.6rem] tracking-[0.16em] text-zinc-400 uppercase">
                    {entry.isOrigin
                      ? "Start"
                      : entry.isDestination
                      ? "Finish"
                      : `${entry.stopMinutes}m stop`}
                  </p>
                </div>
                <div className="min-w-0 flex-1">
                  <button
                    type="button"
                    onClick={() => onSelectStop(entry.stop.id)}
                    className="text-left"
                  >
                    <p className="font-semibold text-zinc-50 hover:text-amber-200">
                      {entry.stop.city}
                      <span className="ml-1.5 font-normal text-zinc-400">
                        {entry.stop.state}
                      </span>
                    </p>
                  </button>
                  <p className="mt-0.5 text-[0.65rem] tracking-[0.16em] text-zinc-400 uppercase">
                    {entry.stop.highway}
                  </p>
                  {entry.stop.address ? (
                    <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                      {entry.stop.address}
                    </p>
                  ) : null}
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Badge
                      variant="outline"
                      className="border-white/15 text-zinc-200"
                    >
                      {kindLabel(entry.stop.kind)}
                    </Badge>
                    {showLeg ? (
                      <span className="text-xs text-zinc-400">
                        +{entry.stop.driveFromPrevMiles} mi ·{" "}
                        {formatHours(entry.stop.driveFromPrevHours)}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-zinc-200">
                    {entry.stop.note}
                  </p>
                  <div className="mt-2 flex flex-col gap-1.5">
                    {entry.stop.eat ? (
                      <NoteLine icon={Utensils} text={entry.stop.eat} />
                    ) : null}
                    {entry.stop.see ? (
                      <NoteLine icon={Landmark} text={entry.stop.see} />
                    ) : null}
                    {entry.isDestination &&
                    (entry.stop.kind === "overnight" ||
                      entry.stop.kind === "camp") ? (
                      <NoteLine
                        icon={Moon}
                        text={`Overnight base — ${entry.stop.city}.`}
                      />
                    ) : null}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <a
                      href={stopDirectionsUrl(entry.stop)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-amber-400 px-3 py-1.5 text-xs font-semibold text-zinc-950 transition-colors hover:bg-amber-300"
                    >
                      <MapPin className="size-3.5" />
                      Navigate Here
                      <ExternalLink className="size-3 opacity-75" />
                    </a>
                    {entry.stop.links?.map((link, lIdx) => (
                      <a
                        key={`${link.url}-${lIdx}`}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-zinc-800 px-2.5 py-1.5 text-xs font-medium text-zinc-100 ring-1 ring-white/10 transition-colors hover:bg-zinc-700"
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

      {guide && guide.foodAndWater.length > 0 ? (
        <>
          <Separator className="bg-white/10" />
          <section className="flex flex-col gap-2.5">
            <div className="flex items-center gap-2">
              <Utensils className="size-4 text-amber-300" />
              <h3 className="text-xs font-semibold tracking-[0.2em] text-amber-300 uppercase">
                Coffee, Meals & Water/Snack Stops
              </h3>
            </div>
            <div className="flex flex-col gap-2">
              {guide.foodAndWater.map((item, idx) => (
                <div
                  key={`${item.name}-${idx}`}
                  className="flex flex-col gap-1.5 rounded-xl bg-zinc-900/60 p-3 ring-1 ring-white/10"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[0.65rem] font-semibold tracking-wider text-amber-300 uppercase">
                      {item.time} · {item.kind}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-zinc-100">
                    {item.name}
                  </p>
                  <p className="text-xs leading-relaxed text-zinc-300">
                    {item.notes}
                  </p>
                  <div className="mt-1 flex flex-wrap gap-2">
                    <a
                      href={item.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-8 items-center gap-1.5 rounded-md bg-zinc-800 px-2.5 py-1 text-xs font-medium text-zinc-100 ring-1 ring-white/10 hover:bg-zinc-700"
                    >
                      <MapPin className="size-3 text-amber-300" />
                      Google Maps Pin
                      <ExternalLink className="size-3 opacity-70" />
                    </a>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-8 items-center gap-1.5 rounded-md bg-zinc-800 px-2.5 py-1 text-xs font-medium text-zinc-200 ring-1 ring-white/10 hover:bg-zinc-700"
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

      {guide && guide.sleepOptions.length > 0 ? (
        <>
          <Separator className="bg-white/10" />
          <section className="flex flex-col gap-2.5">
            <div className="flex items-center gap-2">
              <BedDouble className="size-4 text-amber-300" />
              <h3 className="text-xs font-semibold tracking-[0.2em] text-amber-300 uppercase">
                Overnight Hotel, Cabin & Heated Pool Options
              </h3>
            </div>
            <div className="flex flex-col gap-2.5">
              {guide.sleepOptions.map((sleep, idx) => (
                <div
                  key={`${sleep.name}-${idx}`}
                  className={cn(
                    "flex flex-col gap-2 rounded-xl p-3.5 ring-1",
                    sleep.booked
                      ? "bg-emerald-500/10 ring-emerald-400/35"
                      : "bg-zinc-900/60 ring-white/10"
                  )}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      {sleep.type === "Hotel / Cabin" ? (
                        <BedDouble className="size-3.5 text-amber-300" />
                      ) : (
                        <Tent className="size-3.5 text-emerald-300" />
                      )}
                      <span className="text-[0.65rem] font-semibold tracking-wider text-amber-300 uppercase">
                        {sleep.optionLabel} · {sleep.type}
                      </span>
                    </div>
                    <span className="rounded bg-white/10 px-2 py-0.5 text-xs font-semibold text-zinc-100">
                      {sleep.price}
                    </span>
                  </div>
                  <p className="font-medium text-zinc-100">
                    {sleep.name}
                    {sleep.booked ? (
                      <span className="ml-2 inline-flex items-center gap-1 rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300 uppercase">
                        ✓ Booked
                      </span>
                    ) : null}
                  </p>
                  <p className="text-xs leading-relaxed text-zinc-300">
                    {sleep.notes}
                  </p>
                  <div className="mt-1 flex flex-wrap gap-2">
                    <a
                      href={sleep.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-9 flex-1 items-center justify-center gap-1.5 rounded-lg bg-amber-400/15 px-3 py-1.5 text-xs font-semibold text-amber-200 ring-1 ring-amber-400/30 hover:bg-amber-400/25"
                    >
                      Booking / Info Page
                      <ExternalLink className="size-3 opacity-75" />
                    </a>
                    <a
                      href={sleep.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-100 ring-1 ring-white/10 hover:bg-zinc-700"
                    >
                      <MapPin className="size-3.5 text-amber-300" />
                      Map Pin
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      ) : null}

      {guide && guide.nuances.length > 0 ? (
        <>
          <Separator className="bg-white/10" />
          <section className="flex flex-col gap-2 rounded-xl bg-amber-400/5 p-3.5 ring-1 ring-amber-400/20">
            <div className="flex items-center gap-2">
              <AlertTriangle className="size-4 text-amber-300" />
              <h3 className="text-xs font-semibold tracking-[0.2em] text-amber-300 uppercase">
                Day {day} Nuances & Pro Hints
              </h3>
            </div>
            <ul className="flex flex-col gap-1.5 text-xs leading-relaxed text-zinc-300">
              {guide.nuances.map((n, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-amber-400" />
                  <span>{n}</span>
                </li>
              ))}
            </ul>
          </section>
        </>
      ) : null}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="font-display text-xl tracking-wide text-zinc-50">
        {value}
      </div>
      <div className="text-[0.65rem] tracking-[0.18em] text-zinc-400 uppercase">
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
    <div className="flex items-start gap-2">
      <Icon className="mt-0.5 size-3.5 shrink-0 text-amber-300/80" />
      <p className="text-xs leading-relaxed text-zinc-300">{text}</p>
    </div>
  );
}
