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
      <span className="w-8 kanji text-neutral-500">{label}</span>
      <div className="flex-1 h-[3px] bg-neutral-200/70 relative">
        <div className="absolute inset-y-0 left-0" style={{ width: `${value}%`, background: color }} />
      </div>
      <span className="w-6 text-right num text-neutral-700">{value}</span>
    </div>
  );
}

function CenterCard({ profile, score }: { profile: Profile; score: CompatBreakdown }) {
  const k = profile.kakusu;
  return (
    <div className="bg-ink text-paper px-4 py-3 rounded-md">
      <div className="flex items-baseline justify-between">
        <div>
          <span className="kanji text-[15px]">{profile.person.fullName}</span>
          <span className="kanji text-[11px] text-neutral-400 ml-2">
            本人 / {profile.person.displayName}
          </span>
        </div>
        <span className="num text-[28px] font-light text-sage-200">{score.overall}</span>
      </div>
      <div className="mt-3 space-y-1.5">
        <Bar label="仕事" value={score.work}   color="#9fb27a" />
        <Bar label="対人" value={score.social} color="#9fb27a" />
        <Bar label="健康" value={score.health} color="#9fb27a" />
        <Bar label="金運" value={score.wealth} color="#9fb27a" />
      </div>
      <div className="mt-3 text-[10px] text-neutral-400 kanji leading-relaxed">
        {profile.honmeiName} / {profile.dayGanzhi} ・ {profile.sunJa}
      </div>
      <div className="text-[10px] text-neutral-500 kanji">
        姓名 総格 <span className="num">{k.so}</span> {k.soJ} ・ 人格 <span className="num">{k.jin}</span> {k.jinJ}
      </div>
    </div>
  );
}

function OtherCard({ profile, detail }: { profile: Profile; detail: CompatDetail }) {
  return (
    <div className="border-b border-neutral-200 pb-3">
      <div className="flex items-baseline justify-between">
        <div>
          <span className="kanji text-[14px]">{profile.person.fullName}</span>
          {profile.person.role && (
            <span className="kanji text-[10px] text-neutral-500 ml-2">{profile.person.role}</span>
          )}
        </div>
        <span className="num text-[26px] font-light text-sage-700">{detail.overall}</span>
      </div>
      <div className="mt-2 space-y-1">
        <Bar label="仕事" value={detail.work}   color="#8a9966" />
        <Bar label="対人" value={detail.social} color="#8a9966" />
        <Bar label="健康" value={detail.health} color="#8a9966" />
        <Bar label="金運" value={detail.wealth} color="#8a9966" />
      </div>
      <div className="mt-2 flex items-center justify-between text-[10px] kanji text-neutral-500">
        <span>{profile.honmeiName} / {profile.dayGanzhi} ・ 今日「{detail.tongbian}」</span>
        <span>姓名 <span className="num">{profile.kakusu.so}</span> {profile.kakusu.soJ}</span>
      </div>
    </div>
  );
}

export function TeamForecast({ center, centerSelfScore, others }: Props) {
  return (
    <aside className="w-[360px] shrink-0 p-6 border-l border-black/8 bg-paper">
      <div className="editorial-label mb-4">Team Forecast</div>
      <CenterCard profile={center} score={centerSelfScore} />
      <div className="mt-5 space-y-4">
        {others.map((p) => {
          const detail = calcCompat(center, p);
          return <OtherCard key={p.person.id} profile={p} detail={detail} />;
        })}
      </div>
    </aside>
  );
}
