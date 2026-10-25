import Link from "next/link";
export default function NotFound() {
  return (
    <section className="shell not-found">
      <span className="eyebrow">404 / TU JESZCZE NIE MA DOMU</span>
      <h1>Wróćmy na dobry szlak.</h1>
      <p>Ta strona nie istnieje lub nie jest jeszcze dostępna.</p>
      <Link href="/projekty" className="button">
        Odkryj projekty domów ↗
      </Link>
    </section>
  );
}
