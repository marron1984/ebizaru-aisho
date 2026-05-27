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
    <header className="flex items-center gap-6 px-8 py-5 border-b border-black/8">
      <div className="flex items-baseline gap-3">
        <span className="kanji text-[22px] font-semibold tracking-[0.28em]">URANAI</span>
        <span className="text-[11px] text-neutral-500 tracking-[0.2em] kanji">私的占断 / N°382</span>
      </div>

      <nav className="flex items-center gap-1 mx-auto">
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

      <div className="flex items-center gap-2">
        <input
          type="date"
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
          className="border border-neutral-300 rounded-md px-2 py-1 text-[12px] num bg-white"
        />
        <div
          className="flex items-center gap-1.5 px-2 py-1 rounded-full border border-neutral-300 bg-white"
          title={`${mp.name} / 月齢 ${mp.age.toFixed(1)}`}
        >
          <MoonGlyph phase={mp.phase} size={18} />
          <span className="text-[10px] kanji text-neutral-600">{mp.name}</span>
        </div>
        <div
          className="flex items-center gap-1 px-2 py-1 rounded-full border border-neutral-300 bg-white"
          title={`次の節気: ${st.next.name} (${formatMD(st.nextDate)})`}
        >
          <span className="text-[10px] kanji text-neutral-600">{st.current.name}</span>
        </div>
        <button className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center text-[14px] text-neutral-500" title="追加">
          +
        </button>
        <button className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center text-[12px] text-neutral-500" title="切替">
          ⇄
        </button>
        <button className="ml-1 flex items-center gap-2 px-3 py-1.5 border border-neutral-300 rounded-full text-[12px] kanji">
          <span className="w-2 h-2 rounded-full bg-neutral-300 inline-block" /> エディトリアル ▾
        </button>
        {rightSlot}
      </div>
    </header>
  );
}
