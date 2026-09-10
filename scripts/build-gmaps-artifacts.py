#!/usr/bin/env python3
"""Generate Google My Maps KML and per-day Google Maps directions URLs.

Source of truth is `src/data/route.ts` in the app. This script keeps a
mirrored copy of the stop data so it runs standalone (no TS toolchain
required). If you edit stops in `src/data/route.ts`, update this file
in the same commit.

Outputs:
  plans/gmaps/nyc-to-la.kml           -> import into mymaps.google.com
  plans/gmaps/daily-links.md          -> one Google Maps day URL per day
  plans/gmaps/stops.csv               -> CSV import fallback
"""

from __future__ import annotations

import csv
import os
import urllib.parse
from dataclasses import dataclass
from pathlib import Path
from typing import Optional
from xml.sax.saxutils import escape


@dataclass
class Stop:
    id: str
    city: str
    state: str
    lat: float
    lng: float
    kind: str  # start | meal | scenic | activity | overnight | camp | finish
    day: int
    major: bool
    highway: str
    note: str
    eat: str
    see: str
    address: Optional[str] = None


STOPS: list[Stop] = [
    Stop("nyc", "New York City", "NY", 40.7128, -74.006, "start", 0, True,
         "Start", "Leave the LIC / UWS hotel by 7 AM. Uber to EWR to pick up the SUV. Wheels rolling on I-78 W by 8:15.",
         "Bagel and coffee before the tunnel.",
         "Skyline in the rearview from the Lincoln Tunnel approach.",
         "Manhattan, New York, NY"),
    Stop("clinton", "Clinton", "NJ", 40.6367, -74.9083, "meal", 1, False,
         "I-78 W · Exit 15", "First flush stop. Walk the lot for five minutes before you sit down.",
         "Clinton Station Diner — real Jersey diner, sit at the counter.",
         "Nothing scenic yet — this stop is for the legs.",
         "Clinton Station Diner, 2 Bank St, Clinton, NJ 08809"),
    Stop("front-royal", "Front Royal", "VA", 38.9155, -78.1975, "meal", 1, False,
         "I-81 S · US-340", "Fill the tank here. No fuel available inside Shenandoah NP in November.",
         "Spelunker's — cavern-themed burger + frozen custard.",
         "Shenandoah River from the bridge on your way in.",
         "Spelunker's, 116 South St, Front Royal, VA 22630"),
    Stop("big-meadows", "Big Meadows", "VA", 38.5218, -78.4358, "scenic", 1, False,
         "Skyline Drive · mp 51", "Pit stop and horizon check. Ten minutes, then back on Skyline south.",
         "Thermos coffee refill only.",
         "Open sky over the meadow. Deer at any hour.",
         "Big Meadows Wayside, Skyline Drive mp 51, Shenandoah NP"),
    Stop("blackrock", "Blackrock Summit", "VA", 38.2338, -78.7328, "activity", 1, False,
         "Skyline Drive · mp 84.8", "1.0 mi loop, 175 ft gain, ~45 min. Non-optional recovery flush.",
         "Snack in the day pack. Water — 1L minimum.",
         "360° stone-field summit. Four ridges deep.",
         "Blackrock Summit Trailhead, Skyline Drive mp 84.8"),
    Stop("harrisonburg", "Harrisonburg", "VA", 38.434, -78.8697, "overnight", 1, True,
         "US-33 W · via Swift Run Gap", "Hotel Madison is the pick. Alt: Blackburn Inn in Staunton (25 mi south).",
         "Jack Brown's Beer & Burger or Pale Fire Brewing.",
         "Downtown Harrisonburg. Walkable.",
         "Hotel Madison, 710 S Main St, Harrisonburg, VA 22801"),
    Stop("rockfish-gap", "Rockfish Gap", "VA", 38.0338, -78.8583, "scenic", 2, False,
         "I-64 E · BRP entry", "Fuel and provisions before entering. No gas on the BRP itself.",
         "Coffee thermos filled at Shen Valley in Harrisonburg.",
         "Blue Ridge Parkway mp 0 sign.",
         "Blue Ridge Parkway mp 0, Waynesboro, VA"),
    Stop("peaks-of-otter", "Peaks of Otter", "VA", 37.4463, -79.6058, "scenic", 2, False,
         "Blue Ridge Parkway · mp 86", "BRP highlight. 30 min minimum, 1 hr if the light is good.",
         "Sharp Top Trail overlook lunch. Sandwich from the wayside store.",
         "Abbott Lake reflection of Sharp Top.",
         "Peaks of Otter, BRP mp 86, Bedford, VA"),
    Stop("asheville", "Asheville", "NC", 35.5951, -82.5515, "overnight", 2, True,
         "US-11 · I-81 S · I-40 W", "Cut Mabry Mill for time. Drop off BRP near Buchanan, take I-81/I-40.",
         "Wicked Weed / Burial Beer / Cúrate / 12 Bones BBQ.",
         "River Arts District (RAD) if you have daylight.",
         "Downtown Asheville, NC"),
    Stop("newfound-gap", "Newfound Gap", "TN/NC", 35.6111, -83.4247, "scenic", 3, False,
         "US-441 · Newfound Gap Rd", "Pivot moment: leaving the East. ~20 min stop.",
         "Nothing — no food service in the park corridor.",
         "State line marker. Appalachian Trail crosses here.",
         "Newfound Gap Overlook, Great Smoky Mountains NP"),
    Stop("clingmans-dome", "Clingmans Dome", "TN", 35.5568, -83.4952, "activity", 3, False,
         "Clingmans Dome Rd", "Paved 0.5-mi climb. ~30 min round trip.",
         "Water only.",
         "Highest point in the Smokies (6,643 ft). 360° tower view.",
         "Clingmans Dome Observation Tower, Great Smoky Mountains NP"),
    Stop("nashville", "Nashville", "TN", 36.1627, -86.7816, "overnight", 3, True,
         "I-40 W · US-129", "Target East Nashville or Germantown. Book ahead — Wed nights are surprisingly busy.",
         "Prince's Hot Chicken (Nashville original) or Hattie B's.",
         "East Nashville or Germantown. Skip lower Broadway.",
         "East Nashville or Germantown, Nashville, TN"),
    Stop("memphis", "Memphis", "TN", 35.1341, -90.0578, "meal", 4, False,
         "I-40 W", "2.5 hr stop total: 90 min museum + 45 min lunch + walk.",
         "Central BBQ, 147 E Butler Ave — pulled pork plate.",
         "National Civil Rights Museum at the Lorraine Motel. 90 min minimum.",
         "National Civil Rights Museum, 450 Mulberry St, Memphis, TN 38103"),
    Stop("amarillo", "Amarillo", "TX", 35.2219, -101.8313, "overnight", 4, True,
         "I-40 W · through Little Rock, OKC", "THE transit day. Over 11 hrs door to door. Arrive ~10 PM. Sleep hard.",
         "Late arrival — hotel bar or 24-hr taqueria off I-40.",
         "The horizon flattening for hours. Sunset in Oklahoma.",
         "I-40 corridor, Amarillo, TX"),
    Stop("palo-duro", "Palo Duro Canyon", "TX", 34.9349, -101.6579, "scenic", 5, False,
         "TX-217 · Park Rd 5", "Real 2-hour stop, not a drive-by. Cadillac Ranch cut.",
         "Nothing — provisions from Amarillo.",
         "'Grand Canyon of Texas.' Red rock, 800 ft deep.",
         "Palo Duro Canyon State Park, 11450 State Hwy Park Rd 5, Canyon, TX 79015"),
    Stop("tucumcari", "Tucumcari", "NM", 35.1717, -103.725, "meal", 5, False,
         "I-40 W · Route 66 downtown loop", "Get off I-40, drive Tucumcari Blvd end to end, then back on the highway.",
         "Del's Restaurant — neon cow sign, real green chile.",
         "Blue Swallow Motel neon at dusk.",
         "Route 66, Tucumcari, NM 88401"),
    Stop("albuquerque", "Albuquerque", "NM", 35.0844, -106.6504, "camp", 5, True,
         "I-40 W", "First car-camping night. Elevation ~5,300 ft, near-freezing overnight.",
         "Green chile cheeseburger at Sadie's, 5400 Cutler Ave.",
         "Sandia Peak turning pink at sunset.",
         "BLM dispersed camping, west of Albuquerque, NM"),
    Stop("painted-desert", "Painted Desert", "AZ", 35.0654, -109.781, "scenic", 6, False,
         "I-40 W · PEFO N entrance", "Enter north, exit south. 2 hours minimum inside the park.",
         "Cold breakfast from the cooler on the rim.",
         "Painted Desert rim + Petrified Forest 28-mi scenic road.",
         "Painted Desert Visitor Center, Petrified Forest NP, AZ"),
    Stop("meteor-crater", "Meteor Crater", "AZ", 35.0272, -111.0224, "scenic", 6, False,
         "I-40 W · exit 233", "20 min off I-40, ~45 min at the rim.",
         "Small deli inside the visitor center.",
         "0.7-mi-wide asteroid impact crater. 50,000 years old.",
         "Meteor Crater Natural Landmark, Winslow, AZ 86047"),
    Stop("grand-canyon", "Grand Canyon", "AZ", 36.0553, -112.1394, "camp", 6, True,
         "US-180 N · AZ-64 N", "Mather Campground — Sat Nov 7 = weekend, book EARLY.",
         "Camp stove: pasta + a can of chile. Or Bright Angel restaurant.",
         "South Rim at sunset. Hopi Point or Yavapai Point.",
         "Mather Campground, Grand Canyon South Rim, AZ"),
    Stop("antelope-canyon", "Antelope Canyon", "AZ", 36.8619, -111.3743, "activity", 7, False,
         "US-89 N", "The one time-locked booking of the trip. 8-10 AM slot for the beams.",
         "Coffee in Page — Big John's or Ravens Cafe.",
         "Sandstone light beams. Navajo-guided only.",
         "Upper Antelope Canyon, Page, AZ 86040"),
    Stop("horseshoe-bend", "Horseshoe Bend", "AZ", 36.8791, -111.5104, "scenic", 7, False,
         "US-89 · 5 min south of Page", "45 min stop. Then push west through Kanab to Zion.",
         "Post-tour lunch: State 48 Tavern or Bonkers in Page.",
         "Colorado River in a perfect horseshoe, 1,000 ft below.",
         "Horseshoe Bend Overlook, Page, AZ"),
    Stop("zion", "Zion National Park", "UT", 37.2, -112.9868, "camp", 7, True,
         "US-89A · UT-9", "Two nights here (Sun + Mon). Watchman = walk-in campground with hot showers.",
         "Springdale: Oscar's Cafe (fish tacos) or MeMe's Cafe (crepes).",
         "Watchman peak turning red at sunset from camp.",
         "Watchman Campground, Zion NP, Springdale, UT"),
    Stop("valley-of-fire", "Valley of Fire", "NV", 36.4293, -114.5225, "scenic", 9, False,
         "I-15 S · NV-169", "1.5 hr stop before the LA push. Last true desert of the trip.",
         "Provisions from Springdale gas station or St. George.",
         "Red sandstone spires. Fire Wave loop is 1.5 mi.",
         "Valley of Fire State Park Visitor Center, Overton, NV"),
    Stop("la", "Los Angeles", "CA", 34.0089, -118.4973, "overnight", 9, True,
         "I-15 S · I-10 W", "Book Santa Monica specifically — Wed morning is PCH north to Point Dume + El Matador.",
         "Gjelina in Venice or Bay Cities Deli in Santa Monica.",
         "The Pacific. Stand there until the engine ticks cool.",
         "Santa Monica / Venice / Malibu, Los Angeles, CA"),
    Stop("point-dume", "Point Dume", "CA", 34.0000, -118.8050, "scenic", 10, False,
         "PCH (CA-1) · north from Santa Monica",
         "First real PCH stop, Wed ~9 AM. 45 min: cliff loop trail + optional 15 min down the stairs to sea level.",
         "Coffee at Malibu Farm Pier Cafe on the way out. Nothing at the point itself — bring water.",
         "Cliffside overlook of the whale-migration channel. Gray whales southbound in November. Stairs down to the tide pools.",
         "Point Dume State Beach & Nature Preserve, 6800 Westward Beach Rd, Malibu, CA 90265"),
    Stop("el-matador", "El Matador", "CA", 34.0357, -118.8737, "activity", 10, False,
         "PCH (CA-1) · 4 mi north of Point Dume",
         "The Pacific recovery plunge, if the surf is calm: 3 min cold, 10 min in the sun, repeat twice. Cold water on marathon-tired quads.",
         "Neptune's Net (42505 PCH, 5 mi further north) — burger + fried shrimp if the mood strikes. Otherwise cooler snacks.",
         "Sea stacks, sandstone arches, tide pools. The postcard-Malibu photograph.",
         "El Matador State Beach, 32350 Pacific Coast Hwy, Malibu, CA 90265"),
    Stop("lax", "LAX — Wheels Up", "CA", 33.9416, -118.4085, "finish", 10, True,
         "PCH S → I-10 E → I-405 S",
         "Wed ~2 PM back at Santa Monica (wash car, gas, repack). Sleep SM. Thu Nov 12: leave hotel 10:30, rental drop 11:30, LAX 12:00, wheels up 15:00.",
         "Coffee at the gate. You made it.",
         "The Pacific one more time out the window on takeoff.",
         "Los Angeles International Airport (LAX)"),
]


