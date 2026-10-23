export * from "./day-guides-1-5";
export { DAY_GUIDES_6_11 } from "./day-guides-6-11";

import { DAY_GUIDES_1_5, type DayGuide } from "./day-guides-1-5";
import { DAY_GUIDES_6_11 } from "./day-guides-6-11";

export const DAY_GUIDES: Record<number, DayGuide> = {
  ...DAY_GUIDES_1_5,
  ...DAY_GUIDES_6_11,
};

export function getDayGuide(day: number): DayGuide | undefined {
  return DAY_GUIDES[day];
}
