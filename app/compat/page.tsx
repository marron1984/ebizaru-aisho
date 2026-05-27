"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { EditorialBand } from "@/components/EditorialBand";
import { OWNER } from "@/lib/owner";
import { TEAM } from "@/lib/team";
import { buildProfile, type Profile } from "@/lib/profile";
import { calcCompat, type CompatDetail } from "@/lib/compat";
import { buildCommentary, type Commentary } from "@/lib/commentary";
import { MBTI_TYPES, type MbtiType } from "@/lib/mbti";
import { RATING_DESC, dirRatings, DIRECTIONS } from "@/lib/fengshui";
import type { Gender, Person } from "@/lib/types";

interface PersonInput {
  sourceId: string | "custom";
  fullName: string;
  birth: string;
  gender: Gender;
  mbti: MbtiType | "";
}

const ROSTER: Person[] = [OWNER, ...TEAM];

function inputFromPerson(p: Person): PersonInput {
  return {
    sourceId: p.id,
    fullName: p.fullName,
    birth: p.birth,
    gender: p.gender ?? "male",
    mbti: p.mbti ?? "",
  };
}

function RosterPicker({
  side,
  value,
  onPick,
  onCustom,
}: {
  side: "A" | "B";
  value: string;
  onPick: (p: Person) => void;
  onCustom: () => void;
}) {
  return (
    <div>
      <div className="editorial-label !text-[10px] mb-1.5">Roster {side}</div>
      <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1 pb-2">
        {ROSTER.map((p) => {
          const selected = value === p.id;
          return (
            <button
              key={p.id}
              onClick={() => onPick(p)}
              className={[
                "px-2.5 py-1 rounded-full text-[11px] kanji border-2 border-ink font-bold shrink-0 transition-transform",
                selected ? "bg-ebi-500 text-white shadow-patch -rotate-1" : "bg-white text-ink hover:-rotate-1",
              ].join(" ")}
              title={p.birth}
            >
              {p.fullName}
            </button>
          );
        })}
        <button
          onClick={onCustom}
          className={[
            "px-2.5 py-1 rounded-full text-[11px] kanji border-2 border-ink font-bold shrink-0",
            value === "custom" ? "bg-sun text-ink shadow-patch -rotate-1" : "bg-white text-ink",
          ].join(" ")}
        >
          カスタム入力
        </button>
      </div>
    </div>
  );
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
  const customize = (patch: Partial<PersonInput>) =>
    onChange({ ...v, ...patch, sourceId: "custom" });

  return (
    <div className="patch p-4 space-y-3 relative">
      <div className="absolute -top-3 -left-3 patch-red text-white text-[10px] font-black px-2 py-0.5 rotate-[-4deg]">
        PERSON {side}
      </div>
      <div className="flex items-baseline justify-between pt-1">
        <span className="display text-[20px] text-ebi-600">{side === "A" ? "ENTRY A" : "ENTRY B"}</span>
        <span className="kanji text-[10px] font-bold text-ink/70">
          {v.sourceId === "custom" ? "カスタム入力" : "メンバー選択中"}
        </span>
      </div>

      <RosterPicker
        side={side}
        value={v.sourceId}
        onPick={(p) => onChange(inputFromPerson(p))}
        onCustom={() => onChange({ ...v, sourceId: "custom" })}
      />

      <div>
        <label className="editorial-label !text-[10px]">Full Name 姓名</label>
        <input
          value={v.fullName}
          onChange={(e) => customize({ fullName: e.target.value })}
          placeholder="例: 山田 太郎"
          className="w-full mt-1 px-2.5 py-2 border-2 border-ink rounded-md text-[16px] kanji bg-white"
        />
      </div>
      <div>
        <label className="editorial-label !text-[10px]">Birth 生年月日</label>
        <input
          type="date"
          value={v.birth}
          onChange={(e) => customize({ birth: e.target.value })}
          className="w-full mt-1 px-2.5 py-2 border-2 border-ink rounded-md text-[16px] num bg-white"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="editorial-label !text-[10px]">Gender 性別</label>
          <select
            value={v.gender}
            onChange={(e) => customize({ gender: e.target.value as Gender })}
            className="w-full mt-1 px-2.5 py-2 border-2 border-ink rounded-md text-[16px] kanji bg-white"
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
            onChange={(e) => customize({ mbti: e.target.value as MbtiType | "" })}
            className="w-full mt-1 px-2.5 py-2 border-2 border-ink rounded-md text-[16px] num bg-white"
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
    <div className="flex items-baseline justify-between border-b-2 border-dashed border-ink/30 py-1.5">
      <span className="kanji text-[12px] font-bold text-ink/80">{label}</span>
      <span className="flex items-baseline gap-2">
        {hint && <span className="text-[10px] text-ebi-600 kanji font-bold">{hint}</span>}
        <span className="num text-[16px]">{value}</span>
      </span>
    </div>
  );
}

