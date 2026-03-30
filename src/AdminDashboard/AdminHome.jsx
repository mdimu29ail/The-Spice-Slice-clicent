import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabase/supabaseClient';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  DollarSign,
  ShoppingBag,
  Utensils,
  Users,
  TrendingUp,
  ArrowUpRight,
  Sparkles,
  Zap,
  Package,
  Clock,
} from 'lucide-react';
import Loading from '../Loading/Loading';

const AdminHome = () => {
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    foods: 0,
    customers: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // ১. খাবারের সংখ্যা
        const { count: foodCount } = await supabase
          .from('foods')
          .select('*', { count: 'exact', head: true });

        // ২. ইউজার প্রোফাইলের সংখ্যা
        const { count: userCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        // ৩. সব অর্ডারের ডাটা (রেভিনিউ এবং চার্টের জন্য)
        const { data: orderData, error: orderErr } = await supabase
          .from('applications')
          .select('price_usd, created_at');

        if (orderErr) throw orderErr;

        // ৪. টোটাল রেভিনিউ ক্যালকুলেশন
        const totalRevenue =
          orderData?.reduce(
            (acc, curr) => acc + (Number(curr.price_usd) || 0),
            0,
          ) || 0;

        setStats({
          revenue: totalRevenue.toLocaleString(undefined, {
            minimumFractionDigits: 2,
          }),
          orders: orderData?.length || 0,
          foods: foodCount || 0,
          customers: userCount || 0,
        });

        // ৫. চার্ট ডাটা জেনারেশন (গত ৭ দিনের ডাটা গ্রুপিং)
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const last7Days = [...Array(7)]
          .map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return {
              name: days[d.getDay()],
              rev: 0,
              rawDate: d.toISOString().split('T')[0],
            };
          })
          .reverse();

        orderData?.forEach(order => {
          const orderDate = order.created_at.split('T')[0];
          const dayBucket = last7Days.find(d => d.rawDate === orderDate);
          if (dayBucket) {
            dayBucket.rev += Number(order.price_usd);
          }
        });
        setChartData(last7Days);

        // ৬. রিসেন্ট অর্ডারস (Join with foods)
        const { data: recent } = await supabase
          .from('applications')
          .select(`*, foods(name, image_url)`)
          .order('created_at', { ascending: false })
          .limit(5);
        setRecentOrders(recent || []);

        // ৭. লো স্টক এলার্ট (Quantity < 10)
        const { data: stock } = await supabase
          .from('foods')
          .select('name, quantity')
          .lt('quantity', 10)
          .order('quantity', { ascending: true });
        setLowStock(stock || []);
      } catch (err) {
        console.error('Dashboard Fetch Error:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="p-4 lg:p-10 space-y-12 bg-[#fcf9f5] min-h-screen font-sans selection:bg-orange-100">
      {/* --- 1. DYNAMIC HEADER --- */}
      <header className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-5xl lg:text-6xl font-black text-[#1a1a1a] tracking-tighter uppercase italic"
          >
            Executive <span className="text-[#E65100] not-italic">Suite.</span>
          </motion.h2>
          <div className="flex items-center gap-2 mt-3">
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
            <p className="text-gray-400 font-bold uppercase tracking-[0.3em] text-[9px]">
              Live Boutique Metrics Syncing
            </p>
          </div>
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-3 bg-white border border-black/5 rounded-2xl shadow-sm text-[10px] font-black uppercase tracking-widest hover:text-[#E65100] transition-all">
            Export Ledger
          </button>
          <div className="px-6 py-3 bg-[#1a1a1a] text-white rounded-2xl shadow-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
            Intelligence{' '}
            <Zap size={14} className="text-[#E65100]" fill="currentColor" />
          </div>
        </div>
      </header>

      {/* --- 2. DYNAMIC PERFORMANCE CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard
          title="Total Revenue"
          value={`$${stats.revenue}`}
          icon={<DollarSign />}
          trend="Live"
          color="bg-green-100 text-green-600"
        />
        <StatCard
          title="Boutique Orders"
          value={stats.orders}
          icon={<ShoppingBag />}
          trend="Total"
          color="bg-orange-100 text-[#E65100]"
        />
        <StatCard
          title="Active Inventory"
          value={stats.foods}
          icon={<Utensils />}
          trend="Items"
          color="bg-blue-100 text-blue-600"
        />
        <StatCard
          title="Total Patrons"
          value={stats.customers}
          icon={<Users />}
          trend="Users"
          color="bg-purple-100 text-purple-600"
        />
      </div>

      {/* --- 3. DYNAMIC CHART & STOCK --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Revenue Trajectory Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-2 bg-white p-10 rounded-[3.5rem] shadow-sm border border-black/5 h-[450px]"
        >
          <div className="flex justify-between items-center mb-10">
            <h4 className="text-xl font-black italic tracking-tighter uppercase">
              Revenue Trajectory.
            </h4>
            <span className="text-[10px] font-black uppercase text-gray-400">
              Last 7 Days Performance
            </span>
          </div>
          <ResponsiveContainer width="100%" height="85%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E65100" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#E65100" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f0f0f0"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fontWeight: 'bold' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: '20px',
                  border: 'none',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                }}
              />
              <Area
                type="monotone"
                dataKey="rev"
                stroke="#E65100"
                strokeWidth={4}
                fill="url(#colorRev)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Stock Alerts */}
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-[#1a1a1a] p-10 rounded-[3.5rem] text-white h-full relative overflow-hidden group"
          >
            <h4 className="text-xl font-black italic tracking-tighter uppercase mb-8 relative z-10">
              Stock Alerts.
            </h4>
            <div className="space-y-6 relative z-10">
              {lowStock.length > 0 ? (
                lowStock.map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center border-b border-white/5 pb-4"
                  >
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                      {item.name}
                    </span>
                    <span className="text-sm font-black text-red-500">
                      {item.quantity} Left
                    </span>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center py-10 opacity-20">
                  <Package size={48} />
                  <p className="text-[10px] font-black uppercase mt-4">
                    Inventory Healthy
                  </p>
                </div>
              )}
            </div>
            <Sparkles className="absolute -right-6 -bottom-6 text-white/5 w-40 h-40 group-hover:scale-110 transition-transform duration-700" />
          </motion.div>
        </div>
      </div>

      {/* --- 4. RECENT ACQUISITIONS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 bg-white p-10 rounded-[3.5rem] shadow-sm border border-black/5">
          <h4 className="text-xl font-black italic tracking-tighter uppercase mb-10">
            Recent Acquisitions.
          </h4>
          <div className="space-y-4">
            {recentOrders.map((order, index) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                key={order.id}
                className="flex items-center justify-between p-5 bg-[#fcf9f5] rounded-[2rem] hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={order.foods?.image_url}
                    className="w-12 h-12 rounded-2xl object-cover grayscale group-hover:grayscale-0 transition-all"
                    alt=""
                  />
                  <div>
                    <p className="text-sm font-black text-[#1a1a1a] uppercase">
                      {order.foods?.name}
                    </p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">
                      {order.applicant_email}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-[#E65100]">
                    ${order.price_usd}
                  </p>
                  <p className="text-[9px] font-bold text-gray-300 uppercase tracking-tighter">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Boutique is Thriving Section */}
        <div className="bg-[#E65100] p-10 rounded-[3.5rem] text-white flex flex-col justify-between shadow-2xl">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
            <TrendingUp size={32} />
          </div>
          <div>
            <h4 className="text-4xl font-black italic tracking-tighter leading-none mb-4">
              Boutique is Thriving.
            </h4>
            <p className="text-orange-100 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
              System sync is active. All gourmet treasures are currently
              reflecting live boutique status.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, trend, color }) => (
  <motion.div
    whileHover={{ y: -10 }}
    className="bg-white p-8 rounded-[3rem] shadow-sm border border-black/5 flex flex-col gap-6 relative group overflow-hidden"
  >
    <div className="flex justify-between items-start">
      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner ${color}`}
      >
        {React.cloneElement(icon, { size: 24 })}
      </div>
      <div className="flex items-center gap-1 text-[10px] font-black text-green-500 bg-green-50 px-3 py-1 rounded-full">
        <ArrowUpRight size={12} /> {trend}
      </div>
    </div>
    <div>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">
        {title}
      </p>
      <h3 className="text-4xl font-black text-[#1a1a1a] tracking-tighter leading-none">
        {value}
      </h3>
    </div>
    <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
      {React.cloneElement(icon, { size: 100 })}
    </div>
  </motion.div>
);

export default AdminHome;
