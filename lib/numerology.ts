function digitSum(n: number): number {
  let s = 0;
  for (const c of String(Math.abs(n))) s += Number(c);
  return s;
}

function reduce(n: number, keepMaster = true): number {
  let v = n;
  while (v > 9) {
    if (keepMaster && (v === 11 || v === 22 || v === 33)) return v;
    v = digitSum(v);
  }
  return v;
}

export function lifePathNumber(birth: string): number {
  const digits = birth.replace(/\D/g, "");
  let sum = 0;
  for (const c of digits) sum += Number(c);
  return reduce(sum, true);
}

// 相性スコア: 同じ数 = 5, 補完関係 = 4, 衝突 = 2, それ以外 3
const COMPLEMENTARY = new Set([
  "1-2", "2-1",
  "3-5", "5-3",
  "4-8", "8-4",
  "6-9", "9-6",
  "7-11", "11-7",
]);
const CHALLENGING = new Set([
  "1-4", "4-1",
  "5-7", "7-5",
  "8-11", "11-8",
]);

export function lifePathCompat(a: number, b: number): number {
  if (a === b) return 5;
  const key = `${a}-${b}`;
  if (COMPLEMENTARY.has(key)) return 4;
  if (CHALLENGING.has(key)) return 2;
  return 3;
}
