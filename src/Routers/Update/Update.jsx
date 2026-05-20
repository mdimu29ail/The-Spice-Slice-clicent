import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../supabase/supabaseClient';
import Swal from 'sweetalert2';
import Loading from '../../Loading/Loading';
import {
  ArrowLeft,
  Save,
  Image as ImageIcon,
  Utensils,
  DollarSign,
  Star,
  Type,
  Hash,
  Flame,
  Diamond,
  Sparkles,
} from 'lucide-react';

const Update = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [foodData, setFoodData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');

  // --- ১. সুপাবেস থেকে ডাটা ফেচ করা ---
  useEffect(() => {
    const fetchFood = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('foods')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        Swal.fire('Error', 'Masterpiece not found.', 'error');
        navigate('/dashboard/myFoods');
      } else {
        setFoodData(data);
        setPreviewUrl(data.image_url);
      }
      setLoading(false);
    };
    fetchFood();
  }, [id, navigate]);

  // --- ২. আপডেট লজিক ---
  const handleUpdateFoods = async e => {
    e.preventDefault();
    setUpdating(true);
    const form = e.target;

    const updatedInfo = {
      name: form.name.value,
      category: form.category.value,
      quantity: parseInt(form.quantity.value),
      image_url: form.image_url.value,
      cuisine: form.cuisine.value,
      price_usd: parseFloat(form.price_usd.value),
      rating: parseFloat(form.rating.value),
      description: form.description.value,
      is_signature: form.is_signature.checked,
      is_premium: form.is_premium.checked,
      is_spicy: form.is_spicy.checked,
      is_available: form.is_available.checked,
    };

    try {
      const { error } = await supabase
        .from('foods')
        .update(updatedInfo)
        .eq('id', id);

      if (error) throw error;

      Swal.fire({
        title: 'Masterpiece Refined',
        text: 'The boutique update is now live.',
        icon: 'success',
        confirmButtonColor: '#1a1a1a',
        background: '#fcf9f5',
        customClass: { popup: 'rounded-[3rem]' },
      });
      navigate('/admin/manage-foods');
    } catch (error) {
      Swal.fire('Update Failed', error.message, 'error');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-[#fcf9f5] pt-10 pb-20 px-6 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Navigation */}
        <Link
          to="/dashboard/myFoods"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-[#1a1a1a] mb-10 group transition-all"
        >
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span className="text-[10px] font-black uppercase tracking-[0.4em]">
            Back to Creations
          </span>
        </Link>

        <header className="mb-12">
          <div className="flex items-center gap-2 text-[#E65100] mb-4">
            <Sparkles size={18} />
            <span className="text-[10px] font-black uppercase tracking-[0.5em]">
              Curation Studio
            </span>
          </div>
          <h2 className="text-5xl lg:text-6xl font-black text-[#1a1a1a] tracking-tighter uppercase italic leading-none">
            Refine <span className="text-[#E65100] not-italic">Delicacy.</span>
          </h2>
        </header>

        <form
          onSubmit={handleUpdateFoods}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12"
        >
          {/* --- LEFT: MAIN FIELDS (7 Columns) --- */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-7 bg-white p-10 lg:p-14 rounded-[4rem] shadow-sm border border-black/5 space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <BoutiqueInput
                label="Delicacy Name"
                name="name"
                icon={<Type size={16} />}
                defaultValue={foodData.name}
              />
              <BoutiqueInput
                label="Category"
                name="category"
                icon={<Utensils size={16} />}
                defaultValue={foodData.category}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <BoutiqueInput
                label="Cuisine Type"
                name="cuisine"
                icon={<Sparkles size={16} />}
                defaultValue={foodData.cuisine}
              />
              <BoutiqueInput
                label="Initial Stock"
                name="quantity"
                type="number"
                icon={<Hash size={16} />}
                defaultValue={foodData.quantity}
              />
            </div>

            <BoutiqueInput
              label="Visual Identity (Image URL)"
              name="image_url"
              icon={<ImageIcon size={16} />}
              defaultValue={foodData.image_url}
              onChange={e => setPreviewUrl(e.target.value)}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <BoutiqueInput
                label="Boutique Price ($)"
                name="price_usd"
                type="number"
                icon={<DollarSign size={16} />}
                defaultValue={foodData.price_usd}
              />
              <BoutiqueInput
                label="Gourmet Rating"
                name="rating"
                type="number"
                icon={<Star size={16} />}
                defaultValue={foodData.rating}
                step="0.1"
                max="5"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">
                The Story (Description)
              </label>
              <textarea
                name="description"
                defaultValue={foodData.description}
                rows="4"
                className="w-full px-8 py-6 rounded-[2.5rem] bg-[#fcf9f5] text-[#1a1a1a] font-medium text-sm outline-none focus:ring-2 focus:ring-orange-100 transition-all border border-transparent"
              />
            </div>
          </motion.div>

          {/* --- RIGHT: PREVIEW & TAGS (5 Columns) --- */}
          <div className="lg:col-span-5 space-y-8">
            {/* Live Preview Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#1a1a1a] p-8 rounded-[3.5rem] shadow-2xl text-white overflow-hidden relative group"
            >
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-6 italic">
                Live Preview
              </p>
              <div className="aspect-video w-full rounded-[2rem] overflow-hidden mb-6 border border-white/10 shadow-2xl">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <h4 className="text-2xl font-black tracking-tighter uppercase mb-2">
                Masterpiece Preview
              </h4>
              <p className="text-gray-400 text-xs italic tracking-widest uppercase">
                Spice Slice Boutique Collection
              </p>
              <div className="absolute -right-6 -bottom-6 opacity-5 rotate-12 text-[10rem] font-black italic">
                HOT
              </div>
            </motion.div>

            {/* Attributes & Submit */}
            <div className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-black/5 space-y-6">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-4">
                Masterpiece Attributes
              </p>

              <div className="space-y-4">
                <TagToggle
                  label="Signature Dish"
                  name="is_signature"
                  defaultChecked={foodData.is_signature}
                  icon={<Star className="text-yellow-500" size={14} />}
                />
                <TagToggle
                  label="Premium Choice"
                  name="is_premium"
                  defaultChecked={foodData.is_premium}
                  icon={<Diamond className="text-blue-400" size={14} />}
                />
                <TagToggle
                  label="Spicy Heat Level"
                  name="is_spicy"
                  defaultChecked={foodData.is_spicy}
                  icon={<Flame className="text-red-500" size={14} />}
                />
                <TagToggle
                  label="Kitchen Availability"
                  name="is_available"
                  defaultChecked={foodData.is_available}
                  icon={<Save className="text-green-500" size={14} />}
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={updating}
                className="w-full bg-[#1a1a1a] text-white py-6 rounded-full font-black uppercase text-xs tracking-[0.4em] flex items-center justify-center gap-3 shadow-xl hover:bg-[#E65100] transition-all disabled:opacity-50 mt-10"
              >
                {updating ? 'Refining...' : 'Commit Changes'} <Save size={18} />
              </motion.button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Helper Components ---
const BoutiqueInput = ({
  label,
  name,
  icon,
  defaultValue,
  type = 'text',
  step,
  max,
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
        step={step}
        max={max}
        defaultValue={defaultValue}
        onChange={onChange}
        required
        className="w-full pl-14 pr-6 py-4 bg-[#fcf9f5] border border-transparent focus:border-[#E65100]/20 rounded-full text-sm font-bold transition-all outline-none shadow-inner"
      />
    </div>
  </div>
);

const TagToggle = ({ label, name, defaultChecked, icon }) => (
  <label className="flex items-center justify-between p-4 bg-[#fcf9f5] rounded-2xl cursor-pointer hover:bg-orange-50 transition-all group">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-white rounded-lg shadow-sm">{icon}</div>
      <span className="text-[10px] font-black uppercase tracking-widest text-[#1a1a1a]">
        {label}
      </span>
    </div>
    <input
      type="checkbox"
      name={name}
      defaultChecked={defaultChecked}
      className="w-5 h-5 accent-[#E65100] cursor-pointer"
    />
  </label>
);

export default Update;
