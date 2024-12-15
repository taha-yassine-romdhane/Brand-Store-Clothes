import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log('Received product data:', JSON.stringify(data, null, 2));
    
    // Create the product
    const productData = {
      name: data.name,
      description: data.description,
      price: parseFloat(data.price),
      category: data.category.toLowerCase(),
      colors: data.colors,
      sizes: data.sizes,
      collaborateur: data.collaborateur,
      images: {
        create: data.images.map((imageUrl: string, index: number) => ({
          url: imageUrl,
          isMain: index === 0
        }))
      }
    };

    console.log('Processed product data:', JSON.stringify(productData, null, 2));

    const product = await prisma.product.create({
      data: productData,
      include: {
        images: true
      }
    });

    console.log('Created product:', JSON.stringify(product, null, 2));
    return NextResponse.json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const collaborateur = searchParams.get("collaborateur");
    const sort = searchParams.get("sort");
    const product = searchParams.get("product");

    let where: any = {};

    // Category filter
    if (category && category !== "all") {
      where.category = {
        equals: category.toLowerCase(),
        mode: 'insensitive'
      };
    }

    // Collaborateur filter
    if (collaborateur && collaborateur !== "all") {
      where.collaborateur = {
        equals: collaborateur.toLowerCase(),
        mode: 'insensitive'
      };
    }

    // Product name filter
    if (product) {
      const productName = product
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
        .replace(/-/g, " ");
      
      where.name = {
        contains: productName,
        mode: 'insensitive'
      };
    }

    // Get products with their images
    const products = await prisma.product.findMany({
      where,
      include: {
        images: true
      },
      orderBy: sort === "price-asc" 
        ? { price: "asc" }
        : sort === "price-desc"
        ? { price: "desc" }
        : sort === "newest"
        ? { createdAt: "desc" }
        : { id: "asc" }
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}