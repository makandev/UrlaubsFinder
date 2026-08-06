/** Basis-URL der Seite. In Produktion via NEXT_PUBLIC_SITE_URL setzen. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://fernweh-atlas.app";

export const SITE_NAME = "Fernweh Atlas";
