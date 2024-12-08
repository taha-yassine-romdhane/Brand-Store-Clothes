"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

const collaborations = [
  {
    id: 1,
    name: "LAMASETTE x Aya",
    description: "A stunning fusion of traditional craftsmanship and modern design, featuring unique pieces that celebrate Tunisian heritage with a contemporary twist.",
    image: "/images/autres/3R8A1391.jpg",
    artistImage: "/images/autres/3R8A1409.jpg",
    date: "Winter 2024",
    status: "Available Now",
    link: "/collections?category=suits"
  },
  {
    id: 2,
    name: "LAMASETTE x Emna",
    description: "An innovative collection that reimagines classic silhouettes with bold, artistic elements, creating a perfect blend of elegance and creativity.",
    image: "/images/autres/3R8A1463.jpg",
    artistImage: "/images/autres/3R8A1467.jpg",
    date: "Spring 2024",
    status: "Coming Soon",
    link: "/collections?category=dresses"
  }
]

export default function CollaborationsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[70vh] bg-black">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/images/autres/14.01.jpg"
            alt="Collaborations Banner"
            fill
            className="object-cover object-[center_30%] opacity-85"
            priority
            quality={100}
            sizes="100vw"
          />
        </div>
        <div className="relative h-full flex items-center justify-center text-white bg-black/20">
          <div className="text-center px-4">
            <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">Our Collaborations</h1>
            <p className="text-xl max-w-2xl mx-auto drop-shadow-md">
              Discover our exclusive partnerships and limited edition collections
            </p>
          </div>
        </div>
      </div>

      {/* Collaborations Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-24">
          {collaborations.map((collab, index) => (
            <div 
              key={collab.id} 
              className={`flex flex-col ${
                index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
              } gap-8 items-center`}
            >
              {/* Main Collection Image */}
              <div className="w-full lg:w-1/2 relative aspect-[4/3] overflow-hidden rounded-2xl">
                <Image
                  src={collab.image}
                  alt={collab.name}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  quality={90}
                />
              </div>

              {/* Content */}
              <div className="w-full lg:w-1/2 space-y-6">
                <div className="relative w-24 h-24 mx-auto lg:mx-0 mb-6">
                  <Image
                    src={collab.artistImage}
                    alt={`${collab.name} Artist`}
                    fill
                    className="object-cover rounded-full border-4 border-white shadow-lg"
                  />
                </div>
                <div className="text-center lg:text-left">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">{collab.name}</h2>
                  <p className="text-lg text-gray-600 mb-6">{collab.description}</p>
                  <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-500">Release Date</p>
                      <p className="font-semibold text-gray-900">{collab.date}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-500">Status</p>
                      <p className="font-semibold text-emerald-600">{collab.status}</p>
                    </div>
                    <Link 
                      href={collab.link}
                      className="ml-auto"
                    >
                      <Button className="bg-black hover:bg-gray-800">
                        View Collection
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
