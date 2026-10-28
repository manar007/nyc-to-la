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

export function formatTime12(totalMinutes: number): string {
  const wrapped = ((totalMinutes % (24 * 60)) + 24 * 60) % (24 * 60);
  const h24 = Math.floor(wrapped / 60);
  const m = Math.round(wrapped % 60);
  const period = h24 >= 12 ? "PM" : "AM";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
}

export function formatTimeParts(totalMinutes: number): { time: string; period: string } {
  const wrapped = ((totalMinutes % (24 * 60)) + 24 * 60) % (24 * 60);
  const h24 = Math.floor(wrapped / 60);
  const m = Math.round(wrapped % 60);
  const period = h24 >= 12 ? "PM" : "AM";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return {
    time: `${h12}:${String(m).padStart(2, "0")}`,
    period,
  };
}

export type DayOriginDetail = {
  title: string;
  badge: string;
  note: string;
};

export const DAY_ORIGIN_DETAILS: Record<number, DayOriginDetail> = {
  1: {
    title: "Las Vegas LAS Rental Car Center",
    badge: "Trip Start · 11:30 AM SUV Pick-up",
    note: "Land at LAS at 10:56 AM on AA 2356 from JFK T8. Pick up confirmed Midsize SUV at 11:30 AM (7135 Gilespie St), load luggage, and start your Southwest road trip!",
  },
  2: {
    title: "La Verkin — La Quinta Inn (Night 1 Hotel Departure)",
    badge: "Morning Start · Night 1 Hotel Base",
    note: "Depart your confirmed Night 1 hotel (La Quinta Inn & Suites La Verkin) at ~7:30 AM after complimentary hot breakfast. Head east on UT-9 for the quick 25-minute drive to Zion South Gate.",
  },
  3: {
    title: "Mt. Carmel Junction / Kanab (Night 2 Hotel Departure)",
    badge: "Morning Start · Night 2 Hotel Base",
    note: "Depart your Night 2 hotel (Best Western Thunderbird Lodge in Mt. Carmel Junction or Canyons Boutique Hotel in Kanab) at ~7:30 AM after breakfast. Drive north on US-89 to Scenic Byway UT-12, Red Canyon rock tunnels, and Bryce Canyon.",
  },
  4: {
    title: "Bryce Canyon — Ruby's Inn (Night 3 Hotel Departure)",
    badge: "Morning Start · Night 3 Hotel Base",
    note: "Depart your Night 3 hotel (Best Western Plus Ruby's Inn) at ~7:45 AM (after catching sunrise over the hoodoos at Sunrise Point). Drive down the Grand Staircase to Kanab Creek Bakery and Toadstool Hoodoos.",
  },
  5: {
    title: "Page / Lake Powell Hotel (Night 4 Hotel Departure)",
    badge: "Morning Start · Night 4 Hotel Base",
    note: "Depart your Night 4 hotel in Page (Hyatt Place or Country Inn & Suites) at ~8:15 AM after hot breakfast. It is only an 8-minute drive to Antelope Canyon for your 8:30 AM tour check-in.",
  },
  6: {
    title: "Monument Valley — The View / Goulding's (Night 5 Hotel Departure)",
    badge: "Morning Start · Night 5 Hotel Base",
    note: "Depart your Night 5 hotel/cabin in Monument Valley at ~7:30 AM (after watching sunrise over the Mittens). Drive west on US-163/160 toward Cameron Trading Post and Grand Canyon Desert View.",
  },
  7: {
    title: "Grand Canyon South Rim — Yavapai / Grand Hotel (Night 6 Hotel Departure)",
    badge: "Morning Start · Night 6 Hotel Base",
    note: "Depart your Night 6 lodge inside Grand Canyon National Park (Yavapai Lodge or The Grand Hotel) at ~8:00 AM. Drive south on AZ-64 toward Flagstaff and scenic Oak Creek Canyon to Sedona.",
  },
  8: {
    title: "Sedona — Sky Ranch Lodge / GreenTree (Night 7 Hotel Departure)",
    badge: "Morning Start · Night 7 Hotel Base",
    note: "Depart your Night 7 hotel in Sedona at ~6:45 AM for the scenic drive west across Arizona into California to Laguna Beach (gain 1 hour crossing MST → PST!).",
  },
  9: {
    title: "Laguna Beach — The Laguna Beach House (Night 8 Hotel Departure)",
    badge: "Morning Start · Night 8 Hotel Base",
    note: "Depart your Night 8 hotel in Laguna Beach (The Laguna Beach House) at ~8:15 AM. Drive north on I-5 / US-101 to Universal Studios Hollywood for 9:00 AM park opening, heading to your Santa Monica hotel in the evening.",
  },
  10: {
    title: "Santa Monica — Sea Blue Hotel (Night 9 Hotel Departure)",
    badge: "Morning Start · Night 9 Hotel Base (2-Night Base)",
    note: "Depart your Santa Monica oceanfront base (Sea Blue Hotel on Ocean Ave) at ~8:30 AM. Coastal morning drive up PCH to Point Dume and El Matador Sea Caves in Malibu (no luggage packing needed — staying at the same hotel tonight!).",
  },
  11: {
    title: "Santa Monica — Sea Blue Hotel (Night 10 Hotel Departure)",
    badge: "Morning Start · Final Day Hotel Departure",
    note: "Depart your Santa Monica hotel at ~9:00 AM after breakfast. Enjoy a final morning walk along the Palisades Park bluffs, refuel the SUV to 100%, and return the vehicle to LAX by 11:30 AM sharp.",
  },
};

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
