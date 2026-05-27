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

// score → ノードのカラートーン
function toneFor(score: number): { ring: string; fill: string } {
  if (score >= 90) return { ring: "#7b8a52", fill: "#dcd2bf" }; // sage / sand
  if (score >= 75) return { ring: "#8da06b", fill: "#e8e0cd" };
  if (score >= 60) return { ring: "#aab581", fill: "#efe9d6" };
  if (score >= 40) return { ring: "#c2b495", fill: "#eee3c8" };
  return { ring: "#6f7d8c", fill: "#cfd6df" };
}

export function RelationshipMap({ center, others, centerSelf, onSelectViewpoint }: Props) {
  const W = 720;
  const H = 720;
  const cx = W / 2;
  const cy = H / 2;
  const R = 240;

  const nodes = useMemo(() => {
    return others.map((p, i) => {
      const angle = (-Math.PI / 2) + (i * (2 * Math.PI)) / others.length;
      const x = cx + R * Math.cos(angle);
      const y = cy + R * Math.sin(angle);
      const compat = calcCompat(center, p);
      return { profile: p, x, y, score: compat.overall, compat, angle };
    });
  }, [center, others, cx, cy]);

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center gap-4 mb-3 md:mb-6">
        <span className="editorial-label">Relationship Map</span>
      </div>

      <div className="mb-5 md:mb-8 -mx-4 md:mx-0 px-4 md:px-0">
        <div className="md:hidden editorial-label mb-2">Viewpoint 視点</div>
        <div className="flex items-center gap-2 md:gap-3 md:flex-wrap overflow-x-auto md:overflow-visible no-scrollbar pb-1">
          <span className="hidden md:inline editorial-label">Viewpoint 視点</span>
          <button
            onClick={() => onSelectViewpoint?.(center.person.id)}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 border-2 border-ink rounded-full text-[13px] bg-paper shadow-[0_0_0_2px_rgba(180,160,100,0.35)] shrink-0"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-sand-400" />
            <span className="kanji font-medium">{center.person.fullName}</span>
            <span className="editorial-label !text-[10px] ml-1">CENTER</span>
            <span className="num text-sage-700 font-semibold">{centerSelf}</span>
          </button>
          {others.map((p) => {
            const c = calcCompat(center, p);
            return (
              <button
                key={p.person.id}
                onClick={() => onSelectViewpoint?.(p.person.id)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 border border-neutral-300 rounded-full text-[13px] bg-white hover:bg-neutral-50 transition-colors shrink-0"
              >
                <span className="kanji">{p.person.fullName}</span>
                <span className="num text-neutral-500">{c.overall}</span>
              </button>
            );
          })}
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[720px] mx-auto block">
        {/* 同心円 */}
        {[80, 150, 240, 320].map((r, i) => (
          <circle key={r} cx={cx} cy={cy} r={r} fill="none" stroke="#c9c9c0" strokeOpacity={0.5} strokeDasharray={i === 2 ? "0" : "3 4"} />
        ))}
        {/* 中央水平・垂直軸 */}
        <line x1={cx - 340} y1={cy} x2={cx + 340} y2={cy} stroke="#c9c9c0" strokeOpacity={0.3} />
        <line x1={cx} y1={cy - 340} x2={cx} y2={cy + 340} stroke="#c9c9c0" strokeOpacity={0.3} />

        {/* 接続線とスコアラベル */}
        {nodes.map((n) => (
          <g key={`l-${n.profile.person.id}`}>
            <line x1={cx} y1={cy} x2={n.x} y2={n.y} stroke="#9b9485" strokeDasharray="4 5" strokeOpacity={0.7} />
            <text
              x={cx + (n.x - cx) * 0.45}
              y={cy + (n.y - cy) * 0.45 - 4}
              textAnchor="middle"
              className="num"
              fontSize={14}
              fill="#8a7a4e"
            >
              {n.compat.overall}
            </text>
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
              <circle r={48} fill="none" stroke={tone.ring} strokeWidth={3} />
              <circle r={40} fill={tone.fill} />
              <text textAnchor="middle" y={6} fontSize={22} className="num" fill="#1a1a1a">
                {n.score}
              </text>
              <text textAnchor="middle" y={78} fontSize={16} className="kanji" fill="#1a1a1a">
                {n.profile.person.fullName}
              </text>
              <text textAnchor="middle" y={98} fontSize={11} fill="#7a7a72">
                {n.profile.honmeiName} / {n.profile.dayGanzhi}
              </text>
            </g>
          );
        })}

        {/* 中央ノード */}
        <g transform={`translate(${cx}, ${cy})`}>
          <rect x={-44} y={-100} width={88} height={20} rx={4} fill="#1a1a1a" />
          <text y={-86} textAnchor="middle" fontSize={11} fill="#fafaf7" letterSpacing={2}>
            VIEWPOINT
          </text>
          <circle r={62} fill="none" stroke="#1a1a1a" strokeWidth={2.5} />
          <circle r={54} fill="#e8d9c6" />
          <text textAnchor="middle" y={10} fontSize={30} className="num" fill="#1a1a1a">
            {centerSelf}
          </text>
          <text textAnchor="middle" y={92} fontSize={17} className="kanji" fill="#1a1a1a">
            {center.person.fullName}（中心）
          </text>
          <text textAnchor="middle" y={112} fontSize={11} fill="#7a7a72">
            {center.honmeiName} / {center.dayGanzhi}
          </text>
        </g>
      </svg>
    </div>
  );
}
