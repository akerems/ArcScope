import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "ArcScope — On-chain intelligence for Arc",
  description:
    "Explore wallet and contract activity through an interactive Arc network map.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
