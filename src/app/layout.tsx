import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "MahaInsight",
  description:
    "AI-Powered Maharashtra Climate & Agriculture Intelligence Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html
      lang="en"
      className="h-full antialiased"
    >

      <body className="min-h-full flex flex-col bg-slate-950">

        {children}

      </body>

    </html>
  );
}
