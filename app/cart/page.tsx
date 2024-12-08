"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Minus, Plus, Trash2, ArrowRight } from "lucide-react"
import { useCart } from "@/lib/context/cart-context"

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice } = useCart()
  const [promoCode, setPromoCode] = useState("")

  const shipping = items.length > 0 ? 15.99 : 0
  const total = totalPrice + shipping

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <h2 className="text-xl font-medium text-gray-900 mb-4">Your cart is empty</h2>
                  <p className="text-gray-500 mb-6">Looks like you haven't added anything yet</p>
                  <Link href="/collections">
                    <Button>
                      Continue Shopping
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              ) : (
                items.map((item) => (
                  <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="flex gap-6 py-6 border-b last:border-0">
                    <div className="relative aspect-square w-24 overflow-hidden rounded-lg">
                      <Image
                        src={item.images[0].url}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="text-base font-medium text-gray-900">
                            {item.name}
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            {item.selectedColor} / {item.selectedSize}
                          </p>
                        </div>
                        <p className="text-base font-medium text-gray-900">
                          {Number(item.price * item.quantity).toFixed(2)} DT
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(Number(item.id), Math.max(1, item.quantity - 1), item.selectedSize, item.selectedColor)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(Number(item.id), item.quantity + 1, item.selectedSize, item.selectedColor)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => removeItem(Number(item.id), item.selectedSize, item.selectedColor)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-medium mb-6">Order Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium">{Number(totalPrice).toFixed(2)} DT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Shipping</span>
                  <span className="font-medium">{Number(shipping).toFixed(2)} DT</span>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex justify-between">
                    <span className="text-base font-medium">Total</span>
                    <span className="text-base font-medium">{Number(total).toFixed(2)} DT</span>
                  </div>
                </div>
              </div>

              {/* Promo Code */}
              <div className="mt-6">
                <label htmlFor="promo" className="block text-sm font-medium text-gray-700 mb-2">
                  Promo Code
                </label>
                <div className="flex gap-2">
                  <Input
                    id="promo"
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter code"
                  />
                  <Button variant="outline">Apply</Button>
                </div>
              </div>

              {/* Checkout Button */}
              <Button 
                className="w-full mt-6 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#128C7E]" 
                size="lg"
                onClick={() => {
                  const message = items.map(item => 
                    `${item.name} (${item.selectedSize}, ${item.selectedColor}) - Quantity: ${item.quantity} - Price: ${(item.price * item.quantity).toFixed(2)} DT`
                  ).join('\n');
                  
                  const fullMessage = `New Order:\n\n${message}\n\nSubtotal: ${totalPrice.toFixed(2)} DT\nShipping: ${shipping.toFixed(2)} DT\nTotal: ${total.toFixed(2)} DT`;
                  const phoneNumber = '+21695458811'; // Your WhatsApp number
                  const encodedMessage = encodeURIComponent(fullMessage);
                  window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
                }}
              >
                <svg 
                  viewBox="0 0 24 24" 
                  className="w-5 h-5"
                  fill="currentColor"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Order via WhatsApp
              </Button>

              {/* Continue Shopping */}
              <Link href="/collections" className="block text-center mt-4">
                <Button variant="link" className="text-gray-500 hover:text-gray-700">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}