import type { Metadata } from "next";
import "./globals.css";
import "./components.css";

export const metadata: Metadata = {
  title: "Woonklasse — Alles voor je huis",
  description:
    "Webshop voor badkamer, sanitair en raamdecoratie op maat, én complete verbouwingen met eigen vakmensen. Eén bedrijf, twee werelden.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Advent+Pro:wght@300;400;500;600&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
