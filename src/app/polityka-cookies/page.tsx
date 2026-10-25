import { PageIntro } from "@/components/page-intro";
import { metadata } from "@/lib/seo";
export const generateMetadata = () =>
  metadata(
    "Polityka cookies",
    "Informacje o plikach cookies i narzędziach śledzących. Obecna wersja strony nie uruchamia analityki reklamowej ani opcjonalnych plików cookies.",
    "/polityka-cookies",
  );
export default function Page() {
  return (
    <>
      <PageIntro
        kicker="Polityka cookies"
        title="Prywatność bez zbędnych dodatków."
        description="Wersja przygotowawcza z 25 października 2026 r. Dokument należy sprawdzić po wyborze hostingu i usług zewnętrznych."
      />
      <article className="shell article-content">
        <h2>1. Obecna konfiguracja strony</h2>
        <p>
          Aplikacja nie ustawia analitycznych ani reklamowych cookies. Nie
          ładuje Google Analytics, Meta Pixel, filmów, map ani zewnętrznych
          fontów. Grafiki są serwowane lokalnie. Nie ma powodu wyświetlać
          pozornego panelu zgód dla usług, które nie są aktywne.
        </p>
        <h2>2. Dane techniczne</h2>
        <p>
          Serwer i dostawcy infrastruktury mogą przetwarzać techniczne dane
          połączenia potrzebne do działania i ochrony strony. Operator musi
          zweryfikować, czy wybrany hosting lub jego zabezpieczenia ustawiają
          niezbędne cookies, oraz uzupełnić ich nazwy, cel, dostawcę i czas
          ważności.
        </p>
        <h2>3. Przyszła analityka i reklamy</h2>
        <p>
          Jeśli zostaną dodane opcjonalne narzędzia, należy wdrożyć panel
          umożliwiający dobrowolną, szczegółową zgodę, równie łatwe odrzucenie i
          późniejsze wycofanie. Skrypty i połączenia wymagające zgody muszą
          pozostać wyłączone do jej uzyskania. Samo opublikowanie tej informacji
          nie stanowi zgody użytkownika.
        </p>
        <h2>4. Ustawienia przeglądarki</h2>
        <p>
          Możesz zarządzać plikami cookies i danymi witryn w ustawieniach
          przeglądarki. Ograniczenie niezbędnych mechanizmów wybranej
          infrastruktury może wpłynąć na działanie niektórych funkcji.
        </p>
        <div className="legal-status">
          Przed publikacją operator powinien przeprowadzić audyt faktycznie
          uruchomionych usług i uzyskać weryfikację dokumentu przez specjalistę.
        </div>
      </article>
    </>
  );
}
