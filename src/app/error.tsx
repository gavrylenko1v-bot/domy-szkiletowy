"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <section className="shell not-found">
      <h1>Coś przerwało połączenie.</h1>
      <p>Spróbuj ponownie za chwilę.</p>
      <button className="button" onClick={reset}>
        Spróbuj ponownie
      </button>
    </section>
  );
}
