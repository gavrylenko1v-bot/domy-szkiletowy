import type { House } from "../src/content/houses";
import { floorPlans, round, type Floor, type Furniture } from "../src/content/floor-plans";
export const planGeometry = floorPlans;
const esc = (s:string) => s.replaceAll("&","&amp;").replaceAll("<","&lt;");
const fmt = (n:number) => n.toFixed(2).replace(".",",");
const rect = (x:number,y:number,w:number,d:number,attrs="") => `<rect x="${round(x)}" y="${round(y)}" width="${round(w)}" height="${round(d)}" ${attrs}/>`;
const text = (x:number,y:number,s:string,size=18,attrs="") => `<text x="${round(x)}" y="${round(y)}" font-size="${size}" ${attrs}>${esc(s)}</text>`;
function furnish(f:Furniture,level:number) {
  const {x,y,w,d,kind} = f;
  let body = rect(x,y,w,d,`rx=".035" fill="${kind === "stairs" ? "#f8f7f3" : "#eee7da"}" stroke="#a29580" stroke-width=".012"`);
  if (kind === "bed") {
    body += rect(x+.04,y+.04,w-.08,d-.08,'rx=".03" fill="#fffefa" stroke="#b5ac9b" stroke-width=".012"');
    const horizontal = w > d;
    body += horizontal ? rect(x+.08,y+.08,.30,d-.16,'rx=".04" fill="#dfd7c7"') : rect(x+.08,y+.08,w-.16,.32,'rx=".04" fill="#dfd7c7"');
    body += `<path d="${horizontal ? `M${x+.52} ${y+.06}v${d-.12}` : `M${x+.06} ${y+.55}h${w-.12}`}" stroke="#b5ac9b" stroke-width=".015"/>`;
  } else if (kind === "wardrobe") body += `<path d="M${x} ${y}l${w} ${d}m${-w} 0l${w} ${-d}" stroke="#b7ac99" stroke-width=".012"/>`;
  else if (kind === "sofa") {
    body += rect(x+.12,y+.10,w-.24,d-.20,'rx=".07" fill="#e0d8c8" stroke="#a29580" stroke-width=".012"');
    body += `<path d="M${x+w/2} ${y+.10}v${d-.20}" stroke="#a29580" stroke-width=".012"/>`;
  } else if (kind === "table") {
    body += rect(x+.10,y+.08,w-.2,d-.16,'rx=".10" fill="#d5c6aa"');
    for (const cx of [x+.12,x+w-.42]) body += rect(cx,y+d-.09,.30,.15,'rx=".05" fill="#fffefa" stroke="#a29580" stroke-width=".012"');
  } else if (kind === "kitchen") {
    for(let i=1;i<Math.floor(w/.6);i++) body += `<path d="M${x+i*.6} ${y}v${d}" stroke="#a29580" stroke-width=".012"/>`;
    body += rect(x+.10,y+.12,.42,.35,'rx=".05" fill="#fffefa" stroke="#a29580" stroke-width=".012"');
    for(const [dx,dy] of [[0,0],[.18,0],[0,.18],[.18,.18]]) body += `<circle cx="${x+w-.46+dx}" cy="${y+.20+dy}" r=".055" fill="#647069"/>`;
  } else if (kind === "shower") {
    body = rect(x,y,w,d,'fill="#f4f8f6" stroke="#82978d" stroke-width=".016"')+`<path d="M${x+.04} ${y+.04}l${w-.08} ${d-.08}m${-w+.08} 0l${w-.08} ${-d+.08}" stroke="#b3c3ba" stroke-width=".01"/><circle cx="${x+w/2}" cy="${y+d/2}" r=".035" fill="#82978d"/>`;
  } else if (kind === "wc") body = rect(x,y,w,.17,'rx=".025" fill="white" stroke="#82978d" stroke-width=".014"')+`<ellipse cx="${x+w/2}" cy="${y+d*.62}" rx="${w*.45}" ry="${d*.36}" fill="white" stroke="#82978d" stroke-width=".014"/>`;
  else if (kind === "basin") body += `<ellipse cx="${x+w/2}" cy="${y+d/2}" rx="${w*.34}" ry="${d*.30}" fill="white" stroke="#82978d" stroke-width=".014"/>`;
  else if (kind === "stairs") {
    body += rect(x,y,2,2,`fill="${level ? 'url(#hatch)' : '#f1ede3'}"`);
    for(let i=0;i<=7;i++) body += `<path d="M${x} ${y+i*2/7}h.90M${x+1.1} ${y+i*2/7}h.90" stroke="#a29580" stroke-width=".014"/>`;
    body += `<path d="M${x+.45} ${y+.20}v2.25h1.10V${y+.20}l-.10 .20m.10-.20 .10 .20" fill="none" stroke="#53655a" stroke-width=".02"/>`;
  }
  return `<g data-furniture="${kind}">${body}</g>`;
}
function levelSvg(h:House,f:Floor,offset:number) {
  const s=82, ox=85, oy=150, fw=h.width*s, fh=h.depth*s, sx=1000;
  const sum = round(f.rooms.reduce((v,r)=>v+r.area,0)-f.openingArea);
  let drawing = rect(0,0,h.width,h.depth,'fill="#283f35"');
  for (const r of f.rooms) drawing += rect(r.x,r.y,r.w,r.d,`fill="${r.type === "bath" ? '#e8efeb' : r.type === 'hall' || r.type === 'stairs' ? '#f3f0e8' : '#fffefa'}"`);
  for (const o of f.windows) {
    drawing += `<path d="M${o.x} ${o.y}${o.vertical ? `v${o.size}` : `h${o.size}`}" stroke="#fffefa" stroke-width=".29"/>`;
    for(const d of [-.10,0,.10]) drawing += `<path d="M${o.x+(o.vertical?d:0)} ${o.y+(o.vertical?0:d)}${o.vertical ? `v${o.size}` : `h${o.size}`}" stroke="#7c9d8f" stroke-width=".018"/>`;
  }
  for (const o of f.doors) {
    drawing += `<path d="M${o.x} ${o.y}${o.vertical ? `v${o.size}` : `h${o.size}`}" stroke="#fffefa" stroke-width="${o.b ? '.15' : '.31'}"/>`;
    if (!o.passage) drawing += o.vertical
      ? `<path d="M${o.x} ${o.y}h${o.size}M${o.x} ${o.y+o.size}a${o.size} ${o.size} 0 0 0 ${o.size} ${-o.size}" fill="none" stroke="#6f8276" stroke-width=".016"/>`
      : `<path d="M${o.x} ${o.y}v${o.size}M${o.x+o.size} ${o.y}a${o.size} ${o.size} 0 0 1 ${-o.size} ${o.size}" fill="none" stroke="#6f8276" stroke-width=".016"/>`;
  }
  drawing += f.furniture.map(v=>furnish(v,f.level)).join("");
  for (let i=0;i<f.rooms.length;i++) {
    const r=f.rooms[i];
    drawing += `<circle cx="${r.x+r.w/2}" cy="${r.y+r.d/2}" r=".16" fill="#283f35" stroke="#fffefa" stroke-width=".025"/>`;
    drawing += text(r.x+r.w/2,r.y+r.d/2+.055,String(i+1).padStart(2,"0"),.15,'text-anchor="middle" fill="white"');
  }
  let out = text(ox,55,`${h.name} / ${f.level ? 'PODDASZE' : 'PARTER'}`,30,'font-weight="600" fill="#203d30"');
  out += text(ox,88,'RZUT KONCEPCYJNY · WYMIARY W METRACH',15,'letter-spacing="2" fill="#607164"');
  out += `<g transform="translate(${ox} ${oy}) scale(${s})">${drawing}</g>`;
  const dim=(x1:number,y1:number,x2:number,y2:number,label:string,vertical=false) => `<path d="M${x1} ${y1}L${x2} ${y2}M${x1-5} ${y1-5}l10 10M${x2-5} ${y2-5}l10 10" stroke="#7d8c7e" fill="none"/>`+text((x1+x2)/2+(vertical?-13:0),(y1+y2)/2-9,label,16,vertical?`text-anchor="middle" transform="rotate(-90 ${(x1+x2)/2-13} ${(y1+y2)/2-9})"`:'text-anchor="middle"');
  out += dim(ox,oy-25,ox+fw,oy-25,`${fmt(h.width)} m`);
  out += dim(ox-25,oy,ox-25,oy+fh,`${fmt(h.depth)} m`,true);
  const rear = f.rooms.filter(r=>Math.abs(r.y-.28)<.01).sort((a,b)=>a.x-b.x);
  for(const r of rear) out += dim(ox+r.x*s,oy+fh+35,ox+(r.x+r.w)*s,oy+fh+35,fmt(r.w));
  out += text(sx,140,'POMIESZCZENIA',17,'font-weight="600" letter-spacing="1"');
  for(let i=0;i<f.rooms.length;i++) {
    const r=f.rooms[i], y=185+i*76;
    out += text(sx,y,`${String(i+1).padStart(2,'0')}   ${r.label}`,19,'font-weight="500"');
    out += text(sx+35,y+27,`${fmt(r.w)} × ${fmt(r.d)} m   /   ${fmt(r.area-(r.type==='stairs'?f.openingArea:0))} m²`,17,'fill="#607164"');
  }
  out += text(sx,195+f.rooms.length*76,`PODŁOGI NETTO   ${fmt(sum)} m²`,19,'font-weight="600" fill="#203d30"');
  if(f.level) out += text(sx,225+f.rooms.length*76,'Bez 4,00 m² otworu schodowego.',15,'fill="#607164"');
  const fy=Math.max(oy+fh+105,280+f.rooms.length*76);
  out += `<path d="M${ox} ${fy-35}h1190" stroke="#d4dacd"/>`;
  out += text(ox,fy,'KONCEPCJA ARCHITEKTONICZNA · NIE JEST DOKUMENTACJĄ DO BUDOWY',17,'font-weight="600" fill="#203d30"');
  out += text(ox,fy+29,'Ściany zewnętrzne 28 cm, działowe 12 cm — założenia geometryczne. Taras poza obrysem.',16,'fill="#607164"');
  out += text(ox,fy+55,f.level ? 'Podano pola podłóg przed korektą za skosy. Wysokości, konstrukcję i schody sprawdza projektant.' : 'Otwory, instalacje, nasłonecznienie i zgodność wizualizacji wymagają sprawdzenia przez projektanta.',16,'fill="#607164"');
  out += rect(ox,fy+80,s,7,'fill="#203d30"')+rect(ox+s,fy+80,s,7,'fill="#bbc6b8"')+text(ox+2*s+15,fy+89,'2 m',15);
  return {body:`<g transform="translate(0 ${offset})">${out}</g>`,height:fy+125};
}
export function renderPlan(h:House,onlyLevel?:number) {
  const floors = floorPlans(h).filter(f=>onlyLevel === undefined || f.level===onlyLevel);
  let height=0, content="";
  for(const f of floors) {const result=levelSvg(h,f,height);content+=result.body;height+=result.height;}
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1400 ${height}" role="img" aria-labelledby="title desc"><title id="title">${esc(h.name)} — rzuty koncepcyjne</title><desc id="desc">Wymiary, drzwi z łukami otwierania, okna, meble oraz zestawienie pól netto. Koncepcja, nie projekt do budowy.</desc><defs><pattern id="hatch" width=".12" height=".12" patternUnits="userSpaceOnUse"><path d="M0 .12L.12 0" stroke="#b6bbaa" stroke-width=".01"/></pattern></defs><rect width="100%" height="100%" fill="#fffefa"/><g font-family="Arial, sans-serif" fill="#293c31">${content}</g></svg>`;
}
