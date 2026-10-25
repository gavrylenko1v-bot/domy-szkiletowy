import type { House } from "./houses";

export type RoomAllowance = { name: string; area: number; level: 0 | 1 };
// Preliminary usable-area budgets, not measurements of the schematic SVG zones.
const programs: Record<string, [string, number, (0 | 1)?][]> = {
  "mini-35": [["Salon z aneksem kuchennym",15],["Sypialnia",7],["Łazienka",3],["Wejście i przechowywanie",2]],
  "natura-45": [["Salon z aneksem kuchennym",16],["Sypialnia",8],["Pokój jednoosobowy / gabinet",6],["Łazienka",3.5],["Hol z szafą",2.5]],
  "classic-55": [["Salon z kuchnią i jadalnią",20],["Sypialnia",10],["Pokój jednoosobowy",7],["Łazienka",4],["Wejście i komunikacja",3],["Szafa instalacyjna",1]],
  "komfort-60": [["Salon z kuchnią i jadalnią",23],["Sypialnia",10],["Pokój",8],["Łazienka",4],["Wejście i komunikacja",3],["Strefa techniczna",2]],
  "rodzinny-65": [["Salon z aneksem kuchennym",20],["Sypialnia",10],["Pokój dziecka 1",7],["Pokój dziecka 2",7],["Łazienka",4],["Wejście i komunikacja",5],["Strefa techniczna",2]],
  "optima-70": [["Salon z kuchnią i jadalnią",23],["Sypialnia",10],["Pokój 1",8],["Pokój 2",8],["Łazienka",4],["Wejście i komunikacja",5],["Strefa techniczna",2]],
  "smart-48": [["Salon z kuchnią i jadalnią",23],["Łazienka",4],["Wiatrołap",3],["Schody i komunikacja",4],["Strefa techniczna",2],["Sypialnia 1",10,1],["Sypialnia 2",10,1],["Hol poddasza",5,1]],
  "family-plus-55": [["Salon z kuchnią",23],["Gabinet / pokój jednoosobowy",7],["Łazienka",3],["Wiatrołap",3],["Schody i komunikacja",4],["Strefa techniczna",2],["Sypialnia 1",12,1],["Sypialnia 2",12,1],["Łazienka poddasza",3,1],["Hol poddasza",3,1]],
  "stodola-60": [["Salon z kuchnią",25],["Gabinet / pokój",8],["Łazienka",4],["Wiatrołap",3],["Schody i komunikacja",4],["Strefa techniczna",2],["Sypialnia 1",13,1],["Sypialnia 2",12,1],["Łazienka poddasza",3,1],["Hol poddasza",4,1]],
  "max-70": [["Salon z kuchnią i jadalnią",29],["Gabinet / sypialnia parteru",9],["Łazienka",4],["Wejście i komunikacja",4],["Schody",4],["Strefa techniczna",2],["Sypialnia 1",12,1],["Sypialnia 2",11,1],["Sypialnia 3",10,1],["Łazienka poddasza",4,1],["Hol poddasza",5,1]],
};
export function houseDetails(h: House) {
  const rooms: RoomAllowance[] = programs[h.slug].map(([name,area,level=0]) => ({name,area,level}));
  return {
    rooms,
    gross: h.width * h.depth * h.floors,
    roomCount: h.bedrooms + 1,
    structure: "Szkielet drewniany; przekroje, usztywnienia i układ warstw dobiera konstruktor.",
    roofPitch: h.floors === 2 ? "40° — założenie koncepcyjne" : "35° — założenie koncepcyjne",
    terrace: "Przy strefie dziennej, poza obrysem domu. Kierunek i zadaszenie do dopasowania do działki.",
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
