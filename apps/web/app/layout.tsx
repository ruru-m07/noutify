import type { Metadata } from "next";

import { Bricolage_Grotesque } from "next/font/google";

import { ContextProvider } from "@/context";

import "@noutify/ui/globals.css";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Noutify",
  description: "let him cook!",
};

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

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
      <body className={bricolage.className}>
        <ContextProvider session={session}>{children}</ContextProvider>
      </body>
    </html>
  );
}
