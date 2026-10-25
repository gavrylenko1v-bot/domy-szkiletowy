import type { House } from "./houses";

export type Box = { x: number; y: number; w: number; d: number };
export type Room = Box & { id: string; label: string; type: "living" | "kitchen" | "bed" | "bath" | "hall" | "stairs"; area: number };
export type Opening = { a: string; b?: string; x: number; y: number; size: number; vertical: boolean; passage?: boolean };
export type Furniture = Box & { kind: "bed" | "wardrobe" | "sofa" | "table" | "kitchen" | "shower" | "wc" | "basin" | "stairs"; room: string };
export type Floor = { rooms: Room[]; doors: Opening[]; windows: Opening[]; furniture: Furniture[]; level: number; openingArea: number };
export const round = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;
const t = .28, p = .12;
const near = (a: number, b: number) => Math.abs(a - b) < .015;
export const overlaps = (a: Box, b: Box, clearance = 0) => a.x < b.x + b.w + clearance - .001 && a.x + a.w + clearance > b.x + .001 && a.y < b.y + b.d + clearance - .001 && a.y + a.d + clearance > b.y + .001;

/** Dimensions are clear-face metres. Walls and stair openings are accounted for separately.
 * This is a coordinated concept drawing, not a statutory usable-area measurement or construction document. */
