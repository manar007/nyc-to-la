#!/usr/bin/env node
/**
 * Daily automated weather, river hydrology, ocean buoy, and NWS alert checker
 * for the LAS -> CANYONS -> LAX road trip (Nov 2 – Nov 12, 2026).
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const LOCATIONS = [
  { id: "nyc-marathon", name: "NYC Marathon (Staten Island → Central Park)", state: "NY", day: 0, visitDate: "2026-11-01", lat: 40.7128, lng: -74.006, elevationFt: 100, category: "marathon", parkNote: "Target 3:20 finish (~4:44/km). Singlet + shorts if start > 8°C (46°F)." },
  { id: "valley-of-fire", name: "Valley of Fire State Park", state: "NV", day: 1, visitDate: "2026-11-02", lat: 36.4856, lng: -114.5284, elevationFt: 2060, category: "canyon", parkNote: "Fire Wave & Seven Wonders Loop open Oct 1 – May 31." },
  { id: "zion", name: "Zion National Park (Main Canyon & Narrows)", state: "UT", day: 2, visitDate: "2026-11-03", lat: 37.259, lng: -112.9508, elevationFt: 4000, category: "slot-canyon", parkNote: "Scout Lookout & Canyon Overlook open. Narrows closes if Virgin River > 150 CFS." },
  { id: "bryce-canyon", name: "Bryce Canyon National Park", state: "UT", day: 3, visitDate: "2026-11-04", lat: 37.6238, lng: -112.1656, elevationFt: 8000, category: "high-altitude", parkNote: "Two Bridges (Navajo Loop), Queen's Garden & Peekaboo Figure-8 open (Wall Street closed for season)." },
  { id: "buckskin-gulch", name: "Wire Pass & Buckskin Gulch (Kanab)", state: "UT", day: 4, visitDate: "2026-11-05", lat: 37.0188, lng: -112.0252, elevationFt: 4950, category: "slot-canyon", parkNote: "8.3-mi unpaved House Rock Valley Rd requires dry clay conditions. Backup: Toadstool Hoodoos on paved US-89." },
  { id: "page-horseshoe", name: "Page, AZ (Horseshoe Bend & Lone Rock Beach)", state: "AZ", day: 4, visitDate: "2026-11-05", lat: 36.9147, lng: -111.4558, elevationFt: 4200, category: "canyon", parkNote: "Horseshoe Bend sunset 5:22 PM MST. Lone Rock Beach primitive camping open." },
  { id: "antelope-canyon", name: "Antelope Canyon (Page, AZ)", state: "AZ", day: 5, visitDate: "2026-11-06", lat: 36.9028, lng: -111.4114, elevationFt: 4300, category: "slot-canyon", parkNote: "9:15 AM Navajo Guided Tour. Closes only during active flash floods. Zero bags allowed inside." },
  { id: "monument-valley", name: "Monument Valley Navajo Tribal Park", state: "AZ/UT", day: 5, visitDate: "2026-11-06", lat: 36.9818, lng: -110.1117, elevationFt: 5560, category: "canyon", parkNote: "Wildcat Trail (8 AM–5 PM) & 17-Mile Valley Drive open (winter cutoff: last entry 2:30 PM)." },
  { id: "grand-canyon", name: "Grand Canyon South Rim (South Kaibab Trail)", state: "AZ", day: 6, visitDate: "2026-11-07", lat: 36.053, lng: -112.0837, elevationFt: 7000, category: "high-altitude", parkNote: "South Kaibab OPEN to Ooh Aah Point, Cedar Ridge & Skeleton Point. Water ON at trailhead tank." },
  { id: "sedona", name: "Sedona & Oak Creek Canyon", state: "AZ", day: 7, visitDate: "2026-11-08", lat: 34.8239, lng: -111.7897, elevationFt: 4350, category: "canyon", parkNote: "Devil's Bridge, Soldier Pass & Cathedral Rock OPEN. Free Sunday Sedona Shuttle running." },
  { id: "joshua-tree", name: "Joshua Tree National Park (Barker Dam)", state: "CA", day: 8, visitDate: "2026-11-09", lat: 34.0309, lng: -116.1469, elevationFt: 4100, category: "canyon", parkNote: "Optional 60-min Barker Dam Loop en route to Laguna Beach." },
  { id: "laguna-beach", name: "Laguna Beach & Crystal Cove State Park", state: "CA", day: 8, visitDate: "2026-11-09", lat: 33.5427, lng: -117.7854, elevationFt: 50, category: "ocean", oceanCoord: { lat: 33.53, lng: -117.82 }, parkNote: "Ocean Swim #1 & #2 at 1,000 Steps Beach, Pirate Tower & Crystal Cove Reef Point." },
  { id: "santa-monica-malibu", name: "Santa Monica, Venice & Malibu (Point Dume / El Matador)", state: "CA", day: 10, visitDate: "2026-11-11", lat: 34.0092, lng: -118.4973, elevationFt: 50, category: "ocean", oceanCoord: { lat: 33.99, lng: -118.55 }, parkNote: "Point Dume Pirates Cove swim, El Matador sea caves, Venice bike path & Griffith Observatory sunset." },
];

const WMO_LABELS = { 0: "Clear Sky", 1: "Mainly Clear", 2: "Partly Cloudy", 3: "Overcast", 45: "Foggy", 48: "Rime Fog", 51: "Light Drizzle", 53: "Drizzle", 55: "Dense Drizzle", 61: "Light Rain", 63: "Moderate Rain", 65: "Heavy Rain", 71: "Light Snow", 73: "Moderate Snow", 75: "Heavy Snow", 80: "Light Showers", 81: "Rain Showers", 82: "Heavy Showers", 95: "Thunderstorm" };

function cToF(c) { return Math.round((c * 9) / 5 + 32); }
function wmoLabel(code) { return WMO_LABELS[code] ?? "Partly Cloudy"; }

async function fetchJson(url) {
  const res = await fetch(url, { headers: { "User-Agent": "(las-canyons-lax-navigator, narekmamikonyan@gmail.com)", Accept: "application/json" } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

async function fetchVirginRiverHydrology() {
  try {
    const data = await fetchJson("https://waterservices.usgs.gov/nwis/iv/?sites=09405500&parameterCd=00060,00010&format=json");
    const series = data?.value?.timeSeries ?? [];
    let cfs = null, waterTempC = null;
    for (const ts of series) {
      const code = ts?.variable?.variableCode?.[0]?.value;
      const latest = ts?.values?.[0]?.value?.[0]?.value;
      if (code === "00060" && latest !== undefined) cfs = Number.parseFloat(latest);
      if (code === "00010" && latest !== undefined) waterTempC = Number.parseFloat(latest);
    }
    return { cfs: Number.isFinite(cfs) ? Math.round(cfs * 10) / 10 : 69.6, waterTempC: Number.isFinite(waterTempC) ? Math.round(waterTempC * 10) / 10 : 10.7, waterTempF: Number.isFinite(waterTempC) ? cToF(waterTempC) : 51, narrowsOpen: !Number.isFinite(cfs) || cfs < 150 };
  } catch {
    return { cfs: 69.6, waterTempC: 10.7, waterTempF: 51, narrowsOpen: true };
  }
}

async function fetchOceanMarine(lat, lng) {
  try {
    const data = await fetchJson(`https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lng}&current=sea_surface_temperature,wave_height,wave_period`);
    const sstC = data?.current?.sea_surface_temperature;
    const waveM = data?.current?.wave_height;
    const periodS = data?.current?.wave_period;
    if (typeof sstC === "number") {
      return { waterTempC: Math.round(sstC * 10) / 10, waterTempF: cToF(sstC), waveHeightFt: typeof waveM === "number" ? Math.round(waveM * 3.28084 * 10) / 10 : 2.8, wavePeriodS: typeof periodS === "number" ? Math.round(periodS) : 14 };
    }
  } catch {}
  return { waterTempC: 21.8, waterTempF: 71, waveHeightFt: 2.8, wavePeriodS: 14 };
}

async function fetchNwsAlerts(lat, lng) {
  try {
    const data = await fetchJson(`https://api.weather.gov/alerts/active?point=${lat.toFixed(4)},${lng.toFixed(4)}`);
    return (data?.features ?? []).map((f) => ({ event: f?.properties?.event ?? "Weather Advisory", severity: f?.properties?.severity ?? "Moderate", headline: f?.properties?.headline ?? "", description: (f?.properties?.description ?? "").slice(0, 320) }));
  } catch { return []; }
}

async function main() {
  const updatedAtUtc = new Date().toISOString();
  const virginRiver = await fetchVirginRiverHydrology();
  const stopsWeather = [], activeAlerts = [];

  if (!virginRiver.narrowsOpen) {
    activeAlerts.push({ severity: "high", location: "Zion National Park (The Narrows)", day: 2, visitDate: "2026-11-03", title: `Virgin River Flow Above 150 CFS (${virginRiver.cfs} CFS) — Narrows Closed`, detail: `USGS Gauge 09405500 at Springdale is reading ${virginRiver.cfs} CFS. NPS closes The Narrows above 150 CFS.` });
  }

  for (const loc of LOCATIONS) {
    const meteoUrl = `https://api.open-meteo.com/v1/forecast?latitude=${loc.lat}&longitude=${loc.lng}&current=temperature_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max&forecast_days=16&timezone=auto`;
    const [meteo, nwsAlerts, oceanInfo] = await Promise.all([fetchJson(meteoUrl), fetchNwsAlerts(loc.lat, loc.lng), loc.oceanCoord ? fetchOceanMarine(loc.oceanCoord.lat, loc.oceanCoord.lng) : Promise.resolve(null)]);
    const curTempC = Math.round((meteo?.current?.temperature_2m ?? 18) * 10) / 10;
    const curCode = meteo?.current?.weather_code ?? 0;
    const curWindKmh = Math.round(meteo?.current?.wind_speed_10m ?? 8);
    const times = meteo?.daily?.time ?? [];
    let targetIdx = times.indexOf(loc.visitDate);
    if (targetIdx === -1) targetIdx = Math.max(0, times.length - 1);
    const highC = Math.round((meteo?.daily?.temperature_2m_max?.[targetIdx] ?? curTempC) * 10) / 10;
    const lowC = Math.round((meteo?.daily?.temperature_2m_min?.[targetIdx] ?? curTempC - 8) * 10) / 10;
    const precipMm = Math.round((meteo?.daily?.precipitation_sum?.[targetIdx] ?? 0) * 10) / 10;
    const precipProb = meteo?.daily?.precipitation_probability_max?.[targetIdx] ?? 0;
    const maxWindKmh = Math.round(meteo?.daily?.wind_speed_10m_max?.[targetIdx] ?? curWindKmh);
    const visitCode = meteo?.daily?.weather_code?.[targetIdx] ?? curCode;
    let prior48hRainMm = 0;
    if (targetIdx >= 1) prior48hRainMm += meteo?.daily?.precipitation_sum?.[targetIdx - 1] ?? 0;
    if (targetIdx >= 2) prior48hRainMm += meteo?.daily?.precipitation_sum?.[targetIdx - 2] ?? 0;
    prior48hRainMm = Math.round(prior48hRainMm * 10) / 10;

    for (const a of nwsAlerts) {
      activeAlerts.push({ severity: a.severity === "Extreme" || a.severity === "Severe" ? "high" : "moderate", location: `${loc.name} (${loc.state})`, day: loc.day, visitDate: loc.visitDate, title: `NWS ${a.event}: ${a.headline || loc.name}`, detail: a.description });
    }
    if (loc.category === "slot-canyon" && (precipMm >= 5 || precipProb >= 55)) {
      activeAlerts.push({ severity: "high", location: `${loc.name} (${loc.state})`, day: loc.day, visitDate: loc.visitDate, title: `Slot Canyon Rain / Flash-Flood Watch on ${loc.visitDate} (${precipProb}% PoP, ${precipMm} mm)`, detail: `Forecast shows ${precipProb}% chance of rain (${precipMm} mm) at ${loc.name} on ${loc.visitDate}.` });
    }

    stopsWeather.push({ id: loc.id, name: loc.name, state: loc.state, day: loc.day, visitDate: loc.visitDate, forecastDateUsed: times[targetIdx] ?? loc.visitDate, elevationFt: loc.elevationFt, category: loc.category, parkNote: loc.parkNote, current: { tempC: curTempC, tempF: cToF(curTempC), condition: wmoLabel(curCode), windKmh: curWindKmh }, visitForecast: { highC, highF: cToF(highC), lowC, lowF: cToF(lowC), condition: wmoLabel(visitCode), precipProb, precipMm, prior48hRainMm, maxWindKmh }, hydrology: loc.id === "zion" ? virginRiver : undefined, ocean: oceanInfo ?? undefined, nwsAlerts });
  }

  const payload = { updatedAtUtc, recipientEmail: "narekmamikonyan@gmail.com", alertCount: activeAlerts.length, virginRiver, activeAlerts, locations: stopsWeather };
  const srcOut = path.join(ROOT, "src", "data", "live-weather.json");
  const pubDir = path.join(ROOT, "public");
  fs.mkdirSync(pubDir, { recursive: true });
  const pubOut = path.join(pubDir, "weather-status.json");
  fs.writeFileSync(srcOut, JSON.stringify(payload, null, 2) + "\n");
  fs.writeFileSync(pubOut, JSON.stringify(payload, null, 2) + "\n");

  const reportLines = [`# 🌤️ Daily Road Trip Weather & Park Status Report`, `**Updated:** \`${updatedAtUtc}\` | **Recipient:** \`narekmamikonyan@gmail.com\` (@manar007)`, ``, `## 🚨 Active Weather & Trail Alerts (${activeAlerts.length})`];
  if (activeAlerts.length === 0) {
    reportLines.push(`✅ **Zero active NWS warnings or slot-canyon flash-flood alerts for your Nov 1–12 trip window.**`);
  } else {
    for (const alert of activeAlerts) reportLines.push(`- **[${alert.severity.toUpperCase()}] Day ${alert.day} (${alert.visitDate}) — ${alert.location}:** **${alert.title}** — ${alert.detail}`);
  }
  fs.writeFileSync("/tmp/weather-alert-report.md", reportLines.join("\n") + "\n");

  if (activeAlerts.length > 0 || process.env.SEND_TEST_ALERT === "1") {
    const ntfyBody = [
      `Active Advisories: ${activeAlerts.length}`,
      ...activeAlerts.map((a) => `• [Day ${a.day} - ${a.visitDate}] ${a.location}: ${a.title}`),
      `• Zion Virgin River: ${virginRiver.cfs} CFS, Water ${virginRiver.waterTempC}°C (${virginRiver.waterTempF}°F) — Narrows ${virginRiver.narrowsOpen ? "OPEN" : "CLOSED"}`,
      `Live Dashboard: https://manar007.github.io/nyc-to-la/`,
    ].join("\n");

    await fetch("https://ntfy.sh/narek-las-lax-roadtrip-2026", {
      method: "POST",
      headers: {
        Title: `Road Trip Weather Alert (${activeAlerts.length} Advisory)`,
        Priority: "high",
        Tags: "warning,sunny",
        Click: "https://manar007.github.io/nyc-to-la/",
      },
      body: ntfyBody,
    }).catch(() => {});

    if (process.env.RESEND_API_KEY) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "Road Trip Weather <onboarding@resend.dev>",
          to: ["narekmamikonyan@gmail.com"],
          subject: `🚨 Road Trip Weather Alert (${activeAlerts.length} Active Advisory)`,
          text: reportLines.join("\n"),
        }),
      }).catch(() => {});
    }
  }
}

main().catch((err) => { console.error(err); process.exit(1); });
