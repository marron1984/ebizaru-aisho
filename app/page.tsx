"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { EditorialBand } from "@/components/EditorialBand";
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
  const [viewpointId, setViewpointId] = useState<string>(OWNER.id);

  const allProfiles = useMemo(() => [OWNER, ...TEAM].map(buildProfile), []);

  const center = useMemo(
    () => allProfiles.find((p) => p.person.id === viewpointId) ?? allProfiles[0],
    [allProfiles, viewpointId],
  );
  const others = useMemo(
    () => allProfiles.filter((p) => p.person.id !== viewpointId),
    [allProfiles, viewpointId],
  );

  const centerSelf = useMemo(() => selfScore(center, todaySeed(date)), [center, date]);

  return (
    <main className="min-h-screen flex flex-col">
      <Header
        date={date}
        onDateChange={setDate}
        rightSlot={
          <Link
            href="/compat"
            className="px-3 py-1.5 border-2 border-ink rounded-full text-[12px] kanji bg-sun text-ink shadow-patch font-bold hover:-rotate-1 transition-transform shrink-0"
          >
            二人モード →
          </Link>
        }
      />
      <EditorialBand date={date} />
      <div className="flex flex-col md:flex-row flex-1">
        <section className="flex-1 min-w-0 order-1">
          <RelationshipMap
            center={center}
            others={others}
            centerSelf={centerSelf.overall}
            onSelectViewpoint={setViewpointId}
          />
        </section>
        <TeamForecast center={center} centerSelfScore={centerSelf} others={others} />
      </div>
    </main>
  );
}
