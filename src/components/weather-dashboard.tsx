"use client";

import { useState } from "react";
import initialWeather from "@/data/live-weather.json";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  BellRing,
  CheckCircle2,
  Mail,
  RefreshCw,
  ShieldAlert,
  Waves,
} from "lucide-react";

export type WeatherDataPayload = typeof initialWeather;

export function WeatherDashboard({
  onOpenDay,
}: {
  onOpenDay?: (day: number) => void;
}) {
  const [data, setData] = useState<WeatherDataPayload>(initialWeather);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefreshedSource, setLastRefreshedSource] = useState<
    "repo" | "live-browser"
  >("repo");

  async function refreshLiveFromBrowser() {
    setRefreshing(true);
    try {
      const updatedLocations = await Promise.all(
        data.locations.map(async (loc) => {
          try {
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${
              loc.id === "nyc-marathon"
                ? 40.7128
                : loc.id === "valley-of-fire"
                ? 36.4856
                : loc.id === "zion"
                ? 37.259
                : loc.id === "bryce-canyon"
                ? 37.6238
                : loc.id === "buckskin-gulch"
                ? 37.0188
                : loc.id === "page-horseshoe"
                ? 36.9147
                : loc.id === "antelope-canyon"
                ? 36.9028
                : loc.id === "monument-valley"
                ? 36.9818
                : loc.id === "grand-canyon"
                ? 36.053
                : loc.id === "sedona"
                ? 34.8239
                : loc.id === "joshua-tree"
                ? 34.0309
                : loc.id === "laguna-beach"
                ? 33.5427
                : 34.0092
            }&longitude=${
              loc.id === "nyc-marathon"
                ? -74.006
                : loc.id === "valley-of-fire"
                ? -114.5284
                : loc.id === "zion"
                ? -112.9508
                : loc.id === "bryce-canyon"
                ? -112.1656
                : loc.id === "buckskin-gulch"
                ? -112.0252
                : loc.id === "page-horseshoe"
                ? -111.4558
                : loc.id === "antelope-canyon"
                ? -111.4114
                : loc.id === "monument-valley"
                ? -110.1117
                : loc.id === "grand-canyon"
                ? -112.0837
                : loc.id === "sedona"
                ? -111.7897
                : loc.id === "joshua-tree"
                ? -116.1469
                : loc.id === "laguna-beach"
                ? -117.7854
                : -118.4973
            }&current=temperature_2m,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max&forecast_days=16&timezone=auto`;
            const res = await fetch(url);
            if (!res.ok) return loc;
            const json = await res.json();
            const curC =
              Math.round((json?.current?.temperature_2m ?? loc.current.tempC) * 10) /
              10;
            const times: string[] = json?.daily?.time ?? [];
            let idx = times.indexOf(loc.visitDate);
            if (idx === -1) idx = Math.max(0, times.length - 1);
            const highC =
              Math.round(
                (json?.daily?.temperature_2m_max?.[idx] ??
                  loc.visitForecast.highC) * 10
              ) / 10;
            const lowC =
              Math.round(
                (json?.daily?.temperature_2m_min?.[idx] ??
                  loc.visitForecast.lowC) * 10
              ) / 10;
            return {
              ...loc,
              current: {
                ...loc.current,
                tempC: curC,
                tempF: Math.round((curC * 9) / 5 + 32),
                windKmh: Math.round(
                  json?.current?.wind_speed_10m ?? loc.current.windKmh
                ),
              },
              visitForecast: {
                ...loc.visitForecast,
                highC,
                highF: Math.round((highC * 9) / 5 + 32),
                lowC,
                lowF: Math.round((lowC * 9) / 5 + 32),
                precipProb:
                  json?.daily?.precipitation_probability_max?.[idx] ??
                  loc.visitForecast.precipProb,
                precipMm:
                  Math.round(
                    (json?.daily?.precipitation_sum?.[idx] ??
                      loc.visitForecast.precipMm) * 10
                  ) / 10,
              },
            };
          } catch {
            return loc;
          }
        })
      );

      setData({
        ...data,
        updatedAtUtc: new Date().toISOString(),
        locations: updatedLocations,
      });
      setLastRefreshedSource("live-browser");
    } finally {
      setRefreshing(false);
    }
  }

  const updatedDate = new Date(data.updatedAtUtc);
  const formattedUpdated = Number.isNaN(updatedDate.getTime())
    ? data.updatedAtUtc
    : updatedDate.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZoneName: "short",
      });

  return (
    <div className="flex flex-col gap-5 text-zinc-100">
      {/* Top Automation & Email Alert Status Card */}
      <div className="rounded-2xl bg-zinc-950/90 p-4 ring-1 ring-white/10 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[0.68rem] font-semibold text-emerald-300 ring-1 ring-emerald-400/30">
                <BellRing className="size-3" />
                Daily GitHub Automation Active
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-zinc-900 px-2.5 py-0.5 text-[0.68rem] text-zinc-300 ring-1 ring-white/10">
                <Mail className="size-3 text-amber-300" />
                Alerts → {data.recipientEmail}
              </span>
            </div>
            <h2 className="font-display mt-2 text-3xl tracking-wide text-zinc-50 sm:text-4xl">
              Live Park Weather, River CFS & Ocean Buoys
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-zinc-400">
              Last synced: <strong className="text-zinc-200">{formattedUpdated}</strong>{" "}
              ({lastRefreshedSource === "live-browser" ? "Live Browser Telemetry" : "Daily Repo Snapshot"}).
              GitHub Actions automatically updates the repo every day and emails{" "}
              <strong className="text-amber-200">{data.recipientEmail}</strong> if any NWS warning or slot-canyon flood risk appears.
            </p>
          </div>

          <button
            type="button"
            onClick={refreshLiveFromBrowser}
            disabled={refreshing}
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-amber-400 px-4 py-2.5 text-xs font-semibold text-zinc-950 shadow-sm transition-colors hover:bg-amber-300 disabled:opacity-60"
          >
            <RefreshCw
              className={cn("size-4", refreshing && "animate-spin")}
            />
            {refreshing ? "Fetching Live Telemetry..." : "Refresh Live Now"}
          </button>
        </div>

        {/* Live Water Telemetry Strip (Virgin River CFS + Pacific Ocean Buoys) */}
        <div className="mt-4 grid gap-2.5 sm:grid-cols-3">
          <div className="flex items-center justify-between rounded-xl bg-zinc-900/80 p-3 ring-1 ring-white/10">
            <div>
              <p className="text-[0.65rem] font-semibold tracking-wider text-amber-300 uppercase">
                Zion Virgin River (USGS)
              </p>
              <p className="mt-0.5 text-lg font-bold text-zinc-50">
                {data.virginRiver.cfs} CFS{" "}
                <span className="text-xs font-normal text-zinc-400">
                  · {data.virginRiver.waterTempC}°C ({data.virginRiver.waterTempF}°F)
                </span>
              </p>
              <p className="text-[11px] text-emerald-300">
                {data.virginRiver.narrowsOpen
                  ? "✓ Narrows OPEN (<150 CFS limit)"
                  : "⚠ Narrows CLOSED (>150 CFS)"}
              </p>
            </div>
            <Waves className="size-6 text-amber-300/80" />
          </div>

          {data.locations
            .filter((l) => l.ocean)
            .map((loc) => (
              <div
                key={loc.id}
                className="flex items-center justify-between rounded-xl bg-sky-950/30 p-3 ring-1 ring-sky-400/25"
              >
                <div>
                  <p className="text-[0.65rem] font-semibold tracking-wider text-sky-300 uppercase">
                    {loc.id === "laguna-beach"
                      ? "Laguna / Crystal Cove Buoy"
                      : "Santa Monica / Malibu Buoy"}
                  </p>
                  <p className="mt-0.5 text-lg font-bold text-zinc-50">
                    {loc.ocean?.waterTempC}°C ({loc.ocean?.waterTempF}°F){" "}
                    <span className="text-xs font-normal text-sky-200">
                      Water
                    </span>
                  </p>
                  <p className="text-[11px] text-sky-200/80">
                    Swell: {loc.ocean?.waveHeightFt} ft @ {loc.ocean?.wavePeriodS}s
                  </p>
                </div>
                <Waves className="size-6 text-sky-300" />
              </div>
            ))}
        </div>
      </div>

      {/* Active Weather Alerts Section */}
      {data.activeAlerts.length > 0 ? (
        <div className="flex flex-col gap-2.5 rounded-2xl bg-amber-500/10 p-4 ring-1 ring-amber-400/35">
          <div className="flex items-center gap-2">
            <ShieldAlert className="size-4 text-amber-300" />
            <h3 className="text-xs font-bold tracking-[0.18em] text-amber-300 uppercase">
              Active NWS & Trail Advisories ({data.activeAlerts.length})
            </h3>
          </div>
          <div className="flex flex-col gap-2">
            {data.activeAlerts.map((alert, idx) => (
              <div
                key={idx}
                className="rounded-xl bg-zinc-950/80 p-3 text-xs leading-relaxed ring-1 ring-amber-400/25"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-semibold text-amber-200">
                    Day {alert.day} ({alert.visitDate}) · {alert.location}
                  </span>
                  <Badge
                    variant="outline"
                    className="border-amber-400/40 text-amber-300 uppercase"
                  >
                    {alert.severity}
                  </Badge>
                </div>
                <p className="mt-1 font-medium text-zinc-100">{alert.title}</p>
                <p className="mt-0.5 text-zinc-400">{alert.detail}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2.5 rounded-2xl bg-emerald-500/10 p-4 text-xs text-emerald-200 ring-1 ring-emerald-400/30">
          <CheckCircle2 className="size-4 shrink-0 text-emerald-400" />
          <span>
            <strong>Zero active storm or flash-flood alerts</strong> across your
            route right now. All slot canyons and park highways are clear.
          </span>
        </div>
      )}

      {/* Per-Stop Weather Cards */}
      <div className="grid gap-3 sm:grid-cols-2">
        {data.locations.map((loc) => {
          const isOcean = loc.category === "ocean";
          const isFreeze = loc.visitForecast.lowC <= 0;
          return (
            <div
              key={loc.id}
              className={cn(
                "flex flex-col justify-between gap-3 rounded-2xl p-4 ring-1",
                isOcean
                  ? "bg-sky-950/20 ring-sky-400/25"
                  : "bg-zinc-950/75 ring-white/10"
              )}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={cn(
                      "rounded-md px-2 py-0.5 text-[0.65rem] font-bold tracking-wider uppercase",
                      loc.day === 0
                        ? "bg-emerald-500/20 text-emerald-300"
                        : isOcean
                        ? "bg-sky-400/15 text-sky-300"
                        : "bg-amber-400/15 text-amber-300"
                    )}
                  >
                    {loc.day === 0 ? "Race Day" : `Day ${loc.day}`} ·{" "}
                    {loc.visitDate}
                  </span>
                  <span className="text-[11px] text-zinc-400">
                    Elev {loc.elevationFt.toLocaleString()} ft
                  </span>
                </div>

                <h3 className="mt-2 text-base font-semibold text-zinc-50">
                  {loc.name}
                </h3>

                {/* Current vs Visit Day Forecast Grid */}
                <div className="mt-3 grid grid-cols-2 gap-2 rounded-xl bg-zinc-900/80 p-2.5 ring-1 ring-white/8">
                  <div>
                    <p className="text-[0.6rem] tracking-wider text-zinc-400 uppercase">
                      Live Right Now
                    </p>
                    <p className="mt-0.5 text-sm font-bold text-zinc-100">
                      {loc.current.tempC}°C{" "}
                      <span className="font-normal text-zinc-400">
                        ({loc.current.tempF}°F)
                      </span>
                    </p>
                    <p className="text-[11px] text-zinc-400">
                      {loc.current.condition} · {loc.current.windKmh} km/h
                    </p>
                  </div>

                  <div className="border-l border-white/10 pl-2.5">
                    <p className="text-[0.6rem] tracking-wider text-amber-300 uppercase">
                      Visit Day ({loc.visitDate.slice(5)})
                    </p>
                    <p className="mt-0.5 text-sm font-bold text-zinc-50">
                      {loc.visitForecast.highC}° / {loc.visitForecast.lowC}°C{" "}
                      <span className="text-xs font-normal text-zinc-400">
                        ({loc.visitForecast.highF}°/{loc.visitForecast.lowF}°F)
                      </span>
                    </p>
                    <p className="text-[11px] text-zinc-300">
                      {loc.visitForecast.condition} ·{" "}
                      <span
                        className={cn(
                          loc.visitForecast.precipProb >= 40
                            ? "font-semibold text-amber-300"
                            : "text-zinc-400"
                        )}
                      >
                        {loc.visitForecast.precipProb}% rain
                      </span>
                    </p>
                  </div>
                </div>

                {/* Extra badges (Freeze alert, Ocean water temp, Virgin River) */}
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {isFreeze ? (
                    <span className="inline-flex items-center gap-1 rounded-md bg-sky-500/15 px-2 py-0.5 text-[11px] font-medium text-sky-200 ring-1 ring-sky-400/30">
                      ❄️ Freeze Night ({loc.visitForecast.lowC}°C /{" "}
                      {loc.visitForecast.lowF}°F)
                    </span>
                  ) : null}
                  {loc.ocean ? (
                    <span className="inline-flex items-center gap-1 rounded-md bg-sky-500/20 px-2 py-0.5 text-[11px] font-semibold text-sky-200 ring-1 ring-sky-400/30">
                      🌊 Ocean Water: {loc.ocean.waterTempC}°C (
                      {loc.ocean.waterTempF}°F)
                    </span>
                  ) : null}
                  {loc.hydrology ? (
                    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/15 px-2 py-0.5 text-[11px] font-semibold text-emerald-200 ring-1 ring-emerald-400/30">
                      💧 Virgin River: {loc.hydrology.cfs} CFS ·{" "}
                      {loc.hydrology.waterTempC}°C
                    </span>
                  ) : null}
                </div>

                <p className="mt-2 text-xs leading-relaxed text-zinc-300">
                  {loc.parkNote}
                </p>
              </div>

              {loc.day > 0 && onOpenDay ? (
                <button
                  type="button"
                  onClick={() => onOpenDay(loc.day)}
                  className="mt-1 inline-flex min-h-9 w-full items-center justify-center rounded-xl bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-zinc-200 ring-1 ring-white/10 transition-colors hover:bg-zinc-800"
                >
                  Open Day {loc.day} Plan & Backup Hikes →
                </button>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
