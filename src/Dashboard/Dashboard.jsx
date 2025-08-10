import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  FiUsers,
  FiDollarSign,
  FiTrendingUp,
  FiRefreshCcw,
  FiDownload,
  FiShoppingCart,
} from 'react-icons/fi';

const data = [
  { name: 'Jan', sales: 30 },
  { name: 'Feb', sales: 20 },
  { name: 'Mar', sales: 50 },
  { name: 'Apr', sales: 40 },
  { name: 'May', sales: 70 },
  { name: 'Jun', sales: 60 },
  { name: 'Jul', sales: 40 },
];

const Dashboard = () => {
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Dashboard cards */}
      <div className="grid grid-cols-3 gap-4">
        {/* Card 1 */}
        <div className="bg-white shadow rounded-lg p-6 grid grid-cols-3 divide-x">
          <div className="flex flex-col items-center">
            <FiUsers className="text-purple-600" size={24} />
            <div className="text-xs uppercase mt-1">Customers</div>
            <div className="font-bold text-lg">1000</div>
          </div>
          <div className="flex flex-col items-center">
            <FiDollarSign className="text-purple-600" size={24} />
            <div className="text-xs uppercase mt-1">Revenue</div>
            <div className="font-bold text-lg">$1252</div>
          </div>
          <div className="flex flex-col items-center">
            <FiTrendingUp className="text-purple-600" size={24} />
            <div className="text-xs uppercase mt-1">Growth</div>
            <div className="font-bold text-lg">600</div>
          </div>

          {/* second row */}
          <div className="flex flex-col items-center border-t pt-4">
            <FiRefreshCcw className="text-purple-600" size={24} />
            <div className="text-xs uppercase mt-1">Returns</div>
            <div className="font-bold text-lg">3550</div>
          </div>
          <div className="flex flex-col items-center border-t pt-4">
            <FiDownload className="text-purple-600" size={24} />
            <div className="text-xs uppercase mt-1">Downloads</div>
            <div className="font-bold text-lg">3550</div>
          </div>
          <div className="flex flex-col items-center border-t pt-4">
            <FiShoppingCart className="text-purple-600" size={24} />
            <div className="text-xs uppercase mt-1">Orders</div>
            <div className="font-bold text-lg">100%</div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-2">Conversion Rate</h3>
          <div className="text-4xl font-bold mb-1">53.94%</div>
          <p className="text-sm text-gray-600">
            Number of conversions divided by the total visitors.
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-2">Order Delivered</h3>
          <div className="text-4xl font-bold mb-1">1432</div>
          <p className="text-sm text-gray-600">
            Total number of orders delivered in this month.
          </p>
        </div>
      </div>

      {/* Sales Report */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between mb-4">
          <div>
            <div className="text-2xl font-bold">$21,356.46</div>
            <div className="text-sm text-gray-500">Total Sales</div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">$1935.6</div>
            <div className="text-sm text-gray-500">Average</div>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={200}>
          <LineChart
            data={data}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#7c3aed"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
