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
  "front-royal": 45,
  "big-meadows": 15,
  blackrock: 60,
  "peaks-of-otter": 45,
  "newfound-gap": 20,
  "clingmans-dome": 45,
  memphis: 150,
  "palo-duro": 120,
  tucumcari: 45,
  "painted-desert": 120,
  "meteor-crater": 60,
  "antelope-canyon": 90,
  "horseshoe-bend": 45,
  "valley-of-fire": 90,
  "point-dume": 60,
  "el-matador": 120,
};

const DAY_START_OVERRIDE: Record<number, number> = {
  1: 8 * 60,
  2: 8 * 60,
  3: 7 * 60 + 30,
  4: 7 * 60,
  5: 8 * 60,
  6: 7 * 60 + 30,
  7: 7 * 60,
  8: 8 * 60,
  9: 8 * 60,
  10: 9 * 60,
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
  10: "Wed Nov 11 – Thu Nov 12, 2026",
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
