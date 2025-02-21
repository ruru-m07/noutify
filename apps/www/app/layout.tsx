import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";

import { ContextProvider } from "@/context";

import "@noutify/ui/globals.css";

export const metadata: Metadata = {
  title: "Noutify",
  description: "let him cook!",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicon/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon/favicon-16x16.png"
        />
        <link rel="manifest" href="/favicon/site.webmanifest" />
      </head>
      <body className={GeistSans.className}>
        <ContextProvider>{children}</ContextProvider>
      </body>
    </html>
  );
}
