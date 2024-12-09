"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

const collaborations = [
  {
    id: 1,
    name: "Aya",
    title: "LAMASETTE x Aya",
    description: "Embodying grace and sophistication, Aya brings our designs to life with her elegant presence. Her collection features timeless pieces that blend traditional elements with modern aesthetics.",
    mainImage: "/images/autres/3R8A1354.jpg",
    portraitImage: "/images/autres/3R8A1356.jpg",
    galleryImages: [
      "/images/autres/3R8A1354.jpg",
      "/images/autres/3R8A1356.jpg",
      "/images/product3-greysh-Aya/greysh Luxury coat2.jpg"
    ],
    date: "Winter 2024",
    status: "Available Now",
    link: "/collections?collaborator=aya"
  },
  {
    id: 2,
    name: "Emna",
    title: "LAMASETTE x Emna",
    description: "With her unique style and natural charisma, Emna perfectly captures the essence of our brand. Her collection showcases contemporary designs that celebrate individuality and confidence.",
    mainImage: "/images/autres/3R8A1476.jpg",
    portraitImage: "/images/autres/3R8A1475.jpg",
    galleryImages: [
      "/images/autres/3R8A1476.jpg",
      "/images/autres/3R8A1475.jpg",
      "/images/autres/3R8A1482.jpg"
    ],
    date: "Spring 2024",
    status: "Available Now",
    link: "/collections?collaborator=emna"
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
            <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">Meet Our Models</h1>
            <p className="text-xl max-w-2xl mx-auto drop-shadow-md">
              Discover the talented individuals who bring our collections to life
            </p>
          </div>
        </div>
      </div>

      {/* Models Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-32">
          {collaborations.map((model, index) => (
            <div 
              key={model.id} 
              className={`flex flex-col ${
                index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
              } gap-12 items-center`}
            >
              {/* Model Images Gallery */}
              <div className="w-full lg:w-1/2 grid grid-cols-2 gap-4">
                <div className="col-span-2 relative aspect-[3/4] overflow-hidden rounded-2xl">
                  <Image
                    src={model.mainImage}
                    alt={`${model.name} Main`}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                    quality={90}
                  />
                </div>
                {model.galleryImages.slice(1, 3).map((image, i) => (
                  <div key={i} className="relative aspect-square overflow-hidden rounded-xl">
                    <Image
                      src={image}
                      alt={`${model.name} Gallery ${i + 1}`}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500"
                      quality={85}
                    />
                  </div>
                ))}
              </div>

              {/* Content */}
              <div className="w-full lg:w-1/2 space-y-8">
                <div className="relative w-32 h-32 mx-auto lg:mx-0">
                  <Image
                    src={model.portraitImage}
                    alt={model.name}
                    fill
                    className="object-cover rounded-full border-4 border-white shadow-lg"
                  />
                </div>
                <div className="text-center lg:text-left">
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">{model.title}</h2>
                  <p className="text-lg text-gray-600 mb-8 leading-relaxed">{model.description}</p>
                  <div className="flex flex-col sm:flex-row gap-6 items-center">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-500">Collection Release</p>
                      <p className="font-semibold text-gray-900">{model.date}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-500">Status</p>
                      <p className="font-semibold text-emerald-600">{model.status}</p>
                    </div>
                    <Link 
                      href={model.link}
                      className="sm:ml-auto"
                    >
                      <Button className="bg-black hover:bg-gray-800 min-w-[200px]">
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
