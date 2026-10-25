import { Catalog } from "@/components/catalog";
import { PageIntro } from "@/components/page-intro";
import { metadata } from "@/lib/seo";
export const generateMetadata = () =>
  metadata(
    "Projekty domów szkieletowych do 70 m²",
    "Porównaj 10 koncepcji domów szkieletowych parterowych i z poddaszem. Filtruj powierzchnię zabudowy, sypialnie i styl. Znajdź kierunek dla swojego domu.",
    "/projekty",
  );
export default function Page() {
  return (
    <>
      <PageIntro
        kicker="Projekty domów"
        title="Znajdź swoją przestrzeń."
        description="Dziesięć koncepcji. Różne potrzeby. Ten sam szacunek do prostoty, natury i codziennego komfortu."
      />
      <Catalog />
    </>
  );
}
