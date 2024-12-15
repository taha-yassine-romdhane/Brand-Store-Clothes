import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { OrderStatus } from '@prisma/client';

export async function GET() {
  try {
    // Get total products
    const totalProducts = await prisma.product.count();

    // Get orders and calculate revenue
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => {
      return sum + (order.totalAmount || 0);
    }, 0);

    // Get orders by status
    const ordersByStatus = Object.values(OrderStatus).map(status => ({
      status,
      count: orders.filter(order => order.status === status).length,
      revenue: orders
        .filter(order => order.status === status)
        .reduce((sum, order) => sum + (order.totalAmount || 0), 0),
    }));

    // Get recent orders (last 5)
    const recentOrders = orders.slice(0, 5).map(order => ({
      id: order.id,
      customerName: order.customerName,
      totalAmount: order.totalAmount || 0,
      status: order.status,
      createdAt: order.createdAt.toISOString(),
    }));

    // Calculate sales data for the last 7 days
    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      return date;
    }).reverse();

    const salesData = {
      labels: last7Days.map(date => date.toLocaleDateString('en-US', { weekday: 'short' })),
      data: last7Days.map(date => {
        const dayOrders = orders.filter(order => {
          const orderDate = new Date(order.createdAt);
          return orderDate.toDateString() === date.toDateString();
        });
        return dayOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
      }),
    };

    // Get top products by order quantity
    const topProducts = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: {
        quantity: true,
      },
      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },
      take: 5,
    });

    const topProductsWithDetails = await Promise.all(
      topProducts.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
        });
        return {
          name: product?.name || 'Unknown Product',
          sales: item._sum.quantity || 0,
        };
      })
    );

    // Calculate status-based sales data for the last 7 days
    const salesByStatus = Object.values(OrderStatus).reduce((acc, status) => {
      acc[status] = last7Days.map(date => {
        const dayOrders = orders.filter(order => {
          const orderDate = new Date(order.createdAt);
          return orderDate.toDateString() === date.toDateString() && order.status === status;
        });
        return dayOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
      });
      return acc;
    }, {} as Record<OrderStatus, number[]>);

    const analyticsData = {
      totalProducts,
      totalOrders,
      totalRevenue,
      recentOrders,
      salesData,
      topProducts: topProductsWithDetails,
      ordersByStatus,
      salesByStatus,
      last7DaysLabels: salesData.labels,
    };

    return NextResponse.json(analyticsData);
  } catch (error) {
    console.error('Error generating analytics:', error);
    return NextResponse.json(
      { error: 'Failed to generate analytics' },
      { status: 500 }
    );
  }
}
