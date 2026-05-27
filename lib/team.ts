import type { Person } from "./types";

// 性別は風水・大運の方向計算に使用。未確認のため一旦 male をデフォルト。
// 必要に応じて画面上で書き換えるか、ここを編集してください。
export const TEAM: Person[] = [
  { id: "ohtaka",   fullName: "大高 光二",   birth: "1984-11-04", gender: "male" },
  { id: "nose",     fullName: "能勢 健太郎", birth: "1988-12-07", gender: "male" },
  { id: "okamoto",  fullName: "岡本 雄介",   birth: "1991-07-07", gender: "male" },
  { id: "uchiyama", fullName: "内山 航",     birth: "1992-12-07", gender: "male" },
  { id: "fukuda",   fullName: "福田 知輝",   birth: "1993-11-03", gender: "male" },
  { id: "rikihisa", fullName: "力久 凌太郎", birth: "1998-07-08", gender: "male" },
  { id: "konishi",  fullName: "小西 雄一郎", birth: "2000-07-17", gender: "male" },
  { id: "takaie",   fullName: "高家 陸斗",   birth: "2000-08-06", gender: "male" },
];
