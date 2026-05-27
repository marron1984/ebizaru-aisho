"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { EditorialBand } from "@/components/EditorialBand";
import { buildProfile } from "@/lib/profile";
import { calcCompat } from "@/lib/compat";
import { MBTI_TYPES, type MbtiType } from "@/lib/mbti";
import { RATING_DESC, dirRatings, DIRECTIONS } from "@/lib/fengshui";
import type { Gender } from "@/lib/types";

interface PersonInput {
  fullName: string;
  birth: string;
  gender: Gender;
  mbti: MbtiType | "";
}

function Form({
  side,
  v,
  onChange,
}: {
  side: "A" | "B";
  v: PersonInput;
  onChange: (next: PersonInput) => void;
}) {
  return (
    <div className="bg-white border border-neutral-200 rounded-md p-5 space-y-3">
      <div className="flex items-baseline justify-between">
        <span className="editorial-label">Person {side}</span>
        <span className="kanji text-[12px] text-neutral-400">入力</span>
      </div>
      <div>
        <label className="editorial-label !text-[10px]">Full Name 姓名</label>
        <input
          value={v.fullName}
          onChange={(e) => onChange({ ...v, fullName: e.target.value })}
          placeholder="例: 山田 太郎"
          className="w-full mt-1 px-2 py-1.5 border border-neutral-300 rounded text-[14px] kanji"
        />
      </div>
      <div>
        <label className="editorial-label !text-[10px]">Birth 生年月日</label>
        <input
          type="date"
          value={v.birth}
          onChange={(e) => onChange({ ...v, birth: e.target.value })}
          className="w-full mt-1 px-2 py-1.5 border border-neutral-300 rounded text-[14px] num"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="editorial-label !text-[10px]">Gender 性別</label>
          <select
            value={v.gender}
            onChange={(e) => onChange({ ...v, gender: e.target.value as Gender })}
            className="w-full mt-1 px-2 py-1.5 border border-neutral-300 rounded text-[14px] kanji bg-white"
          >
            <option value="male">男性</option>
            <option value="female">女性</option>
            <option value="other">その他</option>
          </select>
        </div>
        <div>
          <label className="editorial-label !text-[10px]">MBTI</label>
          <select
            value={v.mbti}
            onChange={(e) => onChange({ ...v, mbti: e.target.value as MbtiType | "" })}
            className="w-full mt-1 px-2 py-1.5 border border-neutral-300 rounded text-[14px] num bg-white"
          >
            <option value="">—</option>
            {MBTI_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

function StatRow({ label, value, hint }: { label: string; value: number | string; hint?: string }) {
  return (
    <div className="flex items-baseline justify-between border-b border-neutral-200 py-1.5">
      <span className="kanji text-[12px] text-neutral-600">{label}</span>
      <span className="flex items-baseline gap-2">
        {hint && <span className="text-[10px] text-neutral-400 kanji">{hint}</span>}
        <span className="num text-[16px]">{value}</span>
      </span>
    </div>
  );
}

export default function CompatPage() {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [a, setA] = useState<PersonInput>({ fullName: "吉田 駿成", birth: "1984-05-02", gender: "male", mbti: "INFJ" });
  const [b, setB] = useState<PersonInput>({ fullName: "力久 凌太郎", birth: "1998-07-08", gender: "male", mbti: "" });

  const ready = a.fullName.trim() && a.birth && b.fullName.trim() && b.birth;

  const result = useMemo(() => {
    if (!ready) return null;
    const pa = buildProfile({ id: "A", fullName: a.fullName, birth: a.birth, gender: a.gender, mbti: a.mbti || undefined });
    const pb = buildProfile({ id: "B", fullName: b.fullName, birth: b.birth, gender: b.gender, mbti: b.mbti || undefined });
    const ab = calcCompat(pa, pb);
    const ba = calcCompat(pb, pa);
    return { pa, pb, ab, ba };
  }, [a, b, ready]);

  return (
    <main className="min-h-screen flex flex-col">
      <Header
        date={date}
        onDateChange={setDate}
        rightSlot={
          <Link
            href="/"
            className="px-3 py-1.5 border border-neutral-300 rounded-full text-[12px] kanji bg-white hover:bg-neutral-50"
          >
            ← チームモード
          </Link>
        }
      />
      <EditorialBand date={date} />

      <div className="p-8 grid grid-cols-12 gap-6">
        <div className="col-span-3 space-y-4">
          <Form side="A" v={a} onChange={setA} />
          <Form side="B" v={b} onChange={setB} />
        </div>

        <div className="col-span-9 space-y-6">
          {!result ? (
            <div className="text-neutral-500 kanji p-8 border border-dashed border-neutral-300 rounded">
              名前と生年月日を入力すると相性が表示されます。
            </div>
          ) : (
            <>
              <section className="bg-white border border-neutral-200 rounded-md p-6">
                <div className="editorial-label mb-4">Compatibility</div>
                <div className="grid grid-cols-3 gap-6">
                  <ScorePanel title={`${result.pa.person.fullName} → ${result.pb.person.fullName}`} d={result.ab} />
                  <ScorePanel title={`${result.pb.person.fullName} → ${result.pa.person.fullName}`} d={result.ba} />
                  <div>
                    <div className="editorial-label mb-2">Synthesis</div>
                    <StatRow label="九星関係"   value={result.ab.starKind} />
                    <StatRow label="通変星"     value={result.ab.tongbian} />
                    <StatRow label="地支関係"   value={result.ab.branchRelation} />
                    <StatRow label="星座"       value={result.ab.zodiac} />
                    <StatRow label="姓名 合成"  value={result.ab.seimei} />
                    <StatRow label="風水 卦"    value={result.ab.kua} />
                    {result.ab.mbti && (
                      <StatRow label="MBTI"     value={result.ab.mbti.score} hint={result.ab.mbti.label} />
                    )}
                  </div>
                </div>
              </section>

              <section className="grid grid-cols-2 gap-6">
                <ProfileCard label="A" p={result.pa} />
                <ProfileCard label="B" p={result.pb} />
              </section>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

function ScorePanel({ title, d }: { title: string; d: import("@/lib/compat").CompatDetail }) {
  return (
    <div>
      <div className="text-[11px] text-neutral-500 kanji mb-2 truncate">{title}</div>
      <div className="flex items-baseline gap-3 mb-3">
        <span className="num text-[40px] font-light text-sage-700 leading-none">{d.overall}</span>
        <span className="editorial-label">overall</span>
      </div>
      <div className="space-y-1.5">
        {[
          { l: "仕事", v: d.work },
          { l: "対人", v: d.social },
          { l: "健康", v: d.health },
          { l: "金運", v: d.wealth },
        ].map((r) => (
          <div key={r.l} className="flex items-center gap-2 text-[11px]">
            <span className="w-8 kanji text-neutral-500">{r.l}</span>
            <div className="flex-1 h-[3px] bg-neutral-200/70 relative">
              <div className="absolute inset-y-0 left-0 bg-sage-500" style={{ width: `${r.v}%` }} />
            </div>
            <span className="w-6 text-right num">{r.v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfileCard({ label, p }: { label: string; p: import("@/lib/profile").Profile }) {
  const dirs = dirRatings(p.kua);
  return (
    <div className="bg-white border border-neutral-200 rounded-md p-5">
      <div className="flex items-baseline justify-between mb-3">
        <div>
          <span className="editorial-label mr-2">Person {label}</span>
          <span className="kanji text-[16px]">{p.person.fullName}</span>
        </div>
        <span className="num text-[12px] text-neutral-400">{p.person.birth}</span>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] kanji text-neutral-600">
        <span>太陽 <span className="text-neutral-900">{p.sunJa}</span></span>
        <span>本命星 <span className="text-neutral-900">{p.honmeiName}</span></span>
        <span>日柱 <span className="text-neutral-900 num">{p.dayGanzhi}</span></span>
        <span>年柱 <span className="text-neutral-900 num">{p.yearStem}{p.yearBranch}</span></span>
        <span>ライフパス <span className="text-neutral-900 num">{p.lifePath}</span></span>
        <span>本命卦 <span className="text-neutral-900 num">{p.kua}</span> <span className="text-neutral-500">({p.kuaGroup})</span></span>
        {p.mbti && <span>MBTI <span className="text-neutral-900 num">{p.mbti}</span></span>}
      </div>

      <div className="mt-4">
        <div className="editorial-label mb-2">姓名判断</div>
        <div className="grid grid-cols-5 gap-1 text-[11px] kanji">
          {[
            ["天", p.kakusu.ten, p.kakusu.tenJ],
            ["人", p.kakusu.jin, p.kakusu.jinJ],
            ["地", p.kakusu.chi, p.kakusu.chiJ],
            ["外", p.kakusu.gai, p.kakusu.gaiJ],
            ["総", p.kakusu.so,  p.kakusu.soJ],
          ].map(([k, n, j]) => (
            <div key={k as string} className="flex flex-col items-center border border-neutral-200 rounded py-1">
              <span className="text-neutral-500">{k}</span>
              <span className="num text-[14px]">{n as number}</span>
              <span className="text-[9px] text-neutral-500">{j as string}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <div className="editorial-label mb-2">風水 8 方位</div>
        <div className="grid grid-cols-4 gap-1 text-[10px] kanji">
          {DIRECTIONS.map((dir) => {
            const r = dirs[dir];
            const desc = RATING_DESC[r];
            return (
              <div key={dir} className="flex flex-col items-center border border-neutral-200 rounded py-1.5">
                <span className="text-neutral-500">{dir}</span>
                <span className={["text-[11px]", desc.score >= 60 ? "text-sage-700" : "text-rust"].join(" ")}>{r}</span>
                <span className="text-[9px] text-neutral-400">{desc.rank}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
