// MBTI: 16 タイプ + 認知機能スタック + 相性

export type MbtiType =
  | "INTJ" | "INTP" | "ENTJ" | "ENTP"
  | "INFJ" | "INFP" | "ENFJ" | "ENFP"
  | "ISTJ" | "ISFJ" | "ESTJ" | "ESFJ"
  | "ISTP" | "ISFP" | "ESTP" | "ESFP";

export const MBTI_TYPES: MbtiType[] = [
  "INTJ", "INTP", "ENTJ", "ENTP",
  "INFJ", "INFP", "ENFJ", "ENFP",
  "ISTJ", "ISFJ", "ESTJ", "ESFJ",
  "ISTP", "ISFP", "ESTP", "ESFP",
];

export type Function = "Ni" | "Ne" | "Si" | "Se" | "Ti" | "Te" | "Fi" | "Fe";

export const FUNCTION_STACK: Record<MbtiType, [Function, Function, Function, Function]> = {
  INTJ: ["Ni", "Te", "Fi", "Se"],
  INTP: ["Ti", "Ne", "Si", "Fe"],
  ENTJ: ["Te", "Ni", "Se", "Fi"],
  ENTP: ["Ne", "Ti", "Fe", "Si"],
  INFJ: ["Ni", "Fe", "Ti", "Se"],
  INFP: ["Fi", "Ne", "Si", "Te"],
  ENFJ: ["Fe", "Ni", "Se", "Ti"],
  ENFP: ["Ne", "Fi", "Te", "Si"],
  ISTJ: ["Si", "Te", "Fi", "Ne"],
  ISFJ: ["Si", "Fe", "Ti", "Ne"],
  ESTJ: ["Te", "Si", "Ne", "Fi"],
  ESFJ: ["Fe", "Si", "Ne", "Ti"],
  ISTP: ["Ti", "Se", "Ni", "Fe"],
  ISFP: ["Fi", "Se", "Ni", "Te"],
  ESTP: ["Se", "Ti", "Fe", "Ni"],
  ESFP: ["Se", "Fi", "Te", "Ni"],
};

interface CompatGroup {
  best: MbtiType[];
  good: MbtiType[];
  challenging: MbtiType[];
}

// JSON owner (INFJ) は best=[ENFP, ENTP], good=[INFJ,INTJ,INFP,ENFJ], challenging=[ESTP,ESTJ]
// 一般則: dominant-inferior 補完 (best), 同 NF/SF (good), 反対 SP/SJ (challenging)
export const MBTI_COMPAT: Record<MbtiType, CompatGroup> = {
  INFJ: { best: ["ENFP", "ENTP"], good: ["INFJ", "INTJ", "INFP", "ENFJ"], challenging: ["ESTP", "ESTJ"] },
  INTJ: { best: ["ENFP", "ENTP"], good: ["INTJ", "INFJ", "INTP", "ENTJ"], challenging: ["ESFP", "ESTP"] },
  INFP: { best: ["ENFJ", "ENTJ"], good: ["INFP", "INFJ", "ENFP", "INTP"], challenging: ["ESTJ", "ESTP"] },
  INTP: { best: ["ENTJ", "ENFJ"], good: ["INTP", "INTJ", "ENTP", "INFP"], challenging: ["ESFJ", "ESFP"] },
  ENFP: { best: ["INFJ", "INTJ"], good: ["ENFP", "ENFJ", "INFP", "ENTP"], challenging: ["ISTJ", "ISTP"] },
  ENTP: { best: ["INFJ", "INTJ"], good: ["ENTP", "ENFP", "ENTJ", "INTP"], challenging: ["ISFJ", "ISTJ"] },
  ENFJ: { best: ["INFP", "ISFP"], good: ["ENFJ", "ENFP", "INFJ", "ENTJ"], challenging: ["ISTP", "INTP"] },
  ENTJ: { best: ["INTP", "INFP"], good: ["ENTJ", "ENTP", "INTJ", "ENFJ"], challenging: ["ISFP", "INFP"] },
  ISTJ: { best: ["ESFP", "ESTP"], good: ["ISTJ", "ISFJ", "ESTJ", "INTJ"], challenging: ["ENFP", "ENTP"] },
  ISFJ: { best: ["ESFP", "ESTP"], good: ["ISFJ", "ISTJ", "ESFJ", "INFJ"], challenging: ["ENTP", "ENTJ"] },
  ESTJ: { best: ["ISFP", "ISTP"], good: ["ESTJ", "ESFJ", "ISTJ", "ENTJ"], challenging: ["INFP", "INFJ"] },
  ESFJ: { best: ["ISFP", "ISTP"], good: ["ESFJ", "ESTJ", "ISFJ", "ENFJ"], challenging: ["INTP", "INTJ"] },
  ISTP: { best: ["ESTJ", "ESFJ"], good: ["ISTP", "ISFP", "ESTP", "INTP"], challenging: ["ENFJ", "INFJ"] },
  ISFP: { best: ["ESFJ", "ESTJ"], good: ["ISFP", "ISTP", "ESFP", "INFP"], challenging: ["ENTJ", "INTJ"] },
  ESTP: { best: ["ISFJ", "ISTJ"], good: ["ESTP", "ESFP", "ISTP", "ENTP"], challenging: ["INFJ", "INTJ"] },
  ESFP: { best: ["ISFJ", "ISTJ"], good: ["ESFP", "ESTP", "ISFP", "ENFP"], challenging: ["INTJ", "INTP"] },
};

export type MbtiCompatLabel = "best" | "good" | "neutral" | "challenging";

export function mbtiCompat(a: MbtiType, b: MbtiType): { label: MbtiCompatLabel; score: number } {
  const g = MBTI_COMPAT[a];
  if (g.best.includes(b)) return { label: "best", score: 95 };
  if (g.good.includes(b)) return { label: "good", score: 80 };
  if (g.challenging.includes(b)) return { label: "challenging", score: 35 };
  return { label: "neutral", score: 60 };
}
