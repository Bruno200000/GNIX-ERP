import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GNIX IA ERP | Système de Gestion Intelligent",
  description: "L'ERP SaaS ultra moderne, intelligent et scalable alimenté par l'Intelligence Artificielle.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full">
      <body className="h-full">
        {children}
      </body>
    </html>
  );
}
