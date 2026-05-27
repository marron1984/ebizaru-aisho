import { OWNER } from "../lib/owner.ts";
import { TEAM } from "../lib/team.ts";
import { buildProfile } from "../lib/profile.ts";
import { calcCompat } from "../lib/compat.ts";
import { buildCommentary } from "../lib/commentary.ts";
const a = buildProfile(OWNER);
const b = buildProfile(TEAM[5]); // 力久 凌太郎
const d = calcCompat(a, b);
const c = buildCommentary(a, b, d);
console.log("HEAD:", c.headline);
console.log("");
for (const p of c.paragraphs) console.log("●", p.title, "\n  ", p.body, "\n");
for (const ax of c.axes) console.log("[", ax.label, ax.score, "]", ax.note);
console.log("\nCLOSE:", c.closing);
