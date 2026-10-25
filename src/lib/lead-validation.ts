import { publishedHouses } from "@/content/houses";
import { packages, regions } from "@/content/site";
export type Lead = {
  name: string;
  email: string;
  phone: string;
  project: string;
  area: number;
  package: string;
  region: string;
  message: string;
  consent: boolean;
  website: string;
  requestId: string;
};
export function validateLead(
  value: unknown,
): { ok: true; data: Lead } | { ok: false; errors: Record<string, string> } {
  if (!value || typeof value !== "object" || Array.isArray(value))
    return { ok: false, errors: { form: "Nieprawidłowe dane." } };
  const r = value as Record<string, unknown>,
    errors: Record<string, string> = {};
  const str = (key: string) =>
    typeof r[key] === "string" ? (r[key] as string).trim() : "";
  const data: Lead = {
    name: str("name"),
    email: str("email").toLowerCase(),
    phone: str("phone"),
    project: str("project"),
    area: typeof r.area === "number" ? r.area : NaN,
    package: str("package"),
    region: str("region"),
    message: str("message"),
    consent: r.consent === true,
    website: str("website"),
    requestId: str("requestId"),
  };
  if (
    data.name.length < 2 ||
    data.name.length > 100 ||
    /[\r\n]/.test(data.name)
  )
    errors.name = "Podaj imię (2–100 znaków).";
  if (data.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    errors.email = "Podaj poprawny adres e-mail.";
  if (
    !/^\+?[\d\s().-]{7,25}$/.test(data.phone) ||
    data.phone.replace(/\D/g, "").length < 7
  )
    errors.phone = "Podaj poprawny numer telefonu.";
  const h = publishedHouses.find((h) => h.id === data.project);
  if (data.project && !h) errors.project = "Wybierz dostępny projekt.";
  if (!Number.isFinite(data.area) || data.area < 20 || data.area > 70)
    errors.area = "Podaj powierzchnię zabudowy od 20 do 70 m².";
  if (h && data.area !== h.footprint)
    errors.area =
      "Powierzchnia powinna odpowiadać wybranej koncepcji. Zmiany opisz w wiadomości.";
  if (!packages.some((p) => p.name === data.package))
    errors.package = "Wybierz zakres prac.";
  if (!regions.includes(data.region)) errors.region = "Wybierz województwo.";
  if (data.message.length > 3000)
    errors.message = "Wiadomość może mieć do 3000 znaków.";
  if (!data.consent)
    errors.consent = "Zgoda na przetwarzanie danych jest wymagana.";
  if (!/^[a-f0-9-]{36}$/i.test(data.requestId))
    errors.form = "Odśwież formularz i spróbuj ponownie.";
  return Object.keys(errors).length
    ? { ok: false, errors }
    : { ok: true, data };
}
