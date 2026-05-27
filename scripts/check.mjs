import { OWNER } from "../lib/owner.ts";
import { TEAM } from "../lib/team.ts";
import { buildProfile } from "../lib/profile.ts";
import { calcCompat } from "../lib/compat.ts";

const center = buildProfile(OWNER);
const others = TEAM.map(buildProfile);
console.log("CENTER:", center.person.fullName, center.honmeiName, center.dayGanzhi, "LP=" + center.lifePath, center.sunJa);
for (const o of others) {
  const c = calcCompat(center, o);
  console.log(`${o.person.fullName.padEnd(8)} ${o.honmeiName} ${o.dayGanzhi}  overall=${c.overall}  work=${c.work} social=${c.social} health=${c.health} wealth=${c.wealth}  [${c.starKind}/${c.tongbian}/${c.branchRelation}]`);
}
