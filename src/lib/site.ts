/** Basis-URL der Seite. In Produktion via NEXT_PUBLIC_SITE_URL setzen. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://urlaubscoach.app";

export const SITE_NAME = "UrlaubsCoach";
