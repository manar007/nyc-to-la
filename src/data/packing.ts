export type PackingCategory =
  | "marathon"
  | "recovery"
  | "hiking"
  | "camping"
  | "ocean-general";

export type PackingSource =
  | "carry-on"
  | "checked-bag"
  | "buy-in-vegas"
  | "rent-in-zion";

export type PackingItem = {
  id: string;
  name: string;
  category: PackingCategory;
  source: PackingSource;
  essential: boolean;
  detail: string;
  link?: {
    label: string;
    url: string;
  };
};

export type PackingCategoryMeta = {
  id: PackingCategory;
  label: string;
  shortLabel: string;
  subtitle: string;
};

export const PACKING_STORAGE_KEY = "sw-roadtrip-packing-v2";

export const PACKING_CATEGORIES: PackingCategoryMeta[] = [
  {
    id: "marathon",
    label: "NYC Marathon Race Day (Nov 1 — 3:20 Target)",
    shortLabel: "NYC Marathon",
    subtitle:
      "Sunday Nov 1 · ~4:44/km target pace · Pack all race-critical gear in your Carry-On.",
  },
  {
    id: "recovery",
    label: "Post-Race Flight & Active Recovery (Nov 2 JFK ➔ LAS)",
    shortLabel: "Flight & Recovery",
    subtitle:
      "Monday Nov 2 · AA 2356 (7:59 AM JFK → 10:56 AM LAS) · Flush marathon legs on the 6h flight & SUV drive.",
  },
  {
    id: "hiking",
    label:
      "Father & Daughter Canyon Hiking Gear (Zion, Bryce 8,000 ft, Grand Canyon, Sedona)",
    shortLabel: "Canyon Hiking",
    subtitle:
      "10.5°C Narrows river wading (Adult Dry Bib + Kid's Full Drysuit), 0°C Bryce sunrise layers & grippy shoes.",
  },
  {
    id: "camping",
    label:
      "8-Year-Old Daughter & SUV Road-Trip Kit (Vegas Walmart #1560 & Junior Ranger)",
    shortLabel: "8yo Daughter & Road Kit",
    subtitle:
      "35-min stop at Walmart Supercenter (6005 S Eastern Ave, 8 mins from LAS) for booster cushion, road snacks & kid comfort.",
  },
  {
    id: "ocean-general",
    label: "Pacific Ocean Swimming, Heated Hotel Pools & Critical Documents",
    shortLabel: "Ocean, Pools & Docs",
    subtitle:
      "Swimsuits for heated hotel pools + Laguna 1,000 Steps, Crystal Cove & Malibu El Matador (22°C water) + travel docs.",
  },
];

export function sourceLabel(source: PackingSource): string {
  switch (source) {
    case "carry-on":
      return "Carry-On";
    case "checked-bag":
      return "Checked Bag";
    case "buy-in-vegas":
      return "Buy in Vegas (Day 1)";
    case "rent-in-zion":
      return "Rent in Zion";
  }
}

export function categoryLabel(category: PackingCategory): string {
  return (
    PACKING_CATEGORIES.find((c) => c.id === category)?.shortLabel ?? category
  );
}

