"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { publishedHouses } from "@/content/houses";
import { packages, regions, site } from "@/content/site";
import { ArrowUpRight, Check, LoaderCircle } from "./icons";
export function LeadFormClient({
  projectId = "",
  compact = false,
  available = false,
}: {
  projectId?: string;
  compact?: boolean;
  available?: boolean;
}) {
  const [project, setProject] = useState(projectId),
    [area, setArea] = useState(
      publishedHouses.find((h) => h.id === projectId)?.footprint || 60,
    ),
    [busy, setBusy] = useState(false),
    [success, setSuccess] = useState(false),
    [message, setMessage] = useState(""),
    [errors, setErrors] = useState<Record<string, string>>({});
  const requestId = useRef("");
  const selected = publishedHouses.find((h) => h.id === project);
  const error = (key: string) =>
    errors[key] ? (
      <span className="field-error" id={`error-${key}`}>
        {errors[key]}
      </span>
    ) : null;
  const attrs = (key: string) => ({
    "aria-invalid": !!errors[key],
    "aria-describedby": errors[key] ? `error-${key}` : undefined,
  });
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setMessage("");
    setErrors({});
    const form = new FormData(e.currentTarget);
    if (!requestId.current) requestId.current = crypto.randomUUID();
    const data = {
      ...Object.fromEntries(form.entries()),
      project,
      area: Number(area),
      consent: form.get("consent") === "on",
      requestId: requestId.current,
    };
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      setMessage(result.message || "Nie udało się wysłać zapytania.");
      if (res.ok) {
        setSuccess(true);
      } else {
        setErrors(result.errors || {});
      }
    } catch {
      setMessage("Brak połączenia. Sprawdź sieć i spróbuj ponownie.");
    } finally {
      setBusy(false);
    }
  }
  if (success)
    return (
      <div className="form-success" role="status">
        <Check size={38} />
        <h3>Dziękujemy za rozmowę na dobry początek.</h3>
        <p>{message}</p>
        <button
          className="button outline"
          onClick={() => {
            setSuccess(false);
            setMessage("");
            requestId.current = "";
          }}
        >
          Nowe zapytanie <ArrowUpRight size={17} />
        </button>
      </div>
    );
  return (
    <form
      className={`lead-form ${compact ? "compact" : ""}`}
      aria-busy={busy}
      onSubmit={submit}
      onChange={() => {
        requestId.current = "";
      }}
    >
      {!available && (
        <p className="form-config-note" role="status">
          Formularz w przygotowaniu: wysyłka wymaga konfiguracji obsługi
          zapytań. Nie wysyłaj jeszcze rzeczywistych danych osobowych.
        </p>
      )}
      <div className="form-grid">
        <label>
          Projekt domu
          <select
            name="project"
            value={project}
            onChange={(e) => {
              setProject(e.target.value);
              const h = publishedHouses.find((h) => h.id === e.target.value);
              if (h) setArea(h.footprint);
            }}
            {...attrs("project")}
          >
            <option value="">Jeszcze wybieram</option>
            {publishedHouses.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name}
              </option>
            ))}
          </select>
          {error("project")}
        </label>
        <label>
          Powierzchnia zabudowy (m²)
          <input
            name="area"
            type="number"
            min={20}
            max={70}
            required
            value={area}
            readOnly={!!selected}
            onChange={(e) => setArea(Number(e.target.value))}
            {...attrs("area")}
          />
          {error("area")}
          {selected && (
            <span className="field-help">
              Dla wybranej koncepcji. Zmiany opisz poniżej.
            </span>
          )}
        </label>
        <label>
          Zakres prac
          <select name="package" required defaultValue="" {...attrs("package")}>
            <option value="" disabled>
              Wybierz zakres
            </option>
            {packages.map((p) => (
              <option key={p.name}>{p.name}</option>
            ))}
          </select>
          {error("package")}
        </label>
        <label>
          Województwo
          <select name="region" required defaultValue="" {...attrs("region")}>
            <option value="" disabled>
              Gdzie planujesz budowę?
            </option>
            {regions.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
          {error("region")}
        </label>
        <label className="full">
          Dodatkowe życzenia <span className="optional">(opcjonalnie)</span>
          <textarea
            name="message"
            rows={3}
            maxLength={3000}
            placeholder="Opowiedz o działce, potrzebach i planowanym terminie…"
            {...attrs("message")}
          />
          {error("message")}
        </label>
        <label>
          Twoje imię
          <input
            name="name"
            autoComplete="given-name"
            minLength={2}
            maxLength={100}
            required
            placeholder="Imię"
            {...attrs("name")}
          />
          {error("name")}
        </label>
        <label>
          Telefon
          <input
            name="phone"
            type="tel"
            autoComplete="tel"
            required
            maxLength={25}
            placeholder="+48 …"
            {...attrs("phone")}
          />
          {error("phone")}
        </label>
        <label className="full">
          Adres e-mail
          <input
            name="email"
            type="email"
            autoComplete="email"
            maxLength={254}
            required
            placeholder="twoj@email.pl"
            {...attrs("email")}
          />
          {error("email")}
        </label>
      </div>
      <div className="honeypot" aria-hidden="true">
        <label>
          Strona internetowa
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <label className="consent">
        <input name="consent" type="checkbox" required {...attrs("consent")} />
        <span>
          Zgadzam się na przetwarzanie podanych danych w celu odpowiedzi na
          zapytanie. Zapoznałem/am się z{" "}
          <Link href="/polityka-prywatnosci">polityką prywatności</Link>. Zgoda
          nie obejmuje marketingu.
        </span>
      </label>
      {error("consent")}
      <p className="form-note">
        Przygotujemy indywidualną wycenę dopasowaną do Twoich potrzeb.
      </p>
      {message && (
        <div className="form-error" role="alert">
          {message}
        </div>
      )}
      {errors.form && <p role="alert">{errors.form}</p>}
      <button className="button submit-button" type="submit" disabled={busy}>
        {busy ? "Wysyłanie…" : "Wyślij zapytanie o wycenę"}
        {busy ? (
          <LoaderCircle className="spin" size={18} />
        ) : (
          <ArrowUpRight size={18} />
        )}
      </button>
      {!available && site.email && <p className="form-direct-contact">Możesz napisać bezpośrednio: <a href={`mailto:${site.email}`}>{site.email}</a>.</p>}
      <p className="fine">
        Wysłanie zapytania nie jest zamówieniem ani zawarciem umowy.
      </p>
    </form>
  );
}
