"use client";

import type { Profile } from "@/lib/profile";
import { calcCompat, type CompatBreakdown, type CompatDetail } from "@/lib/compat";

interface Props {
  center: Profile;
  centerSelfScore: CompatBreakdown;
  others: Profile[];
}

function Bar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-2 text-[11px]">
      <span className="w-8 kanji font-bold opacity-80">{label}</span>
      <div className="flex-1 h-[6px] bg-black/15 relative rounded-full border border-ink/30 overflow-hidden">
        <div className="absolute inset-y-0 left-0" style={{ width: `${value}%`, background: color }} />
      </div>
      <span className="w-7 text-right num">{value}</span>
    </div>
  );
}

function CenterCard({ profile, score }: { profile: Profile; score: CompatBreakdown }) {
  const k = profile.kakusu;
  return (
    <div className="patch-red text-white px-4 py-3 -rotate-1 relative">
      <div className="absolute -top-3 -right-3 patch-yellow text-[10px] font-black px-2 py-0.5 kanji rotate-3">
        本人
      </div>
      <div className="flex items-baseline justify-between">
        <div>
          <span className="kanji text-[15px] font-black">{profile.person.fullName}</span>
          <span className="kanji text-[11px] text-cream/80 ml-2">
            / {profile.person.displayName}
          </span>
        </div>
        <span className="num text-[32px] text-sun leading-none">{score.overall}</span>
      </div>
      <div className="mt-3 space-y-1.5">
        <Bar label="仕事" value={score.work}   color="#ffd23f" />
        <Bar label="対人" value={score.social} color="#ffd23f" />
        <Bar label="健康" value={score.health} color="#ffd23f" />
        <Bar label="金運" value={score.wealth} color="#ffd23f" />
      </div>
      <div className="mt-3 text-[10px] text-cream kanji leading-relaxed font-bold">
        {profile.honmeiName} ／ {profile.dayGanzhi} ／ {profile.sunJa}
      </div>
      <div className="text-[10px] text-cream/80 kanji">
        姓名 総格 <span className="num">{k.so}</span> {k.soJ} ／ 人格 <span className="num">{k.jin}</span> {k.jinJ}
      </div>
    </div>
  );
}

function OtherCard({ profile, detail }: { profile: Profile; detail: CompatDetail }) {
  const tier = detail.overall >= 85 ? "pink" : detail.overall >= 70 ? "red" : detail.overall >= 55 ? "yellow" : detail.overall >= 40 ? "cyan" : "navy";
  const tone = {
    pink: { bg: "bg-pop-pink", text: "text-white" },
    red:  { bg: "bg-ebi-500",  text: "text-white" },
    yellow:{ bg: "bg-sun",     text: "text-ink"   },
    cyan: { bg: "bg-pop-cyan", text: "text-ink"   },
    navy: { bg: "bg-navy",     text: "text-cream" },
  }[tier];

  return (
    <div className="patch p-3 relative">
      <div className="flex items-baseline justify-between">
        <div>
          <span className="kanji text-[14px] font-black">{profile.person.fullName}</span>
          {profile.person.role && (
            <span className="kanji text-[10px] text-neutral-500 ml-2">{profile.person.role}</span>
          )}
        </div>
        <div className={`${tone.bg} ${tone.text} border-2 border-ink rounded-full px-2.5 py-0.5 font-black num text-[20px] leading-none -rotate-2`}>
          {detail.overall}
        </div>
      </div>
      <div className="mt-2 space-y-1">
        <Bar label="仕事" value={detail.work}   color="#e63232" />
        <Bar label="対人" value={detail.social} color="#e63232" />
        <Bar label="健康" value={detail.health} color="#e63232" />
        <Bar label="金運" value={detail.wealth} color="#e63232" />
      </div>
      <div className="mt-2 flex items-center justify-between text-[10px] kanji text-ink/70 font-bold">
        <span>{profile.honmeiName} ／ {profile.dayGanzhi} ／ {detail.tongbian}</span>
        <span>姓名 <span className="num">{profile.kakusu.so}</span> {profile.kakusu.soJ}</span>
      </div>
    </div>
  );
}

export function TeamForecast({ center, centerSelfScore, others }: Props) {
  return (
    <aside className="w-full md:w-[380px] shrink-0 px-4 py-5 md:p-6 border-t-[3px] md:border-t-0 md:border-l-[3px] border-ink bg-cream">
      <div className="flex items-center gap-2 mb-4">
        <span className="display text-ebi-600 text-[24px] tracking-wider">TEAM FORECAST</span>
        <span className="patch-yellow text-[10px] px-2 py-0.5 font-bold kanji skew-tape-r">本日の盤</span>
      </div>
      <CenterCard profile={center} score={centerSelfScore} />
      <div className="mt-6 space-y-3">
        {others.map((p) => {
          const detail = calcCompat(center, p);
          return <OtherCard key={p.person.id} profile={p} detail={detail} />;
        })}
      </div>
    </aside>
  );
}
