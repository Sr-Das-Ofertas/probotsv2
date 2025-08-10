import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClientBody } from "./ClientBody";
import { promises as fs } from 'fs';
import path from 'path';
import FacebookPixel from "@/components/FacebookPixel";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Proboots",
  description: "As melhores chuteiras do mercado.",
  icons: {
    icon: '/logo.ico',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settingsPath = path.join(process.cwd(), 'src', 'db', 'settings.json');
  let pixelId = '';

  try {
    const settingsData = await fs.readFile(settingsPath, 'utf-8');
    const settings = JSON.parse(settingsData);
    pixelId = settings.pixelId || '';
  } catch (error) {
    console.error('Layout: Falha ao ler configurações do pixel.', error);
    // Continua sem o pixel se houver erro
  }

  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <ClientBody>
          {pixelId && <FacebookPixel pixelId={pixelId} />}
          {children}
        </ClientBody>
      </body>
    </html>
  );
}
