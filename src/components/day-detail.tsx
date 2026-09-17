"use client";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatHours, kindLabel } from "@/data/route";
import { dayRoutePlan, stopDirectionsUrl } from "@/lib/gmaps";
import { DAY_DATES, dayTimetable, formatHHMM } from "@/lib/timetable";
import { cn } from "@/lib/utils";
import {
  ExternalLink,
  Landmark,
  MapPin,
  Moon,
  Navigation,
  Utensils,
} from "lucide-react";

type DayDetailProps = {
  day: number;
  onSelectStop: (id: string) => void;
};

export function DayDetail({ day, onSelectStop }: DayDetailProps) {
  const plan = dayRoutePlan(day);
  const timetable = dayTimetable(day);
  if (!plan || timetable.length === 0) return null;

  const isRestDay =
    plan.origin.id === plan.destination.id && plan.waypoints.length === 0;
  const stopCount = plan.waypoints.length + 1;
  const dayDate = DAY_DATES[day];
  const arrivalEntry = timetable[timetable.length - 1];

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-[0.7rem] tracking-[0.22em] text-amber-400/90 uppercase">
          Day {day}
          {dayDate ? <span className="text-zinc-500"> · {dayDate}</span> : null}
        </p>
        <h2 className="font-display mt-1 text-3xl leading-none tracking-wide text-zinc-50 sm:text-4xl">
          {plan.title}
        </h2>
        <p className="mt-2 text-sm text-zinc-400">
          {plan.origin.city}
          <span className="mx-1.5 text-zinc-600">→</span>
          {plan.destination.city}
        </p>
      </div>

      {!isRestDay ? (
        <div className="grid grid-cols-3 gap-2 rounded-xl bg-zinc-900/70 p-3 ring-1 ring-white/8">
          <Stat label="Drive" value={`${plan.driveMiles} mi`} />
          <Stat label="Time" value={formatHours(plan.driveHours)} />
          <Stat label="Stops" value={String(stopCount)} />
        </div>
      ) : (
        <div className="rounded-xl bg-zinc-900/70 p-3 text-center text-sm text-zinc-400 ring-1 ring-white/8">
          Rest / in-park day
        </div>
      )}

      <a
        href={plan.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 rounded-md bg-amber-400 px-3 py-2 text-sm font-medium text-zinc-950 shadow-sm transition-colors hover:bg-amber-300"
      >
        <Navigation className="size-4" />
        {isRestDay
          ? "Open in Google Maps"
          : `Drive Day ${day} in Google Maps`}
        <ExternalLink className="size-3.5 opacity-70" />
      </a>

      <Separator className="bg-white/10" />

      <div className="flex items-center justify-between">
        <p className="text-[0.7rem] tracking-[0.22em] text-amber-400/90 uppercase">
          Timetable
        </p>
        <p className="text-[0.65rem] tracking-[0.18em] text-zinc-500 uppercase">
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
                "rounded-xl p-3 ring-1 transition-colors",
                entry.isOrigin
                  ? "bg-zinc-900/40 ring-white/5"
                  : entry.isDestination
                  ? "bg-amber-400/8 ring-amber-400/25"
                  : "bg-zinc-900/60 ring-white/8"
              )}
            >
              <div className="flex items-start gap-3">
                <div className="w-16 shrink-0">
                  <p className="font-display text-lg leading-none text-amber-300">
                    {formatHHMM(entry.arriveMinutes)}
                  </p>
                  <p className="mt-1 text-[0.6rem] tracking-[0.16em] text-zinc-500 uppercase">
                    {entry.isOrigin
                      ? "Depart"
                      : entry.isDestination
                      ? "Arrive"
                      : `${entry.stopMinutes}m stop`}
                  </p>
                </div>
                <div className="min-w-0 flex-1">
                  <button
                    type="button"
                    onClick={() => onSelectStop(entry.stop.id)}
                    className="text-left"
                  >
                    <p className="font-medium text-zinc-50 hover:text-amber-200">
                      {entry.stop.city}
                      <span className="ml-1 font-normal text-zinc-500">
                        {entry.stop.state}
                      </span>
                    </p>
                  </button>
                  <p className="mt-0.5 text-[0.65rem] tracking-[0.18em] text-zinc-500 uppercase">
                    {entry.stop.highway}
                  </p>
                  {entry.stop.address ? (
                    <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                      {entry.stop.address}
                    </p>
                  ) : null}
                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <Badge
                      variant="outline"
                      className="border-white/15 text-zinc-300"
                    >
                      {kindLabel(entry.stop.kind)}
                    </Badge>
                    {showLeg ? (
                      <span className="text-xs text-zinc-500">
                        +{entry.stop.driveFromPrevMiles} mi ·{" "}
                        {formatHours(entry.stop.driveFromPrevHours)}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-300">
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
                        text={`Overnight — ${entry.stop.city}.`}
                      />
                    ) : null}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <a
                      href={stopDirectionsUrl(entry.stop)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-md bg-zinc-900 px-2.5 py-1.5 text-xs font-medium text-zinc-100 ring-1 ring-white/10 transition-colors hover:bg-zinc-800"
                    >
                      <MapPin className="size-3" />
                      Google Maps
                      <ExternalLink className="size-3 opacity-70" />
                    </a>
                    <button
                      type="button"
                      onClick={() => onSelectStop(entry.stop.id)}
                      className="inline-flex items-center gap-1.5 rounded-md bg-zinc-900 px-2.5 py-1.5 text-xs font-medium text-zinc-100 ring-1 ring-white/10 transition-colors hover:bg-zinc-800"
                    >
                      Focus on map
                    </button>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="font-display text-xl tracking-wide text-zinc-50">
        {value}
      </div>
      <div className="text-[0.65rem] tracking-[0.18em] text-zinc-500 uppercase">
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
      <p className="text-xs leading-relaxed text-zinc-400">{text}</p>
    </div>
  );
}