DAYS = [
    (1, "The tunnel, the ridge, the flush",   "nyc",          "harrisonburg"),
    (2, "Blue Ridge Parkway south",           "harrisonburg", "asheville"),
    (3, "Smokies at dawn, hot chicken at dusk","asheville",   "nashville"),
    (4, "Nashville → Memphis → the plains",   "nashville",    "amarillo"),
    (5, "Palo Duro and the high desert",      "amarillo",     "albuquerque"),
    (6, "Painted rock to the great crack",    "albuquerque",  "grand-canyon"),
    (7, "Slot canyon light, red rock camp",   "grand-canyon", "zion"),
    (8, "A full day inside Zion",             "zion",         "zion"),
    (9, "Mojave to the Pacific",              "zion",         "la"),
    (10, "PCH morning + wheels up",           "la",           "lax"),
]


DAY_DATES = {
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
}


def by_id(stop_id: str) -> Stop:
    for s in STOPS:
        if s.id == stop_id:
            return s
    raise KeyError(stop_id)


def coord(s: Stop) -> str:
    return f"{s.lat},{s.lng}"


def day_url(day: int) -> tuple[str, list[Stop], Stop, Stop, bool]:
    day_row = next(d for d in DAYS if d[0] == day)
    _, _, from_id, to_id = day_row
    origin = by_id(from_id)
    destination = by_id(to_id)
    day_stops = [s for s in STOPS if s.day == day]
    waypoints = [s for s in day_stops if s.id != destination.id]

    is_rest_day = origin.id == destination.id and not waypoints

    if is_rest_day:
        params = {"api": "1", "query": coord(destination)}
        return (
            "https://www.google.com/maps/search/?" + urllib.parse.urlencode(params),
            waypoints, origin, destination, True,
        )

    params = {
        "api": "1",
        "origin": coord(origin),
        "destination": coord(destination),
        "travelmode": "driving",
    }
    if waypoints:
        params["waypoints"] = "|".join(coord(s) for s in waypoints)
    return (
        "https://www.google.com/maps/dir/?" + urllib.parse.urlencode(params, safe="|,"),
        waypoints, origin, destination, False,
    )


