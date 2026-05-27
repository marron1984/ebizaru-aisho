// 二人モードのコメント生成 (Oracle 不使用 / 決定論的)
// 各エンジンの計算結果を引き、丁寧な日本語の解釈文を返します。

import type { Profile } from "./profile";
import type { CompatDetail } from "./compat";
import { MBTI_COMPAT } from "./mbti";

export interface Commentary {
  headline: string;          // 総合所見 1〜2 文
  paragraphs: Paragraph[];   // 各エンジンの解釈
  axes: AxisNote[];          // 仕事/対人/健康/金運
  closing: string;           // 締めの一言
}

export interface Paragraph {
  title: string;
  body: string;
}

export interface AxisNote {
  label: "仕事" | "対人" | "健康" | "金運";
  score: number;
  note: string;
}

// ---------- 共通の格付け文 ----------

function scoreTier(s: number): "exceptional" | "good" | "neutral" | "careful" | "low" {
  if (s >= 85) return "exceptional";
  if (s >= 70) return "good";
  if (s >= 55) return "neutral";
  if (s >= 40) return "careful";
  return "low";
}

function overallHeadline(a: Profile, b: Profile, d: CompatDetail): string {
  const t = scoreTier(d.overall);
  const an = a.person.fullName;
  const bn = b.person.fullName;
  switch (t) {
    case "exceptional":
      return `${an} さんから見た ${bn} さんとの総合相性は ${d.overall} と非常に高く、信頼を土台にした自然なやり取りが期待できる組み合わせです。`;
    case "good":
      return `${an} さんから見た ${bn} さんとの相性は ${d.overall} と良好で、協働の手応えを得やすい組み合わせと言えます。`;
    case "neutral":
      return `${an} さんから見た ${bn} さんとの相性は ${d.overall}。突出した親和も衝突もない中庸の領域で、互いの違いを丁寧に扱うことで安定します。`;
    case "careful":
      return `${an} さんから見た ${bn} さんとの相性は ${d.overall} とやや控えめです。役割や距離感をはっきりさせると、無理なく機能します。`;
    case "low":
      return `${an} さんから見た ${bn} さんとの相性は ${d.overall} と低めの数値です。期待値を抑え、業務上の線引きを明確にした関係作りが向きます。`;
  }
}

// ---------- 九星 ----------

function kyuseiPara(a: Profile, b: Profile, kind: string): Paragraph {
  const map: Record<string, string> = {
    比和: `お二人は ${a.honmeiName} と ${b.honmeiName} で、同じ五行を共有しています。波長が合いやすく、横に並んで動くのが自然な関係です。一方で似た者同士ゆえに刺激が足りなくなりがちなので、外からの新しい視点を意識的に取り入れると関係が伸びやすくなります。`,
    相生: `${a.honmeiName} の ${a.person.displayName ?? a.person.fullName} さんにとって、${b.honmeiName} の ${b.person.fullName} さんは「気を育てる側」に立つ存在です。自然と元気をもらいやすく、自信が湧く関係。受け取った分を言葉や行動で返していくと、流れが長続きします。`,
    洩気: `${a.honmeiName} の ${a.person.displayName ?? a.person.fullName} さんは、${b.honmeiName} の ${b.person.fullName} さんを支える側に回りやすい配置です。与える役割が肌に合えば心地よい一方、抱え込みすぎは禁物。自分の充電時間を大切にすると関係が長持ちします。`,
    相剋: `${a.honmeiName} の気は ${b.honmeiName} を抑える方向に作用します。指導や引き締めの役回りでは機能しますが、対等な立場では摩擦が出やすいので、口調や指示の出し方に意識を向けると良いでしょう。`,
    受剋: `${b.honmeiName} の気が ${a.honmeiName} を押さえつけやすい配置です。意見や希望をきちんと言葉にし、対等な発言権を保つ工夫が要ります。受け身に回りすぎないことが安定の鍵です。`,
  };
  return {
    title: "九星 (本命星の関係)",
    body: map[kind] ?? `${a.honmeiName} と ${b.honmeiName} の組み合わせです。`,
  };
}

// ---------- 四柱推命: 通変星 ----------

