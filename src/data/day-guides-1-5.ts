export type DayHikeOption = {
  optionLabel: string;
  name: string;
  distance: string;
  elevation: string;
  duration: string;
  allTrailsUrl: string;
  permitNote: string;
  permitUrl?: string;
  highlights: string;
};

export type DayFoodStop = {
  time: string;
  kind: "Coffee & Breakfast" | "Snacks & Water" | "Lunch" | "Dinner";
  name: string;
  url: string;
  mapUrl: string;
  notes: string;
};

export type DaySleepOption = {
  optionLabel: string;
  name: string;
  type: "Hotel / Cabin" | "Campground" | "Free BLM / Forest";
  price: string;
  booked?: boolean;
  url: string;
  mapUrl: string;
  notes: string;
};

export type DayGuide = {
  day: number;
  date: string;
  title: string;
  routeSummary: string;
  tempDay: string;
  tempNight: string;
  waterTemp?: string;
  sunrise: string;
  sunset: string;
  daylightHours: string;
  timeZoneNote?: string;
  passAndPermitSummary: string;
  bookedBanner?: string;
  kidFriendlyPick?: string;
  hikes: DayHikeOption[];
  foodAndWater: DayFoodStop[];
  sleepOptions: DaySleepOption[];
  nuances: string[];
};

