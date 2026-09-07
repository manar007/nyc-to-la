import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  formatHours,
  kindLabel,
  type Stop,
} from "@/data/route";
import {
  ChevronLeft,
  ChevronRight,
  Landmark,
  Moon,
  Navigation,
  Utensils,
} from "lucide-react";

type StopDetailProps = {
  stop: Stop;
  index: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
};

export function StopDetail({
  stop,
  index,
  total,
  onPrev,
  onNext,
}: StopDetailProps) {
  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[0.7rem] tracking-[0.22em] text-amber-400/90 uppercase">
            {stop.day === 0 ? "Departure" : `Day ${stop.day}`}
          </p>
          <h2
            data-selected-city={stop.id}
            className="font-display mt-1 text-4xl leading-none tracking-wide text-zinc-50 sm:text-5xl"
          >
            {stop.city}
          </h2>
          <p className="mt-1 text-sm text-zinc-400">{stop.state}</p>
        </div>
        <Badge variant="outline" className="mt-1 border-amber-400/30 text-amber-200">
          {kindLabel(stop.kind)}
        </Badge>
      </div>

      <div className="grid grid-cols-3 gap-2 rounded-xl bg-zinc-900/70 p-3 ring-1 ring-white/8">
        <Stat label="Mile" value={stop.milesFromStart.toLocaleString()} />
        <Stat
          label="Leg"
          value={
            stop.driveFromPrevMiles
              ? `${stop.driveFromPrevMiles} mi`
              : "—"
          }
        />
        <Stat label="Drive" value={formatHours(stop.driveFromPrevHours)} />
      </div>

      <p className="text-[0.7rem] tracking-[0.18em] text-zinc-500 uppercase">
        {stop.highway}
      </p>

      <p className="text-[15px] leading-relaxed text-zinc-200">{stop.note}</p>

      <Separator className="bg-white/10" />

      <NoteRow icon={Utensils} label="Eat" text={stop.eat} />
      <NoteRow icon={Landmark} label="See" text={stop.see} />
      {stop.kind === "overnight" || stop.kind === "finish" ? (
        <NoteRow
          icon={stop.kind === "finish" ? Navigation : Moon}
          label={stop.kind === "finish" ? "Arrive" : "Sleep"}
          text={
            stop.kind === "finish"
              ? "Pacific Ocean. Engine off."
              : `Overnight in ${stop.city}.`
          }
        />
      ) : null}

      <div className="mt-auto flex items-center justify-between gap-2 pt-2">
        <Button
          variant="outline"
          data-nav="prev"
          onClick={onPrev}
          disabled={index === 0}
          className="border-white/15 bg-transparent"
        >
          <ChevronLeft data-icon="inline-start" />
          Previous
        </Button>
        <span className="text-xs text-zinc-500">
          {index + 1} / {total}
        </span>
        <Button
          variant="outline"
          data-nav="next"
          onClick={onNext}
          disabled={index === total - 1}
          className="border-white/15 bg-transparent"
        >
          Next
          <ChevronRight data-icon="inline-end" />
        </Button>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="font-display text-2xl tracking-wide text-zinc-50">
        {value}
      </div>
      <div className="text-[0.65rem] tracking-[0.18em] text-zinc-500 uppercase">
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
    <div className="flex gap-3">
      <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-amber-400/10 text-amber-300">
        <Icon className="size-4" />
      </div>
      <div>
        <p className="text-[0.65rem] tracking-[0.18em] text-zinc-500 uppercase">
          {label}
        </p>
        <p className="text-sm leading-relaxed text-zinc-300">{text}</p>
      </div>
    </div>
  );
}