KIND_STYLE = {
    "start":     "start-pin",
    "finish":    "finish-pin",
    "overnight": "hotel-pin",
    "camp":      "camp-pin",
    "activity":  "activity-pin",
    "scenic":    "scenic-pin",
    "meal":      "meal-pin",
}


def kml_style(sid: str, color: str, icon_url: str) -> str:
    return f"""    <Style id="{sid}">
      <IconStyle>
        <color>{color}</color>
        <scale>1.1</scale>
        <Icon><href>{icon_url}</href></Icon>
      </IconStyle>
      <LabelStyle><scale>0.9</scale></LabelStyle>
    </Style>"""


ICON_PADDLE = "https://maps.google.com/mapfiles/kml/paddle/{code}.png"
ICON_PIN    = "https://maps.google.com/mapfiles/kml/pushpin/{code}.png"

STYLES = [
    ("start-pin",    "ff00ffff", ICON_PIN.format(code="ylw-pushpin")),
    ("finish-pin",   "ff0000ff", ICON_PIN.format(code="red-pushpin")),
    ("hotel-pin",    "ffff00ff", ICON_PIN.format(code="pink-pushpin")),
    ("camp-pin",     "ff00cc44", ICON_PIN.format(code="grn-pushpin")),
    ("activity-pin", "ff00aaff", ICON_PADDLE.format(code="orange-circle")),
    ("scenic-pin",   "ffddaa22", ICON_PADDLE.format(code="blu-circle")),
    ("meal-pin",     "ffcccccc", ICON_PADDLE.format(code="wht-circle")),
]


