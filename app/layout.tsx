import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { CartProvider } from "@/lib/context/cart-context";
import Navbar from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LAMASETTE - Timeless Fashion for the Modern Individual',
  description: 'Discover our collection of premium, sustainable clothing crafted for the modern wardrobe. Shop the latest trends in fashion at LAMASETTE.',
  keywords: 'fashion, clothing, sustainable fashion, modern wardrobe, premium clothing, LAMASETTE',
  openGraph: {
    title: 'LAMASETTE - Timeless Fashion for the Modern Individual',
    description: 'Discover our collection of premium, sustainable clothing crafted for the modern wardrobe.',
    type: 'website',
    locale: 'en_US',
    siteName: 'LAMASETTE',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LAMASETTE - Timeless Fashion',
    description: 'Premium, sustainable clothing for the modern wardrobe.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  verification: {
    google: 'your-google-verification-code', // Add your Google Search Console verification code
  },
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
            <Analytics />
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
