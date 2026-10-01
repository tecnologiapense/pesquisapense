import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pesquisa de Mercado | Pense Revalida",
  description:
    "Pesquisa rápida com médicos aprovados no Revalida INEP sobre a jornada de preparação para a prova.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Onest:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
