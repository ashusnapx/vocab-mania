import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import "./globals.css";
import { APP_NAME, APP_DESCRIPTION } from "@/lib/constants";
import { NavRouter } from "@/components/nav-router";
import { AuthProvider } from "@/lib/auth-context";
import { QueryProvider } from "@/lib/query-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeSync } from "@/components/theme-sync";
import { LevelUpCelebration } from "@/components/level-up-celebration";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage-grotesque",
  subsets: ["latin"],
  weight: ["400", "600"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bricolage.variable} ${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <ThemeSync />
          <QueryProvider>
            <AuthProvider>
              <LevelUpCelebration />
              <NavRouter />
              <main className="flex-1 pt-20">{children}</main>
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
