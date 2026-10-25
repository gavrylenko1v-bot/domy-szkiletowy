import { PageIntro } from "@/components/page-intro";
import { LeadForm } from "@/components/lead-form";
import { Mail, Phone, MapPin } from "@/components/icons";
import { site } from "@/content/site";
import { metadata } from "@/lib/seo";
export const generateMetadata = () =>
  metadata(
    "Kontakt i indywidualna wycena domu",
    "Opowiedz o planowanym domu szkieletowym. Wybierz koncepcję, zakres prac i województwo, aby zapytać o możliwości realizacji i indywidualną wycenę.",
    "/kontakt",
  );
export default function Page() {
  return (
    <>
      <PageIntro
        kicker="Kontakt"
        title="Porozmawiajmy o Twoim domu."
        description="Nie musisz znać wszystkich odpowiedzi. Wystarczy, że wiesz, jak chcesz mieszkać. Resztę warto spokojnie omówić."
      />
      <section className="shell contact-page quote-grid">
        <div className="contact-details">
          <span className="eyebrow">DOBRY POCZĄTEK</span>
          <h2>
            Twój pomysł.
            <br />
            Nasza rozmowa.
          </h2>
          <div className="contact-row">
            <Phone size={20} />
            <div>
              <h3>Telefon</h3>
              {site.phone ? (
                <a href={`tel:${site.phone.replace(/\s/g, "")}`}>
                  {site.phone}
                </a>
              ) : (
                <p>Numer telefonu w przygotowaniu.</p>
              )}
            </div>
          </div>
          <div className="contact-row">
            <Mail size={20} />
            <div>
              <h3>E-mail</h3>
              {site.email ? (
                <a href={`mailto:${site.email}`}>{site.email}</a>
              ) : (
                <p>Adres kontaktowy w przygotowaniu.</p>
              )}
            </div>
          </div>
          <div className="contact-row">
            <MapPin size={20} />
            <div>
              <h3>Obszar realizacji</h3>
              <p>{site.serviceArea}</p>
            </div>
          </div>
          <div className="notice">
            Przed wysłaniem zapytania upewnij się, że obsługa formularza jest
            aktywna. W wersji przygotowawczej integracja pocztowa wymaga
            konfiguracji.
          </div>
        </div>
        <div className="quote-form-panel" id="wycena">
          <h3>Zapytaj o indywidualną wycenę</h3>
          <p className="form-subtitle">
            Powiedz nam, co jest dla Ciebie ważne.
          </p>
          <LeadForm />
        </div>
      </section>
    </>
  );
}
