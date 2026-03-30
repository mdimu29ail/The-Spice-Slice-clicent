import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Upload, CheckCircle2 } from 'lucide-react';
import { supabase } from '../../supabase/supabaseClient';
import Swal from 'sweetalert2';

const AddGalleryImage = ({ onClose, onRefresh }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    const form = e.target;
    const file = form.image.files[0];
    const title = form.title.value;
    const category = form.category.value;

    try {
      // ১. ইমেজ আপলোড করা (Storage)
      const fileName = `${Date.now()}-${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('gourmet-gallery')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // ২. পাবলিক ইউআরএল পাওয়া
      const {
        data: { publicUrl },
      } = supabase.storage.from('gourmet-gallery').getPublicUrl(fileName);

      // ৩. ডাটাবেসে সেভ করা
      const { error: dbError } = await supabase
        .from('gallery')
        .insert([{ src: publicUrl, title, category }]);

      if (dbError) throw dbError;

      Swal.fire('Success', 'Gallery piece archived.', 'success');
      onRefresh();
      onClose();
    } catch (err) {
      Swal.fire('Error', err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white w-full max-w-lg rounded-[3rem] p-10 relative"
      >
        <button onClick={onClose} className="absolute top-8 right-8">
          <X />
        </button>
        <h2 className="text-3xl font-black italic tracking-tighter uppercase mb-8">
          Add <span className="text-[#E65100]">Visual Art.</span>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            name="title"
            placeholder="Title of Artwork"
            className="w-full border-b-2 p-4 outline-none focus:border-[#E65100] font-bold"
            required
          />
          <input
            name="category"
            placeholder="Category (e.g. Pizza, Sushi)"
            className="w-full border-b-2 p-4 outline-none focus:border-[#E65100] font-bold"
            required
          />
          <div className="border-2 border-dashed border-gray-200 p-8 rounded-[2rem] text-center">
            <input
              type="file"
              name="image"
              className="hidden"
              id="file-upload"
              required
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              <Upload className="text-[#E65100] mb-4" size={32} />
              <span className="text-xs font-black uppercase tracking-widest text-gray-400">
                Select Image File
              </span>
            </label>
          </div>
          <button
            disabled={loading}
            className="w-full bg-[#1a1a1a] text-white py-5 rounded-full font-black uppercase tracking-widest"
          >
            {loading ? 'Archiving...' : 'Confirm Upload'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AddGalleryImage;
