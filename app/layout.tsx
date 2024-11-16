import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import { CartProvider } from "@/lib/context/cart-context";
import { Toaster } from 'sonner';
import { ShoppingCart } from "lucide-react";
import { CartStatus } from "@/components/cart-status";
import Navbar from "@/components/navbar";
import { Footer } from "@/components/footer";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CLAUTH - Timeless Fashion for the Modern Individual',
  description: 'Discover our collection of premium, sustainable clothing crafted for the modern wardrobe.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          <Navbar />
          <main className="pt-16 min-h-screen">
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}