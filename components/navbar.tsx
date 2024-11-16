"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import Container from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/context/cart-context";

const Navbar = () => {
  const { items } = useCart();

  const routes = [

    {
      href: "/collections",
      label: "Collections",
    },
    {
      href: "/about",
      label: "About",
    },
  ];

  return (
    <div className="border-b">
      <Container>
        <div className="relative px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
          <Link href="/" className="ml-4 flex lg:ml-0 gap-x-2">
            <p className="font-bold text-xl">CLAUTH</p>
          </Link>

          <div className="flex items-center gap-x-4">
            <div className="hidden lg:flex items-center gap-x-4">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className="text-sm font-medium transition-colors"
                >
                  {route.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-x-4">
            <div className="hidden sm:flex items-center rounded-full bg-gray-100 px-4 py-2">
              <Search size={20} className="text-gray-500" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-transparent border-none focus:outline-none px-2"
              />
            </div>
            
            <Link href="/cart">
              <Button variant="ghost" className="relative">
                <ShoppingCart size={20} />
                {items.length > 0 && (
                  <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-black text-white text-xs flex items-center justify-center">
                    {items.length}
                  </span>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Navbar; 