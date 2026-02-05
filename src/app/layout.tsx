import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "SKCET | Sri Krishna College of Engineering and Technology",
  description: "Official website of Sri Krishna College of Engineering and Technology, Coimbatore. Technology Education for a Better Future.",
};

const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const hasValidClerkKey = publishableKey && publishableKey.startsWith("pk_");

export default function RootLayout({
  children,
  admin,
}: Readonly<{
  children: React.ReactNode;
  admin: React.ReactNode;
}>) {
  const content = (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-inter antialiased",
          inter.variable,
          jetbrainsMono.variable
        )}
        suppressHydrationWarning
      >
        {admin}
        {children}
      </body>
    </html>
  );

  if (!hasValidClerkKey) {
    return content;
  }

  return (
    <ClerkProvider publishableKey={publishableKey}>
      {content}
    </ClerkProvider>
  );
}