function ScorePanel({ title, d }: { title: string; d: CompatDetail }) {
  const tier = d.overall >= 85 ? "bg-pop-pink text-white" :
               d.overall >= 70 ? "bg-ebi-500 text-white" :
               d.overall >= 55 ? "bg-sun text-ink" :
               d.overall >= 40 ? "bg-pop-cyan text-ink" :
               "bg-navy text-cream";
  return (
    <div>
      <div className="text-[11px] kanji mb-2 truncate font-bold text-ink/70">{title}</div>
      <div className="flex items-center gap-3 mb-3">
        <div className={`${tier} border-2 border-ink rounded-2xl shadow-patch px-3 py-1 -rotate-2`}>
          <span className="num text-[44px] leading-none font-black">{d.overall}</span>
        </div>
        <span className="display text-ebi-600 text-[18px]">OVERALL</span>
      </div>
      <div className="space-y-1.5">
        {[
          { l: "仕事", v: d.work },
          { l: "対人", v: d.social },
          { l: "健康", v: d.health },
          { l: "金運", v: d.wealth },
        ].map((r) => (
          <div key={r.l} className="flex items-center gap-2 text-[11px]">
            <span className="w-8 kanji font-bold">{r.l}</span>
            <div className="flex-1 h-[7px] bg-black/15 relative rounded-full border border-ink/30 overflow-hidden">
              <div className="absolute inset-y-0 left-0 bg-ebi-500" style={{ width: `${r.v}%` }} />
            </div>
            <span className="w-7 text-right num">{r.v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CommentaryView({ title, c }: { title: string; c: Commentary }) {
  return (
    <article className="patch p-5 space-y-4 relative">
      <div className="absolute -top-3 left-4 patch-red text-white text-[10px] font-black px-2 py-0.5 -rotate-2">
        COMMENTARY
      </div>
      <header className="flex items-baseline justify-between pt-1">
        <span className="display text-ebi-600 text-[18px]">読み解き</span>
        <span className="text-[11px] kanji font-bold text-ink/70">{title}</span>
      </header>
      <p className="kanji text-[14px] leading-relaxed text-ink font-medium border-l-4 border-ebi-500 pl-3">{c.headline}</p>

      <div className="space-y-3">
        {c.paragraphs.map((p) => (
          <div key={p.title}>
            <div className="text-[11px] kanji font-black text-ebi-600 mb-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-ebi-500 inline-block rounded-full" />
              {p.title}
            </div>
            <p className="kanji text-[13px] leading-relaxed text-ink/85">{p.body}</p>
          </div>
        ))}
      </div>

      {c.synthesis.length > 0 && (
        <div className="border-t-2 border-dashed border-ink/20 pt-3 space-y-3">
          <div className="display text-ebi-600 text-[16px]">SYNTHESIS 深層</div>
          {c.synthesis.map((p) => (
            <div key={p.title} className="bg-sun/30 border-l-4 border-ink pl-3 py-2 rounded-r-md">
              <div className="text-[11px] kanji font-black text-ink mb-1">{p.title}</div>
              <p className="kanji text-[13px] leading-relaxed text-ink">{p.body}</p>
            </div>
          ))}
        </div>
      )}

      <div className="border-t-2 border-dashed border-ink/20 pt-3">
        <div className="display text-ebi-600 text-[16px] mb-2">4 軸別の所感</div>
        <ul className="space-y-2">
          {c.axes.map((a) => (
            <li key={a.label} className="flex items-start gap-3 text-[13px]">
              <span className="patch-yellow !shadow-none px-2 py-0.5 kanji font-black text-[11px] shrink-0">{a.label}</span>
              <span className="num w-8 shrink-0 text-ebi-600 font-black text-[14px]">{a.score}</span>
              <span className="kanji text-ink/85 leading-relaxed">{a.note}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="kanji text-[13px] leading-relaxed text-ink italic font-medium bg-cream-100 border-2 border-ink rounded-md p-3 -rotate-[0.4deg]">
        “ {c.closing} ”
      </p>
    </article>
  );
}

function ProfileCard({ label, p }: { label: string; p: Profile }) {
  const dirs = dirRatings(p.kua);
  return (
    <div className="patch p-5 relative">
      <div className="absolute -top-3 -right-3 patch-yellow text-[10px] font-black px-2 py-0.5 rotate-3">
        PROFILE {label}
      </div>
      <div className="flex items-baseline justify-between mb-3 pt-1">
        <div>
          <span className="display text-ebi-600 text-[20px] mr-2">{label}</span>
          <span className="kanji text-[18px] font-black">{p.person.fullName}</span>
        </div>
        <span className="num text-[12px] text-ink/60">{p.person.birth}</span>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] kanji font-bold text-ink/70">
        <span>太陽 <span className="text-ink">{p.sunJa}</span></span>
        <span>本命星 <span className="text-ink">{p.honmeiName}</span></span>
        <span>日柱 <span className="text-ink num">{p.dayGanzhi}</span></span>
        <span>年柱 <span className="text-ink num">{p.yearStem}{p.yearBranch}</span></span>
        <span>ライフパス <span className="text-ink num">{p.lifePath}</span></span>
        <span>本命卦 <span className="text-ink num">{p.kua}</span> <span className="text-ink/60">({p.kuaGroup})</span></span>
        {p.mbti && <span>MBTI <span className="text-ink num">{p.mbti}</span></span>}
      </div>

      <div className="mt-4">
        <div className="display text-ebi-600 text-[14px] mb-2">姓名判断</div>
        <div className="grid grid-cols-5 gap-1.5 text-[11px] kanji">
          {[
            ["天", p.kakusu.ten, p.kakusu.tenJ],
            ["人", p.kakusu.jin, p.kakusu.jinJ],
            ["地", p.kakusu.chi, p.kakusu.chiJ],
            ["外", p.kakusu.gai, p.kakusu.gaiJ],
            ["総", p.kakusu.so,  p.kakusu.soJ],
          ].map(([k, n, j]) => {
            const isGood = String(j).includes("大吉") || String(j) === "吉";
            return (
              <div key={k as string} className={["flex flex-col items-center border-2 border-ink rounded-md py-1.5 font-bold", isGood ? "bg-sun" : "bg-cream-100"].join(" ")}>
                <span className="text-ink/70">{k}</span>
                <span className="num text-[16px]">{n as number}</span>
                <span className="text-[9px] text-ink">{j as string}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4">
        <div className="display text-ebi-600 text-[14px] mb-2">風水 8 方位</div>
        <div className="grid grid-cols-4 gap-1.5 text-[10px] kanji">
          {DIRECTIONS.map((dir) => {
            const r = dirs[dir];
            const desc = RATING_DESC[r];
            const tone = desc.score >= 80 ? "bg-pop-pink text-white" :
                         desc.score >= 60 ? "bg-sun text-ink" :
                         desc.score >= 35 ? "bg-pop-cyan text-ink" :
                         "bg-navy text-cream";
            return (
              <div key={dir} className={["flex flex-col items-center border-2 border-ink rounded-md py-1.5 font-bold", tone].join(" ")}>
                <span className="text-current opacity-80">{dir}</span>
                <span className="text-[11px]">{r}</span>
                <span className="text-[9px] opacity-80">{desc.rank}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function CompatPage() {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [a, setA] = useState<PersonInput>(() => inputFromPerson(OWNER));
  const [b, setB] = useState<PersonInput>(() => inputFromPerson(TEAM[5])); // 力久 凌太郎

  const ready = a.fullName.trim() && a.birth && b.fullName.trim() && b.birth;

  const result = useMemo(() => {
    if (!ready) return null;
    const pa = buildProfile({
      id: a.sourceId === "custom" ? "A" : a.sourceId,
      fullName: a.fullName,
      birth: a.birth,
      gender: a.gender,
      mbti: a.mbti || undefined,
    });
    const pb = buildProfile({
      id: b.sourceId === "custom" ? "B" : b.sourceId,
      fullName: b.fullName,
      birth: b.birth,
      gender: b.gender,
      mbti: b.mbti || undefined,
    });
    const ab = calcCompat(pa, pb);
    const ba = calcCompat(pb, pa);
    const cab = buildCommentary(pa, pb, ab);
    const cba = buildCommentary(pb, pa, ba);
    return { pa, pb, ab, ba, cab, cba };
  }, [a, b, ready]);

  return (
    <main className="min-h-screen flex flex-col">
      <Header
        date={date}
        onDateChange={setDate}
        rightSlot={
          <Link
            href="/"
            className="px-3 py-1.5 border-2 border-ink rounded-full text-[12px] kanji bg-sun text-ink shadow-patch font-bold hover:-rotate-1 transition-transform shrink-0"
          >
            ← チームモード
          </Link>
        }
      />
      <EditorialBand date={date} />

      <div className="p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
        <div className="lg:col-span-3 space-y-4 grid grid-cols-1 md:grid-cols-2 lg:block lg:space-y-4 gap-4">
          <Form side="A" v={a} onChange={setA} />
          <Form side="B" v={b} onChange={setB} />
        </div>

        <div className="lg:col-span-9 space-y-4 md:space-y-6">
          {!result ? (
            <div className="patch p-8 text-center">
              <div className="display text-ebi-600 text-[28px]">START!</div>
              <div className="kanji text-[13px] text-ink/70 mt-2">名前と生年月日を入れると、二人の相性が出ます。</div>
            </div>
          ) : (
            <>
              <section className="patch p-4 md:p-6 relative">
                <div className="absolute -top-3 left-4 patch-red text-white text-[10px] font-black px-2 py-0.5 -rotate-2">
                  COMPATIBILITY
                </div>
                <div className="display text-ebi-600 text-[22px] mb-3 md:mb-4 pt-1">相性スコア</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  <ScorePanel title={`${result.pa.person.fullName} → ${result.pb.person.fullName}`} d={result.ab} />
                  <ScorePanel title={`${result.pb.person.fullName} → ${result.pa.person.fullName}`} d={result.ba} />
                  <div>
                    <div className="display text-ebi-600 text-[16px] mb-2">SYNTHESIS</div>
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

              <section className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
                <CommentaryView
                  title={`${result.pa.person.fullName} → ${result.pb.person.fullName}`}
                  c={result.cab}
                />
                <CommentaryView
                  title={`${result.pb.person.fullName} → ${result.pa.person.fullName}`}
                  c={result.cba}
                />
              </section>

              <section className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
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
