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
            name: "Jane Doe",
            role: "Founder & Creative Director",
            image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&h=400&fit=crop",
        },
        {
            name: "John Smith",
            role: "CEO",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&h=400&fit=crop",
        },
        {
            name: "Emily Brown",
            role: "Head of Design",
            image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&h=400&fit=crop",
        },
    ];

    const locations = [
        { 
            city: "New York", 
            address: "123 Fashion Ave, New York, NY 10001",
            image: "https://images.unsplash.com/photo-1522083165195-3424ed129620",
            mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.9663095343005!2d-73.99038388459469!3d40.74144797932861!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sFashion%20Ave%2C%20New%20York%2C%20NY%2010001!5e0!3m2!1sen!2sus"
        },
        { 
            city: "Los Angeles", 
            address: "456 Style Blvd, Los Angeles, CA 90001",
            image: "https://images.unsplash.com/photo-1449034446853-66c86144b0ad",
            mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3305.7153376542166!2d-118.24368388478195!3d34.052235480605685!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2c7b85dea2a93%3A0x1ff47c3ceb7bb2d5!2sLos%20Angeles%2C%20CA%2090001!5e0!3m2!1sen!2sus"
        },
        { 
            city: "Paris", 
            address: "789 Rue de la Mode, 75001 Paris, France",
            image: "https://images.unsplash.com/photo-1502899576159-f224dc2349fa",
            mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.6898366255713!2d2.3361458156744775!3d48.86146507928747!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66e18a5f84801%3A0x6eb5daa624bdebd2!2s75001%20Paris%2C%20France!5e0!3m2!1sen!2sus"
        },
    ];

    return (
        <div className="container mx-auto px-4 py-16">
            <h1 className="text-5xl font-extrabold text-center text-primary mb-8">
                About Trendy Threads
            </h1>

            {/* Brand Story */}
            <section className="mb-16">
                <h2 className="text-3xl font-bold text-secondary mb-4">Our Story</h2>
                <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div>
                        <p className="text-lg mb-6 leading-relaxed">
                            Trendy Threads was born out of a passion for sustainable fashion
                            and a desire to create clothing that not only looks good but feels
                            good too. Founded in 2010 by Jane Doe, our journey began in a
                            small workshop in Brooklyn, New York.
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
                    <div className="relative h-[400px] rounded-lg overflow-hidden shadow-lg">
                        <Image
                            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200"
                            alt="Trendy Threads workshop"
                            layout="fill"
                            objectFit="cover"
                        />
                    </div>
                </div>
            </section>

            {/* Owners */}
            <section className="mb-16">
                <h2 className="text-3xl font-bold text-secondary mb-4">Meet Our Team</h2>
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
                <h2 className="text-3xl font-bold text-secondary mb-4">Our Locations</h2>
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
