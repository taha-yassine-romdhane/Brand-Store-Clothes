import { ShoppingBag, Truck, RefreshCw, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  const featuredProducts = [
    {
      id: 1,
      name: "Oversized Cotton Sweater",
      price: 89.99,
      image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80&w=600&h=800",
    },
    {
      id: 2,
      name: "Vintage Denim Jacket",
      price: 129.99,
      image: "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?auto=format&fit=crop&q=80&w=600&h=800",
    },
    {
      id: 3,
      name: "Premium Wool Coat",
      price: 299.99,
      image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&q=80&w=600&h=800",
    },
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=1920&h=1080')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>
        
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-6xl font-bold mb-6">CLAUTH</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Elevate your style with our timeless pieces crafted for the modern individual
          </p>
          <Link href="/collections">
            <Button size="lg" className="bg-white text-black hover:bg-gray-100">
              Shop Collection
            </Button>
          </Link>
        </div>
      </section>

      {/* Rest of the sections remain the same */}
      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: Truck, title: "Free Shipping", desc: "On orders over $100" },
              { icon: RefreshCw, title: "Easy Returns", desc: "30-day return policy" },
              { icon: Heart, title: "Premium Quality", desc: "Handcrafted pieces" },
              { icon: ShoppingBag, title: "Secure Shopping", desc: "100% secure checkout" },
            ].map((feature, idx) => (
              <div key={idx} className="text-center">
                <feature.icon className="w-8 h-8 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Collection</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden group">
                <div className="relative aspect-[3/4]">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-2">{product.name}</h3>
                  <p className="text-lg">${product.price}</p>
                  <Button className="w-full mt-4">Add to Cart</Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=800&h=1000"
                alt="Brand Story"
                className="rounded-lg shadow-xl"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-gray-600 mb-6">
                Born from a passion for timeless style and sustainable fashion, CLAUTH represents 
                the perfect harmony between classic elegance and contemporary design. Each piece 
                is thoughtfully crafted using premium materials and ethical manufacturing processes.
              </p>
              <p className="text-gray-600 mb-8">
                We believe that true style transcends seasons, which is why we focus on creating 
                enduring pieces that become the foundation of your wardrobe for years to come.
              </p>
              <Button variant="outline">Learn More</Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}