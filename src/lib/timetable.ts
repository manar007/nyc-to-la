import { DAYS, STOPS, getStop, type Stop, type StopKind } from "@/data/route";

export type TimetableEntry = {
  stop: Stop;
  arriveMinutes: number;
  departMinutes: number;
  stopMinutes: number;
  isOrigin: boolean;
  isDestination: boolean;
};

const DEFAULT_START_MINUTES = 8 * 60;

const DEFAULT_STOP_MINUTES: Record<StopKind, number> = {
  start: 0,
  meal: 45,
  scenic: 30,
  activity: 60,
  overnight: 0,
  camp: 0,
  finish: 0,
};

const STOP_MINUTES_OVERRIDE: Record<string, number> = {
  "vegas-gear": 75,
  "valley-of-fire": 150,
  "zion-canyon": 360,
  "canyon-overlook": 90,
  "red-canyon": 30,
  "kanab-bakery": 45,
  "buckskin-gulch": 225,
  "horseshoe-bend": 105,
  "antelope-canyon": 150,
  "forrest-gump-point": 25,
  "cameron-trading-post": 45,
  "desert-view": 90,
  flagstaff: 45,
  "oak-creek-canyon": 60,
  "joshua-tree": 75,
  "crystal-cove": 210,
  "venice-beach": 135,
  "point-dume": 90,
  "el-matador": 95,
  "malibu-seafood": 75,
  "santa-monica-bluffs": 120,
};

const DAY_START_OVERRIDE: Record<number, number> = {
  1: 11 * 60 + 30,
  2: 7 * 60 + 30,
  3: 7 * 60 + 30,
  4: 7 * 60 + 45,
  5: 8 * 60 + 15,
  6: 7 * 60 + 30,
  7: 8 * 60,
  8: 6 * 60 + 45,
  9: 8 * 60 + 15,
  10: 8 * 60 + 30,
  11: 9 * 60,
};

export const DAY_DATES: Record<number, string> = {
  1: "Mon Nov 2, 2026",
  2: "Tue Nov 3, 2026",
  3: "Wed Nov 4, 2026",
  4: "Thu Nov 5, 2026",
  5: "Fri Nov 6, 2026",
  6: "Sat Nov 7, 2026",
  7: "Sun Nov 8, 2026",
  8: "Mon Nov 9, 2026",
  9: "Tue Nov 10, 2026",
  10: "Wed Nov 11, 2026",
  11: "Thu Nov 12, 2026",
};

function stopDurationMinutes(stop: Stop): number {
  return STOP_MINUTES_OVERRIDE[stop.id] ?? DEFAULT_STOP_MINUTES[stop.kind];
}

export function formatHHMM(totalMinutes: number): string {
  const wrapped = ((totalMinutes % (24 * 60)) + 24 * 60) % (24 * 60);
  const h = Math.floor(wrapped / 60);
  const m = Math.round(wrapped % 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function dayTimetable(day: number): TimetableEntry[] {
  const dayRow = DAYS.find((d) => d.day === day);
  if (!dayRow) return [];
  const origin = getStop(dayRow.from);
  const destination = getStop(dayRow.to);
  if (!origin || !destination) return [];

  const dayStops = STOPS.filter((s) => s.day === day);
  const waypoints = dayStops.filter((s) => s.id !== destination.id);
  const isRestDay =
    origin.id === destination.id && waypoints.length === 0;

  const timeline: Stop[] = isRestDay
    ? [origin]
    : [origin, ...waypoints, destination];

  const start = DAY_START_OVERRIDE[day] ?? DEFAULT_START_MINUTES;
  let cursor = start;
  const entries: TimetableEntry[] = [];

  for (let i = 0; i < timeline.length; i++) {
    const stop = timeline[i];
    const drivePrev = i === 0 ? 0 : Math.round(stop.driveFromPrevHours * 60);
    const arrive = cursor + drivePrev;
    const stopMinutes = i === 0 ? 0 : stopDurationMinutes(stop);
    const finalStop = i === timeline.length - 1;
    const depart = finalStop ? arrive : arrive + stopMinutes;
    entries.push({
      stop,
      arriveMinutes: arrive,
      departMinutes: depart,
      stopMinutes: finalStop ? 0 : stopMinutes,
      isOrigin: i === 0,
      isDestination: finalStop,
    });
    cursor = depart;
  }

  return entries;
}
