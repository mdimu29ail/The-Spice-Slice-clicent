import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../supabase/supabaseClient';
import { AuthContext } from '../../Auth/AuthContext';
import Swal from 'sweetalert2';
import {
  Plus,
  Image as ImageIcon,
  DollarSign,
  Utensils,
  Flame,
  Diamond,
  Star,
  Type,
  Hash,
  ArrowRight,
  Sparkles,
  Clock,
  Check,
  Zap,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// --- ক্যাটাগরি লিস্ট ---
const categories = [
  { id: 'Pizza', name: 'Pizza', icon: '🍕' },
  { id: 'Biryani', name: 'Biryani', icon: '🍛' },
  { id: 'Burger', name: 'Burger', icon: '🍔' },
  { id: 'Drinks', name: 'Drinks', icon: '🍹' },
];

const AddFoods = () => {
  const { user, isAdmin } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [previewUrl, setPreviewUrl] = useState(''); // লাইভ প্রিভিউ স্টেট
  const navigate = useNavigate();

  const handleAddFood = async e => {
    e.preventDefault();

    if (!selectedCategory) {
      return Swal.fire({
        title: 'Wait!',
        text: 'Please select a boutique category first.',
        icon: 'warning',
        confirmButtonColor: '#1a1a1a',
      });
    }

    setLoading(true);
    const form = e.target;

    // অ্যাডমিন হলে সরাসরি Live, ইউজার হলে Pending
    const autoApprove = isAdmin ? true : false;

    const foodData = {
      name: form.name.value,
      category: selectedCategory,
      image_url: form.image_url.value,
      price_usd: parseFloat(form.price.value),
      old_price_usd: parseFloat(form.old_price.value) || null,
      description: form.description.value,
      quantity: parseInt(form.quantity.value),
      is_signature: form.is_signature.checked,
      is_premium: form.is_premium.checked,
      is_spicy: form.is_spicy.checked,
      is_approved: autoApprove,
      created_by_email: user?.email,
      purchase_count: 0,
      created_at: new Date().toISOString(),
    };

    try {
      const { error } = await supabase.from('foods').insert([foodData]);
      if (error) throw error;

      await Swal.fire({
        title: isAdmin ? 'Masterpiece Live!' : 'Submission Received!',
        text: isAdmin
          ? 'The delicacy is now showcased in the boutique.'
          : 'Your masterpiece is sent for artisanal review.',
        icon: 'success',
        confirmButtonColor: '#1a1a1a',
        background: '#fcf9f5',
        customClass: {
          popup: 'rounded-[3rem] shadow-2xl border border-black/5',
        },
      });

      form.reset();
      navigate('/dashboard/myFoods');
    } catch (error) {
      Swal.fire({
        title: 'Boutique Error',
        text: error.message,
        icon: 'error',
        confirmButtonColor: '#E65100',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcf9f5] pt-32 pb-20 px-6 lg:px-12 font-sans selection:bg-orange-100">
      <header className="mb-12 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 text-[#E65100] mb-4"
        >
          {isAdmin ? <Sparkles size={18} /> : <Clock size={18} />}
          <span className="text-[10px] font-black uppercase tracking-[0.5em]">
            {isAdmin ? 'Executive Curator Mode' : 'Patron Contribution'}
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl lg:text-7xl font-black text-[#1a1a1a] tracking-tighter uppercase italic leading-none"
        >
          Curate <span className="text-[#E65100] not-italic">Delicacy.</span>
        </motion.h2>
      </header>

      <form
        onSubmit={handleAddFood}
        className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12"
      >
        {/* --- LEFT COLUMN: CORE INFO --- */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-7 space-y-10"
        >
          {/* ক্যাটাগরি সিলেকশন গ্রিড */}
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">
              Select Delicacy Genre
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`relative p-6 rounded-[2rem] border-2 transition-all duration-500 flex flex-col items-center gap-3 group ${
                    selectedCategory === cat.id
                      ? 'border-[#E65100] bg-white shadow-xl scale-105'
                      : 'border-black/5 bg-white/50 hover:border-black/10'
                  }`}
                >
                  <span className="text-3xl group-hover:scale-110 transition-transform">
                    {cat.icon}
                  </span>
                  <span
                    className={`text-[10px] font-black uppercase tracking-widest ${selectedCategory === cat.id ? 'text-[#1a1a1a]' : 'text-gray-400'}`}
                  >
                    {cat.name}
                  </span>
                  {selectedCategory === cat.id && (
                    <motion.div
                      layoutId="check"
                      className="absolute top-3 right-3 bg-[#E65100] text-white p-1 rounded-full"
                    >
                      <Check size={10} />
                    </motion.div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white p-10 lg:p-14 rounded-[4rem] shadow-sm border border-black/5 space-y-8">
            <InputField
              label="Name of Delicacy"
              name="name"
              icon={<Type size={18} />}
              placeholder="e.g. Fire Blast Pizza"
            />

            <div className="grid grid-cols-2 gap-8">
              <InputField
                label="Available Stock"
                name="quantity"
                type="number"
                icon={<Hash size={18} />}
                placeholder="10"
              />
              <InputField
                label="Boutique Price ($)"
                name="price"
                type="number"
                icon={<DollarSign size={18} />}
                placeholder="24.99"
              />
            </div>

            <InputField
              label="Visual Identity URL"
              name="image_url"
              icon={<ImageIcon size={18} />}
              placeholder="https://..."
              onChange={e => setPreviewUrl(e.target.value)}
            />

            <InputField
              label="Original Price (Optional)"
              name="old_price"
              type="number"
              icon={<DollarSign size={18} />}
              placeholder="e.g. 29.99"
            />
          </div>
        </motion.div>

        {/* --- RIGHT COLUMN: ATTRIBUTES & PREVIEW --- */}
        <div className="lg:col-span-5 space-y-8">
          {/* Live Preview Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#1a1a1a] p-8 rounded-[3.5rem] shadow-2xl text-white overflow-hidden relative group"
          >
            <div className="flex items-center justify-between mb-6">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 italic">
                Live Visual Identity
              </p>
              <Zap size={14} className="text-[#E65100] animate-pulse" />
            </div>
            <div className="aspect-video w-full rounded-[2rem] overflow-hidden mb-6 border border-white/10 shadow-2xl bg-white/5 flex items-center justify-center">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                <ImageIcon size={48} className="text-white/10" />
              )}
            </div>
            <h4 className="text-xl font-black tracking-tighter uppercase leading-none truncate">
              {selectedCategory || 'Masterpiece'} Preview
            </h4>
            <div className="absolute -right-6 -bottom-6 opacity-5 rotate-12 text-8xl font-black italic">
              HOT
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-black/5 space-y-8"
          >
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 block mb-6 italic">
                Signature Tags
              </label>
              <div className="space-y-4">
                <TagCheckbox
                  name="is_signature"
                  label="🔥 Signature"
                  icon={<Star className="text-yellow-500" size={14} />}
                />
                <TagCheckbox
                  name="is_premium"
                  label="💎 Premium"
                  icon={<Diamond className="text-blue-400" size={14} />}
                />
                <TagCheckbox
                  name="is_spicy"
                  label="🌶️ Spicy Heat"
                  icon={<Flame className="text-red-500" size={14} />}
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 block ml-4">
                The Story
              </label>
              <textarea
                name="description"
                required
                rows="4"
                className="w-full bg-[#fcf9f5] rounded-[2rem] p-6 text-sm font-bold italic outline-none focus:ring-2 focus:ring-orange-100 transition-all border border-transparent text-[#1a1a1a]"
                placeholder="Describe the artisanal flavors..."
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="w-full bg-[#1a1a1a] text-white py-6 rounded-full font-black uppercase text-[10px] tracking-[0.4em] flex items-center justify-center gap-3 shadow-xl hover:bg-[#E65100] transition-all disabled:opacity-50"
            >
              {loading
                ? 'Authenticating...'
                : isAdmin
                  ? 'Launch Masterpiece'
                  : 'Request Review'}
              <ArrowRight size={18} />
            </motion.button>
          </motion.div>
        </div>
      </form>
    </div>
  );
};

// --- Helper Components ---
const InputField = ({
  label,
  name,
  type = 'text',
  icon,
  placeholder,
  onChange,
}) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">
      {label}
    </label>
    <div className="relative group">
      <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#E65100] transition-colors">
        {icon}
      </div>
      <input
        type={type}
        name={name}
        required={name !== 'old_price'}
        step="0.01"
        placeholder={placeholder}
        onChange={onChange}
        className="w-full pl-14 pr-6 py-5 bg-[#fcf9f5] border border-transparent focus:border-[#E65100]/20 rounded-full text-sm font-bold transition-all outline-none shadow-inner text-[#1a1a1a] placeholder:text-gray-300"
      />
    </div>
  </div>
);

const TagCheckbox = ({ name, label, icon }) => (
  <label className="flex items-center justify-between p-5 bg-[#fcf9f5] border border-black/5 rounded-2xl cursor-pointer hover:bg-orange-50 transition-all group">
    <div className="flex items-center gap-3">
      {icon}
      <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-[#1a1a1a] transition-colors">
        {label}
      </span>
    </div>
    <input
      type="checkbox"
      name={name}
      className="w-5 h-5 accent-[#E65100] cursor-pointer"
    />
  </label>
);

export default AddFoods;
