"use client";
import { useMemo, useState } from "react";
import { publishedHouses } from "@/content/houses";
import { HouseCard } from "./house-card";
import { SlidersHorizontal, X } from "./icons";
export function Catalog() {
  const [max, setMax] = useState("70"),
    [bedrooms, setBedrooms] = useState(""),
    [floors, setFloors] = useState(""),
    [roof, setRoof] = useState(""),
    [style, setStyle] = useState(""),
    [sort, setSort] = useState("featured");
  const reset = () => {
    setMax("70");
    setBedrooms("");
    setFloors("");
    setRoof("");
    setStyle("");
    setSort("featured");
  };
  const filtered = useMemo(() => {
    const list = publishedHouses.filter(
      (h) =>
        h.footprint <= Number(max) &&
        (!bedrooms || h.bedrooms === Number(bedrooms)) &&
        (!floors || h.floors === Number(floors)) &&
        (!roof || h.roof === roof) &&
        (!style || h.style === style),
    );
    if (sort === "area-asc") list.sort((a, b) => a.footprint - b.footprint);
    if (sort === "area-desc") list.sort((a, b) => b.footprint - a.footprint);
    if (sort === "name")
      list.sort((a, b) => a.name.localeCompare(b.name, "pl"));
    return list;
  }, [max, bedrooms, floors, roof, style, sort]);
  const active = max !== "70" || !!bedrooms || !!floors || !!roof || !!style;
  return (
    <div className="shell catalog">
      <div className="catalog-filter">
        <div className="filter-title">
          <SlidersHorizontal size={18} />
          <span>Dopasuj swój dom</span>
        </div>
        <div className="filter-grid">
          <label>
            Powierzchnia zabudowy
            <select value={max} onChange={(e) => setMax(e.target.value)}>
              <option value="70">Do 70 m²</option>
              <option value="60">Do 60 m²</option>
              <option value="55">Do 55 m²</option>
              <option value="45">Do 45 m²</option>
              <option value="35">Do 35 m²</option>
            </select>
          </label>
          <label>
            Sypialnie
            <select
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
            >
              <option value="">Dowolna liczba</option>
              {[1, 2, 3, 4].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
          <label>
            Kondygnacje
            <select value={floors} onChange={(e) => setFloors(e.target.value)}>
              <option value="">Wszystkie</option>
              <option value="1">Parterowe</option>
              <option value="2">Z poddaszem</option>
            </select>
          </label>
          <label>
            Dach
            <select value={roof} onChange={(e) => setRoof(e.target.value)}>
              <option value="">Wszystkie</option>
              <option>Dwuspadowy</option>
              <option>Jednospadowy</option>
            </select>
          </label>
          <label>
            Styl
            <select value={style} onChange={(e) => setStyle(e.target.value)}>
              <option value="">Wszystkie</option>
              <option>Skandynawski</option>
              <option>Minimalistyczny</option>
              <option>Nowoczesna stodoła</option>
            </select>
          </label>
        </div>
      </div>
      <div className="catalog-toolbar">
        <p aria-live="polite">
          <strong>{filtered.length}</strong> z {publishedHouses.length}{" "}
          koncepcji{" "}
          {active && (
            <button onClick={reset} className="reset-filters">
              Wyczyść filtry <X size={13} />
            </button>
          )}
        </p>
        <label>
          Sortuj
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="featured">Polecana kolejność</option>
            <option value="area-asc">Powierzchnia rosnąco</option>
            <option value="area-desc">Powierzchnia malejąco</option>
            <option value="name">Nazwa A–Z</option>
          </select>
        </label>
      </div>
      {filtered.length ? (
        <div className="house-grid">
          {filtered.map((h) => (
            <HouseCard house={h} key={h.id} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h2>Jeszcze nie ma takiej kombinacji.</h2>
          <p>Zmień filtry i odkryj pozostałe koncepcje.</p>
          <button className="button" onClick={reset}>
            Pokaż wszystkie domy
          </button>
        </div>
      )}
      <p className="catalog-note">
        Powierzchnia zabudowy nie jest powierzchnią użytkową. Koncepcje wymagają
        weryfikacji architektonicznej.
      </p>
    </div>
  );
}
