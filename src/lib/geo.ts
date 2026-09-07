export const MAP = {
  width: 1000,
  height: 520,
  west: -125.5,
  east: -66,
  north: 49.5,
  south: 24.5,
} as const;

export function project(lat: number, lng: number) {
  const x = ((lng - MAP.west) / (MAP.east - MAP.west)) * MAP.width;
  const y = ((MAP.north - lat) / (MAP.north - MAP.south)) * MAP.height;
  return { x, y };
}

/** Simplified lower-48 outline, clockwise from the northwest coast. */
export const US_OUTLINE: [number, number][] = [
  [48.5, -124.7],
  [47.0, -124.3],
  [46.2, -123.8],
  [42.0, -124.2],
  [40.0, -124.0],
  [34.5, -120.5],
  [32.53, -117.12],
  [32.5, -114.8],
  [31.3, -111.0],
  [31.3, -108.2],
  [31.8, -106.5],
  [29.3, -104.0],
  [25.9, -97.4],
  [29.7, -93.8],
  [29.2, -89.4],
  [30.4, -88.0],
  [30.3, -85.5],
  [25.1, -80.9],
  [26.8, -80.0],
  [30.7, -81.4],
  [32.0, -80.8],
  [33.9, -77.9],
  [35.2, -75.5],
  [36.9, -75.9],
  [38.9, -75.0],
  [39.0, -74.9],
  [40.5, -74.0],
  [41.3, -72.0],
  [41.7, -69.9],
  [42.9, -70.6],
  [43.8, -69.8],
  [44.8, -66.97],
  [47.3, -68.2],
  [45.0, -71.5],
  [45.0, -74.7],
  [43.6, -79.2],
  [42.3, -82.4],
  [41.7, -83.5],
  [42.3, -86.0],
  [45.4, -86.7],
  [46.0, -85.0],
  [46.5, -84.5],
  [48.3, -89.0],
  [49.0, -95.0],
  [49.0, -123.0],
  [48.5, -124.7],
];

export function pointsToPath(points: [number, number][]) {
  return points
    .map(([lat, lng], i) => {
      const { x, y } = project(lat, lng);
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}
