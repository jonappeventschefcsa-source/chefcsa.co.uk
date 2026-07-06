import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chefcsa | Authentic Ghanaian Food in the UK",
  description:
    "Authentic Ghanaian flavours, made fresh daily. Delivered across the UK from Cambridge.",
};

async function getLogoUrl(): Promise<string | null> {
  try {
    const { data } = await supabase
      .from("site_content")
      .select("value")
      .eq("section", "global")
      .eq("key", "logo_url")
      .single();
    return data?.value || null;
  } catch {
    return null;
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const logoUrl = await getLogoUrl();

  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-cream text-charcoal font-sans antialiased">
        <Navbar logoUrl={logoUrl} />
        <main className="flex-1">{children}</main>
        <Footer logoUrl={logoUrl} />
      </body>
    </html>
  );
}
