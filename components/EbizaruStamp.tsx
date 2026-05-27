interface Props {
  size?: number;
  text?: string;
}

// 海老猿の赤丸スタンプ
export function EbizaruStamp({ size = 56, text = "海老猿" }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" className="inline-block -rotate-6 shrink-0">
      <circle cx="40" cy="40" r="36" fill="none" stroke="#c41f1f" strokeWidth="3" />
      <circle cx="40" cy="40" r="30" fill="none" stroke="#c41f1f" strokeWidth="1.4" strokeDasharray="2 2" />
      <text
        x="40"
        y="46"
        textAnchor="middle"
        fontFamily='"Noto Serif JP", serif'
        fontWeight="900"
        fontSize="18"
        fill="#c41f1f"
        letterSpacing="1"
      >
        {text}
      </text>
    </svg>
  );
}
