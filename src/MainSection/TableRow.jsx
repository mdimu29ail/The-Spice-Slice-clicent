import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, Star, Diamond, Flame } from 'lucide-react';

const TableRow = ({ list, index, handleDelete }) => {
  // Supabase এ 'id' থাকে, কিন্তু আমরা ব্যাকআপ হিসেবে '_id' ও রাখছি
  const {
    id,
    _id,
    name,
    category,
    image_url,
    price_usd,
    rating,
    purchase_count = 0,
    is_signature,
    is_premium,
  } = list;

  const itemID = id || _id;

  return (
    <motion.tr
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group border-b border-black/[0.03] hover:bg-[#fcf9f5]/80 transition-all duration-300"
    >
      {/* Index Column */}
      <td className="px-8 py-6">
        <span className="text-[11px] font-mono font-bold text-gray-300 group-hover:text-[#E65100] transition-colors">
          {index + 1 < 10 ? `0${index + 1}` : index + 1}
        </span>
      </td>

      {/* Delicacy Identity Column */}
      <td className="px-8 py-6">
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-lg border-2 border-white group-hover:border-orange-100 transition-all duration-500">
              <img
                src={image_url}
                alt={name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
            </div>
            {is_signature && (
              <div className="absolute -top-2 -right-2 bg-[#1a1a1a] text-white p-1.5 rounded-lg shadow-xl">
                <Star size={10} fill="#E65100" className="text-[#E65100]" />
              </div>
            )}
          </div>
          <div>
            <div className="font-black text-[#1a1a1a] uppercase tracking-tight text-sm group-hover:text-[#E65100] transition-colors">
              {name}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1 text-orange-400">
                <Star size={10} fill="currentColor" />
                <span className="text-[10px] font-bold">{rating || '4.9'}</span>
              </div>
              <span className="text-[10px] text-gray-300">|</span>
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic">
                Artisanal
              </span>
            </div>
          </div>
        </div>
      </td>

      {/* Category Column */}
      <td className="px-8 py-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-black/5 rounded-full shadow-sm">
          {is_premium ? (
            <Diamond size={10} className="text-blue-500" />
          ) : (
            <Flame size={10} className="text-orange-500" />
          )}
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
            {category}
          </span>
        </div>
      </td>

      {/* Price Column */}
      <td className="px-8 py-6">
        <div className="flex flex-col">
          <span className="text-lg font-black text-[#1a1a1a] tracking-tighter italic">
            ${parseFloat(price_usd).toFixed(2)}
          </span>
          <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">
            Boutique Price
          </span>
        </div>
      </td>

      {/* Acquisition Count Column */}
      <td className="px-8 py-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#1a1a1a] text-white flex items-center justify-center text-[10px] font-black shadow-lg">
            {purchase_count}
          </div>
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
            Orders
          </span>
        </div>
      </td>

      {/* Delete Action Column */}
      <td className="px-8 py-6 text-right">
        <motion.button
          whileHover={{ scale: 1.1, x: -5 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleDelete(itemID)}
          className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all duration-300 group/btn"
        >
          <Trash2
            size={18}
            className="group-hover/btn:rotate-12 transition-transform"
          />
        </motion.button>
      </td>
    </motion.tr>
  );
};

export default TableRow;
