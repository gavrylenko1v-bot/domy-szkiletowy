import { NextRequest, NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { validateLead } from "@/lib/lead-validation";
import { rateLimit } from "@/lib/rate-limit";
import { site } from "@/content/site";
import { publishedHouses } from "@/content/houses";
export const runtime = "nodejs";
const reply = (
  message: string,
  status: number,
  extra: Record<string, unknown> = {},
) =>
  NextResponse.json(
    { message, ...extra },
    { status, headers: { "Cache-Control": "no-store" } },
  );
async function readBody(req: NextRequest) {
  if (!req.body) throw new Error("empty");
  const reader = req.body.getReader();
  let bytes = 0;
  const chunks: Uint8Array[] = [];
  while (true) {
    const v = await reader.read();
    if (v.done) break;
    bytes += v.value.byteLength;
    if (bytes > 16000) {
      await reader.cancel();
      throw new Error("large");
    }
    chunks.push(v.value);
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}
export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin");
  const expected = new URL(site.website).origin;
  if (!origin || origin !== expected)
    return reply("Żądanie z niedozwolonego źródła.", 403);
  if (!req.headers.get("content-type")?.startsWith("application/json"))
    return reply("Wymagany format JSON.", 415);
  if (Number(req.headers.get("content-length") || 0) > 16000)
    return reply("Wiadomość jest zbyt długa.", 413);
  let raw: unknown;
  try {
    raw = await readBody(req);
  } catch {
    return reply("Nieprawidłowe lub zbyt duże dane.", 400);
  }
  // A filled honeypot is rejected without a false delivery confirmation.
  if (raw && typeof raw === "object" && "website" in raw && raw.website)
    return reply("Nie udało się zweryfikować formularza.", 422);
  const parsed = validateLead(raw);
  if (!parsed.ok)
    return reply("Sprawdź zaznaczone pola.", 422, { errors: parsed.errors });
  if (
    !process.env.RESEND_API_KEY ||
    !process.env.LEADS_FROM_EMAIL ||
    !process.env.LEADS_TO_EMAIL
  )
    return reply(
      "Wysyłka formularza nie jest jeszcze skonfigurowana. Spróbuj po uruchomieniu obsługi zapytań.",
      503,
    );
  const ip =
    process.env.TRUST_PROXY === "true"
      ? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "shared"
      : "shared";
  try {
    if (!(await rateLimit(ip)))
      return reply("Zbyt wiele zapytań. Spróbuj ponownie za 15 minut.", 429);
  } catch {
    return reply(
      "Obsługa zapytań jest chwilowo niedostępna. Spróbuj później.",
      503,
    );
  }
  const d = parsed.data,
    h = publishedHouses.find((h) => h.id === d.project);
  const text = [
    `Imię: ${d.name}`,
    `E-mail: ${d.email}`,
    `Telefon: ${d.phone}`,
    `Projekt: ${h ? `${h.id} — ${h.name}` : "Indywidualny / do ustalenia"}`,
    `Powierzchnia zabudowy: ${d.area} m²`,
    `Zakres: ${d.package}`,
    `Województwo: ${d.region}`,
    `Wiadomość: ${d.message}`,
    `Zgoda na kontakt i przetwarzanie danych: tak`,
    `Wersja zgody: 2026-10-25`,
  ].join("\n");
  try {
    const idempotency = createHash("sha256")
      .update(JSON.stringify(d))
      .digest("hex");
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `lead-${idempotency}`,
      },
      body: JSON.stringify({
        from: process.env.LEADS_FROM_EMAIL,
        to: [process.env.LEADS_TO_EMAIL],
        reply_to: d.email,
        subject: `Zapytanie o dom — ${h?.name || "koncepcja indywidualna"}`,
        text,
      }),
      signal: AbortSignal.timeout(12000),
    });
    if (!response.ok)
      return reply(
        "Nie udało się potwierdzić wysyłki. Spróbuj ponownie później.",
        502,
      );
    const result = await response.json();
    if (typeof result.id !== "string")
      return reply("Nie udało się potwierdzić wysyłki.", 502);
    return reply(
      "Dziękujemy! Twoje zapytanie zostało przyjęte przez usługę pocztową. Odpowiemy na podany adres e-mail.",
      200,
    );
  } catch {
    return reply(
      "Nie udało się potwierdzić wysyłki. Spróbuj ponownie później.",
      502,
    );
  }
}
