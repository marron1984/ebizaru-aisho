"use client";

const TABS = ["星占", "塔羅", "数秘", "易経", "四柱", "風水", "MBTI"];

interface Props {
  date: string;
  onDateChange: (v: string) => void;
}

export function Header({ date, onDateChange }: Props) {
  return (
    <header className="flex items-center gap-6 px-8 py-5 border-b border-black/8">
      <div className="flex items-baseline gap-3">
        <span className="kanji text-[22px] font-semibold tracking-[0.28em]">URANAI</span>
        <span className="text-[11px] text-neutral-500 tracking-[0.2em]">私的占断 / N°382</span>
      </div>

      <nav className="flex items-center gap-1 mx-auto">
        {TABS.map((t, i) => (
          <button
            key={t}
            className={[
              "px-4 py-1.5 rounded-full text-[13px] kanji border",
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
        <button className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center text-[14px]" title="月相">
          ●
        </button>
        <button className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center text-[14px]" title="追加">
          +
        </button>
        <button className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center text-[12px]" title="切替">
          ⇄
        </button>
        <button className="ml-1 flex items-center gap-2 px-3 py-1.5 border border-neutral-300 rounded-full text-[12px] kanji">
          <span className="w-2 h-2 rounded-full bg-neutral-300 inline-block" /> エディトリアル ▾
        </button>
      </div>
    </header>
  );
}
