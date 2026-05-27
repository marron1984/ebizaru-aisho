"use client";

// 月相 0..1 (0=新月, 0.5=満月) を受け取り、SVG で簡易月を描く
interface Props {
  phase: number;
  size?: number;
}

export function MoonGlyph({ phase, size = 22 }: Props) {
  const r = size / 2;
  // 単純な「半月＋楕円のシャドウ」表現。
  // phase が 0→1 で右半→満月→左半→新月
  const angle = phase * 2 * Math.PI;
  const cosA = Math.cos(angle);
  const rx = Math.abs(cosA) * r; // 楕円の長半径 (内側影)
  const lit = phase < 0.5 ? "right" : "left"; // 0..0.5 は右が満ちる、0.5..1 は左

  return (
    <svg width={size} height={size} viewBox={`-${r} -${r} ${size} ${size}`} className="inline-block">
      <circle r={r - 1} fill="#1a1a1a" />
      {phase < 0.02 || phase > 0.98 ? null : phase >= 0.48 && phase <= 0.52 ? (
        <circle r={r - 1} fill="#fafaf7" />
      ) : (
        <>
          {/* 半月の明部 (右 or 左) */}
          <path
            d={
              lit === "right"
                ? `M 0 -${r - 1} A ${r - 1} ${r - 1} 0 0 1 0 ${r - 1} Z`
                : `M 0 -${r - 1} A ${r - 1} ${r - 1} 0 0 0 0 ${r - 1} Z`
            }
            fill="#fafaf7"
          />
          {/* 楕円の上書き (満ち欠け部) */}
          <ellipse
            cx={0}
            cy={0}
            rx={rx}
            ry={r - 1}
            fill={cosA > 0 ? "#1a1a1a" : "#fafaf7"}
          />
        </>
      )}
      <circle r={r - 1} fill="none" stroke="#1a1a1a" strokeOpacity={0.4} />
    </svg>
  );
}
