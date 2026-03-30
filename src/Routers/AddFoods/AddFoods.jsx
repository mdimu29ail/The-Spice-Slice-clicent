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
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const categories = [
  { id: 'Pizza', name: 'Pizza', icon: '🍕' },
  { id: 'Biryani', name: 'Biryani', icon: '🍛' },
  { id: 'Burger', name: 'Burger', icon: '🍔' },
  { id: 'Drinks', name: 'Drinks', icon: '🍹' },
];

const AddFoods = () => {
  const { user, isAdmin } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(''); // ক্যাটাগরি স্টেট
  const navigate = useNavigate();

  const handleAddFood = async e => {
    e.preventDefault();

    if (!selectedCategory) {
      return Swal.fire({
        title: 'Wait!',
        text: 'Please select a category first.',
        icon: 'warning',
      });
    }

    setLoading(true);
    const form = e.target;
    const autoApprove = isAdmin ? true : false;

    const foodData = {
      name: form.name.value,
      category: selectedCategory, // স্টেট থেকে ক্যাটাগরি নেওয়া হচ্ছে
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
    };

    try {
      const { error } = await supabase.from('foods').insert([foodData]);
      if (error) throw error;

      await Swal.fire({
        title: isAdmin ? 'Masterpiece Live!' : 'Submission Received!',
        text: isAdmin
          ? 'The delicacy is now live in the boutique.'
          : 'Your masterpiece is sent for review.',
        icon: 'success',
        confirmButtonColor: '#1a1a1a',
        background: '#fcf9f5',
        customClass: { popup: 'rounded-[3rem] shadow-2xl' },
      });

      form.reset();
      navigate('/dashboard/myFoods');
    } catch (error) {
      Swal.fire('Error', error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcf9f5] pt-32 pb-20 px-6 lg:px-12 font-sans selection:bg-orange-100">
      <header className="mb-12 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 text-[#E65100] mb-4"
        >
          {isAdmin ? <Sparkles size={18} /> : <Clock size={18} />}
          <span className="text-[10px] font-black uppercase tracking-[0.5em]">
            {isAdmin ? 'Executive Curator' : 'Patron Submission'}
          </span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl lg:text-7xl font-black text-[#1a1a1a] tracking-tighter uppercase italic leading-none"
        >
          New <span className="text-[#E65100] not-italic">Delicacy.</span>
        </motion.h2>
      </header>

      <form
        onSubmit={handleAddFood}
        className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12"
      >
        {/* --- LEFT SIDE: CORE INFO --- */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-7 space-y-10"
        >
          {/* ক্যাটাগরি সিলেকশন */}
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">
              Select Masterpiece Category
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`relative p-6 rounded-[2rem] border-2 transition-all duration-300 flex flex-col items-center gap-3 group ${
                    selectedCategory === cat.id
                      ? 'border-[#E65100] bg-white shadow-xl scale-105'
                      : 'border-black/5 bg-white/50 hover:border-black/10'
                  }`}
                >
                  <span className="text-3xl">{cat.icon}</span>
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

          <div className="bg-white p-10 lg:p-12 rounded-[4rem] shadow-sm border border-black/5 space-y-8">
            <InputField
              label="Name of Delicacy"
              name="name"
              icon={<Type size={18} />}
              placeholder="e.g. Fire Blast Pizza"
            />

            <div className="grid grid-cols-2 gap-6">
              <InputField
                label="Available Quantity"
                name="quantity"
                type="number"
                icon={<Hash size={18} />}
                placeholder="10"
              />
              <InputField
                label="Masterpiece Price ($)"
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
            />
            <InputField
              label="Boutique Old Price ($)"
              name="old_price"
              type="number"
              icon={<DollarSign size={18} />}
              placeholder="Optional"
            />
          </div>
        </motion.div>

        {/* --- RIGHT SIDE: ATTRIBUTES & SUBMIT --- */}
        <div className="lg:col-span-5 space-y-8">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-[#1a1a1a] p-10 rounded-[3.5rem] shadow-2xl text-white space-y-8"
          >
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 block mb-6 italic">
                Signature Tags
              </label>
              <div className="space-y-3">
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
                  icon={<Flame size={14} className="text-red-500" size={14} />}
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 block">
                The Story
              </label>
              <textarea
                name="description"
                required
                rows="4"
                className="w-full bg-white/5 border border-white/10 rounded-[2rem] p-6 text-sm outline-none focus:border-[#E65100]/50 transition-all font-medium italic text-gray-200"
                placeholder="Describe the artisanal flavors..."
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="w-full bg-[#E65100] text-white py-6 rounded-full font-black uppercase text-[10px] tracking-[0.4em] flex items-center justify-center gap-3 shadow-xl hover:bg-orange-600 transition-all disabled:opacity-50"
            >
              {loading
                ? 'Authenticating...'
                : isAdmin
                  ? 'Launch Live'
                  : 'Request Review'}
              <ArrowRight size={18} />
            </motion.button>
          </motion.div>

          <div className="p-8 bg-white border border-black/5 rounded-[2.5rem] flex gap-4">
            <div className="w-10 h-10 bg-orange-50 rounded-2xl flex items-center justify-center shrink-0">
              <Sparkles size={18} className="text-[#E65100]" />
            </div>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
              All submissions go through our boutique verification process to
              ensure heritage quality.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

// --- Sub-Components ---
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
        className="w-full pl-14 pr-6 py-5 bg-[#fcf9f5] border border-transparent focus:border-[#E65100]/20 rounded-full text-sm font-bold transition-all outline-none shadow-inner text-[#1a1a1a]"
      />
    </div>
  </div>
);

const TagCheckbox = ({ name, label, icon }) => (
  <label className="flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded-2xl cursor-pointer hover:bg-white/10 transition-all group">
    <div className="flex items-center gap-3">
      {icon}
      <span className="text-[10px] font-black uppercase tracking-widest text-gray-300 group-hover:text-white transition-colors">
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
