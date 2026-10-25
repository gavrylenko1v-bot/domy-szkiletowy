import Image from "next/image";
import Link from "next/link";
import { areaFormat } from "@/content/house-details";
import type { House } from "@/content/houses";
import { ArrowUpRight, BedDouble, Layers3 } from "./icons";
export function HouseCard({
  house: h,
  priority = false,
}: {
  house: House;
  priority?: boolean;
}) {
  return (
    <article className="house-card">
      <Link href={`/projekty/${h.slug}`} className="card-image">
        <Image
          src={h.image}
          alt={`${h.name} — ${h.imageStatus === "illustration" ? "ilustracja" : "wizualizacja"} koncepcyjna domu szkieletowego`}
          fill
          sizes="(max-width: 650px) 100vw, (max-width: 1000px) 50vw, 33vw"
          priority={priority}
        />
        <span className="card-badge">
          {h.floors === 1 ? "PARTEROWY" : "Z PODDASZEM"}
        </span>
        <span className="card-round">
          <ArrowUpRight size={21} />
        </span>
        <span className="render-caption">
          {h.imageStatus === "illustration"
            ? "Ilustracja koncepcyjna"
            : "Wizualizacja koncepcyjna"}
        </span>
      </Link>
      <div className="card-heading">
        <Link href={`/projekty/${h.slug}`}>
          <h3>{h.name}</h3>
        </Link>
        <span>
          {areaFormat(h.usable)} <small>m² netto</small>
        </span>
      </div>
      <p>{h.tagline}</p>
      <div className="card-specs">
        <span>
          <BedDouble size={16} />
          {h.bedrooms+1} pokoje
        </span>
        <span>
          <Layers3 size={16} />
          {h.floors === 1 ? "Parter" : "Parter + poddasze"}
        </span>
        <span>{h.bathrooms} {h.bathrooms === 1 ? "łazienka" : "łazienki"}</span>
        <span>Dach {h.roof.toLocaleLowerCase("pl")}</span>
      </div>
      <Link href={`/projekty/${h.slug}`} className="text-link card-project-link">
        Zobacz projekt <ArrowUpRight size={18} />
      </Link>
    </article>
  );
}
