"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "./icons";
export function Gallery({
  images,
  name,
}: {
  images: { src: string; alt: string }[];
  name: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState(false);
  useEffect(() => {
    if (!expanded) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.current?.showModal();
    return () => {
      document.body.style.overflow = previous;
    };
  }, [expanded]);
  function close() {
    dialog.current?.close();
    setExpanded(false);
    opener.current?.focus();
  }
  function go(i: number) {
    ref.current?.scrollTo({
      left: i * ref.current.clientWidth,
      behavior: expanded ? "instant" : "smooth",
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
          {String(active + 1).padStart(2, "0")} <span className="muted">/ {String(images.length).padStart(2, "0")}</span>
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
      <button ref={opener} className="text-link gallery-expand" onClick={() => setExpanded(true)}>
        Otwórz galerię na pełnym ekranie
      </button>
      {expanded && (
        <dialog
          ref={dialog}
          className="gallery-dialog"
          aria-label={`Pełnoekranowa galeria ${name}`}
          onCancel={(event) => { event.preventDefault(); close(); }}
          onClick={(event) => { if (event.target === event.currentTarget) close(); }}
          onKeyDown={(event) => {
            if (event.key === "ArrowRight") { event.preventDefault(); go(Math.min(images.length - 1, active + 1)); }
            if (event.key === "ArrowLeft") { event.preventDefault(); go(Math.max(0, active - 1)); }
            if (event.key === "Home") { event.preventDefault(); go(0); }
            if (event.key === "End") { event.preventDefault(); go(images.length - 1); }
          }}
        >
          <div className="lightbox-toolbar">
            <span>{name} · {active + 1} / {images.length}</span>
            <button autoFocus onClick={close} aria-label="Zamknij galerię">Zamknij ×</button>
          </div>
          <div className="lightbox-image">
            <Image src={images[active].src} alt={images[active].alt} fill sizes="100vw" />
          </div>
          <div className="lightbox-toolbar">
            <button disabled={active === 0} onClick={() => go(active - 1)} aria-label="Poprzedni widok">← Wstecz</button>
            <p aria-live="polite">{images[active].alt}</p>
            <button disabled={active === images.length - 1} onClick={() => go(active + 1)} aria-label="Następny widok">Dalej →</button>
          </div>
        </dialog>
      )}
    </div>
  );
}
