import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "PáginaFácil AI — Sites profissionais sem programar",
    template: "%s | PáginaFácil AI",
  },
  description: "Crie sites, logos e banners profissionais em uma plataforma simples para pequenos negócios e agências.",
  openGraph: {
    title: "PáginaFácil AI",
    description: "Crie uma presença digital profissional sem precisar programar.",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
