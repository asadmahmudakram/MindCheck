import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";

export const metadata: Metadata = {
  title: "MindCheck — Check-in Harian untuk Kesehatan Mentalmu",
  description:
    "Curhat, refleksi diri, dan pantau mood harianmu bersama AI yang peduli.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
