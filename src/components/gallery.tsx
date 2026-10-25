"use client";
import Image from "next/image";
import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "./icons";
export function Gallery({
  images,
  name,
}: {
  images: { src: string; alt: string }[];
  name: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  function go(i: number) {
    ref.current?.scrollTo({
      left: i * ref.current.clientWidth,
      behavior: "smooth",
    });
    setActive(i);
  }
  return (
    <div className="gallery">
      <div
        className="gallery-track"
        ref={ref}
        onScroll={() => {
          if (ref.current)
            setActive(
              Math.round(ref.current.scrollLeft / ref.current.clientWidth),
            );
        }}
        aria-label={`Galeria ${name}`}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") {
            e.preventDefault();
            go(Math.min(images.length - 1, active + 1));
          }
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            go(Math.max(0, active - 1));
          }
        }}
      >
        {images.map((image, i) => (
          <div className="gallery-slide" key={image.src}>
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 900px) 100vw, 85vw"
              priority={i === 0}
            />
            <span>{image.alt}</span>
          </div>
        ))}
      </div>
      <div className="gallery-controls">
        <span>
          0{active + 1} <span className="muted">/ 0{images.length}</span>
        </span>
        <div>
          {images.map((_, i) => (
            <button
              key={i}
              className={`gallery-dot ${active === i ? "active" : ""}`}
              aria-label={`Pokaż zdjęcie ${i + 1}`}
              aria-pressed={active === i}
              onClick={() => go(i)}
            />
          ))}
        </div>
        <div>
          <button
            onClick={() => go(Math.max(0, active - 1))}
            disabled={active === 0}
            aria-label="Poprzednie zdjęcie"
          >
            <ArrowLeft size={19} />
          </button>
          <button
            onClick={() => go(Math.min(images.length - 1, active + 1))}
            disabled={active === images.length - 1}
            aria-label="Następne zdjęcie"
          >
            <ArrowRight size={19} />
          </button>
        </div>
      </div>
    </div>
  );
}
