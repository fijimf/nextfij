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
  title: "DeepFij - College Basketball Statistical Analysis",
  description: "Modern web application for college basketball statistics, team information, and data analysis",
  keywords: ["Basketball", "Statistics", "College Basketball", "Sports Analytics", "Next.js"],
  icons: {
    icon: "/deepfij.png",
    shortcut: "/deepfij.png",
    apple: "/deepfij.png",
  },
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