export const DAY_GUIDES_1_5: Record<number, DayGuide> = {
  1: {
    day: 1,
    date: "Mon, Nov 2, 2026",
    title: "JFK → Las Vegas → Walmart Kid & Road Kit → Valley of Fire → La Verkin Hotel",
    routeSummary: "Fly AA 2356 (7:59 AM JFK → 10:56 AM LAS) · 11:30 AM Midsize SUV Pick-up · Walmart Eastern Ave ($18 Booster Cushion & Road Snacks) · Valley of Fire State Park · La Verkin, UT (~168 mi · ~3h 05m drive)",
    tempDay: "23°C – 25°C (73°F – 77°F)",
    tempNight: "8°C – 10°C (46°F – 50°F)",
    sunrise: "6:03 AM PST (Las Vegas)",
    sunset: "4:46 PM PST (Valley of Fire) / 5:28 PM MST (La Verkin, UT)",
    daylightHours: "10h 43m",
    timeZoneNote: "+1 hr clock jump (PT → MT): Lose 1 hour crossing from Nevada (PST) into Utah (MST) on I-15 North through the Virgin River Gorge.",
    passAndPermitSummary: "Valley of Fire State Park entry is $15 per vehicle paid at the West Entrance booth (https://parks.nv.gov/parks/valley-of-fire).",
    bookedBanner: "BOOKED: Flight AA 2356 (7:59 AM JFK T8 → 10:56 AM LAS) · Midsize SUV Pick-up 11:30 AM at LAS (7135 Gilespie St, $466.67) · Night 1 Hotel at La Quinta Inn & Suites La Verkin (101 E 500 N, La Verkin, UT).",
    kidFriendlyPick: "👧 8yo Daughter Highlight: At Walmart Eastern Ave, grab a $18 backless booster cushion so she sits 4 inches higher and can see all the red rocks out the SUV window! In Valley of Fire, do Option A (Fire Wave & Pink Canyon, 3.1 km) — walking through the narrow pink sandstone slot feels like exploring Mars.",
    hikes: [
      {
        optionLabel: "Option A · Best for 8yo & Post-Marathon Recovery (Recommended)",
        name: "Fire Wave & Seven Wonders Loop (Pink Canyon)",
        distance: "3.1 km (1.9 mi) loop",
        elevation: "55 m (180 ft) gain",
        duration: "45 – 60 mins",
        allTrailsUrl: "https://www.alltrails.com/trail/us/nevada/fire-wave-and-pink-canyon",
        permitNote: "Included with $15 Valley of Fire State Park vehicle fee; park at Lot #3 on Mouse's Tank Road",
        permitUrl: "https://parks.nv.gov/parks/valley-of-fire",
        highlights: "Swirling orange, crimson, and white zebra-striped sandstone at the Fire Wave paired with the fun pastel narrows of Pink Canyon. Easy 1-hour walk ideal for an 8-year-old!",
      },
      {
        optionLabel: "Option B · Extended Movie-Set Slot Loop",
        name: "Fire Wave, White Domes & Seven Wonders Loop",
        distance: "5.1 km (3.2 mi) loop",
        elevation: "115 m (377 ft) gain",
        duration: "1h 30m – 1h 45m",
        allTrailsUrl: "https://www.alltrails.com/trail/us/nevada/fire-wave-white-domes-seven-wonders-loop",
        permitNote: "Included with $15 Valley of Fire State Park vehicle fee",
        permitUrl: "https://parks.nv.gov/parks/valley-of-fire",
        highlights: "Adds the narrow White Domes slot canyon and 1966 movie set stone ruins if she has extra energy.",
      },
    ],
    foodAndWater: [
      {
        time: "12:00 PM PT",
        kind: "Snacks & Water",
        name: "Walmart Supercenter #1560 (6005 S Eastern Ave, Las Vegas)",
        url: "https://www.walmart.com/store/1560-las-vegas-nv",
        mapUrl: "https://www.google.com/maps/search/?api=1&query=Walmart+Supercenter+6005+S+Eastern+Ave+Las+Vegas+NV+89119",
        notes: "8 mins east of LAS Car Rental. Grab a $18 backless booster cushion, cozy car blanket, 2.5-gal water jug, fresh berries, fruit pouches, granola bars, and road snacks.",
      },
      {
        time: "7:15 PM MT",
        kind: "Dinner",
        name: "River Rock Roasting Company (La Verkin)",
        url: "https://www.riverrockroasters.com/",
        mapUrl: "https://www.google.com/maps/search/?api=1&query=River+Rock+Roasting+Company+394+S+State+St+La+Verkin+UT+84745",
        notes: "2 mins from your La Quinta Inn: kid-friendly wood-fired pizzas, warm cinnamon rolls, sandwiches, and canyon views.",
      },
    ],
    sleepOptions: [
      {
        optionLabel: "Option 1 · BOOKED Hotel (Night 1 Confirmed)",
        name: "La Quinta Inn & Suites by Wyndham La Verkin - Gateway to Zion",
        type: "Hotel / Cabin",
        price: "BOOKED (Prepaid)",
        booked: true,
        url: "https://www.wyndhamhotels.com/laquinta/la-verkin-utah/la-quinta-inn-and-suites-la-verkin-gateway-to-zion/overview",
        mapUrl: "https://www.google.com/maps/search/?api=1&query=La+Quinta+Inn+Suites+101+E+500+N+La+Verkin+UT+84745",
        notes: "Confirmed Night 1 hotel at 101 E 500 N, La Verkin (20 mins from Zion South Gate) with heated pool/hot tub and free hot breakfast.",
      },
    ],
    nuances: [
      "Morning JFK Transfer & Flight: Leave Astoria Inn LaGuardia by Uber at 5:45 AM for JFK Terminal 8. Fly AA 2356 (7:59 AM JFK → 10:56 AM LAS).",
      "$18 Backless Booster Cushion at Walmart: Even though age 8 is legally exempt, a $18 backless booster keeps the SUV shoulder seatbelt comfortable and lifts your daughter 4 inches higher so she can see out the windows!",
      "Golden-Hour Timing at Valley of Fire: Sunset is 4:46 PM PST. Drive scenic Mouse's Tank Road ('The Highway' photo spot) to Lot #3 by 2:45 PM.",
    ],
  },
  2: {
    day: 2,
    date: "Tue, Nov 3, 2026",
    title: "Zion National Park (The Narrows in Kid's Drysuit!) → Mt. Carmel Tunnel → Canyon Overlook → East Zion Lodge",
    routeSummary: "La Verkin (7:00 AM River Rock Roasting Co) · 7:45 AM Zion South Gate (Buy $80 Pass + Pick up Kid's Drysuit at Zion Outfitter) · Zion Main Canyon · 3:00 PM Sol Foods Springdale · 3:45 PM Zion–Mt. Carmel Tunnel · 4:10 PM Canyon Overlook Sunset · East Zion / Kanab Hotel (~42–60 mi drive)",
    tempDay: "17°C – 19°C (63°F – 66°F)",
    tempNight: "3°C – 5°C (37°F – 41°F)",
    waterTemp: "10.5°C (51°F) in Virgin River (Drysuits keep you 100% dry & warm!)",
    sunrise: "7:04 AM MST",
    sunset: "5:27 PM MST",
    daylightHours: "10h 23m",
    timeZoneNote: "Mountain Standard Time (MST, UTC-7). Drive up through the 1.1-mile Zion–Mt. Carmel Tunnel at 3:45 PM so you hike Canyon Overlook in warm golden-hour light.",
    passAndPermitSummary: "Buy the $80 America the Beautiful Pass at the Zion South Entrance booth (covers your entire SUV at Zion, Bryce, Lake Powell, Grand Canyon, Sedona & Joshua Tree!).",
    kidFriendlyPick: "👧 8yo Daughter Highlight: Pick up her Kid's Full Drysuit Package ($59, fits ages 8–14) at Zion Outfitter right at the park entrance and do Option C (The Narrows)! Walking in the shallow river with a wooden staff in a head-to-toe waterproof drysuit is an 8-year-old's ultimate adventure. Also grab her FREE Zion Junior Ranger Badge at the Visitor Center! (Skip Angels Landing chains — too exposed for age 8).",
    hikes: [
      {
        optionLabel: "Option C · #1 Kid & Dad Favorite (River Slot Canyon Expedition!)",
        name: "Riverside Walk + The Zion Narrows (Wade 45–60 Mins Upstream & Back)",
        distance: "5.0 – 8.0 km (3.1 – 5.0 mi) flat out-and-back (turn around anytime!)",
        elevation: "65 m (210 ft) flat river walk",
        duration: "2h 30m – 3h 30m",
        allTrailsUrl: "https://www.alltrails.com/trail/us/utah/the-zion-narrows-riverside-walk",
        permitNote: "NO permit needed. Rent 1 Adult Dry Bib Package ($59) + 1 Kid's Full Drysuit Package ($59, ages 8–14) at Zion Outfitter right at the South Entrance bridge.",
        permitUrl: "https://zionoutfitter.com/product/kids-drysuit-package/",
        highlights: "Start on the paved 1.6 km Riverside Walk (spotting deer & squirrels), then step into the shallow Virgin River in your waterproof drysuits with wooden hiking sticks! Turn around whenever she's ready.",
      },
      {
        optionLabel: "Option B · Dry-Feet Canyon Views (Emerald Pools + Scout Lookout)",
        name: "Emerald Pools Trail OR West Rim to Walter's Wiggles / Scout Lookout",
        distance: "4.8 – 6.1 km (3.0 – 3.8 mi)",
        elevation: "190 – 338 m gain",
        duration: "2h 00m – 2h 45m",
        allTrailsUrl: "https://www.alltrails.com/trail/us/utah/scout-lookout-trail",
        permitNote: "100% permit-free (Skip the final Angels Landing chain spine with an 8yo)",
        highlights: "Walk under sparkling waterfalls at Emerald Pools or climb the paved switchbacks of Walter's Wiggles to Scout Lookout.",
      },
      {
        optionLabel: "Sunset Hike (4:10 PM – 5:25 PM · Fun 1-Hour Trail)",
        name: "Zion Canyon Overlook Trail",
        distance: "1.9 km (1.2 mi) round-trip",
        elevation: "50 m (163 ft) gain",
        duration: "45 – 60 mins",
        allTrailsUrl: "https://www.alltrails.com/trail/us/utah/canyon-overlook-trail",
        permitNote: "Included w/ $80 Pass; right outside the east end of the 1.1-mile tunnel",
        highlights: "Short, super fun trail through a cool shady fern alcove to a steel-railed viewpoint overlooking lower Zion Canyon at sunset (hold her hand along the sandstone ledges).",
      },
    ],
    foodAndWater: [
      {
        time: "7:00 AM",
        kind: "Coffee & Breakfast",
        name: "River Rock Roasting Co. + Davis Food & Drug (La Verkin)",
        url: "https://www.riverrockroasters.com/",
        mapUrl: "https://www.google.com/maps/search/?api=1&query=River+Rock+Roasting+Company+394+S+State+St+La+Verkin+UT+84745",
        notes: "Hot pastries, breakfast burritos, and espresso before heading 20 mins up to Zion.",
      },
      {
        time: "3:00 PM",
        kind: "Snacks & Water",
        name: "Sol Foods Supermarket & Deli (Springdale) + Bumbleberry Pie",
        url: "https://www.solfoods.com/",
        mapUrl: "https://www.google.com/maps/search/?api=1&query=Sol+Foods+Supermarket+995+Zion+Park+Blvd+Springdale+UT+84767",
        notes: "Grab fresh deli sandwiches, ice cream, and snacks after returning your Narrows drysuits at Zion Outfitter.",
      },
      {
        time: "6:15 PM",
        kind: "Dinner",
        name: "Cordwood at Buffalo Ranch · Thunderbird Restaurant ('Ho-Made' Pies) · Peekaboo Wood-Fired Pizza",
        url: "https://www.zmr.com/dining",
        mapUrl: "https://www.google.com/maps/search/?api=1&query=Cordwood+Restaurant+Zion+Mountain+Ranch+Mt+Carmel+UT",
        notes: "Watch real roaming buffalo outside Cordwood at Zion Mountain Ranch, eat homemade pie at Thunderbird Restaurant (Mt. Carmel Jct), or wood-fired pizza at Peekaboo Kitchen in Kanab.",
      },
    ],
    sleepOptions: [
      {
        optionLabel: "Pick 1 · Mt. Carmel Junction Hotel (On Route to Bryce + Outdoor Hot Tub)",
        name: "Best Western East Zion Thunderbird Lodge",
        type: "Hotel / Cabin",
        price: "~$125 – $155 / night",
        url: "https://www.thunderbirdutah.com/",
        mapUrl: "https://www.google.com/maps/search/?api=1&query=Best+Western+East+Zion+Thunderbird+Lodge+Mt+Carmel+Junction+UT",
        notes: "Right at the UT-9 / US-89 turnoff to Bryce Canyon (15 mins from Canyon Overlook) with attached pie diner and 10 mins from the Zion Mountain Ranch buffalo herd.",
      },
      {
        optionLabel: "Pick 2 · Kanab Boutique Hotel (Walkable to Pizza & Bakeries)",
        name: "Canyons Boutique Hotel — Kanab",
        type: "Hotel / Cabin",
        price: "~$135 – $175 / night",
        url: "https://www.canyonscollection.com/canyons-boutique-hotel/",
        mapUrl: "https://www.google.com/maps/search/?api=1&query=Canyons+Boutique+Hotel+121+W+Center+St+Kanab+UT+84741",
        notes: "Warm boutique hotel in Kanab, 2 minutes' walk from Peekaboo Canyon Wood Fired Pizza and Kanab Creek Bakery.",
      },
      {
        optionLabel: "Pick 3 · East Zion Ranch Cabin (Hot Tub, Mini-Golf & Buffalo Next Door)",
        name: "Zion Ponderosa Ranch Resort — Cabin Suite / Cowboy Cabin",
        type: "Hotel / Cabin",
        price: "~$109 – $165 / night",
        url: "https://www.zionponderosa.com/lodging/cowboy-cabins/",
        mapUrl: "https://www.google.com/maps/search/?api=1&query=Zion+Ponderosa+Ranch+Resort+Twin+Knolls+Rd+Orderville+UT",
        notes: "Heated log cabins on the East Rim with resort hot tub, bungee trampoline, and mini-golf that 8-year-olds love.",
      },
    ],
    nuances: [
      "How to Get the Kid's Full Drysuit at Zion Outfitter: Arrive at Zion Outfitter (right at the South Entrance pedestrian bridge) at 7:45 AM. They fit kids ages 8–14 with a full drysuit + grippy boots + wooden stick ($59).",
      "Zion Junior Ranger Badge: Stop at the Visitor Center desk so your daughter can pick up the free Junior Ranger booklet and get her official Zion badge!",
      "3:45 PM Tunnel Drive: Kids love driving through the 1.1-mile dark rock tunnel with giant windows looking out over the cliffs.",
    ],
  },
  3: {
    day: 3,
    date: "Wed, Nov 4, 2026",
    title: "East Zion → Red Canyon Rock Tunnels → Bryce Canyon Hoodoos → Indoor Heated Pool at Ruby's Inn",
    routeSummary: "East Zion · US-89 North · Red Canyon Arch Tunnels (UT-12) · 10:00 AM Ruby's Inn General Store · Bryce Canyon National Park · Sunset at Inspiration Point · Warm Hotel & Indoor Pool (~65 mi · ~1h 30m drive)",
    tempDay: "10°C (50°F) Crisp Mountain Sun",
    tempNight: "-6°C (21°F) Outside (Warm Hotel & Heated Indoor Pool Inside!)",
    sunrise: "7:03 AM MST",
    sunset: "5:24 PM MST",
    daylightHours: "10h 21m",
    timeZoneNote: "Mountain Standard Time (MST). Dress your daughter in her warm base layer, fleece, puffy jacket, beanie, and gloves for the 8,000-ft rim!",
    passAndPermitSummary: "Bryce Canyon entry ($35 value) is 100% FREE with your $80 America the Beautiful Pass.",
    kidFriendlyPick: "👧 8yo Daughter Highlight: Choose Option B (Two Bridges + Queen's Garden Loop — 5.3 km / 3.3 mi)! It is half the distance of the full Figure-8, and she gets to walk through magical tunnels carved straight through the orange hoodoo rocks and see 'Thor's Hammer' & 'Queen Victoria' rock! Afterward, earn her Bryce Junior Ranger Badge and swim in the heated indoor pool at Best Western Plus Ruby's Inn!",
    hikes: [
      {
        optionLabel: "Option B · #1 Kid-Friendly Bryce Hike (5.3 km · Rock Tunnels & Thor's Hammer!)",
        name: "Navajo Loop (Two Bridges) & Queen's Garden Combination Trail",
        distance: "5.3 km (3.3 mi) loop",
        elevation: "196 m (643 ft) gain",
        duration: "1h 45m – 2h 15m",
        allTrailsUrl: "https://www.alltrails.com/trail/us/utah/wall-street-and-queens-garden-loop-trail",
        permitNote: "FREE w/ $80 Pass · Start at Sunset Point (via Two Bridges since Wall Street is closed for winter) and exit at Sunrise Point",
        highlights: "The perfect distance for an 8-year-old at 8,000 ft: walk past Thor's Hammer, descend between towering red rock walls at Two Bridges, walk through 3 hand-carved rock tunnels in Queen's Garden, and climb gently back to Sunrise Point!",
      },
      {
        optionLabel: "Option A · Longer Figure-8 Loop (Only if She Wants More After Queen's Garden)",
        name: "Navajo Loop, Queen's Garden & Peekaboo Loop (Figure-8)",
        distance: "10.5 km (6.5 mi) loop",
        elevation: "446 m (1,466 ft) gain",
        duration: "3h 30m – 4h 00m",
        allTrailsUrl: "https://www.alltrails.com/trail/us/utah/wall-street-and-queens-garden-loop-to-peekaboo-loop-figure-eight-trail",
        permitNote: "FREE w/ $80 Pass · You can decide at the bottom of Queen's Garden whether to add the Peekaboo Loop",
        highlights: "Adds the steeper Peekaboo Loop past the Wall of Windows (often shares the trail with trail horses/mules!).",
      },
    ],
    foodAndWater: [
      {
        time: "10:00 AM",
        kind: "Snacks & Water",
        name: "Ruby's Inn General Store & Bakery (Bryce Canyon City)",
        url: "https://www.rubysinn.com/general-store/",
        mapUrl: "https://www.google.com/maps/search/?api=1&query=Rubys+Inn+General+Store+26+S+Main+St+Bryce+Canyon+City+UT+84764",
        notes: "1 mile before the park entrance: hot cocoa for your daughter, coffee for you, trail sandwiches, and souvenirs.",
      },
      {
        time: "5:45 PM",
        kind: "Dinner",
        name: "Bryce Canyon Pines (Famous Homemade Pies!) · I.D.K. Barbecue · Ruby's Inn Cowboy Buffet",
        url: "https://bcpines.com/",
        mapUrl: "https://www.google.com/maps/search/?api=1&query=Bryce+Canyon+Pines+Restaurant+Hwy+12+Milepost+10+Bryce+UT",
        notes: "Warm comfort food & homemade berry/chocolate pies at Bryce Canyon Pines (6 mins west) or right inside Ruby's Inn.",
      },
    ],
    sleepOptions: [
      {
        optionLabel: "Option 1 · #1 Kid Pick (Heated Indoor Pool & Hot Tub 1 Mile from Park Gate!)",
        name: "Best Western Plus Ruby's Inn",
        type: "Hotel / Cabin",
        price: "~$115 – $145 / night",
        url: "https://www.rubysinn.com/",
        mapUrl: "https://www.google.com/maps/search/?api=1&query=Best+Western+Plus+Rubys+Inn+26+S+Main+St+Bryce+Canyon+City+UT+84764",
        notes: "Warm lodge rooms with a large heated indoor swimming pool & hot tub — only 5 minutes from Sunrise Point for Thursday morning's sunrise!",
      },
      {
        optionLabel: "Option 2 · Cozy Cabins in Tropic (1,700 ft Lower & Warmer)",
        name: "Bryce Pioneer Village (Tropic, UT)",
        type: "Hotel / Cabin",
        price: "~$95 – $125 / night",
        url: "https://brycepioneervillage.com/",
        mapUrl: "https://www.google.com/maps/search/?api=1&query=Bryce+Pioneer+Village+80+S+Main+St+Tropic+UT+84776",
        notes: "Cozy heated cabins 12 mins down the mountain in Tropic where temperatures are 5°C warmer.",
      },
    ],
    nuances: [
      "Red Canyon Rock Tunnels on UT-12: Have your daughter look out the front windshield as you drive right through the two red-rock arches carved over the highway!",
      "Wall Street vs. Two Bridges: Wall Street slot is closed for winter freeze safety, so take the Two Bridges path at Sunset Point — it connects to the exact same Queen's Garden trail.",
    ],
  },
  4: {
    day: 4,
    date: "Thu, Nov 5, 2026",
    title: "Bryce Sunrise → Kanab Creek Bakery → Toadstool 'Mushroom' Rocks & Slot Canyon → Horseshoe Bend → Page Hotel",
    routeSummary: "6:58 AM Sunrise at Bryce Rim · Kanab Creek Bakery · Midday Kid-Friendly Slot Canyon & Toadstool Hoodoos · Glen Canyon Dam Overlook · Horseshoe Bend Sunset · Page, AZ Hotel (~155 mi · ~3h 15m drive)",
    tempDay: "17°C – 19°C (63°F – 66°F) in Kanab & Page",
    tempNight: "7°C – 10°C (45°F – 50°F) in Page",
    sunrise: "6:58 AM MST (Bryce Sunrise Point)",
    sunset: "5:22 PM MST (Horseshoe Bend)",
    daylightHours: "10h 18m",
    timeZoneNote: "Both Utah and Page, Arizona are on Mountain Standard Time (MST, UTC-7) in November — zero clock change today!",
    passAndPermitSummary: "Glen Canyon Dam Overlook is FREE w/ your $80 Pass. Toadstool Hoodoos & Willis Creek are FREE ($0). Horseshoe Bend is $10 parking at the City of Page gate.",
    kidFriendlyPick: "👧 8yo Daughter Highlight: Kids go crazy for Toadstool Hoodoos (2.9 km easy walk right off paved US-89) — it looks like giant red-and-white Super Mario mushroom rocks! Pair it with Willis Creek Slot Canyon (or Wire Pass if dry) and French croissants at Kanab Creek Bakery!",
    hikes: [
      {
        optionLabel: "Option C · #1 Kid Favorite (Giant Mushroom Rocks Right on Paved Highway US-89!)",
        name: "Toadstool Hoodoos Trail",
        distance: "2.9 km (1.8 mi) round-trip",
        elevation: "34 m (111 ft) easy walk",
        duration: "45 – 60 mins",
        allTrailsUrl: "https://www.alltrails.com/trail/us/utah/toadstool-hoodoos-trail",
        permitNote: "100% FREE — paved parking lot directly on Highway US-89 (30 mins before Page)",
        highlights: "A fun, easy treasure-hunt walk to giant red boulders balanced on skinny white rock stems like giant desert mushrooms!",
      },
      {
        optionLabel: "Option B · Easy Flat Slot Canyon Walk (Zero Ladders)",
        name: "Willis Creek Slot Canyon (Short Trail)",
        distance: "4.3 km (2.7 mi) round-trip",
        elevation: "55 m (180 ft) gentle walk",
        duration: "1h 00m – 1h 30m",
        allTrailsUrl: "https://www.alltrails.com/trail/us/utah/willis-creek-short-trail",
        permitNote: "100% FREE — 25 mins from Bryce Canyon near Cannonville",
        highlights: "Walk between narrow, sculpted golden canyon walls alongside a tiny shallow stream with zero steep climbing.",
      },
      {
        optionLabel: "Option A · Deeper Adventure Slot Canyon (Has 8-ft Boulder/Ladder Drop)",
        name: "Wire Pass Slot Canyon to Buckskin Gulch Petroglyphs",
        distance: "5.6 km (3.5 mi) round-trip",
        elevation: "73 m (240 ft) gain",
        duration: "2h 00m",
        allTrailsUrl: "https://www.alltrails.com/trail/us/utah/wire-pass-trail",
        permitNote: "$6 Adult Permit on Recreation.gov (Kids under 16 are FREE!). Dry weather only.",
        permitUrl: "https://www.recreation.gov/activitypass/10006177",
        highlights: "Narrow slot canyon leading to ancient rock petroglyphs at the Buckskin Gulch confluence (spot/lift your daughter down the 8-ft ladder drop inside the slot).",
      },
      {
        optionLabel: "Sunset Walk (4:15 PM – 5:30 PM)",
        name: "Horseshoe Bend Overlook Trail",
        distance: "2.4 km (1.5 mi) round-trip",
        elevation: "58 m (190 ft) wide path",
        duration: "45 – 60 mins",
        allTrailsUrl: "https://www.alltrails.com/trail/us/arizona/horseshoe-bend-trail",
        permitNote: "$10 per vehicle at City of Page parking booth",
        permitUrl: "https://www.pageaz.gov/268/Horseshoe-Bend",
        highlights: "Wide path with shaded benches leading to the fenced viewing platform 1,000 ft above the emerald Colorado River bend (stay inside the main railed platform with your daughter).",
      },
    ],
    foodAndWater: [
      {
        time: "8:45 AM",
        kind: "Coffee & Breakfast",
        name: "Kanab Creek Bakery (Kanab, UT)",
        url: "https://www.kanabcreekbakery.com/",
        mapUrl: "https://www.google.com/maps/search/?api=1&query=Kanab+Creek+Bakery+238+W+Center+St+Kanab+UT+84741",
        notes: "Warm chocolate croissants, sweet pastries, fruit smoothies, and espresso after leaving chilly Bryce Canyon.",
      },
      {
        time: "6:00 PM",
        kind: "Dinner",
        name: "Big John's Texas BBQ (Live Music & Yard Games!) · The BirdHouse (Crispy Chicken & Honey Biscuits)",
        url: "https://bigjohnstexasbbq.com/",
        mapUrl: "https://www.google.com/maps/search/?api=1&query=Big+Johns+Texas+BBQ+153+S+Lake+Powell+Blvd+Page+AZ+86040",
        notes: "Kids love Big John's patio (live music, cornhole & giant Jenga!) or The BirdHouse for honey-butter biscuits and crispy chicken tenders.",
      },
    ],
    sleepOptions: [
      {
        optionLabel: "Option 1 · Upscale Modern Hotel in Page (8 Mins from Antelope Canyon)",
        name: "Hyatt Place Page / Lake Powell",
        type: "Hotel / Cabin",
        price: "~$135 – $170 / night",
        url: "https://www.hyatt.com/hyatt-place/en-US/pgezp-hyatt-place-page-lake-powell",
        mapUrl: "https://www.google.com/maps/search/?api=1&query=Hyatt+Place+Page+Lake+Powell+1126+N+Navajo+Dr+Page+AZ+86040",
        notes: "Spacious rooms with cozy sofa-sleeper, outdoor pool, hot breakfast, and views of the red mesas.",
      },
      {
        optionLabel: "Option 2 · Family Favorite w/ Indoor Heated Pool & Hot Tub",
        name: "Country Inn & Suites by Radisson — Page, AZ",
        type: "Hotel / Cabin",
        price: "~$95 – $125 / night",
        url: "https://www.choicehotels.com/arizona/page/country-inn-suites-hotels/az396",
        mapUrl: "https://www.google.com/maps/search/?api=1&query=Country+Inn+Suites+880+S+Coppermine+Rd+Page+AZ+86040",
        notes: "2 minutes from Horseshoe Bend with a warm indoor swimming pool, hot tub, and complimentary hot waffle breakfast.",
      },
    ],
    nuances: [
      "Bryce Sunrise Warmth Tip: You can park right at Sunrise Point, step out for 15 minutes in your warm jackets as the hoodoos light up at 6:58 AM, and hop right back into the heated SUV!",
      "Horseshoe Bend Safety: Stay at the main steel-railed viewing deck at the center of Horseshoe Bend where it's 100% fenced for kids.",
    ],
  },
  5: {
    day: 5,
    date: "Fri, Nov 6, 2026",
    title: "Page (9:15 AM Antelope Canyon Tour & Crepes) → Forrest Gump Point → Monument Valley 17-Mile Drive & View Cabins",
    routeSummary: "8:00 AM Canyon Crepes Cafe (Page) · 9:15 AM Guided Antelope Canyon Tour · Forrest Gump Point (US-163) · Monument Valley 17-Mile Scenic Drive (Enter before 2:30 PM!) · Sunset over the Mittens (~125 mi · ~2h 15m drive)",
    tempDay: "15°C – 18°C (59°F – 64°F)",
    tempNight: "5°C – 8°C (41°F – 46°F)",
    sunrise: "6:57 AM MST",
    sunset: "5:17 PM MST (Monument Valley Mittens)",
    daylightHours: "10h 20m",
    timeZoneNote: "Mountain Standard Time (MST, UTC-7) all day. Zero clock change between Page and Monument Valley in November.",
    passAndPermitSummary: "Antelope Canyon requires a pre-booked Navajo guided tour (1 Adult + 1 Child age 8). Monument Valley entry is $8/person at the gate.",
    kidFriendlyPick: "👧 8yo Daughter Highlight: Start with sweet Nutella/berry crepes at Canyon Crepes Cafe before walking through the glowing orange waves of Antelope Canyon! At Monument Valley, do Option B (the 17-Mile Scenic SUV Drive) rather than the long 8.7 km sandy hike — she can see the Navajo horses at John Ford's Point and watch sunset right from your cabin balcony at The View or swim in the indoor pool at Goulding's Lodge!",
    hikes: [
      {
        optionLabel: "9:15 AM · Mandatory Navajo-Guided Slot Canyon Tour (Page, AZ)",
        name: "Lower Antelope Canyon (Ken's / Dixie's) OR Upper Antelope Canyon",
        distance: "1.8 km (1.1 mi) guided slot walk",
        elevation: "Fun steel staircases (Lower) or flat sandy floor + 4x4 truck ride (Upper)",
        duration: "1h 15m – 1h 30m",
        allTrailsUrl: "https://www.alltrails.com/trail/us/arizona/lower-antelope-canyon",
        permitNote: "Book 1 Adult + 1 Child (Age 8) for ~9:15 AM: Ken's Tours (https://www.lowerantelope.com/), Dixie's (https://www.antelopecanyon.az/), or Upper Antelope (https://navajotours.com/).",
        permitUrl: "https://www.lowerantelope.com/",
        highlights: "Navajo guides point out hidden shapes in the swirling purple-and-orange rock walls (sharks, eagles, dragons, and hearts) and help take awesome father-daughter photos!",
      },
      {
        optionLabel: "Monument Valley Option B · #1 Kid-Friendly Pick (17-Mile Valley Drive)",
        name: "17-Mile Scenic Valley Drive (John Ford's Point, Three Sisters & Totem Pole)",
        distance: "27.4 km (17.0 mi) scenic loop drive + short viewpoint walks",
        elevation: "Minimal walking — hop out at every viewpoint",
        duration: "1h 45m – 2h 15m (Enter before 2:30 PM winter cutoff!)",
        allTrailsUrl: "https://www.alltrails.com/trail/us/arizona/monument-valley-scenic-drive--2",
        permitNote: "Included w/ $8 Monument Valley entry; last entry onto the loop road is 2:30 PM in November",
        permitUrl: "https://navajonationparks.org/navajo-tribal-parks/monument-valley/",
        highlights: "Drive right among the towering 1,000-foot red rock mittens, stop for Navajo frybread and horse photos at John Ford's Point, and hear the echo at Artist's Point!",
      },
      {
        optionLabel: "Monument Valley Option A · Foot Trail Option",
        name: "Wildcat Trail (Around West Mitten Butte)",
        distance: "8.7 km (5.4 mi) sandy loop",
        elevation: "118 m (387 ft) gain",
        duration: "2h 15m",
        allTrailsUrl: "https://www.alltrails.com/trail/us/arizona/wildcat-trail",
        permitNote: "Open 8:00 AM – 5:00 PM from Visitor Center lot",
        highlights: "Walk the first 15–20 minutes down from the Visitor Center for up-close photos of West Mitten Butte without having to do the whole 8.7 km deep-sand loop.",
      },
    ],
    foodAndWater: [
      {
        time: "7:45 AM",
        kind: "Coffee & Breakfast",
        name: "Canyon Crepes Cafe · LP Espresso (Page, AZ)",
        url: "https://www.google.com/maps/search/?api=1&query=Canyon+Crepes+Cafe+Page+AZ",
        mapUrl: "https://www.google.com/maps/search/?api=1&query=Canyon+Crepes+Cafe+Page+AZ",
        notes: "Fresh sweet berry/Nutella crepes for your daughter and savory egg crepes & espresso for you before your 8:30 AM Antelope Canyon check-in.",
      },
      {
        time: "5:45 PM",
        kind: "Dinner",
        name: "The View Restaurant · Goulding's Stagecoach Dining Room",
        url: "https://monumentvalleyview.com/dining/",
        mapUrl: "https://www.google.com/maps/search/?api=1&query=The+View+Restaurant+Monument+Valley+UT",
        notes: "Warm dinner overlooking the Mittens at dusk (kids love warm Navajo frybread drizzled with honey!).",
      },
    ],
    sleepOptions: [
      {
        optionLabel: "Option 1 · Wake Up Facing the Mittens from Your Balcony / Cabin",
        name: "The View Hotel & Premium Valley Rim Cabins",
        type: "Hotel / Cabin",
        price: "~$215 – $265 / night",
        url: "https://monumentvalleyview.com/",
        mapUrl: "https://www.google.com/maps/search/?api=1&query=The+View+Hotel+Monument+Valley+Navajo+Tribal+Park+AZ",
        notes: "Every room and private wooden cabin sits right on the cliff rim facing the Three Mittens — you and your daughter can watch Saturday's 6:52 AM sunrise from your warm balcony in pajamas!",
      },
      {
        optionLabel: "Option 2 · Historic Red-Rock Lodge w/ Heated Indoor Pool & Western Movie Museum",
        name: "Goulding's Lodge (Monument Valley)",
        type: "Hotel / Cabin",
        price: "~$160 – $205 / night",
        url: "https://www.gouldings.com/",
        mapUrl: "https://www.google.com/maps/search/?api=1&query=Gouldings+Lodge+1000+Gouldings+Trading+Post+Rd+Oljato-Monument+Valley+UT+84536",
        notes: "10 mins across the valley with a heated indoor pool, free John Wayne Western movie museum, and private balconies facing the buttes.",
      },
    ],
    nuances: [
      "No Backpacks Inside Antelope Canyon: Leave bags in your locked SUV trunk — carry only your phones and water bottles.",
      "Beat the 2:30 PM Monument Valley Loop Cutoff: Leaving Page at 11:00 AM puts you at Monument Valley by 1:15 PM, well before the 2:30 PM winter gate cutoff for the 17-Mile Drive.",
    ],
  },
};
