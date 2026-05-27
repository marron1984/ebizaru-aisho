import type { Element } from "./types";

// 九星 名称
export const KYUSEI_NAMES: Record<number, string> = {
  1: "一白水星",
  2: "二黒土星",
  3: "三碧木星",
  4: "四緑木星",
  5: "五黄土星",
  6: "六白金星",
  7: "七赤金星",
  8: "八白土星",
  9: "九紫火星",
};

export const KYUSEI_ELEMENT: Record<number, Element> = {
  1: "水",
  2: "土",
  3: "木",
  4: "木",
  5: "土",
  6: "金",
  7: "金",
  8: "土",
  9: "火",
};

// 立春前は前年扱い (簡易: 2/4 まで)
function effectiveYear(year: number, month: number, day: number): number {
  if (month === 1) return year - 1;
  if (month === 2 && day < 4) return year - 1;
  return year;
}

function digitSum(n: number): number {
  let s = 0;
  for (const c of String(Math.abs(n))) s += Number(c);
  return s;
}

function reduceTo1Digit(n: number): number {
  let v = n;
  while (v > 9) v = digitSum(v);
  return v;
}

// 本命星: 立春前=前年扱い、西暦各桁を1桁まで足す→ h = 11 - sum、範囲外なら±9補正
export function honmeiStar(year: number, month: number, day: number): number {
  const y = effectiveYear(year, month, day);
  const s = reduceTo1Digit(digitSum(y));
  let h = 11 - s;
  if (h < 1) h += 9;
  if (h > 9) h -= 9;
  return h;
}

// 九星五行関係 → スコア (5最高 / 1最低)
export type StarRelation = "比和" | "相生" | "洩気" | "相剋" | "受剋";

const RELATION_SCORE: Record<StarRelation, number> = {
  比和: 4,
  相生: 5,
  洩気: 3,
  相剋: 2,
  受剋: 1,
};

// 五行 相生: 木→火→土→金→水→木
const GENERATES: Record<Element, Element> = {
  木: "火",
  火: "土",
  土: "金",
  金: "水",
  水: "木",
};
// 五行 相剋: 木→土, 土→水, 水→火, 火→金, 金→木
const CONQUERS: Record<Element, Element> = {
  木: "土",
  土: "水",
  水: "火",
  火: "金",
  金: "木",
};

export function starRelation(selfStar: number, otherStar: number): { kind: StarRelation; score: number } {
  const a = KYUSEI_ELEMENT[selfStar];
  const b = KYUSEI_ELEMENT[otherStar];
  if (a === b) return { kind: "比和", score: RELATION_SCORE["比和"] };
  if (GENERATES[b] === a) return { kind: "相生", score: RELATION_SCORE["相生"] }; // 相手が自分を生む
  if (GENERATES[a] === b) return { kind: "洩気", score: RELATION_SCORE["洩気"] }; // 自分が相手を生む
  if (CONQUERS[a] === b) return { kind: "相剋", score: RELATION_SCORE["相剋"] }; // 自分が相手を剋す
  if (CONQUERS[b] === a) return { kind: "受剋", score: RELATION_SCORE["受剋"] }; // 相手から剋される
  return { kind: "比和", score: RELATION_SCORE["比和"] };
}
