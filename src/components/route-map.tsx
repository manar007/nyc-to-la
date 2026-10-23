"use client";

import { STOPS, type Stop } from "@/data/route";
import { MAP, project, pointsToPath, STATE_LINES, US_OUTLINE } from "@/lib/geo";
import { cn } from "@/lib/utils";

type RouteMapProps = {
  selectedId: string;
  onSelect: (id: string) => void;
};

const WATERMARKS: {
  label: string;
  lat: number;
  lng: number;
  ocean?: boolean;
}[] = [
  { label: "NV", lat: 37.35, lng: -116.1 },
  { label: "UT", lat: 37.95, lng: -111.15 },
  { label: "AZ", lat: 33.65, lng: -111.85 },
  { label: "CA", lat: 35.55, lng: -117.55 },
  { label: "PACIFIC OCEAN", lat: 33.0, lng: -119.05, ocean: true },
];

export function RouteMap({ selectedId, onSelect }: RouteMapProps) {
  const points = STOPS.map((stop) => ({ stop, ...project(stop.lat, stop.lng) }));
  const line = points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const outline = pointsToPath(US_OUTLINE);
  const stateLines = STATE_LINES.map((coords) => pointsToPath(coords));
  const majorPoints = points.filter((p) => p.stop.major);
  const minorPoints = points.filter((p) => !p.stop.major);
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

        {stateLines.map((d, index) => (
          <path
            key={`state-line-${index}`}
            d={d}
            fill="none"
            stroke="rgba(226, 232, 240, 0.14)"
            strokeDasharray="4 4"
            strokeWidth="1"
          />
        ))}

        {WATERMARKS.map((wm) => {
          const { x, y } = project(wm.lat, wm.lng);
          return (
            <text
              key={wm.label}
              x={x}
              y={y}
              textAnchor="middle"
              className="select-none uppercase"
              fill={
                wm.ocean
                  ? "rgba(56, 189, 248, 0.22)"
                  : "rgba(148, 163, 184, 0.22)"
              }
              fontSize={wm.ocean ? 10 : 13}
              fontWeight={600}
              letterSpacing={wm.ocean ? "0.32em" : "0.28em"}
              fontFamily="var(--font-geist-sans), ui-sans-serif, system-ui"
            >
              {wm.label}
            </text>
          );
        })}

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

        {minorPoints.map(({ stop, x, y }) => (
          <circle
            key={`minor-${stop.id}`}
            cx={x}
            cy={y}
            r="3"
            fill="rgba(226, 232, 240, 0.55)"
            stroke="#0b1220"
            strokeWidth="1.2"
          />
        ))}

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

        {majorPoints.map(({ stop, x, y }) => (
          <StopLabel key={stop.id} stop={stop} x={x} y={y} selected={stop.id === selectedId} />
        ))}
      </svg>

      <div className="absolute inset-0 pointer-events-none">
        {majorPoints.map(({ stop, x, y }) => {
          const isEnd = stop.kind === "start" || stop.kind === "finish";
          const isCamp = stop.kind === "camp";
          const r = isEnd ? 8 : 6.5;
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
                  selected
                    ? "bg-amber-400"
                    : isEnd
                    ? "bg-orange-50"
                    : isCamp
                    ? "bg-emerald-300"
                    : "bg-slate-200"
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

type LabelOffset = {
  label: string;
  dx: number;
  dy: number;
  anchor: "start" | "middle" | "end";
};

function getLabelPlacement(stop: Stop): LabelOffset {
  const key = `${stop.id} ${stop.city}`.toLowerCase();

  if (stop.id === "las" || key.includes("las-vegas") || key.includes("las vegas")) {
    return { label: "Las Vegas", dx: -12, dy: 5, anchor: "end" };
  }
  if (key.includes("valley-of-fire") || key.includes("valley of fire")) {
    return { label: "Valley of Fire", dx: 12, dy: 5, anchor: "start" };
  }
  if (key.includes("la-verkin") || key.includes("la verkin")) {
    return { label: "La Verkin", dx: -12, dy: 5, anchor: "end" };
  }
  if (stop.id === "east-zion" || key.includes("kanab") || key.includes("mt. carmel")) {
    return { label: "Kanab", dx: 10, dy: 14, anchor: "start" };
  }
  if (key.includes("zion")) {
    return { label: "Zion", dx: 0, dy: -12, anchor: "middle" };
  }
  if (key.includes("bryce")) {
    return { label: "Bryce Canyon", dx: 0, dy: -12, anchor: "middle" };
  }
  if (key.includes("antelope")) {
    return { label: "Antelope Canyon", dx: 12, dy: 13, anchor: "start" };
  }
  if (key.includes("page")) {
    return { label: "Page", dx: -12, dy: -6, anchor: "end" };
  }
  if (key.includes("horseshoe")) {
    return { label: "Horseshoe Bend", dx: -12, dy: 10, anchor: "end" };
  }
  if (key.includes("monument")) {
    return { label: "Monument Valley", dx: 0, dy: -13, anchor: "middle" };
  }
  if (key.includes("grand-canyon") || key.includes("grand canyon")) {
    return { label: "Grand Canyon", dx: -12, dy: 5, anchor: "end" };
  }
  if (key.includes("flagstaff")) {
    return { label: "Flagstaff", dx: 12, dy: -6, anchor: "start" };
  }
  if (key.includes("sedona")) {
    return { label: "Sedona", dx: 12, dy: 5, anchor: "start" };
  }
  if (key.includes("joshua")) {
    return { label: "Joshua Tree", dx: 0, dy: -13, anchor: "middle" };
  }
  if (key.includes("laguna")) {
    return { label: "Laguna Beach", dx: 12, dy: 6, anchor: "start" };
  }
  if (key.includes("crystal-cove") || key.includes("crystal cove")) {
    return { label: "Crystal Cove", dx: 12, dy: -6, anchor: "start" };
  }
  if (key.includes("santa-monica") || key.includes("santa monica") || stop.id === "la") {
    return { label: "Santa Monica", dx: 12, dy: -10, anchor: "start" };
  }
  if (key.includes("venice")) {
    return { label: "Venice", dx: 14, dy: 2, anchor: "start" };
  }
  if (key.includes("point-dume") || key.includes("point dume")) {
    return { label: "Point Dume", dx: -12, dy: 12, anchor: "end" };
  }
  if (key.includes("el-matador") || key.includes("el matador")) {
    return { label: "El Matador", dx: -12, dy: -6, anchor: "end" };
  }
  if (key.includes("lax")) {
    return { label: "LAX", dx: 14, dy: 14, anchor: "start" };
  }

  const labelOnLeft = stop.lng < -114.5;
  return {
    label: stop.city.split(/[—·/]/)[0].trim(),
    dx: labelOnLeft ? -12 : 12,
    dy: 4,
    anchor: labelOnLeft ? "end" : "start",
  };
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
  const { label, dx, dy, anchor } = getLabelPlacement(stop);

  return (
    <text
      x={x + dx}
      y={y + dy}
      textAnchor={anchor}
      paintOrder="stroke"
      stroke="#0b1220"
      strokeWidth="3.5"
      strokeLinejoin="round"
      className={cn(
        "select-none",
        selected || isEnd ? "fill-zinc-50" : "fill-zinc-300"
      )}
      fontSize={isEnd ? 13 : 11}
      fontFamily="var(--font-geist-sans), ui-sans-serif, system-ui"
      fontWeight={selected || isEnd ? 650 : 500}
    >
      {label}
    </text>
  );
}
