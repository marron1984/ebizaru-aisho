import type { Zodiac } from "./types";

const ZODIAC_TABLE: Array<{ sign: Zodiac; from: [number, number]; to: [number, number]; jp: string }> = [
  { sign: "capricorn",   from: [12, 22], to: [1, 19],  jp: "山羊座" },
  { sign: "aquarius",    from: [1, 20],  to: [2, 18],  jp: "水瓶座" },
  { sign: "pisces",      from: [2, 19],  to: [3, 20],  jp: "魚座"   },
  { sign: "aries",       from: [3, 21],  to: [4, 19],  jp: "牡羊座" },
  { sign: "taurus",      from: [4, 20],  to: [5, 20],  jp: "牡牛座" },
  { sign: "gemini",      from: [5, 21],  to: [6, 21],  jp: "双子座" },
  { sign: "cancer",      from: [6, 22],  to: [7, 22],  jp: "蟹座"   },
  { sign: "leo",         from: [7, 23],  to: [8, 22],  jp: "獅子座" },
  { sign: "virgo",       from: [8, 23],  to: [9, 22],  jp: "乙女座" },
  { sign: "libra",       from: [9, 23],  to: [10, 23], jp: "天秤座" },
  { sign: "scorpio",     from: [10, 24], to: [11, 22], jp: "蠍座"   },
  { sign: "sagittarius", from: [11, 23], to: [12, 21], jp: "射手座" },
];

export function getSunSign(month: number, day: number): Zodiac {
  for (const z of ZODIAC_TABLE) {
    if (z.from[0] === z.to[0]) {
      if (month === z.from[0] && day >= z.from[1] && day <= z.to[1]) return z.sign;
      continue;
    }
    if (month === z.from[0] && day >= z.from[1]) return z.sign;
    if (month === z.to[0] && day <= z.to[1]) return z.sign;
  }
  // 山羊座 (12/22-1/19) wraps year
  return "capricorn";
}

export function zodiacJa(sign: Zodiac): string {
  return ZODIAC_TABLE.find((z) => z.sign === sign)?.jp ?? "";
}

const ELEMENT_BY_SIGN: Record<Zodiac, "fire" | "earth" | "air" | "water"> = {
  aries: "fire", leo: "fire", sagittarius: "fire",
  taurus: "earth", virgo: "earth", capricorn: "earth",
  gemini: "air", libra: "air", aquarius: "air",
  cancer: "water", scorpio: "water", pisces: "water",
};

// Sign element compatibility: same-element = 5, complementary = 4, neutral = 3, conflict = 2
export function zodiacCompatScore(a: Zodiac, b: Zodiac): number {
  const ea = ELEMENT_BY_SIGN[a];
  const eb = ELEMENT_BY_SIGN[b];
  if (ea === eb) return 5;
  const complementary = new Set([
    "fire-air", "air-fire",
    "earth-water", "water-earth",
  ]);
  if (complementary.has(`${ea}-${eb}`)) return 4;
  return 3;
}
