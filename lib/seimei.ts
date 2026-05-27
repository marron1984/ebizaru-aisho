// 姓名判断: 五格 + 熊崎式 1-81 吉凶
import { strokesOfName } from "./kanjiStrokes";

export interface Kakusu {
  sei: number[];
  mei: number[];
  ten: number;   // 天格 (Σ姓)
  jin: number;   // 人格 (姓末 + 名頭)
  chi: number;   // 地格 (Σ名)
  gai: number;   // 外格 (総 - 人)
  so: number;    // 総格 (天 + 地)
}

export function calcKakusu(seiKakusu: number[], meiKakusu: number[]): Kakusu {
  const ten = seiKakusu.reduce((a, b) => a + b, 0);
  const chi = meiKakusu.reduce((a, b) => a + b, 0);
  const so = ten + chi;
  const jin =
    (seiKakusu[seiKakusu.length - 1] ?? 0) + (meiKakusu[0] ?? 0);
  const gai = so - jin;
  return { sei: seiKakusu, mei: meiKakusu, ten, jin, chi, gai, so };
}

// 姓名（スペースで姓/名を区切る or 半角空白）から五格を計算
export function kakusuFromFullName(fullName: string): Kakusu {
  const parts = fullName.split(/[\s　]+/).filter(Boolean);
  const seiPart = parts[0] ?? "";
  const meiPart = parts.slice(1).join("");
  return calcKakusu(strokesOfName(seiPart), strokesOfName(meiPart));
}

// 熊崎式 1-81 吉凶表
export type Kichi = "大吉" | "吉" | "半吉" | "凶" | "大凶";

const KICHIKYO_TABLE: Record<number, Kichi> = {
  1: "大吉", 2: "凶", 3: "大吉", 4: "凶", 5: "大吉", 6: "大吉", 7: "大吉", 8: "大吉",
  9: "凶", 10: "凶", 11: "大吉", 12: "凶", 13: "大吉", 14: "凶", 15: "大吉", 16: "大吉",
  17: "大吉", 18: "大吉", 19: "凶", 20: "凶", 21: "大吉", 22: "凶", 23: "大吉", 24: "大吉",
  25: "大吉", 26: "凶", 27: "半吉", 28: "凶", 29: "大吉", 30: "半吉", 31: "大吉", 32: "大吉",
  33: "大吉", 34: "凶", 35: "吉", 36: "凶", 37: "大吉", 38: "吉", 39: "大吉", 40: "凶",
  41: "大吉", 42: "凶", 43: "凶", 44: "凶", 45: "大吉", 46: "凶", 47: "大吉", 48: "大吉",
  49: "凶", 50: "凶", 51: "半吉", 52: "大吉", 53: "凶", 54: "凶", 55: "半吉", 56: "凶",
  57: "大吉", 58: "半吉", 59: "凶", 60: "凶", 61: "大吉", 62: "凶", 63: "大吉", 64: "凶",
  65: "大吉", 66: "凶", 67: "大吉", 68: "大吉", 69: "凶", 70: "凶", 71: "半吉", 72: "凶",
  73: "半吉", 74: "凶", 75: "半吉", 76: "凶", 77: "半吉", 78: "凶", 79: "凶", 80: "凶",
  81: "大吉",
};

export function kichikyo(n: number): Kichi {
  if (n <= 0) return "凶";
  let v = n;
  while (v > 81) v -= 81;
  return KICHIKYO_TABLE[v] ?? "凶";
}

export interface KakusuJudgment extends Kakusu {
  tenJ: Kichi;
  jinJ: Kichi;
  chiJ: Kichi;
  gaiJ: Kichi;
  soJ: Kichi;
}

export function judgeKakusu(k: Kakusu): KakusuJudgment {
  return {
    ...k,
    tenJ: kichikyo(k.ten),
    jinJ: kichikyo(k.jin),
    chiJ: kichikyo(k.chi),
    gaiJ: kichikyo(k.gai),
    soJ: kichikyo(k.so),
  };
}

// 数値スコア (1=凶 .. 5=大吉) を 4 つの主要格平均で 0-100 に
const KICHI_SCORE: Record<Kichi, number> = {
  大吉: 100,
  吉: 80,
  半吉: 60,
  凶: 35,
  大凶: 10,
};

export function kakusuScore(j: KakusuJudgment): number {
  const avg =
    (KICHI_SCORE[j.tenJ] + KICHI_SCORE[j.jinJ] + KICHI_SCORE[j.chiJ] + KICHI_SCORE[j.gaiJ] + KICHI_SCORE[j.soJ]) /
    5;
  return Math.round(avg);
}

// 2 人の姓名判断・相性: 総格の合算リダクションを軸に、人格同士の関係も加味
export function seimeiCompat(a: Kakusu, b: Kakusu): number {
  const merged = a.so + b.so;
  let v = merged;
  while (v > 81) v -= 81;
  const k = kichikyo(v);
  const baseScore = KICHI_SCORE[k];
  // 人格の差が小さいほど合う (経験則)
  const jinDiff = Math.abs(a.jin - b.jin);
  const jinBonus = Math.max(0, 12 - jinDiff); // 0..12
  return Math.min(100, baseScore + jinBonus);
}
