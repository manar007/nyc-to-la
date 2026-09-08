import { DAYS, STOPS, type Stop, getStop } from "@/data/route";

function coord(stop: Stop): string {
  return `${stop.lat},${stop.lng}`;
}

export function stopDirectionsUrl(stop: Stop): string {
  const params = new URLSearchParams({
    api: "1",
    destination: coord(stop),
    travelmode: "driving",
  });
  return `https://www.google.com/maps/dir/?${params.toString()}`;
}

export function stopSearchUrl(stop: Stop): string {
  const params = new URLSearchParams({
    api: "1",
    query: coord(stop),
  });
  return `https://www.google.com/maps/search/?${params.toString()}`;
}

export type DayRoutePlan = {
  day: number;
  title: string;
  origin: Stop;
  destination: Stop;
  waypoints: Stop[];
  driveMiles: number;
  driveHours: number;
  url: string;
};

export function dayRoutePlan(dayNumber: number): DayRoutePlan | null {
  const day = DAYS.find((d) => d.day === dayNumber);
  if (!day) return null;

  const origin = getStop(day.from);
  const destination = getStop(day.to);
  if (!origin || !destination) return null;

  const dayStops = STOPS.filter((s) => s.day === dayNumber);
  const waypoints = dayStops.filter((s) => s.id !== destination.id);

  const params = new URLSearchParams({
    api: "1",
    origin: coord(origin),
    destination: coord(destination),
    travelmode: "driving",
  });

  const isRestDay = origin.id === destination.id && waypoints.length === 0;
  if (isRestDay) {
    return {
      day: dayNumber,
      title: day.title,
      origin,
      destination,
      waypoints,
      driveMiles: 0,
      driveHours: 0,
      url: stopSearchUrl(destination),
    };
  }

  if (waypoints.length > 0) {
    params.set("waypoints", waypoints.map(coord).join("|"));
  }

  const legs = [...waypoints, destination];
  const driveMiles = legs.reduce((sum, s) => sum + s.driveFromPrevMiles, 0);
  const driveHours = legs.reduce((sum, s) => sum + s.driveFromPrevHours, 0);

  return {
    day: dayNumber,
    title: day.title,
    origin,
    destination,
    waypoints,
    driveMiles,
    driveHours,
    url: `https://www.google.com/maps/dir/?${params.toString()}`,
  };
}

export function allDayRoutePlans(): DayRoutePlan[] {
  return DAYS.map((d) => dayRoutePlan(d.day)).filter(
    (p): p is DayRoutePlan => p !== null
  );
}
