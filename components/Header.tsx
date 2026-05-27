"use client";

import { useMemo } from "react";
import { moonPhase, currentSolarTerm } from "@/lib/astronomy";
import { MoonGlyph } from "./MoonGlyph";
import { EbizaruStamp } from "./EbizaruStamp";

const TABS = ["星占", "塔羅", "数秘", "易経", "四柱", "風水", "MBTI"];

interface Props {
  date: string;
  onDateChange: (v: string) => void;
  rightSlot?: React.ReactNode;
}

function formatMD(d: Date): string {
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

export function Header({ date, onDateChange, rightSlot }: Props) {
  const d = useMemo(() => {
    const [y, m, dd] = date.split("-").map(Number);
    return new Date(Date.UTC(y, m - 1, dd, 12, 0, 0));
  }, [date]);

  const mp = useMemo(() => moonPhase(d), [d]);
  const st = useMemo(() => currentSolarTerm(d), [d]);

  return (
    <header className="bg-ebi-500 text-white border-b-[3px] border-ink relative overflow-hidden">
      {/* ストライプ装飾 */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: "repeating-linear-gradient(45deg, #ffffff 0 12px, transparent 12px 24px)",
        }}
      />

      <div className="relative flex items-center gap-3 px-4 md:px-6 py-3 md:py-4 flex-wrap md:flex-nowrap">
        {/* ロゴ */}
        <div className="flex items-center gap-3 shrink-0">
          <EbizaruStamp size={48} />
          <div className="leading-none">
            <div className="display text-[26px] md:text-[32px] font-black tracking-wider text-white">
              NOSE URANAI
            </div>
            <div className="kanji text-[10px] md:text-[11px] tracking-[0.25em] text-cream font-bold">
              EBIZARU CO. ／ 私的占断 N°382
            </div>
          </div>
        </div>

        <div className="md:hidden ml-auto flex items-center gap-2">
          {rightSlot}
        </div>

        {/* タブ (デスクトップ) */}
        <nav className="hidden md:flex items-center gap-1.5 mx-auto">
          {TABS.map((t, i) => (
            <button
              key={t}
              className={[
                "px-3.5 py-1.5 rounded-full text-[13px] kanji border-2 border-ink font-bold transition-all",
                i === 6
                  ? "bg-sun text-ink shadow-patch -rotate-1"
                  : "bg-white text-ink hover:bg-cream-100 hover:-rotate-1",
              ].join(" ")}
            >
              {t}
            </button>
          ))}
        </nav>

        {/* 右側ステータス */}
        <div className="flex items-center gap-2 ml-auto md:ml-0 w-full md:w-auto overflow-x-auto md:overflow-visible no-scrollbar">
          <input
            type="date"
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
            className="border-2 border-ink rounded-md px-2 py-1.5 text-[16px] md:text-[12px] num bg-white text-ink shrink-0 shadow-patch"
          />
          <div
            className="flex items-center gap-1.5 px-2 py-1 rounded-full border-2 border-ink bg-navy text-cream shrink-0 shadow-patch"
            title={`${mp.name} / 月齢 ${mp.age.toFixed(1)}`}
          >
            <MoonGlyph phase={mp.phase} size={16} />
            <span className="text-[10px] kanji font-bold">{mp.name}</span>
          </div>
          <div
            className="flex items-center gap-1 px-2 py-1 rounded-full border-2 border-ink bg-sun text-ink shrink-0 shadow-patch font-bold"
            title={`次の節気: ${st.next.name} (${formatMD(st.nextDate)})`}
          >
            <span className="text-[10px] kanji">{st.current.name}</span>
          </div>
          <div className="hidden md:block shrink-0">{rightSlot}</div>
        </div>
      </div>

      {/* モバイル用タブ */}
      <nav className="md:hidden relative flex items-center gap-1.5 px-4 pb-3 overflow-x-auto no-scrollbar">
        {TABS.map((t, i) => (
          <button
            key={t}
            className={[
              "px-3 py-1.5 rounded-full text-[12px] kanji border-2 border-ink font-bold shrink-0",
              i === 6 ? "bg-sun text-ink shadow-patch" : "bg-white text-ink",
            ].join(" ")}
          >
            {t}
          </button>
        ))}
      </nav>

      {/* 黒の境界線 */}
      <div className="h-[3px] bg-ink" />
    </header>
  );
}
