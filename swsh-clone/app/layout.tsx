import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VJ Startups — What will you build?",
  description: "A fluid editorial startup experience for VJ Startups.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
