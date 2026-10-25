import Link from "next/link";
export function PageIntro({
  kicker,
  title,
  description,
}: {
  kicker: string;
  title: string;
  description: string;
}) {
  return (
    <section className="page-intro shell">
      <div className="breadcrumb">
        <Link href="/">Strona główna</Link>
        <span>/</span>
        <span>{kicker}</span>
      </div>
      <span className="eyebrow">{kicker}</span>
      <h1>{title}</h1>
      <p>{description}</p>
    </section>
  );
}
