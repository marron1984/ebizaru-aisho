import { dayPillar, yearPillar, type Stem, type Branch } from "./shichu";
import { honmeiStar, KYUSEI_NAMES } from "./kyusei";
import { getSunSign, zodiacJa } from "./astrology";
import { lifePathNumber } from "./numerology";
import { kakusuFromFullName, judgeKakusu, kakusuScore, type KakusuJudgment } from "./seimei";
import type { Person, Zodiac } from "./types";

export interface Profile {
  person: Person;
  birth: { y: number; m: number; d: number };
  sun: Zodiac;
  sunJa: string;
  honmei: number;
  honmeiName: string;
  dayStem: Stem;
  dayBranch: Branch;
  dayGanzhi: string;
  yearStem: Stem;
  yearBranch: Branch;
  lifePath: number;
  kakusu: KakusuJudgment;
  kakusuScore: number;
}

export function buildProfile(person: Person): Profile {
  const [y, m, d] = person.birth.split("-").map(Number);
  const sun = getSunSign(m, d);
  const honmei = honmeiStar(y, m, d);
  const dp = dayPillar(y, m, d);
  const yp = yearPillar(y, m, d);
  const k = judgeKakusu(kakusuFromFullName(person.fullName));
  return {
    person,
    birth: { y, m, d },
    sun,
    sunJa: zodiacJa(sun),
    honmei,
    honmeiName: KYUSEI_NAMES[honmei],
    dayStem: dp.stem,
    dayBranch: dp.branch,
    dayGanzhi: `${dp.stem}${dp.branch}`,
    yearStem: yp.stem,
    yearBranch: yp.branch,
    lifePath: lifePathNumber(person.birth),
    kakusu: k,
    kakusuScore: kakusuScore(k),
  };
}
