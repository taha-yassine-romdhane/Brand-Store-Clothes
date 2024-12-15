import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const productId = parseInt(params.productId)
    
    if (isNaN(productId)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      )
    }

    const product = await prisma.product.findUnique({
      where: {
        id: productId
      },
      include: {
        images: true
      }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const productId = parseInt(params.productId)
    const data = await request.json()
    
    if (isNaN(productId)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      )
    }

    // Delete existing images
    await prisma.productImage.deleteMany({
      where: { productId }
    })

    // Update product with new data and images
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        name: data.name,
        description: data.description,
        price: parseFloat(data.price),
        category: data.category.toLowerCase(),
        colors: data.colors,
        sizes: data.sizes,
        collaborateur: data.collaborateur,
        images: {
          create: data.images.map((image: { url: string }) => ({
            url: image.url,
            mimeType: image.url.split(';')[0].split(':')[1], // Extract MIME type from data URL
          }))
        }
      },
      include: {
        images: true
      }
    })

    return NextResponse.json(updatedProduct)
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const productId = parseInt(params.productId)
    
    if (isNaN(productId)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      )
    }

    // First, find the product to get its images
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { images: true }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Delete the product and all related data in a transaction
    await prisma.$transaction([
      // Delete all images associated with the product
      prisma.productImage.deleteMany({
        where: { productId }
      }),
      // Delete the product itself
      prisma.product.delete({
        where: { id: productId }
      })
    ])

    return NextResponse.json({ message: 'Product deleted successfully' })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}
