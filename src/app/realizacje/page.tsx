import { notFound } from "next/navigation";
import type { Metadata } from "next";
// Prepared route intentionally unavailable until genuine, approved work is supplied.
export const metadata: Metadata = {
  title: "Realizacje",
  robots: { index: false, follow: false },
};
export default function Page() {
  notFound();
}
