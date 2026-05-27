// 風水: 本命卦 + 8 方位 吉凶
// JSON 仕様準拠: 男性 k=(100-yy)%9, 女性 k=(yy+5)%9, k=0→9, k=5→男2/女8

import type { Gender } from "./types";

export type Kua = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type KuaGroup = "東四命" | "西四命";
export type Direction = "北" | "東北" | "東" | "東南" | "南" | "西南" | "西" | "西北";

export const DIRECTIONS: Direction[] = ["北", "東北", "東", "東南", "南", "西南", "西", "西北"];

const EAST = new Set<Kua>([1, 3, 4, 9]);
// const WEST = new Set<Kua>([2, 6, 7, 8]);

export function kuaGroup(k: Kua): KuaGroup {
  return EAST.has(k) ? "東四命" : "西四命";
}

export function calcKua(year: number, month: number, day: number, gender: Gender): Kua {
  // 立春前 (2/4 簡易) は前年扱い
  let eff = year;
  if (month === 1) eff -= 1;
  if (month === 2 && day < 4) eff -= 1;
  const yy = eff % 100;

  let k: number;
  if (gender === "female") {
    k = (yy + 5) % 9;
  } else {
    k = ((100 - yy) % 9 + 9) % 9;
  }
  if (k === 0) k = 9;
  if (k === 5) k = gender === "female" ? 8 : 2;
  return k as Kua;
}

// 8 方位の吉凶 (本命卦ごと)
export type DirRating = "生気" | "天医" | "延年" | "伏位" | "禍害" | "六殺" | "五鬼" | "絶命";

export const RATING_DESC: Record<DirRating, { rank: string; desc: string; score: number }> = {
  生気: { rank: "大吉", desc: "発展・財運", score: 100 },
  天医: { rank: "吉",   desc: "健康・回復", score: 85 },
  延年: { rank: "吉",   desc: "長寿・関係", score: 80 },
  伏位: { rank: "小吉", desc: "安定",       score: 65 },
  禍害: { rank: "小凶", desc: "軽い消耗",   score: 40 },
  六殺: { rank: "中凶", desc: "対立・災い", score: 25 },
  五鬼: { rank: "大凶", desc: "損失・病",   score: 15 },
  絶命: { rank: "最大凶", desc: "重大な不運", score: 5 },
};

// 各本命卦の 8 方位
// 出典: 伝統的な紫白八宅。kua=5 は男女で 2/8 に置換される (calcKua 内で処理済み)
const KUA_DIRS: Record<Exclude<Kua, 5>, Record<Direction, DirRating>> = {
  1: { 北: "伏位", 東北: "禍害", 東: "天医", 東南: "生気", 南: "延年", 西南: "絶命", 西: "禍害", 西北: "六殺" },
  2: { 北: "絶命", 東北: "生気", 東: "禍害", 東南: "五鬼", 南: "六殺", 西南: "伏位", 西: "天医", 西北: "延年" },
  3: { 北: "天医", 東北: "六殺", 東: "伏位", 東南: "延年", 南: "生気", 西南: "禍害", 西: "絶命", 西北: "五鬼" },
  4: { 北: "生気", 東北: "絶命", 東: "延年", 東南: "伏位", 南: "天医", 西南: "五鬼", 西: "六殺", 西北: "禍害" },
  6: { 北: "六殺", 東北: "天医", 東: "五鬼", 東南: "禍害", 南: "絶命", 西南: "延年", 西: "生気", 西北: "伏位" },
  7: { 北: "禍害", 東北: "延年", 東: "絶命", 東南: "六殺", 南: "五鬼", 西南: "天医", 西: "伏位", 西北: "生気" },
  8: { 北: "五鬼", 東北: "伏位", 東: "六殺", 東南: "絶命", 南: "禍害", 西南: "生気", 西: "延年", 西北: "天医" },
  9: { 北: "延年", 東北: "五鬼", 東: "生気", 東南: "天医", 南: "伏位", 西南: "六殺", 西: "禍害", 西北: "絶命" },
};

export function dirRatings(k: Kua): Record<Direction, DirRating> {
  if (k === 5) {
    // 防御的: calcKua で 2/8 に置換されているはずだが万一の保険
    return KUA_DIRS[2];
  }
  return KUA_DIRS[k];
}

// 2 人の本命卦 相性: 同じ群=吉 / 同じ卦=最良 / 異群=注意
export function kuaCompat(a: Kua, b: Kua): number {
  if (a === b) return 95;
  const ga = kuaGroup(a);
  const gb = kuaGroup(b);
  return ga === gb ? 80 : 50;
}
