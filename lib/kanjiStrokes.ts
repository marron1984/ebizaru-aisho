// 姓名判断用 漢字画数辞典
// 注: 姓名判断では旧字体の画数を採るのが伝統 (熊崎式)。一般的な辞書値に合わせる。
// 必要な文字を team/owner に出てくる範囲で網羅。未登録の文字は default = 0 として警告できるよう lookupStrokes() で吸収。

export const KANJI_STROKES: Record<string, number> = {
  // owner: 吉田 駿成
  吉: 6,
  田: 5,
  駿: 17,
  成: 7,

  // team
  大: 3,
  高: 10,
  光: 6,
  二: 2,

  能: 10,
  勢: 13,

  健: 11,
  太: 4,
  郎: 9,

  岡: 8,
  本: 5,
  雄: 12,
  介: 4,

  内: 4,
  山: 3,
  航: 10,

  福: 14,
  知: 8,
  輝: 15,

  力: 2,
  久: 3,
  凌: 10,

  小: 3,
  西: 6,
  一: 1,

  家: 10,
  陸: 11,
  斗: 4,
};

export function lookupStrokes(ch: string): number {
  return KANJI_STROKES[ch] ?? 0;
}

export function strokesOfName(name: string): number[] {
  return [...name].filter((c) => c.trim()).map(lookupStrokes);
}