def build_kml() -> str:
    lines: list[str] = []
    lines.append('<?xml version="1.0" encoding="UTF-8"?>')
    lines.append('<kml xmlns="http://www.opengis.net/kml/2.2">')
    lines.append('  <Document>')
    lines.append('    <name>NYC → LA Road Trip (Nov 2–12, 2026)</name>')
    lines.append('    <description>Post-marathon 10-day southern crossing. Nine overnights, one finish line at the Pacific.</description>')

    for sid, color, icon in STYLES:
        lines.append(kml_style(sid, color, icon))

    # Route polyline: connect all stops in order
    coords_line = " ".join(f"{s.lng},{s.lat},0" for s in STOPS)
    lines.append('    <Placemark>')
    lines.append('      <name>Route</name>')
    lines.append('      <Style><LineStyle><color>ffe094fb</color><width>3</width></LineStyle></Style>')
    lines.append('      <LineString><tessellate>1</tessellate><coordinates>')
    lines.append(f'        {coords_line}')
    lines.append('      </coordinates></LineString>')
    lines.append('    </Placemark>')

    # One Folder per day for easy toggling in My Maps
    for day_num, title, _from_id, _to_id in DAYS:
        day_stops = [s for s in STOPS if s.day == day_num]
        if day_num == 0 or not day_stops:
            continue
        lines.append('    <Folder>')
        lines.append(f'      <name>Day {day_num} — {escape(title)} ({escape(DAY_DATES[day_num])})</name>')
        for s in day_stops:
            style = KIND_STYLE.get(s.kind, "scenic-pin")
            desc_parts = []
            if s.address:
                desc_parts.append(f"<b>{escape(s.address)}</b>")
            desc_parts.append(f"<b>Note:</b> {escape(s.note)}")
            desc_parts.append(f"<b>Eat:</b> {escape(s.eat)}")
            desc_parts.append(f"<b>See:</b> {escape(s.see)}")
            desc_parts.append(f"<b>Highway:</b> {escape(s.highway)}")
            desc = "<br/>".join(desc_parts)
            lines.append('      <Placemark>')
            lines.append(f'        <name>{escape(s.city)} ({escape(s.state)})</name>')
            lines.append(f'        <description><![CDATA[{desc}]]></description>')
            lines.append(f'        <styleUrl>#{style}</styleUrl>')
            lines.append(f'        <Point><coordinates>{s.lng},{s.lat},0</coordinates></Point>')
            lines.append('      </Placemark>')
        lines.append('    </Folder>')

    # Also include the start stop (Day 0) in its own folder
    day0_stops = [s for s in STOPS if s.day == 0]
    if day0_stops:
        lines.append('    <Folder>')
        lines.append('      <name>Day 0 — Start (NYC)</name>')
        for s in day0_stops:
            style = KIND_STYLE.get(s.kind, "start-pin")
            lines.append('      <Placemark>')
            lines.append(f'        <name>{escape(s.city)}</name>')
            lines.append(f'        <description><![CDATA[{escape(s.note)}]]></description>')
            lines.append(f'        <styleUrl>#{style}</styleUrl>')
            lines.append(f'        <Point><coordinates>{s.lng},{s.lat},0</coordinates></Point>')
            lines.append('      </Placemark>')
        lines.append('    </Folder>')

    lines.append('  </Document>')
    lines.append('</kml>')
    return "\n".join(lines) + "\n"


