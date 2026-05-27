export type Gender = "male" | "female" | "other";

export interface Person {
  id: string;
  fullName: string;
  displayName?: string;
  furigana?: string;
  birth: string;
  gender?: Gender;
  role?: string;
}

export type Element = "木" | "火" | "土" | "金" | "水";

export type Zodiac =
  | "aries"
  | "taurus"
  | "gemini"
  | "cancer"
  | "leo"
  | "virgo"
  | "libra"
  | "scorpio"
  | "sagittarius"
  | "capricorn"
  | "aquarius"
  | "pisces";
