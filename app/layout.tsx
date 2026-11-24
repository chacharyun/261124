import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ForestStoreProvider } from "@/lib/store";

export const metadata: Metadata = {
  title: "합격의 숲 — 나의 경찰 마을 (2027 순경 합격)",
  description: "2027년 3월 20일 경찰공무원 순경 필기시험 대비 올인원 학습 관리 & 마을 성장 웹 애플리케이션",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#F3B8CC",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css"
        />
      </head>
      <body className="antialiased min-h-screen selection:bg-forest-pink/40 selection:text-forest-pink-dark">
        <ForestStoreProvider>{children}</ForestStoreProvider>
      </body>
    </html>
  );
}
