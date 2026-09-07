export type StopKind = "start" | "waypoint" | "overnight" | "finish";

export type Stop = {
  id: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  milesFromStart: number;
  driveFromPrevMiles: number;
  driveFromPrevHours: number;
  kind: StopKind;
  day: number;
  highway: string;
  eat: string;
  see: string;
  note: string;
};

export const TRIP = {
  name: "NYC → LA",
  tagline: "Leave the Hudson at dawn. Hit the Pacific before the week is out.",
  miles: 2830,
  driveHours: 42,
  days: 7,
  highways: "I-78 · I-70 · I-44 · I-40",
} as const;

export const STOPS: Stop[] = [
  {
    id: "nyc",
    city: "New York City",
    state: "NY",
    lat: 40.7128,
    lng: -74.006,
    milesFromStart: 0,
    driveFromPrevMiles: 0,
    driveFromPrevHours: 0,
    kind: "start",
    day: 0,
    highway: "Start",
    eat: "Bagel and coffee before the tunnel. You will not find this again in Oklahoma.",
    see: "The skyline from the New Jersey Turnpike — last look east.",
    note: "Roll before 7 a.m. The first day is long and the Lincoln Tunnel does not care about your itinerary.",
  },
  {
    id: "philly",
    city: "Philadelphia",
    state: "PA",
    lat: 39.9526,
    lng: -75.1652,
    milesFromStart: 95,
    driveFromPrevMiles: 95,
    driveFromPrevHours: 1.75,
    kind: "waypoint",
    day: 1,
    highway: "I-95 / I-76",
    eat: "A roast pork sandwich if you can spare 25 minutes off I-76.",
    see: "City Hall clock tower from the Schuylkill Expressway.",
    note: "Do not linger. Pittsburgh is still four and a half hours west.",
  },
  {
    id: "pittsburgh",
    city: "Pittsburgh",
    state: "PA",
    lat: 40.4406,
    lng: -79.9959,
    milesFromStart: 400,
    driveFromPrevMiles: 305,
    driveFromPrevHours: 4.75,
    kind: "overnight",
    day: 1,
    highway: "I-76 / I-70",
    eat: "Pierogies and a beer in Lawrenceville. You earned the carbs.",
    see: "The three rivers from Mount Washington after dark.",
    note: "First overnight. The Alleghenies are behind you; the Midwest starts tomorrow.",
  },
  {
    id: "columbus",
    city: "Columbus",
    state: "OH",
    lat: 39.9612,
    lng: -82.9988,
    milesFromStart: 585,
    driveFromPrevMiles: 185,
    driveFromPrevHours: 3,
    kind: "waypoint",
    day: 2,
    highway: "I-70",
    eat: "Thurman Café if you detour into German Village — otherwise keep rolling.",
    see: "Flat light and grain silos. This is the country changing under the wheels.",
    note: "I-70 is honest highway. Fuel in Ohio; Indiana rest stops get thinner after Indianapolis.",
  },
  {
    id: "indianapolis",
    city: "Indianapolis",
    state: "IN",
    lat: 39.7684,
    lng: -86.1581,
    milesFromStart: 760,
    driveFromPrevMiles: 175,
    driveFromPrevHours: 2.75,
    kind: "overnight",
    day: 2,
    highway: "I-70",
    eat: "Pork tenderloin sandwich. It will not fit on the plate. That is the point.",
    see: "The Soldiers and Sailors Monument at dusk.",
    note: "Short second day on purpose. Sleep here so St. Louis is a civilized afternoon arrival.",
  },
  {
    id: "stlouis",
    city: "St. Louis",
    state: "MO",
    lat: 38.627,
    lng: -90.1994,
    milesFromStart: 1000,
    driveFromPrevMiles: 240,
    driveFromPrevHours: 3.75,
    kind: "overnight",
    day: 3,
    highway: "I-70",
    eat: "Imo's pizza or a frozen custard at Ted Drewes. Pick a side, then pick the other.",
    see: "The Gateway Arch — you are leaving the East for real.",
    note: "Walk the riverfront. Tomorrow is the longest day on the board: 500 miles to Oklahoma City.",
  },
  {
    id: "okc",
    city: "Oklahoma City",
    state: "OK",
    lat: 35.4676,
    lng: -97.5164,
    milesFromStart: 1495,
    driveFromPrevMiles: 495,
    driveFromPrevHours: 7.25,
    kind: "overnight",
    day: 4,
    highway: "I-44",
    eat: "Onion burger in El Reno if you still have daylight, or Cattlemen's in the Stockyards.",
    see: "The sky getting bigger. Wind, red dirt, and a sunset that does not quit.",
    note: "You join Route 66 country here. Stretch. Tomorrow is high plains all the way to New Mexico.",
  },
  {
    id: "amarillo",
    city: "Amarillo",
    state: "TX",
    lat: 35.222,
    lng: -101.8313,
    milesFromStart: 1755,
    driveFromPrevMiles: 260,
    driveFromPrevHours: 3.75,
    kind: "waypoint",
    day: 5,
    highway: "I-40",
    eat: "The Big Texan if you want the bit. A normal steak if you want to drive afterward.",
    see: "Cadillac Ranch — ten minutes, spray paint optional, photos mandatory.",
    note: "Do not skip the photo. Then get back on I-40. Albuquerque is still four hours.",
  },
  {
    id: "albuquerque",
    city: "Albuquerque",
    state: "NM",
    lat: 35.0844,
    lng: -106.6504,
    milesFromStart: 2040,
    driveFromPrevMiles: 285,
    driveFromPrevHours: 4,
    kind: "overnight",
    day: 5,
    highway: "I-40",
    eat: "Red or green chile. If they offer Christmas, say yes.",
    see: "Sandia Peak turning pink. The West is no longer a rumor.",
    note: "Altitude. Drink water. The next morning's run to Flagstaff is desert and then ponderosa.",
  },
  {
    id: "flagstaff",
    city: "Flagstaff",
    state: "AZ",
    lat: 35.1983,
    lng: -111.6513,
    milesFromStart: 2365,
    driveFromPrevMiles: 325,
    driveFromPrevHours: 4.75,
    kind: "overnight",
    day: 6,
    highway: "I-40",
    eat: "A green chile breakfast burrito downtown before the last push.",
    see: "Ponderosa pines and, if you have a half day, a Grand Canyon detour north.",
    note: "Last night on the road. LA is 465 miles of I-40 to I-15 — desert, then the basin.",
  },
  {
    id: "la",
    city: "Los Angeles",
    state: "CA",
    lat: 34.0522,
    lng: -118.2437,
    milesFromStart: 2830,
    driveFromPrevMiles: 465,
    driveFromPrevHours: 6.75,
    kind: "finish",
    day: 7,
    highway: "I-40 / I-15",
    eat: "Something with a view of the water. You drove for this.",
    see: "The Pacific. Stand there until the engine ticks cool.",
    note: "Drop into the basin on I-15, ride the 10 west, and do not look at the traffic like it personally betrayed you. You made it.",
  },
];

export const DAYS = [
  { day: 1, title: "Hudson to the Three Rivers", from: "nyc", to: "pittsburgh" },
  { day: 2, title: "Across the Midwest", from: "pittsburgh", to: "indianapolis" },
  { day: 3, title: "To the Arch", from: "indianapolis", to: "stlouis" },
  { day: 4, title: "The long one", from: "stlouis", to: "okc" },
  { day: 5, title: "High plains and chile", from: "okc", to: "albuquerque" },
  { day: 6, title: "Desert to ponderosa", from: "albuquerque", to: "flagstaff" },
  { day: 7, title: "Last push to the Pacific", from: "flagstaff", to: "la" },
] as const;

export function formatHours(hours: number) {
  if (hours === 0) return "—";
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export function kindLabel(kind: StopKind) {
  switch (kind) {
    case "start":
      return "Start";
    case "waypoint":
      return "Fuel stop";
    case "overnight":
      return "Overnight";
    case "finish":
      return "Finish";
  }
}
