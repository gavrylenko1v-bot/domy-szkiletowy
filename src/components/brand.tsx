import Image from "next/image";
/** SVG lockup; dark selects the artwork for a dark background. */
export function Brand({ dark = false }: { dark?: boolean }) {
  return (
    <Image
      className="brand-logo"
      src={`/brand/logo-${dark ? "dark" : "light"}.svg`}
      alt="VERTEX I.S.O — domy szkieletowe"
      width={340}
      height={80}
      unoptimized
      priority
    />
  );
}
