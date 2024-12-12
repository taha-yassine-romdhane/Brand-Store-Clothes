import Image from "next/image";
import { MapPin } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

export default function AboutUs() {
    const owners = [
        {
            name: "Aya Romdhane",
            role: "Founder & Creative Director",
            image: "2d36c081-65d7-4957-bbc3-86857614dfb1.jpg",
        },
        {
            name: "Sameh Zammit",
            role: "CEO",
            image: "017e5d9b-1231-46e6-8e1f-02cfeae2b5c5.jpg",
        },
    ];
    

    const locations = [
        { 
            city: "Tunisia Sousse , Msaken", 
            address: "Chera el bi2a , Rampoint Urgence , Msaken",
            image: "Capture d'écran 2024-12-12 184551.png",
            mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3234.9891632755877!2d10.572296375754671!3d35.73798852939042!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12fdf5d5083bd377%3A0x58184a9b95cca8f4!2sWood's%20pizzaria!5e0!3m2!1sen!2stn!4v1702403810"  },
      
    ];

    return (
        <div className="container mx-auto px-4 py-16">
            <h1 className="text-5xl font-extrabold text-center text-primary mb-8">
                About Trendy Threads
            </h1>

            {/* Brand Story */}
            <section className="mb-16">
                <h2 className="text-3xl font-bold text-primary mb-4">Our Story</h2>
                <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div>
                        <p className="text-lg mb-6 leading-relaxed">
                            LAMASETTE is a fashion brand that is dedicated to creating
                            timeless and stylish clothing for women. Founded in 2021 by SAMEH ZAMMIT
                             our mission is to provide a range of high-quality clothing that is both
                            fashionable and sustainable.
                        </p>
                        <p className="text-lg mb-6 leading-relaxed">
                            Over the years, we've grown from a local boutique to an
                            international brand, but our core values remain the same: quality,
                            sustainability, and style.
                        </p>
                        <button className="bg-primary text-white py-2 px-6 rounded-lg font-medium hover:bg-primary-dark transition">
                            Explore Our Products
                        </button>
                    </div>
                    <div className="relative h-[600px] rounded-lg overflow-hidden shadow-lg">
                        <Image
                            src="/téléchargement.jpg"
                            alt="Trendy Threads workshop"
                            layout="fill"
                            objectFit="cover"
                        />
                    </div>
                </div>
            </section>

            {/* Owners */}
            <section className="mb-16">
                <h2 className="text-3xl font-bold text-primary mb-4">Meet Our Team</h2>
                <Carousel className="w-full max-w-4xl mx-auto">
                    <CarouselContent>
                        {owners.map((owner, index) => (
                            <CarouselItem key={index} className="p-4">
                                <Card className="hover:shadow-xl transition-shadow">
                                    <CardContent className="flex flex-col items-center p-6">
                                        <div className="relative w-48 h-48 rounded-full overflow-hidden mb-4 shadow-md">
                                            <Image
                                                src={owner.image}
                                                alt={owner.name}
                                                layout="fill"
                                                objectFit="cover"
                                            />
                                        </div>
                                        <h3 className="text-xl font-semibold text-primary">
                                            {owner.name}
                                        </h3>
                                        <p className="text-muted-foreground">{owner.role}</p>
                                    </CardContent>
                                </Card>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </section>

            {/* Locations */}
            <section>
                <h2 className="text-3xl font-bold text-primary mb-4">Our Locations</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {locations.map((location, index) => (
                        <Card
                            key={index}
                            className="hover:shadow-lg transition-shadow border border-gray-200"
                        >
                            <CardContent className="p-6">
                                <div className="flex items-start mb-4">
                                    <MapPin className="mr-2 h-6 w-6 text-primary" />
                                    <div>
                                        <h3 className="text-lg font-semibold">{location.city}</h3>
                                        <p className="text-muted-foreground">{location.address}</p>
                                    </div>
                                </div>
                                <div className="relative h-40 rounded-md overflow-hidden shadow-sm mb-4">
                                    <Image
                                        src={`${location.image}?q=80&w=800`}
                                        alt={`${location.city} store`}
                                        layout="fill"
                                        objectFit="cover"
                                    />
                                </div>
                                <div className="relative h-60 rounded-md overflow-hidden shadow-sm">
                                    <iframe
                                        src={location.mapUrl}
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        className="absolute inset-0"
                                    ></iframe>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>
        </div>
    );
}
