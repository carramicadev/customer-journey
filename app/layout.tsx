import type { Metadata } from "next";
import {
  Inter,
  Playfair_Display,
  Abhaya_Libre,
  Poppins,
} from "next/font/google";

import "./globals.css";
import { CategoriesProvider } from "@/context/CategoriesContext";
import { Suspense } from "react";
import { AuthProvider } from "@/context/AuthContext";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import HeaderVisibility from "@/components/header/HeaderVisibility";

const inter = Inter({ subsets: ["latin"] });
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair",
});

const abhaya = Abhaya_Libre({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-abhaya",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Carramica",
  description: "Carramica Store",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          src="https://app.sandbox.midtrans.com/snap/snap.js"
          data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
          async
        />
      </head>

      <body
        className={`${inter.className} ${playfair.variable} ${abhaya.variable} ${poppins.variable}`}
      >
        <AuthProvider>
          <CategoriesProvider>
            {/* ✅ HEADER GLOBAL */}
            <HeaderVisibility />

            {/* ✅ KONTEN HALAMAN */}
            <Suspense>
              <main className=" pt-16 md:pt-20">{children}</main>
            </Suspense>

            {/* FOOTER GLOBAL */}
            <Footer />
          </CategoriesProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
