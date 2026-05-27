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
    <div className="px-8 py-3 border-b border-black/8 flex items-center gap-6 text-[11px] text-neutral-600 bg-paper">
      <span className="editorial-label">Astronomy</span>
      <span className="kanji">太陽黄経 <span className="num text-neutral-800">{fmt(sl)}</span></span>
      <span className="kanji">月黄経 <span className="num text-neutral-800">{fmt(ml)}</span></span>
      <span className="kanji">月齢 <span className="num text-neutral-800">{mp.age.toFixed(1)}</span></span>
      <span className="kanji">{mp.name}</span>
      <span className="text-neutral-300">/</span>
      <span className="kanji">節気 <span className="text-neutral-800">{st.current.name}</span> → <span className="text-neutral-800">{st.next.name}</span> <span className="num text-neutral-500">{nd}</span></span>
    </div>
  );
}
