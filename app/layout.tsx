import type { Metadata } from "next";
import { Roboto, Inter } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  weight: ["400", "500"],
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-roboto",
});

// Дисплейный шрифт заголовков: загруженный Inter вместо системного
// Helvetica-стека — нейтральный гротеск, но рендерится одинаково на всех ОС.
const inter = Inter({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Timeweb — Хостинг для сайта",
  description:
    "Домен, хостинг, SSL и почта в одном месте. Запустите сайт за 15 минут.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${roboto.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
