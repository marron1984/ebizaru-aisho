"use client";

import { useMemo } from "react";
import type { Profile } from "@/lib/profile";
import { calcCompat } from "@/lib/compat";

interface Props {
  center: Profile;
  others: Profile[];
  centerSelf: number;
  onSelectViewpoint?: (id: string) => void;
}

// score → ポップな配色
function toneFor(score: number): { fill: string; ink: string; ring: string } {
  if (score >= 85) return { fill: "#ff5b8d", ink: "#fff", ring: "#0a0a0a" }; // ピンク
  if (score >= 70) return { fill: "#e63232", ink: "#fff", ring: "#0a0a0a" }; // 赤
  if (score >= 55) return { fill: "#ffd23f", ink: "#0a0a0a", ring: "#0a0a0a" }; // 黄
  if (score >= 40) return { fill: "#3ec1d3", ink: "#0a0a0a", ring: "#0a0a0a" }; // シアン
  return { fill: "#0a1846", ink: "#fff8e8", ring: "#0a0a0a" }; // ネイビー
}

export function RelationshipMap({ center, others, centerSelf, onSelectViewpoint }: Props) {
  const W = 720;
  const H = 720;
  const cx = W / 2;
  const cy = H / 2;
  const R = 240;

  const nodes = useMemo(() => {
    return others.map((p, i) => {
      const angle = -Math.PI / 2 + (i * (2 * Math.PI)) / others.length;
      const x = cx + R * Math.cos(angle);
      const y = cy + R * Math.sin(angle);
      const compat = calcCompat(center, p);
      return { profile: p, x, y, score: compat.overall, compat, angle };
    });
  }, [center, others, cx, cy]);

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center gap-3 mb-4 md:mb-6">
        <span className="display text-[22px] md:text-[28px] tracking-wider text-ebi-600">RELATIONSHIP MAP</span>
        <span className="patch-yellow text-[11px] px-2 py-0.5 font-bold kanji skew-tape">海老猿チーム</span>
      </div>

      <div className="mb-5 md:mb-8 -mx-4 md:mx-0 px-4 md:px-0">
        <div className="md:hidden editorial-label mb-2">Viewpoint 視点</div>
        <div className="flex items-center gap-2 md:gap-3 md:flex-wrap overflow-x-auto md:overflow-visible no-scrollbar pb-2">
          <span className="hidden md:inline editorial-label">Viewpoint 視点</span>
          <button
            onClick={() => onSelectViewpoint?.(center.person.id)}
            className="patch-red text-white flex items-center gap-2 pl-2 pr-3 py-1.5 text-[13px] font-bold shrink-0 -rotate-1"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-sun inline-block" />
            <span className="kanji">{center.person.fullName}</span>
            <span className="text-[10px] tracking-widest text-cream font-black ml-1">CENTER</span>
            <span className="num text-sun">{centerSelf}</span>
          </button>
          {others.map((p) => {
            const c = calcCompat(center, p);
            return (
              <button
                key={p.person.id}
                onClick={() => onSelectViewpoint?.(p.person.id)}
                className="patch flex items-center gap-2 pl-2 pr-3 py-1.5 text-[13px] font-bold shrink-0 hover:-rotate-1 transition-transform"
              >
                <span className="kanji">{p.person.fullName}</span>
                <span className="num text-ebi-600">{c.overall}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="relative">
        {/* 背景の十字＋同心円ステッカー */}
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[760px] mx-auto block">
          <defs>
            <pattern id="dots" width="14" height="14" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.2" fill="#0a0a0a" opacity="0.08" />
            </pattern>
          </defs>
          <rect x="0" y="0" width={W} height={H} fill="url(#dots)" />

          {[110, 180, 250, 320].map((r, i) => (
            <circle
              key={r}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke="#0a0a0a"
              strokeOpacity={i === 2 ? 0.6 : 0.15}
              strokeWidth={i === 2 ? 2 : 1}
              strokeDasharray={i === 2 ? "0" : "4 6"}
            />
          ))}

          {/* 接続線 */}
          {nodes.map((n) => (
            <g key={`l-${n.profile.person.id}`}>
              <line
                x1={cx}
                y1={cy}
                x2={n.x}
                y2={n.y}
                stroke="#0a0a0a"
                strokeOpacity={0.5}
                strokeWidth={1.5}
                strokeDasharray="5 5"
              />
              {/* スコアラベル: 赤いふきだし */}
              <g transform={`translate(${cx + (n.x - cx) * 0.45}, ${cy + (n.y - cy) * 0.45})`}>
                <rect x={-18} y={-12} width={36} height={22} rx={11} fill="#ffd23f" stroke="#0a0a0a" strokeWidth={2} />
                <text
                  textAnchor="middle"
                  y={5}
                  fontFamily="JetBrains Mono"
                  fontWeight={700}
                  fontSize={14}
                  fill="#0a0a0a"
                >
                  {n.compat.overall}
                </text>
              </g>
            </g>
          ))}

          {/* 周辺ノード */}
          {nodes.map((n) => {
            const tone = toneFor(n.score);
            return (
              <g
                key={n.profile.person.id}
                transform={`translate(${n.x}, ${n.y})`}
                className="cursor-pointer"
                onClick={() => onSelectViewpoint?.(n.profile.person.id)}
              >
                {/* 黒の影 */}
                <circle cx={4} cy={4} r={48} fill="#0a0a0a" />
                {/* 本体 */}
                <circle r={48} fill={tone.fill} stroke={tone.ring} strokeWidth={3} />
                <text
                  textAnchor="middle"
                  y={10}
                  fontFamily="Anton, Bebas Neue"
                  fontWeight={900}
                  fontSize={36}
                  fill={tone.ink}
                >
                  {n.score}
                </text>
                {/* 名前 (黒タグ) */}
                <g transform="translate(0, 76)">
                  <rect
                    x={-55}
                    y={-13}
                    width={110}
                    height={22}
                    rx={5}
                    fill="#0a0a0a"
                  />
                  <text
                    textAnchor="middle"
                    y={3}
                    fontFamily='"Noto Sans JP"'
                    fontSize={13}
                    fontWeight={700}
                    fill="#fff8e8"
                  >
                    {n.profile.person.fullName}
                  </text>
                </g>
                <text
                  textAnchor="middle"
                  y={104}
                  fontFamily='"Noto Sans JP"'
                  fontSize={10}
                  fontWeight={600}
                  fill="#0a0a0a"
                >
                  {n.profile.honmeiName} ／ {n.profile.dayGanzhi}
                </text>
              </g>
            );
          })}

          {/* 中央ノード: 赤いスタンプ風 */}
          <g transform={`translate(${cx}, ${cy})`}>
            {/* VIEWPOINT タグ */}
            <g transform="translate(0, -100) rotate(-4)">
              <rect x={-60} y={-15} width={120} height={28} rx={6} fill="#0a0a0a" />
              <text
                textAnchor="middle"
                y={6}
                fontFamily="Bebas Neue, Anton"
                fontSize={20}
                letterSpacing={3}
                fill="#ffd23f"
              >
                VIEWPOINT
              </text>
            </g>
            {/* 影 */}
            <circle cx={5} cy={5} r={68} fill="#0a0a0a" />
            {/* 本体 */}
            <circle r={68} fill="#e63232" stroke="#0a0a0a" strokeWidth={3.5} />
            <circle r={60} fill="none" stroke="#fff8e8" strokeWidth={2} strokeDasharray="3 4" />
            <text
              textAnchor="middle"
              y={12}
              fontFamily="Anton, Bebas Neue"
              fontWeight={900}
              fontSize={48}
              fill="#fff8e8"
            >
              {centerSelf}
            </text>
            {/* 中央名タグ */}
            <g transform="translate(0, 102)">
              <rect x={-72} y={-15} width={144} height={28} rx={6} fill="#fff8e8" stroke="#0a0a0a" strokeWidth={2} />
              <text
                textAnchor="middle"
                y={6}
                fontFamily='"Noto Sans JP"'
                fontSize={16}
                fontWeight={900}
                fill="#0a0a0a"
              >
                {center.person.fullName}
              </text>
            </g>
            <text
              textAnchor="middle"
              y={140}
              fontFamily='"Noto Sans JP"'
              fontSize={11}
              fontWeight={600}
              fill="#0a0a0a"
            >
              {center.honmeiName} ／ {center.dayGanzhi}
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
}
