import React, { useContext, useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async'; // SEO এর জন্য
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
  ShoppingBag,
  TrendingUp,
  RefreshCcw,
  Target,
  Zap,
  Clock,
  ChevronRight,
  Activity,
  Award,
} from 'lucide-react';
import { AuthContext } from '../Auth/AuthContext';
import { supabase } from '../supabase/supabaseClient';
import Loading from '../Loading/Loading';

// --- CHART DATA (Performance: Memoized outside or inside) ---
const chartData = [
  { name: 'Mon', sales: 4000 },
  { name: 'Tue', sales: 3000 },
  { name: 'Wed', sales: 5500 },
  { name: 'Thu', sales: 4500 },
  { name: 'Fri', sales: 8000 },
  { name: 'Sat', sales: 6500 },
  { name: 'Sun', sales: 5000 },
];

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [userStats, setUserStats] = useState({
    orders: 0,
    spent: 0,
    pending: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.email) return;
      setLoading(true);
      try {
        const { data: orders, error } = await supabase
          .from('applications')
          .select('price_usd, status')
          .eq('applicant_email', user.email);

        if (error) throw error;

        if (orders) {
          const total = orders.reduce(
            (acc, curr) => acc + (Number(curr.price_usd) || 0),
            0,
          );
          const pending = orders.filter(o => o.status === 'pending').length;
          setUserStats({
            orders: orders.length,
            spent: total.toFixed(2),
            pending,
          });
        }
      } catch (err) {
        console.error('Dashboard data fetch error:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [user?.email]);

  // Performance: স্ট্যাটাস কার্ডের ডাটা মেমোইজ করা হয়েছে
  const statsGrid = useMemo(
    () => [
      {
        id: 1,
        icon: <ShoppingBag color="#E65100" aria-hidden="true" />,
        label: 'Total Orders',
        value: userStats.orders,
        sub: 'Lifetime',
      },
      {
        id: 2,
        icon: <Clock color="#3b82f6" aria-hidden="true" />,
        label: 'Pending',
        value: userStats.pending,
        sub: 'In Kitchen',
      },
      {
        id: 3,
        icon: <TrendingUp color="#10b981" aria-hidden="true" />,
        label: 'Growth',
        value: '12.4%',
        sub: 'Monthly',
      },
      {
        id: 4,
        icon: <RefreshCcw color="#ef4444" aria-hidden="true" />,
        label: 'Returns',
        value: '00',
        sub: 'Rejections',
      },
      {
        id: 5,
        icon: <Award color="#f59e0b" aria-hidden="true" />,
        label: 'Points',
        value: '2,450',
        sub: 'Loyalty',
      },
      {
        id: 6,
        icon: <Zap color="#8b5cf6" aria-hidden="true" />,
        label: 'Activity',
        value: 'High',
        sub: 'Patron Level',
      },
    ],
    [userStats],
  );

  if (loading) return <Loading />;

  return (
    <main className="space-y-8 pb-20 font-sans selection:bg-orange-100">
      {/* SEO: Page Metadata */}
      <Helmet>
        <title>Patron Insights | The Spice Slice Dashboard</title>
        <meta
          name="description"
          content="View your real-time acquisition metrics, portfolio value, and order status at The Spice Slice Boutique."
        />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* --- 1. EXECUTIVE HEADER --- */}
      <header className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 mb-2"
          >
            <div className="px-3 py-1 rounded-full bg-[#1a1a1a] text-white text-[8px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
              <Activity
                size={10}
                className="text-[#E65100]"
                aria-hidden="true"
              />
              <span>Live Activity Hub</span>
            </div>
          </motion.div>
          <h1 className="text-4xl lg:text-5xl font-black text-[#1a1a1a] tracking-tighter uppercase italic leading-none">
            Patron <span className="text-[#E65100] not-italic">Insights.</span>
          </h1>
          <p className="text-gray-400 font-bold uppercase tracking-[0.3em] text-[9px] mt-3">
            Real-time acquisition & performance metrics
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-black/5 shadow-sm">
          <div className="px-4 py-2">
            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">
              Status
            </p>
            <p className="text-xs font-black text-green-500 uppercase">
              Active Session
            </p>
          </div>
          <div className="w-[1px] h-8 bg-black/5" aria-hidden="true" />
          <button
            type="button"
            className="p-3 hover:bg-[#fcf9f5] rounded-xl transition-all text-[#1a1a1a]"
            aria-label="Refresh session"
          >
            <Zap size={18} fill="currentColor" aria-hidden="true" />
          </button>
        </div>
      </header>

      {/* --- 2. TOP PERFORMANCE BANNER --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.section
          whileHover={{ y: -5 }}
          className="lg:col-span-2 bg-[#1a1a1a] rounded-[3.5rem] p-10 text-white relative overflow-hidden flex flex-col justify-between min-h-[280px]"
          aria-labelledby="portfolio-value-title"
        >
          <div className="relative z-10">
            <h2
              id="portfolio-value-title"
              className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-500 mb-2"
            >
              Net Portfolio Value
            </h2>
            <p
              className="text-7xl font-black tracking-tighter italic"
              aria-label={`Total spent: ${userStats.spent} dollars`}
            >
              ${userStats.spent}
            </p>
          </div>
          <div className="relative z-10 flex items-center gap-8">
            <div>
              <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                Total Acquisitions
              </p>
              <p className="text-2xl font-black text-[#E65100]">
                {userStats.orders}
              </p>
            </div>
            <div className="w-[1px] h-10 bg-white/10" aria-hidden="true" />
            <div>
              <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                Boutique Tier
              </p>
              <p className="text-2xl font-black text-white italic">
                Gold Patron
              </p>
            </div>
          </div>
          <Award
            size={200}
            className="absolute -right-10 -bottom-10 text-white/[0.03] rotate-12"
            aria-hidden="true"
          />
        </motion.section>

        <motion.section
          whileHover={{ y: -5 }}
          className="bg-[#E65100] rounded-[3.5rem] p-10 text-white flex flex-col justify-between shadow-2xl shadow-orange-900/20"
          aria-labelledby="success-rate-title"
        >
          <div>
            <div className="flex justify-between items-start">
              <h2
                id="success-rate-title"
                className="text-[10px] font-black uppercase tracking-[0.5em] text-orange-200"
              >
                Success Rate
              </h2>
              <Target size={20} aria-hidden="true" />
            </div>
            <p className="text-6xl font-black tracking-tighter mt-4 italic">
              98.2%
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
              <span>Reliability</span>
              <span>Optimal</span>
            </div>
            <div
              className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden"
              role="progressbar"
              aria-valuenow="98"
              aria-valuemin="0"
              aria-valuemax="100"
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '98%' }}
                className="h-full bg-white"
              />
            </div>
          </div>
        </motion.section>
      </div>

      {/* --- 3. DETAILED METRICS GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <section
          className="lg:col-span-8 bg-white p-10 rounded-[3.5rem] shadow-sm border border-black/5 grid grid-cols-2 md:grid-cols-3 gap-y-12 gap-x-4 relative"
          aria-label="Detailed boutique metrics"
        >
          {statsGrid.map(stat => (
            <StatMini key={stat.id} {...stat} />
          ))}
          <div
            className="col-span-full h-[1px] bg-black/5"
            aria-hidden="true"
          />
        </section>

        {/* --- QUICK ACTION CARD --- */}
        <aside className="lg:col-span-4">
          <div className="bg-white p-8 rounded-[3rem] border border-black/5 shadow-sm h-full flex flex-col justify-between group">
            <div>
              <h3 className="text-lg font-black uppercase tracking-tighter italic mb-2">
                Next Masterpiece?
              </h3>
              <p className="text-xs text-gray-400 font-medium leading-relaxed">
                Your flavor profile suggests you might enjoy our new{' '}
                <span className="text-[#E65100]">Naga Fusion</span> collection.
              </p>
            </div>
            <button
              type="button"
              className="mt-8 w-full py-4 bg-[#fcf9f5] hover:bg-[#1a1a1a] hover:text-white text-[#1a1a1a] rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 border border-black/5"
              aria-label="Explore our full menu"
            >
              Explore Menu <ChevronRight size={14} aria-hidden="true" />
            </button>
          </div>
        </aside>
      </div>

      {/* --- 4. VISUAL ANALYTICS (CHART) --- */}
      <section
        className="bg-white p-10 lg:p-14 rounded-[4rem] shadow-sm border border-black/5"
        aria-labelledby="chart-title"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <h2
              id="chart-title"
              className="text-2xl font-black text-[#1a1a1a] tracking-tighter uppercase italic"
            >
              Acquisition Trajectory.
            </h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
              Weekly flavor investment patterns
            </p>
          </div>
          <div className="text-right">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">
              Portfolio Value
            </p>
            <p className="text-4xl font-black text-[#1a1a1a] tracking-tighter">
              ${userStats.spent}
            </p>
          </div>
        </div>

        <div
          className="h-[350px] w-full"
          role="img"
          aria-label="Area chart showing weekly acquisition trajectory"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E65100" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#E65100" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f5f5f5"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 'bold' }}
                dy={15}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: '20px',
                  border: 'none',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                }}
                itemStyle={{
                  color: '#E65100',
                  fontWeight: '900',
                  fontSize: '12px',
                  textTransform: 'uppercase',
                }}
              />
              <Area
                type="monotone"
                dataKey="sales"
                stroke="#E65100"
                strokeWidth={5}
                fillOpacity={1}
                fill="url(#colorSales)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>
    </main>
  );
};

// --- SUB-COMPONENT: MINI STAT (Optimized) ---
const StatMini = ({ icon, label, value, sub }) => (
  <div className="flex flex-col items-center text-center group cursor-default">
    <div className="w-16 h-16 bg-[#fcf9f5] rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500 shadow-inner border border-black/5">
      {icon}
    </div>
    <p className="text-xl font-black text-[#1a1a1a] tracking-tighter leading-none">
      {value}
    </p>
    <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mt-2">
      {label}
    </p>
    <p className="text-[7px] font-black uppercase text-[#E65100] mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
      {sub}
    </p>
  </div>
);

export default Dashboard;
