export const MAP = {
  width: 1000,
  height: 560,
  west: -120.2,
  east: -109.2,
  north: 38.4,
  south: 32.4,
} as const;

export function project(lat: number, lng: number) {
  const x = ((lng - MAP.west) / (MAP.east - MAP.west)) * MAP.width;
  const y = ((MAP.north - lat) / (MAP.north - MAP.south)) * MAP.height;
  return { x, y };
}

/**
 * Simplified regional outline of the Southwest & Southern California
 * (CA Pacific coast, US-Mexico border, AZ/NM border, UT/CO border, and northern frame).
 */
export const US_OUTLINE: [number, number][] = [
  // Point Conception / Santa Barbara / Ventura / Malibu
  [34.45, -120.05],
  [34.4, -119.7],
  [34.27, -119.29],
  [34.03, -118.87],
  [34.0, -118.8],
  // Santa Monica / South Bay / Palos Verdes / Long Beach
  [34.01, -118.5],
  [33.88, -118.41],
  [33.74, -118.41],
  [33.77, -118.19],
  // Orange County / Laguna Beach / San Clemente / Oceanside / San Diego
  [33.6, -117.9],
  [33.54, -117.79],
  [33.42, -117.62],
  [33.2, -117.39],
  [32.85, -117.28],
  [32.53, -117.12],
  // US-Mexico Border (CA & AZ)
  [32.72, -114.72],
  [32.49, -114.81],
  [32.4, -114.5],
  [32.4, -109.05],
  // Eastern border (AZ/NM & UT/CO at ~109.05°W)
  [37.0, -109.05],
  [38.35, -109.05],
  // Northern frame across Utah, Nevada, and Eastern Sierra
  [38.35, -114.05],
  [38.35, -118.5],
  [37.5, -119.5],
  [35.5, -120.05],
  [34.45, -120.05],
];

/**
 * Simplified state borders within the Southwest region (CA, NV, UT, AZ).
 */
export const STATE_LINES: [number, number][][] = [
  // CA - NV border (diagonal from Lake Tahoe area to Colorado River at Needles)
  [
    [38.35, -119.3],
    [35.0, -114.63],
  ],
  // CA - AZ border (Colorado River from Needles to Yuma)
  [
    [35.0, -114.63],
    [34.47, -114.33],
    [34.26, -114.13],
    [33.6, -114.53],
    [32.72, -114.72],
  ],
  // NV - UT border (~114.05°W from 37°N to 38.35°N)
  [
    [38.35, -114.05],
    [37.0, -114.05],
  ],
  // NV - AZ border (37°N down to Hoover Dam / Lake Mead / Colorado River to 35°N)
  [
    [37.0, -114.05],
    [36.01, -114.74],
    [35.0, -114.63],
  ],
  // UT - AZ border (37°N parallel from NV border to Four Corners at 109.05°W)
  [
    [37.0, -114.05],
    [37.0, -109.05],
  ],
];

export function pointsToPath(points: [number, number][]) {
  return points
    .map(([lat, lng], i) => {
      const { x, y } = project(lat, lng);
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}