const TONGBIAN_TEXT: Record<string, string> = {
  比肩: "対等な仲間関係を結びやすい配置。協力すれば力強いものの、競合場面では火花が飛びやすいので、役割分担をはっきりさせると衝突を避けられます。",
  劫財: "支え合い・分け合いの関係です。気持ちは通いますが、出費や負担も共有しがち。お金や時間の使い方を都度すり合わせると安定します。",
  食神: "居心地が良く、創造性が引き出される関係。雑談や食事を共にする中で、自然にアイデアが生まれていく組み合わせです。",
  傷官: "鋭い表現力で刺激し合える関係。生み出すものは多い一方、言葉が鋭く当たると傷が深く残るので、批評の手前で一拍置く意識を。",
  偏財: "軽やかに情報やお金が回る関係。深掘りより流動性が向きます。複数案件を回す相棒として機能するタイプです。",
  正財: "堅実に積み上げる経済関係。約束を守り、納期や数字に誠実に向き合うほど信頼が育ちます。中長期に強い相性です。",
  偏官: "挑戦と緊張を共有するタイプ。短期決戦やプレッシャー下では結束しますが、ベースが緊張のため長期では摩耗に注意。休息のリズムを共有するとよいでしょう。",
  正官: "規律と評価が機能する関係。公私の線引きがしやすく、組織内のフォーマルなやり取りが噛み合うタイプです。",
  偏印: "独自視点を交換し合える関係。型破りで知的な刺激は多いものの、世間一般の文脈からズレやすいので、共通言語を都度確認すると円滑になります。",
  印綬: "学びと支援の関係。年長者・先達としての示唆を受けたり、知見を授けたりする関わりが自然に成立します。",
};

function tongbianPara(t: string): Paragraph {
  return { title: `四柱推命 通変星「${t}」`, body: TONGBIAN_TEXT[t] ?? "" };
}

// ---------- 四柱推命: 地支関係 ----------

const BRANCH_TEXT: Record<string, string> = {
  三合: "日柱の地支が三合の構成要素を成しています。協働の波が長く続きやすく、プロジェクト型・チーム型の関わりに向きます。",
  六合: "日柱どうしの親和度が高く、自然にペアで動ける配置。日常的なやり取りが滑らかになりやすい組み合わせです。",
  沖: "日柱の地支が真向かい (沖) です。意見がぶつかりやすい一方、外向きの推進力に変わる関係でもあります。長期で組む場合は適度な距離感を意識しましょう。",
  なし: "日柱の地支は特別な親和も衝突も持たず、ニュートラルな関係。良くも悪くも個別の積み重ねが結果を左右します。",
};

function branchPara(b: string): Paragraph {
  return { title: "四柱推命 日支の関係", body: BRANCH_TEXT[b] ?? BRANCH_TEXT["なし"] };
}

// ---------- 西洋占星術: 太陽星座エレメント ----------

type Elem = "fire" | "earth" | "air" | "water";
const SIGN_ELEM: Record<string, Elem> = {
  aries: "fire", leo: "fire", sagittarius: "fire",
  taurus: "earth", virgo: "earth", capricorn: "earth",
  gemini: "air", libra: "air", aquarius: "air",
  cancer: "water", scorpio: "water", pisces: "water",
};

function zodiacPara(a: Profile, b: Profile): Paragraph {
  const ea = SIGN_ELEM[a.sun];
  const eb = SIGN_ELEM[b.sun];
  let body: string;
  if (ea === eb) {
    body = `${a.sunJa} と ${b.sunJa} は同じエレメントです。世界の感じ方が似ているため共感が早く、共通言語を持ちやすい一方、視野が揃いやすいので異質な視点を意図的に招き入れるとさらに広がります。`;
  } else if ((ea === "fire" && eb === "air") || (ea === "air" && eb === "fire") || (ea === "earth" && eb === "water") || (ea === "water" && eb === "earth")) {
    body = `${a.sunJa} と ${b.sunJa} は補完的なエレメントです。片方が動きをもたらし、もう片方が安定や深さを提供する形で、自然にバランスが取れる組み合わせと言えます。`;
  } else {
    body = `${a.sunJa} と ${b.sunJa} は異質な感じ方を持ち寄る組み合わせです。違いを面白がる姿勢を持てば、双方の幅が広がります。`;
  }
  return { title: "西洋占星術 太陽星座", body };
}

