import React, { useContext, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  Mail,
  Phone,
  MapPin,
  LogOut,
  ShieldCheck,
  Sparkles,
  Zap,
  Camera,
  Edit3,
  ShoppingBag,
  Award,
  Save,
  X,
  CheckCircle2,
  Clock,
  Fingerprint,
  Star,
  Loader2,
  Globe,
  ArrowUpRight,
} from 'lucide-react';
import { AuthContext } from '../Auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase/supabaseClient';
import Swal from 'sweetalert2';
import Loading from '../Loading/Loading';

const ProfileCard = () => {
  const { user, logOut, isAdmin } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({ orders: 0, spent: 0, points: 0 });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false); // আপলোড স্টেট
  const [editData, setEditData] = useState({});
  const navigate = useNavigate();

  // --- ১. ডাটা ফেচিং ---
  const fetchPatronData = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      const { data: orderData } = await supabase
        .from('applications')
        .select('price_usd')
        .eq('applicant_email', user.email);

      if (profileData) {
        setProfile(profileData);
        setEditData(profileData);
      }
      if (orderData) {
        const total = orderData.reduce(
          (acc, curr) => acc + (Number(curr.price_usd) || 0),
          0,
        );
        setStats({
          orders: orderData.length,
          spent: total.toFixed(2),
          points: Math.floor(total * 10),
        });
      }
    } catch (err) {
      console.error('Vault Access Error:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchPatronData();
  }, [fetchPatronData]);

  // --- ২. ইমেজ আপলোড লজিক (Supabase Storage) ---
  const handleAvatarUpload = async e => {
    const file = e.target.files[0];
    if (!file) return;

    // ফাইল সাইজ চেক (Max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      return Swal.fire(
        'File too large',
        'Please select an image under 2MB.',
        'warning',
      );
    }

    setIsUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    try {
      // ১. স্টোরেজে আপলোড
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // ২. পাবলিক ইউআরএল গেট করা
      const {
        data: { publicUrl },
      } = supabase.storage.from('avatars').getPublicUrl(filePath);

      // ৩. প্রোফাইল টেবিল আপডেট
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      // ৪. লোকাল স্টেট আপডেট
      setProfile({ ...profile, avatar_url: publicUrl });
      setEditData({ ...editData, avatar_url: publicUrl });

      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Portrait Synchronized',
        showConfirmButton: false,
        timer: 2000,
        background: '#1a1a1a',
        color: '#fff',
      });
    } catch (err) {
      Swal.fire('Upload Failed', err.message, 'error');
    } finally {
      setIsUploading(false);
    }
  };

  // --- ৩. প্রোফাইল টেক্সট আপডেট ---
  const handleUpdate = async e => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: editData.full_name,
          phone: editData.phone,
          address: editData.address,
          bio: editData.bio,
          updated_at: new Date(),
        })
        .eq('id', user.id);

      if (error) throw error;

      setProfile(editData);
      setIsEditing(false);
      Swal.fire({
        title: 'IDENTITY REFINED',
        icon: 'success',
        background: '#fcf9f5',
        confirmButtonColor: '#1a1a1a',
      });
    } catch (err) {
      Swal.fire('Update Failed', err.message, 'error');
    }
  };

  const handleSignOut = async () => {
    const result = await Swal.fire({
      title: 'Terminate Session?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1a1a1a',
      confirmButtonText: 'Logout',
    });
    if (result.isConfirmed) {
      await logOut();
      navigate('/login');
    }
  };

  if (loading && !profile) return <Loading />;

  return (
    <main className="space-y-10 pb-20 relative font-sans selection:bg-orange-100">
      <Helmet>
        <title>Patron Identity | The Spice Slice</title>
      </Helmet>

      {/* --- 1. TOP IDENTITY CARD --- */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[4rem] p-8 lg:p-16 shadow-sm border border-black/5 relative overflow-hidden"
      >
        <div className="flex flex-col lg:flex-row items-center gap-12 relative z-10">
          {/* Avatar Section with Upload */}
          <div className="relative group">
            <div className="w-48 h-48 rounded-[4.5rem] border-[12px] border-[#fcf9f5] shadow-2xl overflow-hidden relative bg-gray-100">
              <img
                src={
                  profile?.avatar_url ||
                  `https://api.dicebear.com/7.x/initials/svg?seed=${profile?.full_name}`
                }
                alt="Patron Identity"
                className={`w-full h-full object-cover transition-all duration-700 ${isUploading ? 'opacity-40 blur-sm' : 'group-hover:scale-110'}`}
              />
              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="animate-spin text-[#E65100]" size={32} />
                </div>
              )}
            </div>

            {/* Camera Button (Hidden Input) */}
            <label className="absolute bottom-2 right-2 p-4 bg-[#1a1a1a] text-white rounded-2xl shadow-xl hover:bg-[#E65100] transition-all cursor-pointer border-4 border-white">
              <Camera size={20} />
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleAvatarUpload}
                disabled={isUploading}
              />
            </label>
          </div>

          {/* Identity Info */}
          <div className="flex-1 text-center lg:text-left space-y-6">
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <div
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full border ${isAdmin ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-green-50 text-green-600 border-green-100'}`}
              >
                {isAdmin ? (
                  <ShieldCheck size={14} />
                ) : (
                  <Zap size={14} fill="currentColor" />
                )}
                <span className="text-[10px] font-black uppercase tracking-widest">
                  {isAdmin ? 'Executive Curator' : 'Verified Patron'}
                </span>
              </div>
            </div>

            {isEditing ? (
              <input
                type="text"
                className="text-4xl lg:text-6xl font-black text-[#1a1a1a] border-b-4 border-[#E65100] outline-none bg-transparent w-full uppercase tracking-tighter italic"
                value={editData.full_name}
                onChange={e =>
                  setEditData({ ...editData, full_name: e.target.value })
                }
              />
            ) : (
              <h2 className="text-5xl lg:text-8xl font-black text-[#1a1a1a] tracking-tighter leading-none uppercase italic">
                {profile?.full_name || 'Anonymous'}
              </h2>
            )}

            <div className="flex flex-wrap justify-center lg:justify-start gap-8 text-gray-400 font-bold uppercase text-[10px] tracking-widest">
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-[#E65100]" /> {user?.email}
              </div>
              <div className="flex items-center gap-2">
                <Globe size={16} className="text-[#E65100]" />{' '}
                {profile?.address || 'Boutique Zone'}
              </div>
            </div>
          </div>

          {/* Action Toggle */}
          <div className="shrink-0">
            {!isEditing ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setIsEditing(true)}
                className="px-10 py-6 bg-[#1a1a1a] text-white rounded-full font-black uppercase text-[10px] tracking-[0.3em] shadow-2xl hover:bg-[#E65100] flex items-center gap-3 transition-all"
              >
                Refine Identity <Edit3 size={16} />
              </motion.button>
            ) : (
              <div className="flex gap-4">
                <button
                  onClick={handleUpdate}
                  className="p-5 bg-[#1a1a1a] text-white rounded-3xl shadow-xl hover:bg-green-600 transition-all"
                >
                  <Save size={24} />
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-5 bg-white border border-black/5 text-gray-400 rounded-3xl shadow-xl hover:bg-red-50 transition-all"
                >
                  <X size={24} />
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.section>

      {/* --- ২. STATS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard
          label="Total Acquisitions"
          value={stats.orders}
          icon={<ShoppingBag />}
          color="text-orange-600"
        />
        <StatCard
          label="Portfolio Value"
          value={`$${stats.spent}`}
          icon={<Award />}
          color="text-blue-600"
        />
        <StatCard
          label="Loyalty Points"
          value={stats.points}
          icon={<Star />}
          color="text-purple-600"
        />
      </div>

      {/* --- ৩. DETAILED LEDGER --- */}
      <section className="bg-white p-10 lg:p-16 rounded-[4rem] border border-black/5 shadow-sm space-y-12">
        <h3 className="text-2xl font-black text-[#1a1a1a] uppercase tracking-tighter italic flex items-center gap-3">
          <div className="w-2 h-8 bg-[#E65100] rounded-full" /> Detailed Ledger
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
          <EditableRow
            isEditing={isEditing}
            label="Registered Mobile"
            value={editData.phone}
            icon={<Phone size={18} />}
            onChange={val => setEditData({ ...editData, phone: val })}
          />
          <EditableRow
            isEditing={isEditing}
            label="Physical Residency"
            value={editData.address}
            icon={<MapPin size={18} />}
            onChange={val => setEditData({ ...editData, address: val })}
          />
        </div>

        <div className="pt-10 border-t border-black/5">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-6">
            Artisanal Biography
          </p>
          {isEditing ? (
            <textarea
              className="w-full bg-[#fcf9f5] p-8 rounded-[3rem] outline-none focus:ring-4 focus:ring-orange-100 font-medium italic text-lg border-none shadow-inner"
              value={editData.bio}
              onChange={e => setEditData({ ...editData, bio: e.target.value })}
              rows="5"
            />
          ) : (
            <p className="text-lg font-medium text-gray-500 leading-relaxed italic uppercase tracking-wider">
              {profile?.bio ||
                'No biography has been recorded in the boutique ledger yet.'}
            </p>
          )}
        </div>
      </section>

      {/* Terminate Session */}
      <div className="flex justify-center pt-10">
        <button
          onClick={handleSignOut}
          className="group flex items-center gap-4 text-red-500/40 hover:text-red-600 transition-all font-black text-[10px] uppercase tracking-[0.5em]"
        >
          Terminate Active Session{' '}
          <LogOut
            size={16}
            className="group-hover:translate-x-2 transition-transform"
          />
        </button>
      </div>
    </main>
  );
};

