/** Basis-URL der Seite. In Produktion via NEXT_PUBLIC_SITE_URL setzen. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://fernweh-atlas.app";

export const SITE_NAME = "Fernweh Atlas";

/** basePath auf GitHub Pages (Projektseite unter /UrlaubsFinder), sonst leer. */
export const BASE_PATH = process.env.GITHUB_PAGES === "true" ? "/UrlaubsFinder" : "";
