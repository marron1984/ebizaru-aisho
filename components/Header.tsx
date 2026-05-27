"use client";

import { useMemo } from "react";
import { moonPhase, currentSolarTerm } from "@/lib/astronomy";
import { MoonGlyph } from "./MoonGlyph";

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
    <header className="border-b border-black/8 bg-paper">
      {/* 上段: ロゴ + 日付 + 月相 + 節気 + rightSlot */}
      <div className="flex items-center gap-3 px-4 md:px-8 py-3 md:py-5 flex-wrap md:flex-nowrap">
        <div className="flex items-baseline gap-2 md:gap-3 shrink-0">
          <span className="kanji text-[18px] md:text-[22px] font-semibold tracking-[0.22em] md:tracking-[0.28em]">NOSE URANAI</span>
          <span className="hidden sm:inline text-[11px] text-neutral-500 tracking-[0.2em] kanji">私的占断 / N°382</span>
        </div>

        <div className="md:hidden ml-auto flex items-center gap-2">
          {rightSlot}
        </div>

        {/* 中段（デスクトップ用タブ） */}
        <nav className="hidden md:flex items-center gap-1 mx-auto">
          {TABS.map((t, i) => (
            <button
              key={t}
              className={[
                "px-4 py-1.5 rounded-full text-[13px] kanji border transition-colors",
                i === 6 ? "bg-ink text-paper border-ink" : "border-neutral-300 text-neutral-700 hover:bg-neutral-100",
              ].join(" ")}
            >
              {t}
            </button>
          ))}
        </nav>

        {/* 右側: 日付・月相・節気・rightSlot */}
        <div className="flex items-center gap-2 ml-auto md:ml-0 w-full md:w-auto overflow-x-auto md:overflow-visible no-scrollbar">
          <input
            type="date"
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
            className="border border-neutral-300 rounded-md px-2 py-1.5 text-[16px] md:text-[12px] num bg-white shrink-0"
          />
          <div
            className="flex items-center gap-1.5 px-2 py-1 rounded-full border border-neutral-300 bg-white shrink-0"
            title={`${mp.name} / 月齢 ${mp.age.toFixed(1)}`}
          >
            <MoonGlyph phase={mp.phase} size={18} />
            <span className="text-[10px] kanji text-neutral-600">{mp.name}</span>
          </div>
          <div
            className="flex items-center gap-1 px-2 py-1 rounded-full border border-neutral-300 bg-white shrink-0"
            title={`次の節気: ${st.next.name} (${formatMD(st.nextDate)})`}
          >
            <span className="text-[10px] kanji text-neutral-600">{st.current.name}</span>
          </div>
          <button className="hidden sm:flex w-8 h-8 rounded-full border border-neutral-300 items-center justify-center text-[14px] text-neutral-500 shrink-0" title="追加">
            +
          </button>
          <button className="hidden sm:flex w-8 h-8 rounded-full border border-neutral-300 items-center justify-center text-[12px] text-neutral-500 shrink-0" title="切替">
            ⇄
          </button>
          <button className="hidden lg:flex ml-1 items-center gap-2 px-3 py-1.5 border border-neutral-300 rounded-full text-[12px] kanji shrink-0">
            <span className="w-2 h-2 rounded-full bg-neutral-300 inline-block" /> エディトリアル ▾
          </button>
          <div className="hidden md:block shrink-0">{rightSlot}</div>
        </div>
      </div>

      {/* モバイル用タブ (横スクロール) */}
      <nav className="md:hidden flex items-center gap-1 px-4 pb-3 overflow-x-auto no-scrollbar">
        {TABS.map((t, i) => (
          <button
            key={t}
            className={[
              "px-3 py-1.5 rounded-full text-[12px] kanji border transition-colors shrink-0",
              i === 6 ? "bg-ink text-paper border-ink" : "border-neutral-300 text-neutral-700",
            ].join(" ")}
          >
            {t}
          </button>
        ))}
      </nav>
    </header>
  );
}
