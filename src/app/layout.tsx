import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Auth from "@/components/auth/Auth";
import Navbar from "@/components/NavBar";
import { isAuthenticated } from "@/utils/amplify-utils";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tittle list ",
  description: "Tittle list and tittle details",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar isSignedIn={await isAuthenticated()}/>
        <Auth> {children} </Auth>
      </body>
    </html>
  );
}
