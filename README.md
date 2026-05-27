# ebizaru-aisho

私的占断 / 相性マップ — Next.js (App Router) + TypeScript。

## ローカル開発

```bash
npm install
npm run dev
# http://localhost:3000
```

## ビルド

```bash
npm run build && npm run start
```

## デプロイ (Vercel)

1. https://vercel.com/new で本リポジトリ (marron1984/ebizaru-aisho) を Import
2. Framework Preset: **Next.js** (自動検出)
3. Root Directory: そのまま (`./`)
4. Environment Variables: 不要 (BYOK や外部 API 連携は現状なし)
5. Deploy を押す

URL を身内に共有するだけ。検索インデックスに乗せたくない場合は Vercel のプロジェクト設定で **Password Protection** を有効化、もしくは `app/robots.ts` で全パスを `disallow` してください。

## 機能

- **チームモード** (`/`)
  - 中心 (VIEWPOINT) と 8 名の RELATIONSHIP MAP
  - 視点（中心人物）はピル or ノードのクリックで切り替え可
  - 右パネル TEAM FORECAST に各人の 仕事/対人/健康/金運 と 姓名 総格
  - ヘッダー: 日付・月相（自前 SVG）・現在節気
  - エディトリアルバンド: 太陽黄経・月黄経・月齢・節気→次節気
- **任意 2 人モード** (`/compat`)
  - A/B に名前・生年月日・性別・MBTI を入力 → 双方向の相性
  - 各人のプロファイル: 太陽星座・本命星・日柱・ライフパス・本命卦・五格・8 方位吉凶

## 実装エンジン

| エンジン | ファイル | 状態 |
| --- | --- | --- |
| 太陽星座 | `lib/astrology.ts` | ✅ |
| 太陽黄経 (Meeus 簡易) | `lib/astronomy.ts` | ✅ |
| 月黄経 (ELP2000 簡易 12 項) | `lib/astronomy.ts` | ✅ |
| 月相 (8 区分) | `lib/astronomy.ts` | ✅ |
| 24 節気 (二分法) | `lib/astronomy.ts` | ✅ |
| 九星 本命星 + 五行関係 | `lib/kyusei.ts` | ✅ |
| 四柱推命 (年柱/日柱/通変星/地支) | `lib/shichu.ts` | ✅ |
| 数秘術 ライフパス | `lib/numerology.ts` | ✅ |
| 姓名判断 五格 + 熊崎式 1-81 | `lib/seimei.ts` | ✅ |
| 風水 本命卦 + 8 方位 | `lib/fengshui.ts` | ✅ |
| MBTI 16 タイプ + 相性 | `lib/mbti.ts` | ✅ |
| 相性合成 | `lib/compat.ts` | ✅ |

## データ

- `lib/owner.ts` — 吉田駿成（名前・生年月日・性別・MBTI のみ。詳細住所は含めない）
- `lib/team.ts` — 8 名分の氏名・生年月日。性別は仮で male。
- `lib/kanjiStrokes.ts` — 姓名判断用 漢字画数辞典（owner + team の使用文字を網羅）

## ライセンス

私的占断のため非公開想定。
