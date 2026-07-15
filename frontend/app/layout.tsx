import React from "react";
import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "StartupSN | Le point de rencontre de la Tech sénégalaise",
  description:
    "StartupSN recense, connecte et valorise les startups les plus prometteuses du Sénégal. Un seul endroit pour découvrir l'écosystème, lever des fonds, recruter et nouer des partenariats.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex flex-col min-h-screen bg-[#F7F3E8]">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