// --- HELPERS ---
const StatCard = ({ label, value, icon, color }) => (
  <motion.div
    whileHover={{ y: -10 }}
    className="bg-white p-10 rounded-[3.5rem] border border-black/5 shadow-sm flex items-center justify-between group"
  >
    <div>
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
        {label}
      </p>
      <h3 className="text-4xl font-black text-[#1a1a1a] tracking-tighter italic">
        {value}
      </h3>
    </div>
    <div
      className={`w-16 h-16 rounded-3xl bg-[#fcf9f5] flex items-center justify-center ${color} group-hover:scale-110 transition-transform shadow-inner`}
    >
      {React.cloneElement(icon, { size: 28 })}
    </div>
  </motion.div>
);

const EditableRow = ({ isEditing, label, value, icon, onChange }) => (
  <div className="space-y-3 group">
    <div className="flex items-center gap-2 text-gray-300 group-focus-within:text-[#E65100] transition-colors">
      {icon}{' '}
      <span className="text-[10px] font-black uppercase tracking-widest">
        {label}
      </span>
    </div>
    {isEditing ? (
      <input
        type="text"
        className="w-full bg-[#fcf9f5] border-b-2 border-[#E65100] px-2 py-2 text-sm font-black uppercase outline-none"
        value={value || ''}
        onChange={e => onChange(e.target.value)}
      />
    ) : (
      <p className="text-sm font-black text-[#1a1a1a] uppercase tracking-tight border-b border-black/[0.03] pb-2">
        {value || 'Not Defined'}
      </p>
    )}
  </div>
);

export default ProfileCard;
