import { floorPlans, round } from "./floor-plans";
import type { House } from "./houses";

export type RoomAllowance = { name: string; area: number; level: 0 | 1 };
export function houseDetails(h: House) {
  const rooms: RoomAllowance[] = floorPlans(h).flatMap(f => f.rooms.map(r => ({ name:r.label, area:round(r.area-(r.type === "stairs" ? f.openingArea : 0)), level:f.level as 0|1 })));
  return {
    rooms,
    gross: h.width * h.depth * h.floors,
    roomCount: h.bedrooms + 1,
    structure: "Szkielet drewniany; przekroje, usztywnienia i układ warstw dobiera konstruktor.",
    roofPitch: h.roof === "Płaski" ? "Spadek techniczny ukryty za attyką — do zaprojektowania" : h.floors === 2 ? "40° — założenie koncepcyjne" : "35° — założenie koncepcyjne",
    terrace: (h.terrace ? "Przewidziany w koncepcji. " : "Opcjonalny, do uzgodnienia. ")+"Przy strefie dziennej, poza obrysem domu. Kierunek i zadaszenie do dopasowania do działki.",
    glazing: h.floors === 1
      ? "Większe przeszklenie przy salonie; oddzielne okna w sypialniach. Ochronę przed przegrzewaniem i widoki należy sprawdzić na działce."
      : "Przeszklenie salonu oraz okna sypialni na poddaszu. Wymiary, wysokości parapetów i drogi ewakuacji wymagają sprawdzenia projektowego.",
    changes: [
      "Odbicie układu po sprawdzeniu nasłonecznienia i dostępu do drogi.",
      h.bedrooms > 1 ? "Połączenie jednego z mniejszych pokoi ze strefą dzienną lub urządzenie gabinetu." : "Zmiana zabudowy kuchennej i szaf bez powiększania obrysu.",
      "Dobór tarasu, osłon przeciwsłonecznych i materiału elewacji.",
      "Dobór ogrzewania, wentylacji i miejsca na urządzenia przez projektanta instalacji.",
    ],
    finishes: [
      ["Naturalne drewno", h.facade + ". Sposób zabezpieczenia i konserwacji do ustalenia."],
      ["Drewno i jasna okładzina", "Jaśniejszy charakter bryły; system elewacji i detale połączeń wymagają doboru projektowego."],
      ["Grafitowe akcenty", "Ciemna stolarka i obróbki. Dostępność kolorów oraz wpływ na nagrzewanie do sprawdzenia."],
    ],
  };
}
export const areaFormat = (value: number) => new Intl.NumberFormat("pl-PL", {maximumFractionDigits: 2}).format(value);
