import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Parastar - Advanced Web Proxy",
  description: "Ultra-fast, secure web proxy with full authentication and persistence",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
