import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import {
  DollarSign,
  TrendingUp,
  Users,
  ShoppingBag,
  ArrowUpRight,
  Calendar,
} from 'lucide-react';
import { supabase } from '../supabase/supabaseClient';

// --- SAMPLE DATA FOR CHARTS ---
const salesData = [
  { name: 'Mon', sales: 4000 },
  { name: 'Tue', sales: 3000 },
  { name: 'Wed', sales: 5000 },
  { name: 'Thu', sales: 2780 },
  { name: 'Fri', sales: 6890 },
  { name: 'Sat', sales: 8390 },
  { name: 'Sun', sales: 7490 },
];

const categoryData = [
  { name: 'Pizza', value: 400 },
  { name: 'Biryani', value: 300 },
  { name: 'Burgers', value: 300 },
  { name: 'Sides', value: 200 },
];

const COLORS = ['#E65100', '#1a1a1a', '#D84315', '#4A4A4A'];

const AdminStats = () => {
  const [stats, setStats] = useState({
    revenue: '12,840.00',
    orders: '482',
    users: '1,204',
    growth: '+18.4%',
  });

  const cards = [
    {
      title: 'Total Revenue',
      value: `$${stats.revenue}`,
      icon: <DollarSign />,
      color: 'text-green-600',
      bg: 'bg-green-100',
    },
    {
      title: 'Boutique Orders',
      value: stats.orders,
      icon: <ShoppingBag />,
      color: 'text-[#E65100]',
      bg: 'bg-orange-100',
    },
    {
      title: 'Total Patrons',
      value: stats.users,
      icon: <Users />,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
    },
    {
      title: 'Empire Growth',
      value: stats.growth,
      icon: <TrendingUp />,
      color: 'text-purple-600',
      bg: 'bg-purple-100',
    },
  ];

  return (
    <div className="p-8 space-y-10 bg-[#fcf9f5] min-h-screen">
      {/* --- HEADER --- */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-5xl font-black text-[#1a1a1a] tracking-tighter uppercase italic"
          >
            Analytics <span className="text-[#E65100] not-italic">Vault.</span>
          </motion.h2>
          <div className="flex items-center gap-2 mt-2">
            <Calendar size={14} className="text-gray-400" />
            <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">
              Real-time Performance Metrics
            </p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="px-6 py-3 bg-white border border-black/5 rounded-2xl shadow-sm text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
        >
          Export Report <ArrowUpRight size={14} />
        </motion.button>
      </header>

      {/* --- QUICK STAT CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -10 }}
            className="bg-white p-8 rounded-[3rem] shadow-sm border border-black/5 flex flex-col gap-4 relative overflow-hidden group"
          >
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center ${card.bg} ${card.color} group-hover:scale-110 transition-transform duration-500`}
            >
              {card.icon}
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                {card.title}
              </p>
              <h3 className="text-3xl font-black text-[#1a1a1a] tracking-tighter mt-1">
                {card.value}
              </h3>
            </div>
            {/* Design Decor */}
            <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
              {React.cloneElement(card.icon, { size: 100 })}
            </div>
          </motion.div>
        ))}
      </div>

      {/* --- CHARTS SECTION --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Sales Area Chart (2/3 width) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-2 bg-white p-10 rounded-[3.5rem] shadow-sm border border-black/5 h-[500px]"
        >
          <div className="flex justify-between items-center mb-10">
            <h4 className="text-xl font-black italic tracking-tighter uppercase">
              Revenue Trajectory.
            </h4>
            <div className="flex gap-2">
              <div className="w-3 h-3 bg-[#E65100] rounded-full"></div>
              <span className="text-[10px] font-black uppercase text-gray-400">
                Weekly Sales
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height="80%">
            <AreaChart data={salesData}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E65100" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#E65100" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a1a1a',
                  borderRadius: '15px',
                  border: 'none',
                  color: '#fff',
                  fontSize: '12px',
                }}
                itemStyle={{ color: '#E65100', fontWeight: 'bold' }}
              />
              <Area
                type="monotone"
                dataKey="sales"
                stroke="#E65100"
                strokeWidth={4}
                fillOpacity={1}
                fill="url(#colorSales)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Category Performance Bar Chart (1/3 width) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-1 bg-[#1a1a1a] p-10 rounded-[3.5rem] shadow-2xl text-white h-[500px] flex flex-col"
        >
          <h4 className="text-xl font-black italic tracking-tighter uppercase mb-10 text-white">
            Popularity Index.
          </h4>
          <ResponsiveContainer width="100%" height="60%">
            <BarChart data={categoryData}>
              <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                {categoryData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index === 0 ? '#E65100' : '#4A4A4A'}
                  />
                ))}
              </Bar>
              <Tooltip
                cursor={{ fill: 'transparent' }}
                contentStyle={{ display: 'none' }}
              />
            </BarChart>
          </ResponsiveContainer>

          <div className="mt-8 space-y-4">
            {categoryData.map((cat, i) => (
              <div
                key={i}
                className="flex justify-between items-center border-b border-white/5 pb-2"
              >
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                  {cat.name}
                </span>
                <span className="text-sm font-black text-[#E65100]">
                  {cat.value} Orders
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminStats;
