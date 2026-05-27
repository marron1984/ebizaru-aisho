// 四柱推命: 日柱を中心に算出
// JSON 仕様: lib/shichu.ts

export const STEMS = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"] as const;
export const BRANCHES = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"] as const;

export type Stem = typeof STEMS[number];
export type Branch = typeof BRANCHES[number];

// 干支 -> 五行
const STEM_ELEMENT: Record<Stem, "木" | "火" | "土" | "金" | "水"> = {
  甲: "木", 乙: "木",
  丙: "火", 丁: "火",
  戊: "土", 己: "土",
  庚: "金", 辛: "金",
  壬: "水", 癸: "水",
};

const STEM_YIN_YANG: Record<Stem, "陽" | "陰"> = {
  甲: "陽", 乙: "陰", 丙: "陽", 丁: "陰", 戊: "陽",
  己: "陰", 庚: "陽", 辛: "陰", 壬: "陽", 癸: "陰",
};

function daysBetween(a: Date, b: Date): number {
  const ms = b.getTime() - a.getTime();
  return Math.round(ms / 86400000);
}

// 基準: 1900-01-01 = 丙戌 (stemIdx=2, branchIdx=10)
const BASE_DATE = new Date(Date.UTC(1900, 0, 1));
const BASE_STEM = 2;
const BASE_BRANCH = 10;

export function dayPillar(year: number, month: number, day: number): { stem: Stem; branch: Branch } {
  const d = new Date(Date.UTC(year, month - 1, day));
  const diff = daysBetween(BASE_DATE, d);
  const stem = STEMS[(BASE_STEM + diff) % 10 < 0 ? ((BASE_STEM + diff) % 10) + 10 : (BASE_STEM + diff) % 10];
  const branch = BRANCHES[(BASE_BRANCH + diff) % 12 < 0 ? ((BASE_BRANCH + diff) % 12) + 12 : (BASE_BRANCH + diff) % 12];
  return { stem, branch };
}

// 年柱 (立春 2/4 簡易)
export function yearPillar(year: number, month: number, day: number): { stem: Stem; branch: Branch } {
  let eff = year;
  if (month === 1) eff -= 1;
  if (month === 2 && day < 4) eff -= 1;
  const stem = STEMS[((eff - 4) % 10 + 10) % 10];
  const branch = BRANCHES[((eff - 4) % 12 + 12) % 12];
  return { stem, branch };
}

// 通変星
export type Tongbian =
  | "比肩" | "劫財"
  | "食神" | "傷官"
  | "偏財" | "正財"
  | "偏官" | "正官"
  | "偏印" | "印綬";

// 五行 相生 / 相剋
const GEN: Record<string, string> = { 木: "火", 火: "土", 土: "金", 金: "水", 水: "木" };
const CON: Record<string, string> = { 木: "土", 土: "水", 水: "火", 火: "金", 金: "木" };

export function tongbianStar(dayStem: Stem, otherStem: Stem): Tongbian {
  const da = STEM_ELEMENT[dayStem];
  const ob = STEM_ELEMENT[otherStem];
  const sameYY = STEM_YIN_YANG[dayStem] === STEM_YIN_YANG[otherStem];
  if (da === ob) return sameYY ? "比肩" : "劫財";
  if (GEN[da] === ob) return sameYY ? "食神" : "傷官";
  if (CON[da] === ob) return sameYY ? "偏財" : "正財";
  if (CON[ob] === da) return sameYY ? "偏官" : "正官";
  if (GEN[ob] === da) return sameYY ? "偏印" : "印綬";
  return "比肩";
}

// 通変星のスコア (ビジネス相性 JSON より)
export const TONGBIAN_SCORE: Record<Tongbian, number> = {
  正官: 95,
  正財: 90,
  印綬: 88,
  偏財: 82,
  食神: 80,
  比肩: 75,
  偏官: 70,
  偏印: 65,
  傷官: 55,
  劫財: 50,
};

// 地支関係
export type BranchInteraction = "三合" | "六合" | "沖" | "刑" | "破" | "害" | "なし";

const SANGO: Array<[Branch, Branch, Branch]> = [
  ["申", "子", "辰"], // 水
  ["亥", "卯", "未"], // 木
  ["寅", "午", "戌"], // 火
  ["巳", "酉", "丑"], // 金
];
const RIKUGO: Array<[Branch, Branch]> = [
  ["子", "丑"], ["寅", "亥"], ["卯", "戌"], ["辰", "酉"], ["巳", "申"], ["午", "未"],
];
const CHONG: Array<[Branch, Branch]> = [
  ["子", "午"], ["丑", "未"], ["寅", "申"], ["卯", "酉"], ["辰", "戌"], ["巳", "亥"],
];

function pairIn(a: Branch, b: Branch, pairs: Array<[Branch, Branch]>): boolean {
  return pairs.some(([x, y]) => (x === a && y === b) || (x === b && y === a));
}

export function branchInteraction(a: Branch, b: Branch): BranchInteraction {
  if (a === b) return "なし";
  if (pairIn(a, b, CHONG)) return "沖";
  for (const tri of SANGO) {
    if (tri.includes(a) && tri.includes(b)) return "三合";
  }
  if (pairIn(a, b, RIKUGO)) return "六合";
  return "なし";
}

export function branchScore(rel: BranchInteraction): number {
  switch (rel) {
    case "三合": return 100;
    case "六合": return 90;
    case "なし": return 60;
    case "刑": return 40;
    case "破": return 40;
    case "害": return 40;
    case "沖": return 20;
  }
}
