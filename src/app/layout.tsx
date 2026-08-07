import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { ServiceWorker } from "@/components/ServiceWorker";
import { SITE_URL, BASE_PATH } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: "Fernweh Atlas",
  title: {
    default: "Fernweh Atlas — Geheimtipps für Europa",
    template: "%s",
  },
  description:
    "Fernweh Atlas: finde das Geheimste vom Besten in Europa, mit messbarem Geheimtipp-Grad, Wetter, Preisen und Merkliste.",
  openGraph: { siteName: "Fernweh Atlas", type: "website" },
  appleWebApp: {
    capable: true,
    title: "Fernweh Atlas",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f5f0" },
    { media: "(prefers-color-scheme: dark)", color: "#1d3a34" },
  ],
};

const themeInit = `
(function(){try{
  var t = localStorage.getItem('uc.theme');
  var d = t ? t === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  if(d) document.documentElement.classList.add('dark');
  var l = localStorage.getItem('uc.locale'); if(l) document.documentElement.lang = l;
}catch(e){}})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" suppressHydrationWarning>
      <head>
        {/* basePath-bewusste PWA-Links (Next präfixt Metadaten-Links nicht) */}
        <link rel="manifest" href={`${BASE_PATH}/manifest.webmanifest`} />
        <link rel="icon" type="image/png" sizes="32x32" href={`${BASE_PATH}/favicon-32.png`} />
        <link rel="apple-touch-icon" href={`${BASE_PATH}/apple-touch-icon.png`} />
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body>
        <Providers>
          <Header />
          <main className="mx-auto max-w-6xl px-4 pb-24 pt-6">{children}</main>
          <BottomNav />
          <ServiceWorker base={BASE_PATH} />
        </Providers>
      </body>
    </html>
  );
}
