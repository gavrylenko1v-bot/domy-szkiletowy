import { mkdir, writeFile } from "node:fs/promises";
import { houses } from "../src/content/houses";
import { planGeometry, renderPlan } from "./plan-geometry";
const esc = (s: string) => s.replaceAll("&", "&amp;").replaceAll("<", "&lt;");
for (const h of houses) {
  const dir = `public/images/houses/${h.slug}`;
  await mkdir(dir, { recursive: true });
  const dark = h.style === "Nowoczesna stodoła";
  for (const [file, flip] of [
    ["exterior", false],
    ["alternate", true],
  ] as const) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 850"><defs><linearGradient id="sky" x2="0" y2="1"><stop stop-color="#d5ddd7"/><stop offset="1" stop-color="#f2ede1"/></linearGradient><linearGradient id="wood"><stop stop-color="${dark ? "#45473f" : "#b09b7c"}"/><stop offset="1" stop-color="${dark ? "#62645a" : "#d2bd98"}"/></linearGradient><pattern id="lines" width="14" height="14" patternUnits="userSpaceOnUse"><path d="M1 0V14" stroke="#554d3a" opacity=".25"/></pattern></defs><rect width="1200" height="850" fill="url(#sky)"/><path d="M0 450Q250 390 500 450T1200 400V850H0Z" fill="#b2b9a2"/><path d="M0 650Q500 570 1200 660V850H0Z" fill="#929e81"/><g opacity=".35" stroke="#6c7b66" fill="#6c7b66"><path d="M100 520V160M1100 500V120" stroke-width="8"/><ellipse cx="100" cy="230" rx="100" ry="150"/><ellipse cx="1110" cy="210" rx="95" ry="160"/></g><g ${flip ? 'transform="translate(1200 0) scale(-1 1)"' : ""}><path d="M170 637L880 683 1080 572 360 535Z" fill="#c2b599"/><path d="M220 370L830 400 830 640 220 605Z" fill="url(#wood)"/><path d="M220 370L830 400 830 640 220 605Z" fill="url(#lines)"/><path d="M830 400L1020 295 1020 530 830 640Z" fill="${dark ? "#363c35" : "#9e8968"}"/><path d="M220 370L405 250 1020 280 830 400Z" fill="#3d443f"/><path d="M830 400L1020 280 1020 295 830 415 220 385 220 370Z" fill="#252e29"/><path d="M265 425L500 437 500 610 265 596Z" fill="#829a97" stroke="#35413b" stroke-width="8"/><path d="M382 432V602M265 535L500 547" stroke="#35413b" stroke-width="6"/><path d="M540 440L605 443 605 615 540 611Z" fill="#665b49" stroke="#35413b" stroke-width="6"/><path d="M650 449L712 453 712 533 650 529ZM745 455L795 458 795 538 745 535Z" fill="#8fa39c" stroke="#35413b" stroke-width="6"/>${h.floors === 2 ? '<path d="M900 360L953 330 953 397 900 427Z" fill="#8fa39c" stroke="#35413b" stroke-width="6"/>' : ""}</g><text x="48" y="786" fill="#344b3f" font-family="sans-serif" font-size="15" letter-spacing="3">${esc(h.name)} / ILUSTRACJA KONCEPCYJNA</text></svg>`;
    await writeFile(`${dir}/${file}.svg`, svg);
  }
  await writeFile(`${dir}/plan.svg`, renderPlan(h));
  const passport = {
    ...h,
    geometry: {
      functionalZones: planGeometry(h),
      externalEnvelope: `${h.width} × ${h.depth} m`,
      footprintCalculation: `${h.width} × ${h.depth} = ${h.footprint} m²`,
      assumedExternalWall: ".28 m for feasibility envelope only",
      usableAreaStatus:
        "Preliminary estimate; loft slopes, stair openings and partitions require professional measurement",
      professionalReview: false,
    },
    visuals: {
      status: "Conceptual; not evidence of an engineering review",
      front: `Photorealistic architectural photograph. Concept ${h.name}, external envelope ${h.width}m x ${h.depth}m, ${h.floors === 1 ? "single storey" : "ground floor and habitable attic"}, gable metal standing seam roof, ${h.facade}. Polish meadow, daylight. Front left three quarter view. ${h.layout} No text, no logos. Fix a window and door schedule before production; do not invent additional volumes.`,
      alternate: `Use the approved front image as a mandatory identity reference. Exactly the same ${h.name} building, roof pitch, dimensions, materials, door and window positions. Rear right three quarter view, eye level, Polish meadow, daylight. Do not mirror the building or move windows.`,
      plan: `Top down schematic floor plan for ${h.name}, ${h.width} x ${h.depth}m external footprint, ${h.floors} levels. ${h.layout} ${h.note} Before producing a final plan, architect must resolve doors, window schedule, stairs and clearances; match the approved exterior. Label as conceptual.`,
    },
  };
  await mkdir("docs/passports", { recursive: true });
  await writeFile(
    `docs/passports/${h.slug}.json`,
    JSON.stringify(passport, null, 2) + "\n",
  );
}
console.log(
  `Prepared ${houses.length} passports, 20 original SVG illustrations and 10 conceptual zoning plans.`,
);
