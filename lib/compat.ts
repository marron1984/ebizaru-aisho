import type { Profile } from "./profile";
import { starRelation } from "./kyusei";
import { zodiacCompatScore } from "./astrology";
import { lifePathCompat } from "./numerology";
import { tongbianStar, branchInteraction, branchScore, TONGBIAN_SCORE } from "./shichu";
import { seimeiCompat } from "./seimei";
import { kuaCompat } from "./fengshui";
import { mbtiCompat } from "./mbti";

export interface CompatBreakdown {
  work: number;       // 仕事
  social: number;     // 対人
  health: number;     // 健康
  wealth: number;     // 金運
  overall: number;    // 総合
}

export interface CompatDetail extends CompatBreakdown {
  starKind: string;
  tongbian: string;
  branchRelation: string;
  zodiac: string;
  seimei: number;
  kua: number;
  mbti?: { label: string; score: number };
}

function clamp(n: number, lo = 1, hi = 99): number {
  return Math.max(lo, Math.min(hi, Math.round(n)));
}

// 視点 a → 相手 b
// 各軸は 1-99 の整数。axes は engine 群から線形合成。
export function calcCompat(a: Profile, b: Profile): CompatDetail {
  // 九星 (対人/総合の主軸)
  const kyusei = starRelation(a.honmei, b.honmei);
  const kyuseiScore = (kyusei.score / 5) * 100; // 20..100

  // 通変星 (仕事/金運の主軸)
  const tong = tongbianStar(a.dayStem, b.dayStem);
  const tongScore = TONGBIAN_SCORE[tong]; // 50..95

  // 地支関係 (健康/対人の補助)
  const branchRel = branchInteraction(a.dayBranch, b.dayBranch);
  const bScore = branchScore(branchRel);

  // 太陽星座 (対人/健康の彩り)
  const zScore = (zodiacCompatScore(a.sun, b.sun) / 5) * 100; // 60..100

  // ライフパス (社交/金運)
  const lpScore = (lifePathCompat(a.lifePath, b.lifePath) / 5) * 100;

  // 姓名判断 (運勢全般の補強)
  const seScore = seimeiCompat(a.kakusu, b.kakusu);

  // 風水 (本命卦群)
  const fsScore = kuaCompat(a.kua, b.kua);

  // MBTI (両方ある時のみ)
  const mb = a.mbti && b.mbti ? mbtiCompat(a.mbti, b.mbti) : undefined;
  const mbScore = mb?.score ?? 60;

  const work    = clamp(tongScore * 0.42 + kyuseiScore * 0.22 + bScore * 0.12 + seScore * 0.10 + fsScore * 0.08 + mbScore * 0.06);
  const social  = clamp(kyuseiScore * 0.32 + zScore * 0.20 + lpScore * 0.16 + seScore * 0.12 + fsScore * 0.08 + mbScore * 0.12);
  const health  = clamp(zScore * 0.32 + bScore * 0.24 + kyuseiScore * 0.18 + seScore * 0.10 + fsScore * 0.10 + mbScore * 0.06);
  const wealth  = clamp(tongScore * 0.32 + lpScore * 0.22 + kyuseiScore * 0.18 + seScore * 0.12 + fsScore * 0.10 + mbScore * 0.06);
  const overall = clamp(work * 0.30 + social * 0.30 + wealth * 0.25 + health * 0.15);

  return {
    work, social, health, wealth, overall,
    starKind: kyusei.kind,
    tongbian: tong,
    branchRelation: branchRel,
    zodiac: `${a.sunJa} × ${b.sunJa}`,
    seimei: seScore,
    kua: fsScore,
    mbti: mb ? { label: mb.label, score: mb.score } : undefined,
  };
}

// 自己プロファイル (中心の人) の "今日感" の主観スコア (本人視点の自己評価)
export function selfScore(p: Profile, dateSeed: number): CompatBreakdown {
  // 簡易: 九星 比和 100 ベース + 日付シードでわずかに揺らぐ
  const base = 70;
  const noise = (k: number) => ((dateSeed * (k + 1)) % 19) - 9;
  const work = clamp(base + noise(1));
  const social = clamp(base + 8 + noise(2));
  const health = clamp(base + 6 + noise(3));
  const wealth = clamp(base + 2 + noise(4));
  const overall = clamp(work * 0.3 + social * 0.3 + wealth * 0.25 + health * 0.15);
  return { work, social, health, wealth, overall };
}
