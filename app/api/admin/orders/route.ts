import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  console.log('Fetching orders...');
  try {
    // First, test the database connection
    await prisma.$connect();
    console.log('Database connected successfully');

    // Fetch orders with included relations
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                images: {
                  where: { isMain: true },
                  select: {
                    url: true,
                  },
                  take: 1,
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log(`Found ${orders.length} orders`);

    // Safely transform dates to strings and handle undefined values
    const serializedOrders = orders.map(order => {
      // Ensure all required fields exist
      const safeOrder = {
        ...order,
        createdAt: order.createdAt || new Date(),
        updatedAt: order.updatedAt || new Date(),
        items: order.items || [],
      };

      return {
        ...safeOrder,
        createdAt: safeOrder.createdAt.toISOString(),
        updatedAt: safeOrder.updatedAt.toISOString(),
        items: safeOrder.items.map(item => {
          // Only include fields that exist in the OrderItem model
          const safeItem = {
            ...item,
            product: {
              ...item.product
            }
          };

          return safeItem;
        }),
      };
    });

    return NextResponse.json(serializedOrders);
  } catch (error) {
    console.error('Detailed orders fetch error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to fetch orders', details: errorMessage },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