def build_daily_links() -> str:
    lines = [
        "# Daily Google Maps Deep-Links",
        "",
        "Tap the URL for a given day on your phone. Google Maps app opens with the whole day pre-loaded — origin, waypoints, destination. Hit **Start**.",
        "",
        "**Note on the 9-waypoint cap:** every day of this trip fits inside Google's directions API limit. If you edit a day to add more stops than fit, split it into two links.",
        "",
        "---",
        "",
    ]
    for day_num, title, _from_id, _to_id in DAYS:
        url, waypoints, origin, destination, is_rest = day_url(day_num)
        date = DAY_DATES[day_num]
        lines.append(f"## Day {day_num} — {title}")
        lines.append("")
        lines.append(f"**{date}**")
        lines.append("")
        if is_rest:
            lines.append(f"*Rest / in-park day at {destination.city}.*")
            lines.append("")
            lines.append(f"**Pin only:** [{destination.city}]({url})")
        else:
            legs = [origin] + waypoints + [destination]
            leg_str = " → ".join(f"**{s.city}**" for s in legs)
            lines.append(leg_str)
            lines.append("")
            lines.append(f"**Open in Google Maps:** {url}")
        lines.append("")
        lines.append("---")
        lines.append("")

    return "\n".join(lines)


def build_csv() -> str:
    fieldnames = ["day", "id", "city", "state", "kind", "major", "lat", "lng",
                  "address", "highway", "note", "eat", "see"]
    from io import StringIO
    buf = StringIO()
    w = csv.DictWriter(buf, fieldnames=fieldnames)
    w.writeheader()
    for s in STOPS:
        w.writerow({
            "day": s.day, "id": s.id, "city": s.city, "state": s.state,
            "kind": s.kind, "major": s.major, "lat": s.lat, "lng": s.lng,
            "address": s.address or "", "highway": s.highway,
            "note": s.note, "eat": s.eat, "see": s.see,
        })
    return buf.getvalue()


def main() -> None:
    root = Path(__file__).resolve().parent.parent
    out_dir = root / "plans" / "gmaps"
    out_dir.mkdir(parents=True, exist_ok=True)

    (out_dir / "nyc-to-la.kml").write_text(build_kml())
    (out_dir / "daily-links.md").write_text(build_daily_links())
    (out_dir / "stops.csv").write_text(build_csv())

    print(f"Wrote {out_dir}/nyc-to-la.kml")
    print(f"Wrote {out_dir}/daily-links.md")
    print(f"Wrote {out_dir}/stops.csv")


if __name__ == "__main__":
    main()
