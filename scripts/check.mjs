import { OWNER } from "../lib/owner.ts";
import { TEAM } from "../lib/team.ts";
import { buildProfile } from "../lib/profile.ts";
import { calcCompat } from "../lib/compat.ts";
import { sunLongitude, moonLongitude, moonPhase, currentSolarTerm } from "../lib/astronomy.ts";

const center = buildProfile(OWNER);
const others = TEAM.map(buildProfile);
console.log("CENTER:", center.person.fullName, center.honmeiName, center.dayGanzhi, "LP=" + center.lifePath, center.sunJa);
console.log("KAKUSU(owner):", JSON.stringify(center.kakusu, null, 0));
for (const o of others) {
  const c = calcCompat(center, o);
  console.log(`${o.person.fullName.padEnd(8)} ${o.honmeiName} ${o.dayGanzhi}  ov=${c.overall}  w=${c.work} s=${c.social} h=${c.health} m=${c.wealth}  ten=${o.kakusu.ten}${o.kakusu.tenJ} jin=${o.kakusu.jin}${o.kakusu.jinJ} so=${o.kakusu.so}${o.kakusu.soJ}  se=${c.seimei}`);
}
const d = new Date(Date.UTC(2026, 4, 27, 12));
console.log("\n2026-05-27 12:00Z");
console.log("sunLon =", sunLongitude(d).toFixed(3));
console.log("moonLon=", moonLongitude(d).toFixed(3));
const mp = moonPhase(d);
console.log("moonPhase:", mp.name, "phase=" + mp.phase.toFixed(3), "age=" + mp.age.toFixed(2));
const st = currentSolarTerm(d);
console.log("solarTerm: current=" + st.current.name + ", next=" + st.next.name + " on " + st.nextDate.toISOString().slice(0, 10));
