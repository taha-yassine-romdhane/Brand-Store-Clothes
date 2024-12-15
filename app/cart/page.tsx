"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Minus, Plus, Trash2, ArrowRight, X } from "lucide-react"
import { useCart } from "@/lib/context/cart-context"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart()
  const [promoCode, setPromoCode] = useState("")
  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    phone: "",
    address: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const shipping = items.length > 0 ? 7.00 : 0
  const total = totalPrice + shipping

  const handleConfirmOrder = () => {
    if (!customerDetails.name || !customerDetails.phone || !customerDetails.address) {
      toast.error("Please fill in all customer details")
      return
    }
    setShowConfirmation(true)
  }

  const handleSubmitOrder = async () => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerName: customerDetails.name,
          phoneNumber: customerDetails.phone,
          address: customerDetails.address,
          totalAmount: total,
          items: items.map(item => ({
            productId: item.id,
            quantity: item.quantity,
            size: item.selectedSize,
            color: item.selectedColor,
            price: item.price
          }))
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create order')
      }

      const order = await response.json()
      setShowConfirmation(false)
      toast.success("Order submitted successfully! We'll contact you shortly to confirm your order.")
      
      // Clear cart and reset form
      clearCart()
      setCustomerDetails({ name: "", phone: "", address: "" })
    } catch (error) {
      console.error('Error submitting order:', error)
      toast.error("Failed to submit order. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

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
            <div className="bg-white rounded-xl shadow-sm p-6 space-y-6 sticky top-4">
              <h2 className="text-lg font-semibold">Order Summary</h2>
              
              {/* Customer Details */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={customerDetails.name}
                    onChange={(e) => setCustomerDetails(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={customerDetails.phone}
                    onChange={(e) => setCustomerDetails(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <Label htmlFor="address">Delivery Address</Label>
                  <Input
                    id="address"
                    value={customerDetails.address}
                    onChange={(e) => setCustomerDetails(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Enter your delivery address"
                  />
                </div>
              </div>

              {/* Summary */}
              <div className="border-t pt-4">
                <div className="flex justify-between mb-2">
                  <span>Subtotal</span>
                  <span>{totalPrice.toFixed(2)} TND</span>
                </div>
                <div className="flex justify-between mb-4">
                  <span>Shipping</span>
                  <span>{shipping.toFixed(2)} TND</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{total.toFixed(2)} TND</span>
                </div>
              </div>

              <Button
                className="w-full"
                onClick={handleConfirmOrder}
                disabled={items.length === 0 || isSubmitting}
              >
                Submit Order
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Order Confirmation</h2>
              <button onClick={() => setShowConfirmation(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="border-b pb-4">
                <h3 className="font-medium mb-2">Customer Details</h3>
                <p><span className="text-gray-600">Name:</span> {customerDetails.name}</p>
                <p><span className="text-gray-600">Phone:</span> {customerDetails.phone}</p>
                <p><span className="text-gray-600">Address:</span> {customerDetails.address}</p>
              </div>

              <div className="border-b pb-4">
                <h3 className="font-medium mb-2">Order Items</h3>
                {items.map((item) => (
                  <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="flex justify-between mb-2">
                    <div>
                      <span className="font-medium">{item.name}</span>
                      <div className="text-sm text-gray-600">
                        {item.quantity}x @ {item.price.toFixed(2)} TND
                        {item.selectedSize && ` - Size: ${item.selectedSize}`}
                        {item.selectedColor && ` - Color: ${item.selectedColor}`}
                      </div>
                    </div>
                    <span>{(item.quantity * item.price).toFixed(2)} TND</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{totalPrice.toFixed(2)} TND</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping.toFixed(2)} TND</span>
                </div>
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>{total.toFixed(2)} TND</span>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <p className="text-sm text-gray-600">
                  By confirming this order, you agree that we will contact you shortly to confirm your order details and arrange delivery.
                </p>
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setShowConfirmation(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="w-full"
                    onClick={handleSubmitOrder}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Confirm Order'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}