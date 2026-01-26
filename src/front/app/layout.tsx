import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Management Application",
  description: "Frontend service for ws-demo-poly1 project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">{children}</body>
    </html>
  );
}
