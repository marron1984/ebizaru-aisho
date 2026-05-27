"use client";

import { useMemo } from "react";
import { sunLongitude, moonLongitude, moonPhase, currentSolarTerm } from "@/lib/astronomy";

interface Props {
  date: string;
}

function fmt(deg: number): string {
  const d = Math.floor(deg);
  const m = Math.floor((deg - d) * 60);
  return `${d}°${String(m).padStart(2, "0")}′`;
}

function Chip({ label, value, tone = "white" }: { label: string; value: string; tone?: "white" | "yellow" | "red" | "navy" }) {
  const styles = {
    white: "bg-white text-ink",
    yellow: "bg-sun text-ink",
    red: "bg-ebi-500 text-white",
    navy: "bg-navy text-cream",
  }[tone];
  return (
    <span className={`${styles} border-2 border-ink shadow-patch rounded-full px-2.5 py-1 inline-flex items-center gap-1.5 shrink-0`}>
      <span className="text-[9px] kanji font-bold opacity-70 uppercase tracking-widest">{label}</span>
      <span className="num text-[12px]">{value}</span>
    </span>
  );
}

export function EditorialBand({ date }: Props) {
  const d = useMemo(() => {
    const [y, m, dd] = date.split("-").map(Number);
    return new Date(Date.UTC(y, m - 1, dd, 12, 0, 0));
  }, [date]);

  const sl = sunLongitude(d);
  const ml = moonLongitude(d);
  const mp = moonPhase(d);
  const st = currentSolarTerm(d);
  const nd = `${st.nextDate.getMonth() + 1}/${st.nextDate.getDate()}`;

  return (
    <div className="border-b-[3px] border-ink bg-ink text-cream relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-25 pointer-events-none"
        style={{
          backgroundImage: "repeating-linear-gradient(-45deg, transparent 0 8px, rgba(255,210,63,0.4) 8px 9px)",
        }}
      />
      <div className="relative flex items-center gap-2 px-4 md:px-6 py-3 overflow-x-auto no-scrollbar">
        <span className="display text-cream text-[14px] tracking-wider mr-1 shrink-0">ASTRONOMY //</span>
        <Chip label="SUN" value={fmt(sl)} tone="yellow" />
        <Chip label="MOON" value={fmt(ml)} tone="white" />
        <Chip label="AGE" value={mp.age.toFixed(1)} tone="white" />
        <span className="text-cream kanji font-bold text-[12px] shrink-0">{mp.name}</span>
        <span className="text-cream/40 shrink-0">▸</span>
        <Chip label={st.current.name} value="今" tone="red" />
        <span className="text-cream/60 text-[11px] shrink-0">→</span>
        <Chip label={st.next.name} value={nd} tone="navy" />
      </div>
    </div>
  );
}