export const PACKING_ITEMS: PackingItem[] = [
  {
    id: "marathon-race-shoes",
    name: "Carbon-plated race shoes (broken in)",
    category: "marathon",
    source: "carry-on",
    essential: true,
    detail:
      "Broken-in marathon super shoes tuned for 4:44/km (3:20 finish). MUST go in Carry-On bag — never check race shoes!",
  },
  {
    id: "marathon-kit-singlet-shorts",
    name: "Race singlet & half-tights / marathon shorts",
    category: "marathon",
    source: "carry-on",
    essential: true,
    detail:
      "Chafe-tested in long progression runs at 4:44/km marathon pace with pockets for 6–7 gels + bib number pins/magnets.",
  },
  {
    id: "marathon-socks",
    name: "Race socks (anti-blister technical socks + 1 spare pair)",
    category: "marathon",
    source: "carry-on",
    essential: true,
    detail:
      "Synthetic/merino anti-blister crew or quarter socks plus a dry backup pair for start village conditions.",
  },
  {
    id: "marathon-fueling-kit",
    name: "Fueling kit: 6–7 high-carb gels, Mile 18 caffeine gel & salt tabs",
    category: "marathon",
    source: "carry-on",
    essential: true,
    detail:
      "Target 60–80g carbs/hr for 3:20 (~220g total) + 1 caffeinated gel before the Queensboro Bridge / First Ave push at Mile 16–18.",
  },
  {
    id: "marathon-garmin-hrm",
    name: "Garmin GPS watch + USB charging cable + HRM chest strap",
    category: "marathon",
    source: "carry-on",
    essential: true,
    detail:
      "Pre-load manual kilometer/mile pace alerts (4:44/km) since tall Manhattan buildings & bridges can skew instant GPS pace.",
  },
  {
    id: "marathon-throwaway-warm-clothes",
    name: "Staten Island Ferry & Start Village throwaway warm clothes",
    category: "marathon",
    source: "checked-bag",
    essential: true,
    detail:
      "Old hoodie, sweatpants, mylar blanket, cheap gloves, and warm hat to stay warm during the Fort Wadsworth corral wait.",
  },
  {
    id: "marathon-antichafe-nipple-tape",
    name: "Anti-chafe balm (Body Glide / Squirrel's Nut Butter) + waterproof tape",
    category: "marathon",
    source: "carry-on",
    essential: true,
    detail:
      "Apply generously before boarding the ferry; keeps skin protected so your hiking daypack straps don't chafe later.",
  },
  {
    id: "marathon-expo-passport-bag",
    name: "Passport + Javits Expo confirmation QR + post-race gear bag",
    category: "marathon",
    source: "carry-on",
    essential: true,
    detail:
      "Required for NYRR bib pick-up at Javits Center and Central Park post-race walk-off recovery layer.",
  },
  {
    id: "recovery-compression-socks",
    name: "Knee-high graduated compression socks (20–30 mmHg)",
    category: "recovery",
    source: "carry-on",
    essential: true,
    detail:
      "Put on Monday morning before AA 2356 (7:59 AM JFK → 10:56 AM LAS) to prevent post-marathon calf swelling & blood pooling.",
  },
  {
    id: "recovery-slides",
    name: "Cushioned recovery slides / sandals (Hoka Ora / Oofos)",
    category: "recovery",
    source: "carry-on",
    essential: true,
    detail:
      "Let swollen feet breathe through JFK TSA, on the plane, at the LAS rental counter, and around hotel pools.",
  },
  {
    id: "recovery-lacrosse-ball-roller",
    name: "Lacrosse ball / mini massage roller for calves, quads & feet",
    category: "recovery",
    source: "carry-on",
    essential: true,
    detail:
      "Zero cabin weight; roll out tight soles, calves, and glutes in the hotel room each evening.",
  },
  {
    id: "recovery-electrolytes-magnesium",
    name: "Electrolyte drink mixes (LMNT / Liquid I.V.) + Magnesium Glycinate",
    category: "recovery",
    source: "carry-on",
    essential: true,
    detail:
      "High-sodium hydration packets for post-marathon + dry Colorado Plateau air, plus Magnesium before sleep.",
  },
  {
    id: "recovery-blister-care-kit",
    name: "Family first-aid & blister kit (Compeed plasters, Band-Aids, kids pain reliever)",
    category: "recovery",
    source: "carry-on",
    essential: true,
    detail:
      "Compeed hydrocolloid blister plasters for marathon toes + kid-friendly Band-Aids, antiseptic wipes, and children's ibuprofen/acetaminophen.",
  },
  {
    id: "hiking-zion-narrows-adult-kid-drysuit",
    name: "Zion Narrows Rental: 1 Adult Dry Bib ($59) + 1 Kid's Full Drysuit Package ($59, Age 8+)",
    category: "hiking",
    source: "rent-in-zion",
    essential: true,
    detail:
      "Virgin River water is 10.5°C (51°F). Zion Outfitter's Kid's Full Drysuit (fits ages 8–14) has waterproof wrist & ankle seals, canyoneering boots, neoprene socks & a kid-sized wooden stick so your 8yo stays 100% warm and dry!",
    link: {
      label: "Zion Outfitter Kid's Drysuit ($59)",
      url: "https://zionoutfitter.com/product/kids-drysuit-package/",
    },
  },
  {
    id: "hiking-trail-shoes-both",
    name: "Grippy trail shoes / hiking sneakers (for both you & your 8yo daughter)",
    category: "hiking",
    source: "checked-bag",
    essential: true,
    detail:
      "Good rubber tread for Zion Canyon Overlook slickrock, Bryce Queen's Garden tunnels, Horseshoe Bend, and Sedona red rocks.",
  },
  {
    id: "hiking-daypack-hydration",
    name: "20L–24L hiking daypack + two 1L water bottles (plus spill-proof bottle for daughter)",
    category: "hiking",
    source: "carry-on",
    essential: true,
    detail:
      "Carry water, extra layers, and trail snacks for both of you so your daughter can hike hands-free without a heavy pack.",
  },
  {
    id: "hiking-warm-layers-both",
    name: "Outer & Mid Layers (Each): 1 Packable Down Puffy + 1 Wind/Rain Shell + 2 Fleece/Hoodies + 1 Thermal Base Set",
    category: "hiking",
    source: "checked-bag",
    essential: true,
    detail:
      "The 3-climate 'Onion System': wear all 4 layers at 0°C Bryce/Grand Canyon sunrise, peel down to a t-shirt by 2:00 PM! Also wear the thermal leggings + fleece underneath your Zion Narrows drysuits (never wear jeans under a drysuit).",
  },
  {
    id: "hiking-tops-bottoms-dad",
    name: "Dad's Hiking & Road Clothes: 5 Technical Tees + 2 Long-Sleeve Sun Shirts + 2 Hiking Pants + 2 Shorts",
    category: "hiking",
    source: "checked-bag",
    essential: true,
    detail:
      "Plus 1 pair of jeans/chinos + 2 casual shirts for dinners, 8 pairs underwear, and 6 pairs merino/synthetic hiking socks (plan 1 quick 45-min hotel laundry load in Page or Goulding's!).",
  },
  {
    id: "hiking-clothes-daughter",
    name: "8yo Daughter's Clothes: 6 Tees + 2 Long-Sleeve Tops + 4 Leggings/Joggers + 2 Shorts/Skorts + 2 Cozy Pajamas",
    category: "hiking",
    source: "checked-bag",
    essential: true,
    detail:
      "Plus 1 pair of fleece-lined leggings (for Bryce Canyon & under her Narrows drysuit), 1 cute outfit for Santa Monica/Laguna dinners, 8 pairs underwear, and 7 pairs warm crew socks.",
  },
  {
    id: "hiking-beanie-gloves-both",
    name: "Warm Beanies (1 each), Neck Buffs (1 each) & Gloves (1 pair each — Adult + Kid sizes)",
    category: "hiking",
    source: "checked-bag",
    essential: true,
    detail:
      "Keeps ears and fingers warm during Bryce Canyon sunrise (0°C), Monument Valley breeze, and Canyon Overlook sunset.",
  },
  {
    id: "hiking-headlamps-two",
    name: "2 Headlamps (1 for you + 1 fun headlamp for your daughter!)",
    category: "hiking",
    source: "carry-on",
    essential: true,
    detail:
      "8-year-olds love wearing their own headlamp inside the Bryce hoodoo tunnels, Sedona caves, and sunset walks.",
  },
  {
    id: "hiking-drybag-phone-pouch",
    name: "Small dry bag (5L–10L) + waterproof phone pouch lanyard",
    category: "hiking",
    source: "checked-bag",
    essential: true,
    detail:
      "Keeps camera, extra fleece, snacks, and rental SUV key fob dry while wading in The Narrows.",
  },
  {
    id: "hiking-sun-protection",
    name: "Sunglasses, sun hats, SPF 50 sunscreen & moisturizing lip balm (for both!)",
    category: "hiking",
    source: "carry-on",
    essential: true,
    detail:
      "Desert air is 15% humidity — keep lip balm and hand lotion in the SUV console so your daughter's lips don't chap.",
  },
  {
    id: "kid-walmart-booster-cushion",
    name: "Backless Booster Seat Cushion (~$18 Cosco Topside at Vegas Walmart)",
    category: "camping",
    source: "buy-in-vegas",
    essential: true,
    detail:
      "Grab on Day 1 at Walmart Supercenter (6005 S Eastern Ave, 8 mins from LAS). Keeps the SUV shoulder belt off her neck AND boosts her 4 inches higher so she can easily see all the canyons & wildlife out the window!",
    link: {
      label: "Walmart #1560 Eastern Ave (Map)",
      url: "https://www.google.com/maps/search/?api=1&query=Walmart+Supercenter+6005+S+Eastern+Ave+Las+Vegas+NV+89119",
    },
  },
  {
    id: "kid-walmart-snacks-water",
    name: "2.5-gal water jug + Kid's favorite road snacks (berries, apple pouches, granola bars, pretzels)",
    category: "camping",
    source: "buy-in-vegas",
    essential: true,
    detail:
      "Stock the SUV backseat organizer at Walmart on Day 1 so she always has snacks and drinks between national parks.",
    link: {
      label: "Walmart #1560 Eastern Ave (Map)",
      url: "https://www.google.com/maps/search/?api=1&query=Walmart+Supercenter+6005+S+Eastern+Ave+Las+Vegas+NV+89119",
    },
  },
  {
    id: "kid-cozy-car-blanket-pillow",
    name: "Cozy fleece car-nap throw blanket + travel neck pillow (~$12 at Walmart)",
    category: "camping",
    source: "buy-in-vegas",
    essential: true,
    detail:
      "For cozy backseat naps during afternoon highway drives (like the desert drive to Laguna Beach on Day 8).",
  },
  {
    id: "kid-junior-ranger-passport",
    name: "National Park 'Junior Ranger' Activity Booklets & Stamp Passport",
    category: "camping",
    source: "buy-in-vegas",
    essential: true,
    detail:
      "Ask the ranger desk at Zion (Day 2), Bryce (Day 3), Glen Canyon (Day 4), and Grand Canyon (Day 6) for the FREE Junior Ranger booklet — she gets sworn in and earns an official Junior Ranger Badge at every park!",
    link: {
      label: "NPS Junior Ranger Program",
      url: "https://www.nps.gov/kids/become-a-junior-ranger.htm",
    },
  },
  {
    id: "kid-ipad-headphones-offline",
    name: "iPad / Tablet + Kid headphones + downloaded Disney/Netflix shows & audiobooks",
    category: "camping",
    source: "carry-on",
    essential: true,
    detail:
      "Pre-download offline movies/stories over Wi-Fi for the 6-hour JFK→LAS flight, the 10-hour LAX→FRA flight, and desert highway stretches.",
  },
  {
    id: "kid-car-charger-wipes",
    name: "12V dual USB-C car charger + 20,000mAh power bank + wet hand wipes",
    category: "camping",
    source: "carry-on",
    essential: true,
    detail:
      "Keeps phones and tablet charged on the road, plus wet wipes for sticky hands after ice cream, BBQ, and beach tide pools.",
  },
  {
    id: "ocean-swimsuits-goggles",
    name: "Swimwear: 2 Swimsuits for Daughter + 2 Swim Trunks for Dad + Kid's Swim Goggles",
    category: "ocean-general",
    source: "checked-bag",
    essential: true,
    detail:
      "Bring 2 swimsuits each so nobody ever has to put on a cold, damp swimsuit the next day! Used at heated hotel pools (La Quinta, Ruby's Inn Bryce, Page, Goulding's, Laguna) AND in the 22.3°C (72°F) Pacific Ocean.",
  },
  {
    id: "ocean-towels-watershoes",
    name: "2 Quick-dry beach towels + flip-flops / water sandals for tide pools",
    category: "ocean-general",
    source: "checked-bag",
    essential: true,
    detail:
      "Protects feet while exploring starfish & crabs in the rocky tide pools at Laguna Beach (Heisler Park / 1,000 Steps) and El Matador sea caves.",
  },
  {
    id: "ocean-casual-clothes-both",
    name: "11-day casual clothes rotation + warm hoodies for Santa Monica Pier evening",
    category: "ocean-general",
    source: "checked-bag",
    essential: true,
    detail:
      "Comfortable outfits plus cozy sweaters for riding the Pacific Park Ferris wheel & roller coaster on Santa Monica Pier at sunset.",
  },
  {
    id: "docs-passports-both",
    name: "Passports (Both You & Your Daughter) + Child Travel Consent / Birth Certificate Copy",
    category: "ocean-general",
    source: "carry-on",
    essential: true,
    detail:
      "Carry both passports + a signed international travel consent note from mom (standard border/airline check when one parent flies internationally with a child on LH 457 LAX → FRA → EVN).",
  },
  {
    id: "docs-license-credit-card",
    name: "Physical Driver's License + Physical Credit Card in driver's name",
    category: "ocean-general",
    source: "carry-on",
    essential: true,
    detail:
      "Required at the LAS rental counter for your confirmed $466.67 Midsize SUV booking (Nov 2 11:30 AM LAS → Nov 12 11:30 AM LAX).",
  },
  {
    id: "docs-america-the-beautiful-pass",
    name: "America the Beautiful Interagency National Park Pass ($80)",
    category: "ocean-general",
    source: "buy-in-vegas",
    essential: true,
    detail:
      "Buy at the Zion South Entrance booth on Day 2 morning — one $80 pass covers the entire SUV (both you and your daughter) at Zion, Bryce, Lake Powell, Grand Canyon, Sedona & Joshua Tree!",
    link: {
      label: "NPS Interagency Pass Info",
      url: "https://www.nps.gov/planyourvisit/passes.htm",
    },
  },
  {
    id: "docs-offline-maps",
    name: "Offline maps downloaded on phone: Google Maps Offline (NV/UT/AZ/CA) + AllTrails",
    category: "ocean-general",
    source: "carry-on",
    essential: true,
    detail:
      "Zero cell reception inside Valley of Fire, Zion Canyon, Monument Valley & Oak Creek Canyon. Download over hotel Wi-Fi.",
  },
];
