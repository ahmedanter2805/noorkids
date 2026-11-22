import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Navbar } from "@/components/Navbar";
import { NoorBotWidget } from "@/components/NoorBotWidget";

export const metadata: Metadata = {
  title: "NoorKids — Gamified Islamic Learning Platform for Children",
  description:
    "An interactive, gamified Islamic education platform for kids. Learn, Interact, Practice, Earn, and Progress across Quran, Salah, Ramadan, Stories, and Character.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50/50 text-charcoal-900 antialiased selection:bg-babyBlue-200 selection:text-babyBlue-900">
        <AuthProvider>
          <Navbar />
          <main className="flex-1 flex flex-col">{children}</main>
          <NoorBotWidget />
        </AuthProvider>
      </body>
    </html>
  );
}
