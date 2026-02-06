import type { Metadata } from "next";
import Script from "next/script";
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
        {/* Load epoxy-transport from CDN to avoid WASM build issues */}
        <Script 
          src="https://unpkg.com/@mercuryworkshop/epoxy-transport@3.0.1/dist/index.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
