'use client';

import { useState, useEffect } from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { OrderStatus } from '@prisma/client';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface Analytics {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  recentOrders: {
    id: number;
    customerName: string;
    totalAmount: number;
    status: OrderStatus;
    createdAt: string;
  }[];
  salesData: {
    labels: string[];
    data: number[];
  };
  topProducts: {
    name: string;
    sales: number;
  }[];
  ordersByStatus: {
    status: OrderStatus;
    count: number;
    revenue: number;
  }[];
  salesByStatus: Record<OrderStatus, number[]>;
  last7DaysLabels: string[];
}

const statusColors = {
  PENDING: 'rgb(251, 191, 36)',
  CONFIRMED: 'rgb(79, 70, 229)',
  SHIPPED: 'rgb(59, 130, 246)',
  DELIVERED: 'rgb(34, 197, 94)',
  CANCELLED: 'rgb(239, 68, 68)',
};

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<Analytics>({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentOrders: [],
    salesData: {
      labels: [],
      data: [],
    },
    topProducts: [],
    ordersByStatus: [],
    salesByStatus: {} as Record<OrderStatus, number[]>,
    last7DaysLabels: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/admin/analytics');
      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }
      const data = await response.json();
      setAnalytics(data);
      setError('');
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const salesChartData = {
    labels: analytics.salesData.labels,
    datasets: [
      {
        label: 'Total Sales',
        data: analytics.salesData.data,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
      ...Object.entries(analytics.salesByStatus).map(([status, data]) => ({
        label: `${status} Sales`,
        data: data,
        fill: false,
        borderColor: statusColors[status as OrderStatus],
        tension: 0.1,
        hidden: true,
      })),
    ],
  };

  const orderStatusChartData = {
    labels: analytics.ordersByStatus.map(item => item.status),
    datasets: [{
      data: analytics.ordersByStatus.map(item => item.count),
      backgroundColor: analytics.ordersByStatus.map(item => statusColors[item.status]),
    }],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Total Products</h3>
          <p className="text-3xl font-bold text-indigo-600">{analytics.totalProducts}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Total Orders</h3>
          <p className="text-3xl font-bold text-indigo-600">{analytics.totalOrders}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Total Revenue</h3>
          <p className="text-3xl font-bold text-indigo-600">{analytics.totalRevenue.toFixed(2)} TND</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Overview</h3>
          <Line data={salesChartData} options={chartOptions} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Orders by Status</h3>
          <div className="aspect-square relative">
            <Doughnut data={orderStatusChartData} options={{
              ...chartOptions,
              plugins: {
                ...chartOptions.plugins,
                legend: {
                  position: 'right' as const,
                },
              },
            }} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {analytics.recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-4 py-2 text-sm text-gray-900">#{order.id}</td>
                    <td className="px-4 py-2 text-sm text-gray-500">{order.customerName}</td>
                    <td className="px-4 py-2 text-sm text-gray-500">{order.totalAmount.toFixed(2)} TND</td>
                    <td className="px-4 py-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                        ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                          order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'CONFIRMED' ? 'bg-indigo-100 text-indigo-800' :
                          order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status Summary</h3>
          <div className="space-y-4">
            {analytics.ordersByStatus.map((statusData) => (
              <div key={statusData.status} className="flex items-center justify-between">
                <div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                    ${statusData.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                      statusData.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
                      statusData.status === 'CONFIRMED' ? 'bg-indigo-100 text-indigo-800' :
                      statusData.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'}`}>
                    {statusData.status}
                  </span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">Orders: </span>
                  <span className="font-medium text-gray-900">{statusData.count}</span>
                  <span className="mx-2 text-gray-300">|</span>
                  <span className="text-gray-500">Revenue: </span>
                  <span className="font-medium text-gray-900">{statusData.revenue.toFixed(2)} TND</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
