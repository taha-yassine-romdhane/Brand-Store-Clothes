import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { HomePageProductGrid } from "@/components/home-page-product-grid"
import type { Product, ProductImage } from "@prisma/client"

async function getFeaturedProducts() {
  try {
    const products = await prisma.product.findMany({
      include: {
        images: true
      },
      take: 3,
      orderBy: {
        createdAt: 'desc'  // Get the latest 3 products
      }
    }) as (Product & { images: ProductImage[] })[]
    
    console.log('Featured products fetched:', products.map(p => ({
      id: p.id,
      name: p.name,
      imageUrls: p.images.map(img => img.url)
    })))
    return products
  } catch (error) {
    console.error('Error fetching featured products:', error)
    return []
  }
}

export default async function Home() {
  const featuredProducts = await getFeaturedProducts()

  return (
    <main className="flex-1">
      {/* Hero Section */}
      <div className="relative h-[60vh]">
        <Image
          src="/images/autres/3R8A1646.jpg"
          alt="Hero Image"
          fill
          className="object-cover"
          priority
          quality={70}
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white space-y-6 px-4">
            <h1 className="text-5xl md:text-6xl font-bold max-w-4xl mx-auto leading-tight">
              Discover Elegance in Every Detail
            </h1>
            <p className="text-xl md:text-2xl max-w-2xl mx-auto">
              Explore our latest collection of timeless pieces crafted with precision
            </p>
            <Link href="/collections">
              <Button size="lg" className="bg-white text-black hover:bg-gray-100">
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Categories */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Explore Our Collections</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our carefully curated categories, each featuring unique pieces that embody elegance and style
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Suits Category */}
            <Link href="/collections?category=suits" className="group">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-500 hover:scale-[1.02] hover:shadow-3xl">
                <Image
                  src="/images/autres/3R8A1350.jpg"
                  alt="Suits Collection"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
                <div className="absolute inset-0 flex flex-col justify-end p-8 text-white transform transition-transform duration-500 group-hover:translate-y-[-8px]">
                  <span className="text-sm uppercase tracking-wider mb-2 opacity-80">Collection</span>
                  <h3 className="text-3xl font-bold mb-3">Elegant Suits</h3>
                  <p className="text-sm opacity-90 mb-4">Timeless sophistication for every occasion</p>
                  <div className="flex items-center text-sm font-medium">
                    <span>Shop Now</span>
                    <ArrowRight className="ml-2 h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-2" />
                  </div>
                </div>
              </div>
            </Link>

            {/* Dresses Category */}
            <Link href="/collections?category=dresses" className="group">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-500 hover:scale-[1.02] hover:shadow-3xl">
                <Image
                  src="images/product2-offwhite-Emna/offwhite stright-cut long dress  2.jpg"
                  alt="Dresses Collection"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
                <div className="absolute inset-0 flex flex-col justify-end p-8 text-white transform transition-transform duration-500 group-hover:translate-y-[-8px]">
                  <span className="text-sm uppercase tracking-wider mb-2 opacity-80">Collection</span>
                  <h3 className="text-3xl font-bold mb-3">Stunning Dresses</h3>
                  <p className="text-sm opacity-90 mb-4">Elegance in every silhouette</p>
                  <div className="flex items-center text-sm font-medium">
                    <span>Shop Now</span>
                    <ArrowRight className="ml-2 h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-2" />
                  </div>
                </div>
              </div>
            </Link>

            {/* Outerwear Category */}
            <Link href="/collections?category=outerwear" className="group">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-500 hover:scale-[1.02] hover:shadow-3xl">
                <Image
                  src="/images/product3-greysh-Aya/greysh Luxury coat2.jpg"
                  alt="Outerwear Collection"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
                <div className="absolute inset-0 flex flex-col justify-end p-8 text-white transform transition-transform duration-500 group-hover:translate-y-[-8px]">
                  <span className="text-sm uppercase tracking-wider mb-2 opacity-80">Collection</span>
                  <h3 className="text-3xl font-bold mb-3">Luxury Outerwear</h3>
                  <p className="text-sm opacity-90 mb-4">Embrace sophistication in every layer</p>
                  <div className="flex items-center text-sm font-medium">
                    <span>Shop Now</span>
                    <ArrowRight className="ml-2 h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-2" />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Products</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our most popular pieces, carefully selected for their unique design and exceptional quality
            </p>
          </div>
          <HomePageProductGrid initialProducts={featuredProducts} />
          <div className="text-center mt-12">
            <Link href="/collections">
              <Button variant="outline" size="lg">
                View All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              <Image
                src="/images/autres/3R8A1409.jpg"
                alt="About LAMASETTE"
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Our Story</h2>
              <p className="text-gray-600">
                LAMASETTE is more than just a fashion brand; it's a celebration of timeless elegance 
                and contemporary style. Each piece in our collection is thoughtfully designed and 
                crafted to bring out the confidence and beauty in every woman.
              </p>
              <Link href="/about">
                <Button variant="outline">
                  Learn More
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}