import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const size = searchParams.get("size");
    const color = searchParams.get("color");
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

    // Size filter
    if (size && size !== "all") {
      where.sizes = {
        has: size
      };
    }

    // Color filter
    if (color && color !== "all") {
      where.colors = {
        has: color
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
      orderBy: sort === "price-desc" 
        ? { price: "desc" }
        : sort === "price-asc"
        ? { price: "asc" }
        : { createdAt: "desc" }
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("[PRODUCTS_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}