// ---------- 数秘術 ----------

function numerologyPara(a: Profile, b: Profile): Paragraph {
  const av = a.lifePath;
  const bv = b.lifePath;
  let body: string;
  if (av === bv) {
    body = `お二人とも ライフパス ${av}。同じテーマを生きる同志で、価値判断が揃いやすい組み合わせです。`;
  } else {
    const compl = new Set(["1-2", "2-1", "3-5", "5-3", "4-8", "8-4", "6-9", "9-6", "7-11", "11-7"]);
    const conflict = new Set(["1-4", "4-1", "5-7", "7-5", "8-11", "11-8"]);
    const key = `${av}-${bv}`;
    if (compl.has(key)) {
      body = `ライフパス ${av} と ${bv} は補完関係です。二人で組み合わさることで全体性が立ち上がるタイプの組み合わせです。`;
    } else if (conflict.has(key)) {
      body = `ライフパス ${av} と ${bv} は価値観の角度が大きく、小さな擦り合わせを重ねる必要があります。違いの理由を言語化する習慣を持つと安定します。`;
    } else {
      body = `ライフパス ${av} と ${bv} は中立的な相性です。お互いの数の性質を尊重できれば穏やかに作用します。`;
    }
  }
  return { title: "数秘術 ライフパス", body };
}

// ---------- 姓名判断 ----------

function seimeiPara(a: Profile, b: Profile): Paragraph {
  const ai = a.kakusu;
  const bi = b.kakusu;
  const fragments: string[] = [];
  fragments.push(
    `お二人の総格は ${ai.so} (${ai.soJ}) と ${bi.so} (${bi.soJ}) で、長期的な巡りの土台はこのようになっています。`,
  );
  if (ai.jinJ === "凶" || bi.jinJ === "凶") {
    fragments.push(
      "片方の人格に課題のサインが出ているため、情緒の波が見えたら早めに言葉にして共有し合えると関係が安定します。",
    );
  } else if (ai.jinJ === "大吉" && bi.jinJ === "大吉") {
    fragments.push(
      "両者の人格が共に大吉で、対人運の核は強い組み合わせです。直接的なやり取りが噛み合いやすいでしょう。",
    );
  }
  if (ai.gaiJ === "大吉" || bi.gaiJ === "大吉") {
    fragments.push("外格が良く、第三者を交えた場面でも縁が動きやすい配置です。");
  }
  return { title: "姓名判断 五格", body: fragments.join(" ") };
}

// ---------- 風水 ----------

function fengshuiPara(a: Profile, b: Profile): Paragraph {
  if (a.kua === b.kua) {
    return {
      title: "風水 本命卦",
      body: `お二人とも本命卦 ${a.kua} (${a.kuaGroup})。八方位の吉凶パターンを共有しているため、空間の使い方や席の好みも自然と揃いやすい組み合わせです。`,
    };
  }
  if (a.kuaGroup === b.kuaGroup) {
    return {
      title: "風水 本命卦",
      body: `本命卦は ${a.kua} と ${b.kua}。同じ「${a.kuaGroup}」に属するため、相性のよい方位が近く、同じ部屋・近い席で並んで作業すると力を発揮しやすい関係です。`,
    };
  }
  return {
    title: "風水 本命卦",
    body: `本命卦は ${a.kua} (${a.kuaGroup}) と ${b.kua} (${b.kuaGroup}) で、相性方位が真逆の傾向です。机の向きや席の配置を分けて、それぞれの吉方位を活かす運用にするとパフォーマンスが揃います。`,
  };
}

// ---------- MBTI ----------

