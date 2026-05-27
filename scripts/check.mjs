import { OWNER } from "../lib/owner.ts";
import { TEAM } from "../lib/team.ts";
import { buildProfile } from "../lib/profile.ts";
import { calcCompat } from "../lib/compat.ts";
import { dirRatings } from "../lib/fengshui.ts";
import { sunLongitude, moonLongitude, moonPhase, currentSolarTerm } from "../lib/astronomy.ts";

const center = buildProfile(OWNER);
const others = TEAM.map(buildProfile);
console.log("CENTER:", center.person.fullName, center.honmeiName, center.dayGanzhi, "LP=" + center.lifePath, center.sunJa, "MBTI=" + center.mbti, "Kua=" + center.kua + "(" + center.kuaGroup + ")");
console.log("Owner 8方位:", dirRatings(center.kua));
console.log("");
for (const o of others) {
  const c = calcCompat(center, o);
  const mbti = c.mbti ? ` MBTI=${c.mbti.score}/${c.mbti.label}` : "";
  console.log(`${o.person.fullName.padEnd(8)} ${o.honmeiName} ${o.dayGanzhi} Kua${o.kua}(${o.kuaGroup})  ov=${c.overall}  w=${c.work} s=${c.social} h=${c.health} m=${c.wealth}  fs=${c.kua} se=${c.seimei}${mbti}`);
}
const d = new Date(Date.UTC(2026, 4, 27, 12));
console.log("");
console.log("2026-05-27 12:00Z  sun=" + sunLongitude(d).toFixed(2) + "  moon=" + moonLongitude(d).toFixed(2) + "  " + moonPhase(d).name + " 月齢" + moonPhase(d).age.toFixed(1));
const st = currentSolarTerm(d);
console.log("solarTerm:", st.current.name, "→", st.next.name, "(" + (st.nextDate.getMonth() + 1) + "/" + st.nextDate.getDate() + ")");
