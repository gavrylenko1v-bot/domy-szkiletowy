import { PageIntro } from "@/components/page-intro";
import { FAQ } from "@/components/faq";
import { metadata, JsonLd } from "@/lib/seo";
import { faq } from "@/content/site";
export const generateMetadata = () =>
  metadata(
    "FAQ — pytania o budowę domu szkieletowego",
    "Powierzchnia zabudowy a użytkowa, formalności budowlane, cena, całoroczność i modyfikacje koncepcji. Odpowiedzi na najczęstsze pytania.",
    "/faq",
  );
export default function Page() {
  return (
    <>
      <PageIntro
        kicker="Pytania i odpowiedzi"
        title="Świadome decyzje zaczynają się od pytań."
        description="Zebraliśmy tematy, które warto wyjaśnić przed wyborem koncepcji i rozpoczęciem rozmowy o budowie."
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map(([q, a]) => ({
            "@type": "Question",
            name: q,
            acceptedAnswer: { "@type": "Answer", text: a },
          })),
        }}
      />
      <section className="shell article-content">
        <FAQ />
        <div className="notice">
          Informacje ogólne nie zastępują porady uprawnionego projektanta ani
          weryfikacji aktualnych przepisów dla konkretnej działki.
        </div>
      </section>
    </>
  );
}
