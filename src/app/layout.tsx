import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Planne Challenge",
  description: "Frontend challenge for Planne",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
