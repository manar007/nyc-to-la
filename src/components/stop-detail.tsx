import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  formatHours,
  kindLabel,
  type Stop,
} from "@/data/route";
import { stopDirectionsUrl } from "@/lib/gmaps";
import { cn } from "@/lib/utils";
import {
  Bed,
  ChevronLeft,
  ChevronRight,
  Clock,
  Compass,
  ExternalLink,
  Landmark,
  MapPin,
  Moon,
  Navigation,
  ShoppingBag,
  Tent,
  Thermometer,
  Ticket,
  Utensils,
  X,
} from "lucide-react";

type QuickLink = {
  label: string;
  url: string;
  kind?: string;
};

type StopWithExtras = Stop & {
  timeWindow?: string;
  tempInfo?: string;
  permitInfo?: string;
  links?: QuickLink[];
};

type StopDetailProps = {
  stop: StopWithExtras;
  index: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  onClose?: () => void;
};

export function StopDetail({
  stop,
  index,
  total,
  onPrev,
  onNext,
  onClose,
}: StopDetailProps) {
  const isOvernight =
    stop.kind === "overnight" || stop.kind === "camp" || stop.kind === "finish";
  const hasMetaBadges = Boolean(
    stop?.timeWindow || stop?.tempInfo || stop?.permitInfo
  );
  const quickLinks = stop?.links ?? [];

  return (
    <div className="flex h-full flex-col">
      {onClose ? (
        <header className="sticky top-0 z-20 -mx-4 -mt-4 mb-4 flex items-center justify-between gap-3 border-b border-white/10 bg-zinc-950/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:-mt-6 sm:px-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-9 gap-1.5 rounded-lg px-2.5 text-xs font-semibold text-zinc-300 hover:bg-zinc-900 hover:text-zinc-50"
          >
            <X className="size-4" />
            Close
          </Button>

          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={onPrev}
              disabled={index === 0}
              className="h-8 rounded-lg border-white/15 bg-zinc-900/80 px-2.5 text-xs font-medium text-zinc-200 hover:bg-zinc-800 disabled:opacity-40"
            >
              <ChevronLeft className="size-3.5" />
              Prev
            </Button>
            <span className="px-2 text-xs font-semibold tabular-nums text-amber-300">
              Stop {index + 1} of {total}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={onNext}
              disabled={index === total - 1}
              className="h-8 rounded-lg border-white/15 bg-zinc-900/80 px-2.5 text-xs font-medium text-zinc-200 hover:bg-zinc-800 disabled:opacity-40"
            >
              Next
              <ChevronRight className="size-3.5" />
            </Button>
          </div>
        </header>
      ) : null}

      <div className="flex flex-col gap-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold tracking-[0.24em] text-amber-300 uppercase">
              {stop.day === 0 ? "Departure" : `Day ${stop.day}`}
            </p>
            <h2
              data-selected-city={stop.id}
              className="font-display mt-1 text-3xl font-bold leading-tight tracking-wide text-zinc-50 sm:text-4xl lg:text-5xl"
            >
              {stop.city}
            </h2>
            <p className="mt-1 text-sm font-medium text-zinc-300">{stop.state}</p>
          </div>
          <Badge
            variant="outline"
            className="mt-1 border-amber-400/40 bg-amber-400/10 px-2.5 py-1 text-xs font-semibold text-amber-200"
          >
            {kindLabel(stop.kind)}
          </Badge>
        </div>

        {hasMetaBadges ? (
          <div className="flex flex-wrap gap-2">
            {stop?.timeWindow ? (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-400/10 px-3 py-1.5 text-xs font-medium text-amber-200 ring-1 ring-amber-400/30">
                <Clock className="size-3.5 shrink-0 text-amber-300" />
                {stop.timeWindow}
              </span>
            ) : null}
            {stop?.tempInfo ? (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-sky-400/10 px-3 py-1.5 text-xs font-medium text-sky-200 ring-1 ring-sky-400/30">
                <Thermometer className="size-3.5 shrink-0 text-sky-300" />
                {stop.tempInfo}
              </span>
            ) : null}
            {stop?.permitInfo ? (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-400/10 px-3 py-1.5 text-xs font-medium text-emerald-200 ring-1 ring-emerald-400/30">
                <Ticket className="size-3.5 shrink-0 text-emerald-300" />
                {stop.permitInfo}
              </span>
            ) : null}
          </div>
        ) : null}

        <div className="grid grid-cols-3 gap-2.5 rounded-2xl bg-zinc-900/80 p-3.5 ring-1 ring-white/10 sm:p-4">
          <Stat label="Total Mile" value={stop.milesFromStart.toLocaleString()} />
          <Stat
            label="Leg Dist"
            value={
              stop.driveFromPrevMiles
                ? `${stop.driveFromPrevMiles} mi`
                : "—"
            }
          />
          <Stat label="Leg Drive" value={formatHours(stop.driveFromPrevHours)} />
        </div>

        <p className="text-xs font-semibold tracking-[0.2em] text-zinc-400 uppercase">
          🛣️ {stop.highway}
        </p>

        {stop.address ? (
          <p className="text-xs leading-relaxed text-zinc-400 sm:text-sm">
            📍 {stop.address}
          </p>
        ) : null}

        <p className="text-sm leading-relaxed text-zinc-100 sm:text-base sm:leading-relaxed">
          {stop.note}
        </p>

        <a
          href={stopDirectionsUrl(stop)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-amber-400 px-4 py-3 text-sm font-bold text-zinc-950 shadow-md shadow-amber-500/15 transition-all hover:bg-amber-300 active:scale-[0.99] sm:text-base"
        >
          <Navigation className="size-4 shrink-0" />
          Navigate Here in Google Maps
          <ExternalLink className="size-4 shrink-0 opacity-75" />
        </a>

        {quickLinks.length > 0 ? (
          <div className="flex flex-col gap-2.5">
            <p className="text-xs font-bold tracking-[0.2em] text-amber-300 uppercase">
              1-Tap Quick Links &amp; Hikes
            </p>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {quickLinks.map((link, idx) => {
                const meta = getLinkBadgeMeta(link);
                const Icon = meta.icon;
                return (
                  <a
                    key={`${link.url}-${idx}`}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex min-h-12 items-center justify-between gap-3 rounded-xl bg-zinc-900/90 px-3.5 py-3 text-left ring-1 ring-white/10 transition-all hover:bg-zinc-800 hover:ring-amber-400/35 active:scale-[0.99]"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        className={cn(
                          "flex size-8 shrink-0 items-center justify-center rounded-lg",
                          meta.iconClass
                        )}
                      >
                        <Icon className="size-4" />
                      </span>
                      <div className="min-w-0">
                        <span
                          className={cn(
                            "inline-block rounded px-1.5 py-0.5 text-[0.62rem] font-bold tracking-wider uppercase",
                            meta.badgeClass
                          )}
                        >
                          {meta.badge}
                        </span>
                        <p className="mt-0.5 truncate text-xs font-medium text-zinc-100 group-hover:text-amber-200 sm:text-sm">
                          {link.label}
                        </p>
                      </div>
                    </div>
                    <ExternalLink className="size-3.5 shrink-0 text-zinc-400 transition-colors group-hover:text-amber-300" />
                  </a>
                );
              })}
            </div>
          </div>
        ) : null}

        <Separator className="bg-white/10" />

        <div className="flex flex-col gap-3">
          <NoteRow icon={Utensils} label="Eat & Coffee" text={stop.eat} />
          <NoteRow icon={Landmark} label="See & Explore" text={stop.see} />
          {isOvernight ? (
            <NoteRow
              icon={stop.kind === "finish" ? Navigation : Moon}
              label={stop.kind === "finish" ? "Arrive & Flight" : "Overnight Lodging"}
              text={
                stop.kind === "finish"
                  ? "Return SUV at LAX by 11:30 AM. Shuttle to TBIT for 15:00 Lufthansa LH 457."
                  : stop.kind === "camp"
                  ? `Overnight base in ${stop.city}.`
                  : `Overnight in ${stop.city}.`
              }
            />
          ) : null}
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 pt-2">
          <Button
            variant="outline"
            data-nav="prev"
            onClick={onPrev}
            disabled={index === 0}
            className="min-h-11 flex-1 rounded-xl border-white/15 bg-zinc-900/60 text-xs font-semibold text-zinc-100 hover:bg-zinc-800 active:scale-[0.99] sm:text-sm"
          >
            <ChevronLeft data-icon="inline-start" />
            Previous Stop
          </Button>
          <span className="px-2 text-xs font-semibold tabular-nums text-zinc-400 sm:text-sm">
            {index + 1} / {total}
          </span>
          <Button
            variant="outline"
            data-nav="next"
            onClick={onNext}
            disabled={index === total - 1}
            className="min-h-11 flex-1 rounded-xl border-white/15 bg-zinc-900/60 text-xs font-semibold text-zinc-100 hover:bg-zinc-800 active:scale-[0.99] sm:text-sm"
          >
            Next Stop
            <ChevronRight data-icon="inline-end" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function getLinkBadgeMeta(link: QuickLink) {
  const kind = (link.kind ?? "").toLowerCase();
  const label = link.label.toLowerCase();
  const url = link.url.toLowerCase();

  if (
    kind.includes("hike") ||
    kind.includes("trail") ||
    label.includes("alltrails") ||
    url.includes("alltrails")
  ) {
    return {
      badge: "AllTrails",
      icon: Compass,
      iconClass: "bg-emerald-400/15 text-emerald-300",
      badgeClass: "bg-emerald-400/15 text-emerald-300",
    };
  }
  if (kind.includes("camp") || label.includes("camp") || label.includes("blm")) {
    return {
      badge: "Camp",
      icon: Tent,
      iconClass: "bg-teal-400/15 text-teal-300",
      badgeClass: "bg-teal-400/15 text-teal-300",
    };
  }
  if (
    kind.includes("hotel") ||
    kind.includes("lodging") ||
    kind.includes("stay") ||
    label.includes("hotel") ||
    label.includes("lodge") ||
    label.includes("inn")
  ) {
    return {
      badge: "Lodging",
      icon: Bed,
      iconClass: "bg-indigo-400/15 text-indigo-300",
      badgeClass: "bg-indigo-400/15 text-indigo-300",
    };
  }
  if (
    kind.includes("gear") ||
    kind.includes("shop") ||
    label.includes("walmart") ||
    label.includes("rei") ||
    label.includes("outfitter")
  ) {
    return {
      badge: "Store / Gear",
      icon: ShoppingBag,
      iconClass: "bg-sky-400/15 text-sky-300",
      badgeClass: "bg-sky-400/15 text-sky-300",
    };
  }
  if (
    kind.includes("permit") ||
    kind.includes("tour") ||
    kind.includes("pass") ||
    kind.includes("ticket") ||
    label.includes("permit") ||
    label.includes("tour") ||
    label.includes("ticket") ||
    url.includes("recreation.gov")
  ) {
    return {
      badge: "Tour / Ticket",
      icon: Ticket,
      iconClass: "bg-amber-400/15 text-amber-300",
      badgeClass: "bg-amber-400/15 text-amber-300",
    };
  }
  if (kind.includes("food") || kind.includes("coffee") || kind.includes("eat")) {
    return {
      badge: "Food & Coffee",
      icon: Utensils,
      iconClass: "bg-rose-400/15 text-rose-300",
      badgeClass: "bg-rose-400/15 text-rose-300",
    };
  }
  return {
    badge: link.kind ? link.kind : "Map Pin",
    icon: MapPin,
    iconClass: "bg-zinc-400/15 text-zinc-300",
    badgeClass: "bg-zinc-400/15 text-zinc-300",
  };
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

function NoteRow({
  icon: Icon,
  label,
  text,
}: {
  icon: typeof Utensils;
  label: string;
  text: string;
}) {
  return (
    <div className="flex gap-3.5 rounded-xl bg-zinc-900/60 p-3 ring-1 ring-white/8">
      <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-amber-400/15 text-amber-300">
        <Icon className="size-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[0.68rem] font-bold tracking-[0.18em] text-amber-300 uppercase">
          {label}
        </p>
        <p className="mt-0.5 text-xs leading-relaxed text-zinc-200 sm:text-sm">
          {text}
        </p>
      </div>
    </div>
  );
}
