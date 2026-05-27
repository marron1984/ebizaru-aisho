"use client";

import { useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { RelationshipMap } from "@/components/RelationshipMap";
import { TeamForecast } from "@/components/TeamForecast";
import { OWNER } from "@/lib/owner";
import { TEAM } from "@/lib/team";
import { buildProfile } from "@/lib/profile";
import { selfScore } from "@/lib/compat";

function todaySeed(date: string): number {
  const [y, m, d] = date.split("-").map(Number);
  return y * 10000 + m * 100 + d;
}

export default function Home() {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));

  const center = useMemo(() => buildProfile(OWNER), []);
  const others = useMemo(() => TEAM.map(buildProfile), []);
  const centerSelf = useMemo(() => selfScore(center, todaySeed(date)), [center, date]);

  return (
    <main className="min-h-screen flex flex-col">
      <Header date={date} onDateChange={setDate} />
      <div className="flex flex-1">
        <section className="flex-1 min-w-0">
          <RelationshipMap center={center} others={others} centerSelf={centerSelf.overall} />
        </section>
        <TeamForecast center={center} centerSelfScore={centerSelf} others={others} />
      </div>
    </main>
  );
}
