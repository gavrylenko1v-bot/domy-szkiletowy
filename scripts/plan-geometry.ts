import type { House } from "../src/content/houses";
type Room = {
  x: number;
  y: number;
  w: number;
  d: number;
  label: string;
  type: "living" | "bed" | "bath" | "hall" | "stairs";
};
const f = (v: number) => Number(v.toFixed(2));
export function planGeometry(h: House) {
  const t = 0.28,
    iw = h.width - 2 * t,
    id = h.depth - 2 * t;
  const floors: Room[][] = [];
  const room = (
    x: number,
    y: number,
    w: number,
    d: number,
    label: string,
    type: Room["type"],
  ): Room => ({ x: t + x, y: t + y, w, d, label, type });
  if (h.floors === 1 && h.bedrooms === 1) {
    const left = iw * 0.61;
    floors.push([
      room(0, 0, left, id, "Salon + aneks", "living"),
      room(left, 0, iw - left, id * 0.36, "Łazienka", "bath"),
      room(left, id * 0.36, iw - left, id * 0.64, "Sypialnia", "bed"),
    ]);
  } else if (h.floors === 1 && h.bedrooms === 2) {
    const bed = iw * 0.35,
      hall = 0.85,
      split = iw - bed - hall;
    floors.push([
      room(0, 0, split * 0.45, 1.95, "Łazienka", "bath"),
      room(split * 0.45, 0, split * 0.55, 1.95, "Kuchnia", "living"),
      room(0, 1.95, split, id - 1.95, "Salon + wejście", "living"),
      room(split, 0, hall, id, "Hol", "hall"),
      room(split + hall, 0, bed, id / 2, "Pokój 1", "bed"),
      room(split + hall, id / 2, bed, id / 2, "Pokój 2", "bed"),
    ]);
  } else if (h.floors === 1) {
    const bd = 2.65,
      hd = 0.85,
      rest = id - bd - hd;
    floors.push([
      ...[0, 1, 2].map((i) =>
        room((i * iw) / 3, 0, iw / 3, bd, `Pokój ${i + 1}`, "bed"),
      ),
      room(0, bd, iw, hd, "Komunikacja", "hall"),
      room(0, bd + hd, iw - 2.25, rest, "Salon + aneks", "living"),
      room(iw - 2.25, bd + hd, 2.25, rest, "Łaz. / wejście*", "bath"),
    ]);
  } else {
    const zone = iw * 0.36;
    const first: Room[] = [
      room(0, 0, iw - zone, id, "Salon + kuchnia", "living"),
      room(
        iw - zone,
        0,
        zone,
        id * 0.37,
        h.bedrooms > 2 ? "Pokój / gabinet" : "Jadalnia",
        h.bedrooms > 2 ? "bed" : "living",
      ),
      room(iw - zone, id * 0.37, zone, id * 0.28, "Łazienka", "bath"),
      room(iw - zone, id * 0.65, zone, id * 0.35, "Schody / wejście", "stairs"),
    ];
    floors.push(first);
    const upperBeds = h.bedrooms - (h.bedrooms > 2 ? 1 : 0),
      corr = h.bathrooms === 2 ? 1.6 : 0.95,
      bd = (id - corr) / 2;
    if (upperBeds === 2) {
      floors.push([
        room(0, 0, iw / 2, id - corr, "Pokój 1 / skosy", "bed"),
        room(iw / 2, 0, iw / 2, id - corr, "Pokój 2 / skosy", "bed"),
        ...(h.bathrooms === 2
          ? [
              room(0, id - corr, iw * 0.7, corr, "Hol / schody", "stairs"),
              room(iw * 0.7, id - corr, iw * 0.3, corr, "Łazienka", "bath"),
            ]
          : [room(0, id - corr, iw, corr, "Hol / otwór schodowy", "stairs")]),
      ]);
    } else {
      floors.push([
        room(0, 0, iw / 2, bd, "Pokój 1 / skosy", "bed"),
        room(iw / 2, 0, iw / 2, bd, "Pokój 2 / skosy", "bed"),
        room(0, bd, iw, corr, "Hol", "hall"),
        room(0, bd + corr, iw * 0.48, bd, "Pokój 3 / skosy", "bed"),
        room(iw * 0.48, bd + corr, iw * 0.22, bd, "Łazienka", "bath"),
        room(iw * 0.7, bd + corr, iw * 0.3, bd, "Schody", "stairs"),
      ]);
    }
  }
  return {
    externalWall: t,
    floors: floors.map((rs) =>
      rs.map((r) => ({ ...r, x: f(r.x), y: f(r.y), w: f(r.w), d: f(r.d) })),
    ),
  };
}
export function renderPlan(h: House) {
  const g = planGeometry(h),
    s = 68,
    margin = 65,
    fw = h.width * s,
    fh = h.depth * s,
    gap = 100,
    vw = fw + margin * 2,
    vh = (fh + gap) * h.floors + 75;
  const rect = (x: number, y: number, w: number, d: number, attrs: string) =>
    `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(d)}" ${attrs}/>`;
  const levels = g.floors
    .map((rooms, level) => {
      const oy = 65 + level * (fh + gap);
      const text = (x: number, y: number, label: string, size = 10) =>
        `<text x="${f(x)}" y="${f(y)}" font-family="Arial,sans-serif" font-size="${size}" fill="#344b3f" text-anchor="middle">${label}</text>`;
      let parts = rect(margin, oy, fw, fh, 'fill="#344b3f"');
      for (const r of rooms) {
        const x = margin + r.x * s,
          y = oy + r.y * s,
          w = r.w * s,
          d = r.d * s;
        parts += rect(
          x,
          y,
          w,
          d,
          `fill="${r.type === "living" ? "#e4e9da" : r.type === "bath" ? "#dce6e4" : r.type === "hall" || r.type === "stairs" ? "#f1ede3" : "#f0ebe0"}" stroke="#344b3f" stroke-width="5"`,
        );
        parts += text(x + w / 2, y + d / 2, r.label, Math.min(11, w / 10));
        if (r.type === "bed" && w > 120 && d > 100) {
          parts += rect(
            x + 14,
            y + 14,
            Math.min(96, w * 0.47),
            Math.min(132, d * 0.63),
            'fill="#fbfaf7" stroke="#a8b19f" stroke-width="1"',
          );
          parts += rect(
            x + 18,
            y + 18,
            Math.min(84, w * 0.4),
            20,
            'fill="#e0d7c6" stroke="#b5ad9b"',
          );
        }
        if (r.type === "bath" && w > 95 && d > 85) {
          parts += rect(x + 12, y + 12, 48, 48, 'fill="none" stroke="#99aaa4"');
          parts += `<circle cx="${f(x + w - 24)}" cy="${f(y + 25)}" r="11" fill="#fbfaf7" stroke="#99aaa4"/>`;
        }
        if (r.type === "stairs") {
          for (let j = 0; j < 8; j++)
            parts += `<path d="M${f(x + w * 0.55)} ${f(y + 10 + (j * (d - 20)) / 8)}h${f(w * 0.35)}" stroke="#b3b9a9"/>`;
        }
      }
      if (level === 1)
        parts += `<path d="M${margin + 20} ${oy + 40}h${fw - 40}M${margin + 20} ${oy + fh - 40}h${fw - 40}" stroke="#a78661" stroke-dasharray="6 5" fill="none"/>`;
      parts += `<path d="M${margin} ${oy - 18}h${fw}M${margin - 18} ${oy}v${fh}" stroke="#a78661" fill="none"/>`;
      parts += text(margin + fw / 2, oy - 27, `${h.width.toFixed(2)} m`, 13);
      parts += text(28, oy + fh / 2, `${h.depth.toFixed(2)} m`, 12);
      parts += text(
        margin + fw / 2,
        oy + fh + 30,
        level === 0
          ? "PARTER / SCHEMAT FUNKCJONALNY"
          : "PODDASZE / OBSZAR POD SKOSAMI",
        11,
      );
      return parts;
    })
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${vw} ${vh}" role="img"><title>${h.name} — schemat funkcjonalny</title><rect width="100%" height="100%" fill="#f8f7f4"/>${levels}<text x="30" y="${vh - 37}" font-family="Arial" font-size="10" fill="#344b3f">KONCEPCJA. NIE JEST RYSUNKIEM BUDOWLANYM.</text><text x="30" y="${vh - 19}" font-family="Arial" font-size="9" fill="#697267">Przejścia, okna, drzwi, schody i instalacje do opracowania. * Strefa do podziału.</text></svg>`;
}