export function floorPlans(h: Pick<House, "width" | "depth" | "floors" | "bedrooms" | "bathrooms" | "slug">): Floor[] {
  const iw = round(h.width - 2*t), id = round(h.depth - 2*t);
  const levels: Room[][] = [];
  const make = (list: [number, number, number, number, string, Room["type"]][]) => list.map(([x,y,w,d,label,type], i) => ({ x: round(t+x), y: round(t+y), w: round(w), d: round(d), label, type, id: `r${i+1}`, area: round(round(w)*round(d)) }));
  if (h.floors === 1 && h.bedrooms === 1) {
    const left = 3.92, right = round(iw-left-p);
    levels.push(make([[0,0,left,id,"Salon + kuchnia","living"], [left+p,0,right,1.65,"Łazienka","bath"], [left+p,1.77,right,id-1.77,"Sypialnia","bed"]]));
  } else if (h.floors === 1 && h.bedrooms === 2) {
    const wing = h.slug === "natura-45" ? 2.78 : h.slug === "classic-55" ? 3.30 : 3.56;
    const hall = .95, left = round(iw-wing-hall-2*p), bd = round((id-p)/2), bathW = 1.85, bathD = h.slug === "natura-45" ? 1.85 : 2.10;
    levels.push(make([[0,0,bathW,bathD,"Łazienka","bath"], [bathW+p,0,left-bathW-p,bathD,"Kuchnia","kitchen"], [0,bathD+p,left,id-bathD-p,"Salon + jadalnia","living"], [left+p,0,hall,id,"Hol wejściowy","hall"], [left+hall+2*p,0,wing,bd,"Sypialnia 1","bed"], [left+hall+2*p,bd+p,wing,id-bd-p,"Sypialnia 2","bed"]]));
  } else if (h.slug === "optima-70") {
    const left=4.60, hall=.95, right=round(iw-left-hall-2*p), rx=round(left+hall+2*p), bd=2.63, hd=.95;
    levels.push(make([[0,0,2.65,2.65,"Sypialnia 1","bed"], [2.77,0,left-2.77,2.65,"Łazienka","bath"], [0,2.77,left,id-2.77,"Salon + kuchnia","living"], [left+p,0,hall,id,"Hol","hall"], [rx,0,right,bd,"Sypialnia 2","bed"], [rx,bd+p,right,hd,"Hol wejściowy","hall"], [rx,bd+hd+2*p,right,id-bd-hd-2*p,"Sypialnia 3","bed"]]));
  } else if (h.floors === 1) {
    const bedD = h.slug === "rodzinny-65" ? 2.50 : 2.65, hallD = .95, bedW = round((iw-2*p)/3), livingD = round(id-bedD-hallD-2*p), bathW = 2.25;
    levels.push(make([[0,0,bedW,bedD,"Sypialnia 1","bed"], [bedW+p,0,bedW,bedD,"Pokój 2","bed"], [2*(bedW+p),0,iw-2*(bedW+p),bedD,"Pokój 3","bed"], [0,bedD+p,iw,hallD,"Hol wejściowy","hall"], [0,bedD+hallD+2*p,iw-bathW-p,livingD,"Salon + kuchnia","living"], [iw-bathW,bedD+hallD+2*p,bathW,livingD,"Łazienka","bath"]]));
  } else {
    const wing = 3.12, left = round(iw-wing-p), stairD = 3.10, topD = round(id-stairD-p), sx = round(left+p), sy = round(topD+p);
    const first: [number,number,number,number,string,Room["type"]][] = [[0,0,left,id,"Salon + kuchnia","living"], [sx,sy,wing,stairD,"Schody + wejście","stairs"]];
    if (h.bedrooms > 2) {
      const bh = h.slug === "family-plus-55" ? 2.15 : 2.10;
      first[0] = [0,bh+p,left,id-bh-p,"Salon + kuchnia","living"];
      first.push([0,0,left,bh,"Pokój / gabinet","bed"]);
    }
    first.push([sx,0,wing,topD,"Łazienka","bath"]);
    levels.push(make(first));
    if (h.bedrooms === 4) {
      const bd = 2.50, hd = 1.0, half = round((left-p)/2), bottomY = bd+hd+2*p;
      levels.push(make([[0,0,half,bd,"Sypialnia 1","bed"], [half+p,0,left-half-p,bd,"Sypialnia 2","bed"], [0,bd+p,left,hd,"Hol poddasza","hall"], [0,bottomY,half,id-bottomY,"Sypialnia 3","bed"], [half+p,bottomY,left-half-p,id-bottomY,"Przejście","hall"], [sx,0,wing,topD,"Łazienka","bath"], [sx,sy,wing,stairD,"Schody + hol","stairs"]]));
    } else {
      const bd = round((id-p)/2);
      levels.push(make([[0,0,left,bd,"Sypialnia 1","bed"], [0,bd+p,left,id-bd-p,"Sypialnia 2","bed"], [sx,0,wing,topD,h.bathrooms === 2 ? "Łazienka" : "Hol poddasza",h.bathrooms === 2 ? "bath" : "hall"], [sx,sy,wing,stairD,"Schody + hol","stairs"]]));
    }
  }

  return levels.map((rooms,level) => {
    const doors: Opening[] = [];
    // Join a spanning tree through shared walls. Bedrooms never lead through other bedrooms.
    const root = rooms.find(r => level ? r.type === "stairs" : r.type === "living")!;
    const seen = new Set([root.id]);
    const shared = (a: Room,b: Room): Opening | undefined => {
      if (a.type === "bed" && b.type === "bed") return;
      const vertical = near(a.x+a.w+p,b.x) || near(b.x+b.w+p,a.x);
      const horizontal = near(a.y+a.d+p,b.y) || near(b.y+b.d+p,a.y);
      if (vertical) {
        const start = Math.max(a.y,b.y), end = Math.min(a.y+a.d,b.y+b.d);
        if (end-start < .86) return;
        return {a:a.id,b:b.id,x:round(Math.max(a.x,b.x)-p/2),y:round(end-.83),size:.80,vertical:true};
      }
      if (horizontal) {
        const start = Math.max(a.x,b.x), end = Math.min(a.x+a.w,b.x+b.w);
        if (end-start < .86) return;
        return {a:a.id,b:b.id,x:round(a.type === "stairs" || b.type === "stairs" ? start+.08 : end-.83),y:round(Math.max(a.y,b.y)-p/2),size:.80,vertical:false};
      }
    };
    for (let n = 0;n < rooms.length;n++) {
      for (const b of [...rooms].sort((a,b) => (a.type === "bed" ? 1 : 0)-(b.type === "bed" ? 1 : 0))) {
        if (seen.has(b.id)) continue;
        const candidates = rooms.filter(a => seen.has(a.id)).sort((a,b) => (a.type === "hall" || a.type === "stairs" ? 0 : 1)-(b.type === "hall" || b.type === "stairs" ? 0 : 1));
        for (const a of candidates) {
          const door = shared(a,b);
          if (door) { door.passage = [a.type,b.type].every(v => ["living","kitchen","hall","stairs"].includes(v)); doors.push(door); seen.add(b.id); break; }
        }
      }
    }
    if (seen.size !== rooms.length) throw new Error(`Disconnected concept ${h.slug} / ${level}`);
    if (!level) {
      const entrance = rooms.find(r => r.type === "hall" && near(r.x+r.w,h.width-t)) || rooms.find(r => (r.type === "hall" || r.type === "stairs") && near(r.y+r.d,h.depth-t)) || root;
      const side = near(entrance.x+entrance.w,h.width-t) && entrance.type === "hall";
      doors.push({a:entrance.id,x:side ? h.width-t/2 : round(entrance.type === "stairs" ? entrance.x+.08 : entrance.x+entrance.w-.98),y:side ? round(entrance.y+.08) : round(h.depth-t/2),size:.90,vertical:side});
    }
    const windows: Opening[] = [];
    for (const r of rooms) {
      if (["hall","stairs"].includes(r.type)) continue;
      const size = Math.min(r.type === "living" ? 2.4 : r.type === "bath" ? .6 : 1.2,r.w-.3);
      if (near(r.y,t)) windows.push({a:r.id,x:round(r.x+(r.w-size)/2),y:t/2,size,vertical:false});
      else if (near(r.y+r.d,h.depth-t)) windows.push({a:r.id,x:round(r.x+.12),y:h.depth-t/2,size,vertical:false});
      else if (near(r.x+r.w,h.width-t)) windows.push({a:r.id,x:h.width-t/2,y:round(r.y+.15),size:Math.min(1.2,r.d-.3),vertical:true});
      else if (near(r.x,t)) windows.push({a:r.id,x:t/2,y:round(r.y+.15),size:Math.min(1.2,r.d-.3),vertical:true});
    }
    const furniture: Furniture[] = [];
    const obstacles: Box[] = doors.map(o => o.vertical ? {x:o.x-.86,y:o.y,w:1.72,d:o.size} : {x:o.x,y:o.y-.86,w:o.size,d:1.72});
    const place = (r:Room,kind:Furniture["kind"],w:number,d:number,positions?:[number,number][]) => {
      const candidates = positions || [[r.w-w-.08,.08],[.08,.08],[.08,r.d-d-.08],[r.w-w-.08,r.d-d-.08],[(r.w-w)/2,.08],[(r.w-w)/2,(r.d-d)/2]];
      if (!positions) for(let y=.08;y+d<r.d-.04;y+=.10) for(let x=.08;x+w<r.w-.04;x+=.10) candidates.push([round(x),round(y)]);
      for (const [x,y] of candidates) {
        const box = {x:round(r.x+x),y:round(r.y+y),w,d};
        if (x < .04 || y < .04 || x+w > r.w-.04 || y+d > r.d-.04) continue;
        if ([...obstacles,...furniture].some(o => overlaps(box,o,.04))) continue;
        furniture.push({...box,kind,room:r.id}); return true;
      }
      return false;
    };
    for (const r of rooms) {
      if (r.type === "bed") {
        if (!place(r,"bed",1.4,2.0)) if (!place(r,"bed",.9,2.0)) place(r,"bed",2.0,.9);
        place(r,"wardrobe",1.2,.6);
      } else if (r.type === "bath") {
        place(r,"shower",.85,.85);
        if(!place(r,"wc",.40,.65,[[r.w-1.63,.08]])) place(r,"wc",.40,.65);
        if(!place(r,"basin",.55,.40)) place(r,"basin",.55,.32);
      } else if (r.type === "living" || r.type === "kitchen") {
        // The single kitchen belongs to the kitchen zone, or to the open living area.
        if (r.type === "kitchen" || !rooms.some(z => z.type === "kitchen")) place(r,"kitchen",Math.min(2.4,r.w-.2),.60);
        if (r.type === "living") { if (!place(r,"sofa",1.8,.8)) place(r,"sofa",.8,1.8); place(r,"table",1.1,.65); }
        else place(r,"table",.9,.65);
      } else if (r.type === "stairs") {
        // Same stair position on both levels; 0.9 m flights, 1 m turning landing.
        place(r,"stairs",2.0,2.9,[[r.w-2.04,.10]]);
      } else place(r,"wardrobe",.60,1.0);
    }
    if (!level && !furniture.some(f=>f.kind === "wardrobe")) place(root,"wardrobe",.60,1.0);
    const openingArea = level ? 2.0*2.0 : 0; // Upper stairwell flights; the 1 m landing remains floor.
    return {rooms,doors,windows,furniture,level,openingArea};
  });
}

export function netFloorArea(h: Parameters<typeof floorPlans>[0]) {
  return round(floorPlans(h).reduce((sum,f) => sum+f.rooms.reduce((a,r) => a+r.area,0)-f.openingArea,0));
}
