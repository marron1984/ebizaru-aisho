// Meeus / ELP2000 簡易版による天文計算
// 参考: Meeus "Astronomical Algorithms" 2nd ed. Ch.25 (太陽), Ch.47 (月)

const DEG = Math.PI / 180;

export function normalizeDeg(d: number): number {
  return ((d % 360) + 360) % 360;
}

export function julianDay(date: Date): number {
  const y = date.getUTCFullYear();
  const m = date.getUTCMonth() + 1;
  const day =
    date.getUTCDate() +
    (date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600) / 24;
  let yy = y;
  let mm = m;
  if (m <= 2) {
    yy -= 1;
    mm += 12;
  }
  const A = Math.floor(yy / 100);
  const B = 2 - A + Math.floor(A / 4);
  return (
    Math.floor(365.25 * (yy + 4716)) +
    Math.floor(30.6001 * (mm + 1)) +
    day +
    B -
    1524.5
  );
}

// 太陽黄経 (Meeus Ch.25 簡易版) 精度 ~0.01°
export function sunLongitude(date: Date): number {
  const JD = julianDay(date);
  const T = (JD - 2451545.0) / 36525;
  const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
  const M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
  const Mrad = normalizeDeg(M) * DEG;
  const C =
    (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mrad) +
    (0.019993 - 0.000101 * T) * Math.sin(2 * Mrad) +
    0.000289 * Math.sin(3 * Mrad);
  return normalizeDeg(L0 + C);
}

// 月黄経 (ELP2000 簡易: 主要 12 周期項) 精度 ~0.5°
export function moonLongitude(date: Date): number {
  const JD = julianDay(date);
  const T = (JD - 2451545.0) / 36525;

  const L =
    218.3164477 + 481267.88123421 * T - 0.0015786 * T * T + (T * T * T) / 538841;
  const D =
    297.8501921 + 445267.1114034 * T - 0.0018819 * T * T + (T * T * T) / 545868;
  const M =
    357.5291092 + 35999.0502909 * T - 0.0001536 * T * T + (T * T * T) / 24490000;
  const Mp =
    134.9633964 + 477198.8675055 * T + 0.0087414 * T * T + (T * T * T) / 69699;
  const F =
    93.272095 + 483202.0175233 * T - 0.0036539 * T * T - (T * T * T) / 3526000;

  const Dr = D * DEG;
  const Mr = M * DEG;
  const Mpr = Mp * DEG;
  const Fr = F * DEG;

  let lon = L;
  lon += 6.288774 * Math.sin(Mpr);
  lon += 1.274027 * Math.sin(2 * Dr - Mpr);
  lon += 0.658314 * Math.sin(2 * Dr);
  lon += 0.213618 * Math.sin(2 * Mpr);
  lon -= 0.185116 * Math.sin(Mr);
  lon -= 0.114332 * Math.sin(2 * Fr);
  lon += 0.058793 * Math.sin(2 * Dr - 2 * Mpr);
  lon += 0.057066 * Math.sin(2 * Dr - Mr - Mpr);
  lon += 0.053322 * Math.sin(2 * Dr + Mpr);
  lon += 0.045758 * Math.sin(2 * Dr - Mr);
  lon -= 0.040923 * Math.sin(Mr - Mpr);
  lon -= 0.03472 * Math.sin(Dr);

  return normalizeDeg(lon);
}

// 月相
export interface MoonPhase {
  phase: number;   // 0..1 (0=新月)
  age: number;     // 0..29.53 日
  name: string;
  illumination: number; // 0..1 (満月=1)
}

export function moonPhase(date: Date): MoonPhase {
  const diff = normalizeDeg(moonLongitude(date) - sunLongitude(date));
  const phase = diff / 360;
  const age = phase * 29.530589;
  const illumination = (1 - Math.cos(diff * DEG)) / 2;
  return { phase, age, name: moonPhaseName(phase), illumination };
}

