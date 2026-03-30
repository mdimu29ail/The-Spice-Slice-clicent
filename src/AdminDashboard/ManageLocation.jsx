import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabase/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Save,
  Plus,
  Trash2,
  Edit3,
  X,
  Navigation,
  Hash,
  Phone,
  Globe,
  Loader2,
} from 'lucide-react';
import Swal from 'sweetalert2';
import Loading from '../Loading/Loading';

const ManageLocation = () => {
  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState([]);
  const [isEditing, setIsEditing] = useState(null);
  const [formData, setFormData] = useState({
    address: '',
    phone: '',
    lat: '',
    lng: '',
  });

  // --- ১. ডাটা ফেচ করার ফাংশন (useCallback দিয়ে মেমোরি অপ্টিমাইজ করা) ---
  const fetchLocations = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('boutique_settings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLocations(data || []);
    } catch (error) {
      console.error('Fetch Error:', error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // --- ২. রিয়েল-টাইম লিসেনার সেটআপ ---
  useEffect(() => {
    fetchLocations();

    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'boutique_settings' },
        () => {
          fetchLocations(); // ডাটাবেসে যেকোনো পরিবর্তন হলে অটো ফেচ হবে
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchLocations]);

  // --- ৩. অ্যাড বা আপডেট লজিক ---
  const handleSubmit = async e => {
    e.preventDefault();

    const isDuplicate = locations.some(
      loc =>
        loc.address.toLowerCase().trim() ===
          formData.address.toLowerCase().trim() && loc.id !== isEditing,
    );

    if (isDuplicate) {
      return Swal.fire({
        title: 'Duplicate Entry',
        text: 'This location already exists.',
        icon: 'warning',
      });
    }

    setLoading(true);
    const payload = {
      address: formData.address.trim(),
      phone: formData.phone,
      lat: parseFloat(formData.lat),
      lng: parseFloat(formData.lng),
      updated_at: new Date(),
    };

    try {
      let error;
      if (isEditing) {
        const { error: updateError } = await supabase
          .from('boutique_settings')
          .update(payload)
          .eq('id', isEditing);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('boutique_settings')
          .insert([payload]);
        error = insertError;
      }

      if (error) throw error;

      Swal.fire({
        title: isEditing ? 'Refined' : 'Established',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
      });

      setFormData({ address: '', phone: '', lat: '', lng: '' });
      setIsEditing(null);

      // রিয়েল-টাইম লিসেনার কাজ না করলেও এটি নিশ্চিত করবে যে ডাটা আপডেট হয়েছে
      await fetchLocations();
    } catch (error) {
      Swal.fire('Error', error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // --- ৪. ডিলিট লজিক ---
  const handleDelete = async id => {
    const result = await Swal.fire({
      title: 'Terminate?',
      text: 'Remove this node from the network?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1a1a1a',
      cancelButtonColor: '#E65100',
      confirmButtonText: 'Yes, Erase',
    });

    if (result.isConfirmed) {
      const { error } = await supabase
        .from('boutique_settings')
        .delete()
        .eq('id', id);
      if (!error) {
        await fetchLocations(); // ডিলিট হওয়ার পর লিস্ট আপডেট
        Swal.fire('Deleted', '', 'success');
      }
    }
  };

  const startEdit = loc => {
    setIsEditing(loc.id);
    setFormData({
      address: loc.address,
      phone: loc.phone,
      lat: loc.lat,
      lng: loc.lng,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading && locations.length === 0) return <Loading />;

  return (
    <div className="p-6 lg:p-10 bg-[#fcf9f5] min-h-screen font-sans selection:bg-orange-100">
      <header className="mb-12">
        <h2 className="text-5xl font-black text-[#1a1a1a] tracking-tighter uppercase italic leading-none">
          Atelier <span className="text-[#E65100] not-italic">Ledger.</span>
        </h2>
        <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.4em] mt-3">
          Coordinate Management System
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* FORM SECTION */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-5"
        >
          <form
            onSubmit={handleSubmit}
            className="bg-white p-10 rounded-[3.5rem] shadow-2xl border border-black/5 space-y-8"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-black uppercase italic text-[#1a1a1a]">
                {isEditing ? 'Refine Node' : 'New Node'}
              </h3>
              {isEditing && (
                <button
                  onClick={() => {
                    setIsEditing(null);
                    setFormData({ address: '', phone: '', lat: '', lng: '' });
                  }}
                  className="text-red-500"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-4">
                Full Address
              </label>
              <textarea
                required
                value={formData.address}
                onChange={e =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="w-full px-6 py-4 bg-[#fcf9f5] rounded-[2rem] outline-none font-bold text-sm text-black border border-transparent focus:border-[#E65100]/20 transition-all shadow-inner"
                rows="3"
                placeholder="Street, City..."
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-4">
                  Latitude
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  value={formData.lat}
                  onChange={e =>
                    setFormData({ ...formData, lat: e.target.value })
                  }
                  className="w-full px-6 py-4 bg-[#fcf9f5] rounded-full outline-none font-bold text-black border border-transparent focus:border-[#E65100]/20 transition-all shadow-inner"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-4">
                  Longitude
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  value={formData.lng}
                  onChange={e =>
                    setFormData({ ...formData, lng: e.target.value })
                  }
                  className="w-full px-6 py-4 bg-[#fcf9f5] rounded-full outline-none font-bold text-black border border-transparent focus:border-[#E65100]/20 transition-all shadow-inner"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-4">
                Contact Link
              </label>
              <input
                required
                value={formData.phone}
                onChange={e =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-6 py-4 bg-[#fcf9f5] rounded-full outline-none font-bold text-black border border-transparent focus:border-[#E65100]/20 transition-all shadow-inner"
              />
            </div>

            <button
              disabled={loading}
              className="w-full py-6 bg-[#1a1a1a] text-white rounded-full font-black uppercase text-[10px] tracking-[0.4em] hover:bg-[#E65100] transition-all shadow-xl flex items-center justify-center gap-3"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : isEditing ? (
                'Commit Refinement'
              ) : (
                'Launch Node'
              )}
              {!loading &&
                (isEditing ? <Navigation size={16} /> : <Plus size={16} />)}
            </button>
          </form>
        </motion.div>

        {/* TABLE SECTION */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-[3rem] border border-black/5 shadow-sm overflow-hidden overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#fcf9f5] border-b border-black/5">
                  <th className="p-6 text-[9px] font-black uppercase tracking-widest text-gray-400">
                    <Hash size={12} />
                  </th>
                  <th className="p-6 text-[9px] font-black uppercase tracking-widest text-gray-400">
                    Identity
                  </th>
                  <th className="p-6 text-[9px] font-black uppercase tracking-widest text-gray-400">
                    Coordinates
                  </th>
                  <th className="p-6 text-[9px] font-black uppercase tracking-widest text-gray-400 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <AnimatePresence mode="popLayout">
                  {locations.map((loc, index) => (
                    <motion.tr
                      key={loc.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-black/[0.03] hover:bg-[#fcf9f5]/50 transition-all group"
                    >
                      <td className="p-6 font-mono text-gray-300 text-[10px]">
                        0{index + 1}
                      </td>
                      <td className="p-6">
                        <div className="flex flex-col">
                          <span className="font-black text-[#1a1a1a] uppercase text-xs line-clamp-1">
                            {loc.address}
                          </span>
                          <span className="text-[9px] font-bold text-gray-400 uppercase mt-1">
                            {loc.phone}
                          </span>
                        </div>
                      </td>
                      <td className="p-6 font-black text-[#1a1a1a] text-[10px] italic">
                        <Globe
                          size={12}
                          className="inline mr-1 text-blue-400"
                        />
                        {loc.lat.toFixed(2)}, {loc.lng.toFixed(2)}
                      </td>
                      <td className="p-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => startEdit(loc)}
                            className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(loc.id)}
                            className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-600 hover:text-white transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageLocation;
