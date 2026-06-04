import type { Metadata } from "next";
import {
  DM_Sans,
  Sora,
  Geist_Mono,
} from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { ScanStoreProvider } from "@/lib/scan-store";
import "./globals.css";

const bodyFont = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const headingFont = Sora({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const codeFont = Geist_Mono({
  variable: "--font-code",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wave",
  description: "Scam and risk detection assistant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      suppressHydrationWarning
      lang="en"
      className={`${bodyFont.variable} ${headingFont.variable} ${codeFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <ScanStoreProvider>
            {children}
            <Toaster />
          </ScanStoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