function moonPhaseName(phase: number): string {
  if (phase >= 0.964 || phase < 0.036) return "新月";
  if (phase < 0.214) return "三日月";
  if (phase < 0.286) return "上弦の月";
  if (phase < 0.464) return "十三夜";
  if (phase < 0.536) return "満月";
  if (phase < 0.714) return "十六夜";
  if (phase < 0.786) return "下弦の月";
  return "晦月";
}

// 24 節気
export interface SolarTerm {
  lon: number;
  name: string;
  main: boolean;
}

export const TERMS_24: SolarTerm[] = [
  { lon: 315, name: "立春", main: true },
  { lon: 330, name: "雨水", main: false },
  { lon: 345, name: "啓蟄", main: true },
  { lon: 0,   name: "春分", main: false },
  { lon: 15,  name: "清明", main: true },
  { lon: 30,  name: "穀雨", main: false },
  { lon: 45,  name: "立夏", main: true },
  { lon: 60,  name: "小満", main: false },
  { lon: 75,  name: "芒種", main: true },
  { lon: 90,  name: "夏至", main: false },
  { lon: 105, name: "小暑", main: true },
  { lon: 120, name: "大暑", main: false },
  { lon: 135, name: "立秋", main: true },
  { lon: 150, name: "処暑", main: false },
  { lon: 165, name: "白露", main: true },
  { lon: 180, name: "秋分", main: false },
  { lon: 195, name: "寒露", main: true },
  { lon: 210, name: "霜降", main: false },
  { lon: 225, name: "立冬", main: true },
  { lon: 240, name: "小雪", main: false },
  { lon: 255, name: "大雪", main: true },
  { lon: 270, name: "冬至", main: false },
  { lon: 285, name: "小寒", main: true },
  { lon: 300, name: "大寒", main: false },
];

// 二分法 40 反復で「年内に太陽黄経 = lon を満たす日」を求める
export function findSolarTermDate(year: number, lon: number): Date {
  // 立春 (315°) 起点で、節気は前年末〜翌年初をまたぐので、対象範囲を ±60 日広めに取る
  const start = new Date(Date.UTC(year - 1, 11, 1)).getTime();
  const end = new Date(Date.UTC(year + 1, 1, 1)).getTime();

  // 大まかな初期位置: 黄経差を線形補間
  // λ=lon となる時刻を二分探索する。連続性が崩れるのは 360→0 の境界。
  // そこで参照点として diff = ((sunLon - lon + 540) % 360) - 180 を符号関数として扱う。
  const signed = (t: number) => {
    const sl = sunLongitude(new Date(t));
    return ((sl - lon + 540) % 360) - 180;
  };

  // 大まかに 5 日刻みで sign 変化点を探す
  let lo = start;
  let hi = start + 5 * 86400000;
  let found = false;
  while (hi <= end) {
    if (signed(lo) <= 0 && signed(hi) >= 0) {
      found = true;
      break;
    }
    lo = hi;
    hi += 5 * 86400000;
  }
  if (!found) return new Date(start);

  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    if (signed(mid) >= 0) hi = mid;
    else lo = mid;
  }
  return new Date((lo + hi) / 2);
}

// その時点の節気 (直近 過去の主要/中気を返す) と次の節気
export function currentSolarTerm(date: Date): { current: SolarTerm; next: SolarTerm; nextDate: Date } {
  const lon = sunLongitude(date);
  let bestIdx = 0;
  let bestDiff = 360;
  for (let i = 0; i < TERMS_24.length; i++) {
    const diff = ((lon - TERMS_24[i].lon) % 360 + 360) % 360;
    if (diff < bestDiff) {
      bestDiff = diff;
      bestIdx = i;
    }
  }
  const current = TERMS_24[bestIdx];
  const next = TERMS_24[(bestIdx + 1) % TERMS_24.length];
  const yr = date.getUTCFullYear();
  // 次の節気が年をまたぐかもしれないので両方試して未来側を採用
  const candidates = [findSolarTermDate(yr, next.lon), findSolarTermDate(yr + 1, next.lon)];
  const nextDate = candidates.find((d) => d.getTime() > date.getTime()) ?? candidates[0];
  return { current, next, nextDate };
}
