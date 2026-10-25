import Link from "next/link";
import { Brand } from "./brand";
import { ArrowUpRight } from "./icons";
import { site } from "@/content/site";
export function Footer() {
  return (
    <footer className="footer">
      <div className="shell">
        <div className="footer-top">
          <div>
            <span className="eyebrow light">TWÓJ DOM. TWÓJ NOWY ROZDZIAŁ.</span>
            <h2>
              Zróbmy pierwszy
              <br />
              krok do Twojego domu.
            </h2>
          </div>
          <Link className="button light-button" href="/kontakt#wycena">
            Porozmawiajmy o Twoim domu <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="footer-grid">
          <div>
            <Link
              href="/"
              className="footer-logo"
              aria-label={`${site.name} — strona główna`}
            >
              <Brand dark />
            </Link>
            <p>
              Prosta forma. Naturalne materiały.
              <br />
              Przestrzeń dla Twojego życia.
            </p>
            <p className="fine">
              Dane rejestrowe w przygotowaniu.
            </p>
          </div>
          <div>
            <h3>Odkryj</h3>
            <Link href="/projekty">Projekty domów</Link>
            <Link href="/technologia">Technologia</Link>
            <Link href="/o-nas">O nas</Link>
          </div>
          <div>
            <h3>Porozmawiajmy</h3>
            <Link href="/kontakt">Kontakt i wycena</Link>
            <Link href="/faq">Pytania i odpowiedzi</Link>
            {site.phone && (
              <a href={`tel:${site.phone.replace(/\s/g, "")}`}>{site.phone}</a>
            )}
            {site.email && <a href={`mailto:${site.email}`}>{site.email}</a>}
          </div>
          <div>
            <h3>Dobrze wiedzieć</h3>
            <p>
              Koncepcje do 70 m²
              <br />
              podłóg netto wszystkich kondygnacji.
            </p>
            <p className="fine">{site.serviceArea}</p>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} {site.name}. Domy szkieletowe.
          </span>
          <div>
            <Link href="/polityka-prywatnosci">Polityka prywatności</Link>
            <Link href="/polityka-cookies">Polityka cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
