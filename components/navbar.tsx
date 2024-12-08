"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import Container from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/context/cart-context";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

const collectionCategories = [
  {
    label: "Suits",
    subcategories: [
      { name: "Casual Skirt Suit", query: "casual-skirt-suit" },
      { name: "Business Formal Outfit", query: "business-formal-outfit" }
    ]
  },
  {
    label: "Dresses",
    subcategories: [
      { name: "Straight-cut Long Dress", query: "straight-cut-long-dress" }
    ]
  },
  {
    label: "Outerwear",
    subcategories: [
      { name: "Luxury Coat", query: "luxury-coat" },
      { name: "Short Sporty Coat", query: "short-sporty-coat" }
    ]
  },
  {
    label: "Accessories",
    subcategories: [
      { name: "Neck Cover", query: "neck-cover" }
    ]
  }
];

const Navbar = () => {
  const { items } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();

  const routes = [
    {
      href: "/collections",
      label: "Collections",
      dropdown: true
    },
    {
      href: "/collaborations",
      label: "Collaborations"
    },
    {
      href: "/ramadhane-collections",
      label: "RAMADHANE Collections",
    },
    {
      href: "/about",
      label: "About"
    }
  ];

  const handleProductClick = (category: string, productQuery: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("category", category.toLowerCase());
    params.set("product", productQuery);
    router.push(`/collections?${params.toString()}`);
  };

  return (
    <div className="border-b">
      <Container>
        <div className="relative px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
          <Link href="/" className="ml-4 flex lg:ml-0 gap-x-2">
            <p className="font-bold text-xl">LAMASETTE</p>
          </Link>

          <div className="flex items-center gap-x-4">
            <div className="hidden lg:flex items-center gap-x-4">
              {routes.map((route) => (
                <div key={route.href} className="relative group">
                  <Link
                    href={route.href}
                    className={`text-sm font-medium transition-colors hover:text-black py-2 relative ${
                      route.dropdown ? 'group-hover:after:content-[""] group-hover:after:absolute group-hover:after:bottom-0 group-hover:after:left-0 group-hover:after:w-full group-hover:after:h-0.5 group-hover:after:bg-black' : ''
                    }`}
                  >
                    {route.label}
                  </Link>
                  
                  {route.dropdown && (
                    <div className="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 w-[800px] bg-white shadow-lg rounded-lg py-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 before:content-[''] before:absolute before:top-0 before:left-1/2 before:-translate-x-1/2 before:w-4 before:h-4 before:bg-white before:transform before:rotate-45 before:-translate-y-2">
                      <div className="flex justify-around relative bg-white rounded-lg">
                        {collectionCategories.map((category) => (
                          <div key={category.label} className="px-6">
                            <h3 className="font-medium text-sm mb-4 text-black">{category.label}</h3>
                            <div className="space-y-2">
                              {category.subcategories.map((product) => (
                                <button
                                  key={product.name}
                                  onClick={() => handleProductClick(category.label, product.query)}
                                  className="block text-sm text-gray-600 hover:text-black transition-colors w-full text-left"
                                >
                                  {product.name}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
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