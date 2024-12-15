import { NextRequest, NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Get all unique categories and count their products
    const products = await prisma.product.findMany({
      select: {
        category: true,
      },
    });

    // Count products per category
    const categoryCounts = products.reduce((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Format the response
    const categories = Object.entries(categoryCounts).map(([name, productCount]) => ({
      name,
      productCount,
    }));

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Categories fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json();

    if (!name) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }

    // Since categories are just strings in the Product model,
    // we don't actually need to create a category record.
    // We'll just return success.
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Category creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');

    if (!name) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }

    // Update all products in this category to 'uncategorized'
    await prisma.product.updateMany({
      where: {
        category: name,
      },
      data: {
        category: 'uncategorized',
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Category deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    );
  }
}
