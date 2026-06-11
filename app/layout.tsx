import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  weight: ["400", "500"],
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-roboto",
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
    <html lang="ru" className={roboto.variable} suppressHydrationWarning>
      <head>
        <script
          // До первой отрисовки: включаем стартовые состояния анимаций,
          // только если JS работает и нет prefers-reduced-motion
          dangerouslySetInnerHTML={{
            __html: `if(!matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('js-anim')}`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
