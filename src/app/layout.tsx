import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/lib/providers";
import { AuthProvider } from "@/lib/auth/auth-context";
import { Header } from "@/components/header";
import { ErrorBoundary } from "@/components/error-boundary";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "NextFij - Modern Next.js Application",
  description: "A modern Next.js application built with Tailwind CSS and shadcn/ui",
  keywords: ["Next.js", "React", "Tailwind CSS", "shadcn/ui"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased min-h-full bg-background text-foreground`}
        suppressHydrationWarning
      >
        <ErrorBoundary>
          <Providers>
            <AuthProvider>
              <div className="relative flex min-h-screen flex-col">
                <Header />
                <main className="flex-1">{children}</main>
              </div>
            </AuthProvider>
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
