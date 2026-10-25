import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { site } from "@/content/site";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: new URL(site.website),
  title: {
    default: `${site.name} — Nowoczesne domy szkieletowe`,
    template: `%s | ${site.name}`,
  },
  description:
    "Odkryj koncepcyjne projekty domów szkieletowych do 70 m² powierzchni zabudowy. Naturalne materiały, przemyślane wnętrza i indywidualna wycena.",
  robots: site.published
    ? { index: true, follow: true }
    : { index: false, follow: false },
  icons: { icon: "/icon.svg" },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl">
      <body>
        <a className="skip-link" href="#main">
          Przejdź do treści
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
