import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "UrlaubsCoach — Geheimtipps für Europa",
  description:
    "Dein persönlicher Reise-Coach: finde das Geheimste vom Besten in Europa, mit messbarem Geheimtipp-Grad, Wetter, Preisen und Merkliste.",
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
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body>
        <Providers>
          <Header />
          <main className="mx-auto max-w-6xl px-4 pb-24 pt-6">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
