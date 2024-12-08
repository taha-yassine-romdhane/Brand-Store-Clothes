"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function RamadhaneCollection() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically handle the email subscription
    setSubscribed(true);
    setEmail("");
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2070')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/60" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <div className="transform transition-all duration-700 translate-y-0 opacity-100">
            <h1 className="text-7xl font-bold mb-6">RAMADHANE</h1>
            <p className="text-2xl mb-8 text-gray-300">A New Vision of Luxury</p>
            <div className="flex flex-col items-center space-y-6">
              <p className="text-xl">Coming Soon - Fall 2024</p>
              
              {/* Brand Values */}
              <div className="flex flex-wrap justify-center gap-8 text-center my-8">
                {["ELEGANCE", "INNOVATION", "TRADITION"].map((word) => (
                  <div 
                    key={word} 
                    className="px-6 py-3 border border-white/20 rounded-lg backdrop-blur-sm hover:border-white/40 transition-all duration-300"
                  >
                    <p className="text-sm">{word}</p>
                  </div>
                ))}
              </div>

              {/* Newsletter Signup */}
              <div className="max-w-md w-full">
                {!subscribed ? (
                  <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
                    <p className="text-gray-300 mb-2">
                      Be the first to know when we launch
                    </p>
                    <div className="flex w-full max-w-md gap-2">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300"
                        required
                      />
                      <Button 
                        type="submit"
                        className="bg-white text-black hover:bg-gray-200 transition-all duration-300"
                      >
                        Notify Me
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="text-green-400 text-lg opacity-0 animate-fade-in">
                    Thank you! We'll notify you when we launch.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
      </div>
    </div>
  );
}