function mbtiPara(a: Profile, b: Profile): Paragraph | null {
  if (!a.mbti || !b.mbti) return null;
  const text = {
    best: `${a.mbti} と ${b.mbti} は、認知機能のスタックが理想的に補完し合う組み合わせです。直感同士・思考同士で深まりやすく、長い対話に向きます。`,
    good: `${a.mbti} と ${b.mbti} は、機能の優先順位が近いタイプ同士。会話のリズムが揃いやすく、共同作業に手応えが出やすい組み合わせです。`,
    neutral: `${a.mbti} と ${b.mbti} は中立的な関係。意識的にお互いの好む情報の扱い方を尊重すると円滑になります。`,
    challenging: `${a.mbti} と ${b.mbti} は機能の方向性が真逆になりやすく、誤解が生まれがちな組み合わせです。「言葉にする」「確認する」を一段増やすと差が縮まります。`,
  } as const;
  const g = MBTI_COMPAT[a.mbti];
  let label: keyof typeof text = "neutral";
  if (g.best.includes(b.mbti)) label = "best";
  else if (g.good.includes(b.mbti)) label = "good";
  else if (g.challenging.includes(b.mbti)) label = "challenging";
  return { title: "MBTI 認知機能", body: text[label] };
}

// ---------- 4 軸 ----------

function axisNote(label: AxisNote["label"], score: number, ctx: { tongbian: string; starKind: string; kuaGroupSame: boolean }): AxisNote {
  const t = scoreTier(score);
  const lead: Record<typeof t, string> = {
    exceptional: "とても高い相性が出ています。",
    good: "相性は良好です。",
    neutral: "中庸の領域です。",
    careful: "やや慎重に運びたい領域です。",
    low: "数値は控えめです。",
  };
  let extra = "";
  switch (label) {
    case "仕事":
      extra = `通変星「${ctx.tongbian}」の性質が出やすい場面なので、役割分担を意識して動くと噛み合いが良くなります。`;
      break;
    case "対人":
      extra = ctx.kuaGroupSame
        ? "同じ本命卦群で、日常の距離感を取りやすい関係です。"
        : "本命卦群が異なるため、コミュニケーションのリズムをこまめに合わせる意識が役立ちます。";
      break;
    case "健康":
      extra = ctx.starKind === "受剋" || ctx.starKind === "相剋"
        ? "九星の関係に緊張が含まれるため、長時間の同席は休憩を多めに取るとよいでしょう。"
        : "ペースを揃えて動ける関係です。";
      break;
    case "金運":
      extra = ["正財", "偏財", "食神"].includes(ctx.tongbian)
        ? "金銭面での流れは追い風寄り。約束事を明確にしておくとさらに伸びます。"
        : "金銭関係は淡白に運用するのが向きます。割り勘・明朗会計を徹底すると軋みません。";
      break;
  }
  return { label, score, note: `${lead[t]}${extra}` };
}

// ---------- 締め ----------

function closingLine(d: CompatDetail): string {
  const t = scoreTier(d.overall);
  switch (t) {
    case "exceptional":
      return "総じて自然体で価値を出し合える組み合わせです。お互いへの感謝をこまめに言葉にすると、この相性は長く保たれます。";
    case "good":
      return "違いがあってもうまく回っていく相性です。日々の小さな配慮の積み重ねが、関係をさらに伸ばします。";
    case "neutral":
      return "中庸の関係は、丁寧さで色が変わります。誠実なやり取りを続ければ十分に機能する組み合わせです。";
    case "careful":
      return "得意な領域に絞り、不得意な領域では無理に深入りしないことが、関係を長く保つコツです。";
    case "low":
      return "相性が低いからといって関係を否定する必要はありません。期待値を整え、フォーマルなやり取りを基本にすれば、十分に共存できます。";
  }
}

// ---------- 公開関数 ----------

export function buildCommentary(a: Profile, b: Profile, d: CompatDetail): Commentary {
  const paragraphs: Paragraph[] = [
    kyuseiPara(a, b, d.starKind),
    tongbianPara(d.tongbian),
    branchPara(d.branchRelation),
    zodiacPara(a, b),
    numerologyPara(a, b),
    seimeiPara(a, b),
    fengshuiPara(a, b),
  ];
  const mb = mbtiPara(a, b);
  if (mb) paragraphs.push(mb);

  const ctx = {
    tongbian: d.tongbian,
    starKind: d.starKind,
    kuaGroupSame: a.kuaGroup === b.kuaGroup,
  };
  const axes: AxisNote[] = [
    axisNote("仕事", d.work, ctx),
    axisNote("対人", d.social, ctx),
    axisNote("健康", d.health, ctx),
    axisNote("金運", d.wealth, ctx),
  ];

  return {
    headline: overallHeadline(a, b, d),
    paragraphs,
    axes,
    closing: closingLine(d),
  };
}
