import type { Metadata } from "next";
import { Bebas_Neue, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const display = Bebas_Neue({
  weight: "400",
  variable: "--font-bebas",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LAS → CANYONS → LAX | Southwest & Pacific Coast Road Trip",
  description:
    "11-Day post-NYC Marathon adventure road trip: Las Vegas, Valley of Fire, Zion, Bryce Canyon, Buckskin Gulch, Page, Antelope Canyon, Monument Valley, Grand Canyon, Sedona, Laguna Beach, Malibu & Santa Monica.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`dark ${geistSans.variable} ${geistMono.variable} ${display.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
