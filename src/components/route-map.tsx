"use client";

import { STOPS, type Stop } from "@/data/route";
import { MAP, project, pointsToPath, US_OUTLINE } from "@/lib/geo";
import { cn } from "@/lib/utils";

type RouteMapProps = {
  selectedId: string;
  onSelect: (id: string) => void;
};

export function RouteMap({ selectedId, onSelect }: RouteMapProps) {
  const points = STOPS.map((stop) => ({ stop, ...project(stop.lat, stop.lng) }));
  const line = points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const outline = pointsToPath(US_OUTLINE);
  const selected = points.find((p) => p.stop.id === selectedId);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#0b1220] ring-1 ring-white/10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_circle_at_12%_40%,rgba(251,191,36,0.12),transparent_55%),radial-gradient(700px_circle_at_88%_70%,rgba(251,113,133,0.16),transparent_50%)]" />
      <svg
        viewBox={`0 0 ${MAP.width} ${MAP.height}`}
        className="relative h-auto w-full"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="route-line" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="55%" stopColor="#fb7185" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
          <filter id="route-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <path
          d={outline}
          fill="rgba(148, 163, 184, 0.08)"
          stroke="rgba(226, 232, 240, 0.22)"
          strokeWidth="1.4"
        />

        <polyline
          points={line}
          fill="none"
          stroke="url(#route-line)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.35"
          filter="url(#route-glow)"
        />
        <polyline
          points={line}
          fill="none"
          stroke="url(#route-line)"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {selected ? (
          <circle
            cx={selected.x}
            cy={selected.y}
            r="18"
            fill="none"
            stroke="#fbbf24"
            strokeWidth="1.5"
            opacity="0.7"
          >
            <animate
              attributeName="r"
              values="14;22;14"
              dur="2.4s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.8;0.15;0.8"
              dur="2.4s"
              repeatCount="indefinite"
            />
          </circle>
        ) : null}

        {points.map(({ stop, x, y }) => (
          <StopLabel key={stop.id} stop={stop} x={x} y={y} selected={stop.id === selectedId} />
        ))}
      </svg>

      <div className="absolute inset-0 pointer-events-none">
        {points.map(({ stop, x, y }) => {
          const isEnd = stop.kind === "start" || stop.kind === "finish";
          const r = isEnd ? 8 : stop.kind === "overnight" ? 6.5 : 4.5;
          const selected = stop.id === selectedId;
          return (
            <button
              key={stop.id}
              type="button"
              data-map-stop={stop.id}
              aria-label={`${stop.city}, ${stop.state}`}
              aria-pressed={selected}
              onClick={() => onSelect(stop.id)}
              className="pointer-events-auto absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full"
              style={{
                left: `${(x / MAP.width) * 100}%`,
                top: `${(y / MAP.height) * 100}%`,
                width: 44,
                height: 44,
              }}
            >
              <span
                className={cn(
                  "block rounded-full ring-2 ring-[#0b1220]",
                  selected ? "bg-amber-400" : isEnd ? "bg-orange-50" : "bg-slate-200"
                )}
                style={{ width: r * 2, height: r * 2 }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StopLabel({
  stop,
  x,
  y,
  selected,
}: {
  stop: Stop;
  x: number;
  y: number;
  selected: boolean;
}) {
  const isEnd = stop.kind === "start" || stop.kind === "finish";
  const labelOnLeft = stop.lng < -98;

  return (
    <text
      x={labelOnLeft ? x - 12 : x + 12}
      y={y + 4}
      textAnchor={labelOnLeft ? "end" : "start"}
      className={cn(
        "select-none",
        selected || isEnd ? "fill-zinc-50" : "fill-zinc-400"
      )}
      fontSize={isEnd ? 15 : 11}
      fontFamily="var(--font-geist-sans), ui-sans-serif, system-ui"
      fontWeight={selected || isEnd ? 650 : 500}
    >
      {stop.city}
    </text>
  );
}
