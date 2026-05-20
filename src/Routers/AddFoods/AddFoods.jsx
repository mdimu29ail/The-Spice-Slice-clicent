import React, { useState, useContext, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async'; // SEO এর জন্য
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

// --- ক্যাটাগরি লিস্ট (Memoized for performance) ---
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
  const [previewUrl, setPreviewUrl] = useState('');
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
    <main className="min-h-screen bg-[#fcf9f5] pt-32 pb-20 px-6 lg:px-12 font-sans selection:bg-orange-100">
      {/* SEO: Page Metadata */}
      <Helmet>
        <title>Curate Delicacy | The Spice Slice Boutique</title>
        <meta
          name="description"
          content="Add a new artisanal masterpiece to The Spice Slice collection. Curate your signature dishes with premium spices."
        />
      </Helmet>

      <header className="mb-12 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 text-[#E65100] mb-4"
        >
          {isAdmin ? (
            <Sparkles size={18} aria-hidden="true" />
          ) : (
            <Clock size={18} aria-hidden="true" />
          )}
          <span className="text-[10px] font-black uppercase tracking-[0.5em]">
            {isAdmin ? 'Executive Curator Mode' : 'Patron Contribution'}
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl lg:text-7xl font-black text-[#1a1a1a] tracking-tighter uppercase italic leading-none"
        >
          Curate <span className="text-[#E65100] not-italic">Delicacy.</span>
        </motion.h1>
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
          <section className="space-y-4">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">
              Select Delicacy Genre
            </h2>
            <div
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
              role="radiogroup"
              aria-label="Select food category"
            >
              {categories.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  aria-checked={selectedCategory === cat.id}
                  role="radio"
                  aria-label={`Select ${cat.name} category`}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`relative p-6 rounded-[2rem] border-2 transition-all duration-500 flex flex-col items-center gap-3 group ${
                    selectedCategory === cat.id
                      ? 'border-[#E65100] bg-white shadow-xl scale-105'
                      : 'border-black/5 bg-white/50 hover:border-black/10'
                  }`}
                >
                  <span
                    className="text-3xl group-hover:scale-110 transition-transform"
                    aria-hidden="true"
                  >
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
                      <Check size={10} aria-hidden="true" />
                    </motion.div>
                  )}
                </button>
              ))}
            </div>
          </section>

          <div className="bg-white p-10 lg:p-14 rounded-[4rem] shadow-sm border border-black/5 space-y-8">
            <InputField
              id="food-name"
              label="Name of Delicacy"
              name="name"
              icon={<Type size={18} aria-hidden="true" />}
              placeholder="e.g. Fire Blast Pizza"
            />

            <div className="grid grid-cols-2 gap-8">
              <InputField
                id="food-quantity"
                label="Available Stock"
                name="quantity"
                type="number"
                icon={<Hash size={18} aria-hidden="true" />}
                placeholder="10"
              />
              <InputField
                id="food-price"
                label="Boutique Price ($)"
                name="price"
                type="number"
                icon={<DollarSign size={18} aria-hidden="true" />}
                placeholder="24.99"
              />
            </div>

            <InputField
              id="food-image"
              label="Visual Identity URL"
              name="image_url"
              icon={<ImageIcon size={18} aria-hidden="true" />}
              placeholder="https://..."
              onChange={e => setPreviewUrl(e.target.value)}
            />

            <InputField
              id="food-old-price"
              label="Original Price (Optional)"
              name="old_price"
              type="number"
              icon={<DollarSign size={18} aria-hidden="true" />}
              placeholder="e.g. 29.99"
            />
          </div>
        </motion.div>

        {/* --- RIGHT COLUMN: ATTRIBUTES & PREVIEW --- */}
        <div className="lg:col-span-5 space-y-8">
          {/* Live Preview Card */}
          <motion.section
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#1a1a1a] p-8 rounded-[3.5rem] shadow-2xl text-white overflow-hidden relative group"
            aria-label="Live visual preview"
          >
            <div className="flex items-center justify-between mb-6">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 italic">
                Live Visual Identity
              </p>
              <Zap
                size={14}
                className="text-[#E65100] animate-pulse"
                aria-hidden="true"
              />
            </div>
            <div className="aspect-video w-full rounded-[2rem] overflow-hidden mb-6 border border-white/10 shadow-2xl bg-white/5 flex items-center justify-center">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Live preview of the delicacy being added"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <ImageIcon
                  size={48}
                  className="text-white/10"
                  aria-hidden="true"
                />
              )}
            </div>
            <h3 className="text-xl font-black tracking-tighter uppercase leading-none truncate">
              {selectedCategory || 'Masterpiece'} Preview
            </h3>
            <div
              className="absolute -right-6 -bottom-6 opacity-5 rotate-12 text-8xl font-black italic"
              aria-hidden="true"
            >
              HOT
            </div>
          </motion.section>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-black/5 space-y-8"
          >
            <fieldset>
              <legend className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 block mb-6 italic">
                Signature Tags
              </legend>
              <div className="space-y-4">
                <TagCheckbox
                  id="is_signature"
                  name="is_signature"
                  label="🔥 Signature"
                  icon={
                    <Star
                      className="text-yellow-500"
                      size={14}
                      aria-hidden="true"
                    />
                  }
                />
                <TagCheckbox
                  id="is_premium"
                  name="is_premium"
                  label="💎 Premium"
                  icon={
                    <Diamond
                      className="text-blue-400"
                      size={14}
                      aria-hidden="true"
                    />
                  }
                />
                <TagCheckbox
                  id="is_spicy"
                  name="is_spicy"
                  label="🌶️ Spicy Heat"
                  icon={
                    <Flame
                      className="text-red-500"
                      size={14}
                      aria-hidden="true"
                    />
                  }
                />
              </div>
            </fieldset>

            <div className="space-y-3">
              <label
                htmlFor="food-description"
                className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 block ml-4"
              >
                The Story
              </label>
              <textarea
                id="food-description"
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
              type="submit"
              className="w-full bg-[#1a1a1a] text-white py-6 rounded-full font-black uppercase text-[10px] tracking-[0.4em] flex items-center justify-center gap-3 shadow-xl hover:bg-[#E65100] transition-all disabled:opacity-50"
              aria-label={
                loading
                  ? 'Processing submission'
                  : isAdmin
                    ? 'Launch masterpiece to boutique'
                    : 'Request artisanal review'
              }
            >
              {loading
                ? 'Authenticating...'
                : isAdmin
                  ? 'Launch Masterpiece'
                  : 'Request Review'}
              <ArrowRight size={18} aria-hidden="true" />
            </motion.button>
          </motion.div>
        </div>
      </form>
    </main>
  );
};

// --- Helper Components ---
const InputField = ({
  id,
  label,
  name,
  type = 'text',
  icon,
  placeholder,
  onChange,
}) => (
  <div className="space-y-2">
    <label
      htmlFor={id}
      className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4"
    >
      {label}
    </label>
    <div className="relative group">
      <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#E65100] transition-colors">
        {icon}
      </div>
      <input
        id={id}
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

const TagCheckbox = ({ id, name, label, icon }) => (
  <label
    htmlFor={id}
    className="flex items-center justify-between p-5 bg-[#fcf9f5] border border-black/5 rounded-2xl cursor-pointer hover:bg-orange-50 transition-all group"
  >
    <div className="flex items-center gap-3">
      {icon}
      <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-[#1a1a1a] transition-colors">
        {label}
      </span>
    </div>
    <input
      id={id}
      type="checkbox"
      name={name}
      className="w-5 h-5 accent-[#E65100] cursor-pointer"
    />
  </label>
);

export default AddFoods;
