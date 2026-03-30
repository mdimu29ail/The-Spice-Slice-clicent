import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard,
  Search,
  Download,
  Hash,
  Calendar,
  DollarSign,
  Trash2,
  Printer,
  FileSpreadsheet,
  X,
} from 'lucide-react';
import Swal from 'sweetalert2';
import Loading from '../Loading/Loading';

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('applications')
      .select(`*, foods(name)`)
      .order('created_at', { ascending: false });
    if (!error) setPayments(data);
    setLoading(false);
  };

  // --- ১. ডিলিট লজিক ---
  const handleDelete = async id => {
    const result = await Swal.fire({
      title: 'Erase Transaction?',
      text: 'This record will be permanently removed from the boutique ledger.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1a1a1a',
      cancelButtonColor: '#E65100',
      confirmButtonText: 'Yes, Delete',
      background: '#fcf9f5',
      customClass: { popup: 'rounded-[3rem] border border-black/5 shadow-2xl' },
    });

    if (result.isConfirmed) {
      const { error } = await supabase
        .from('applications')
        .delete()
        .eq('id', id);
      if (!error) {
        setPayments(prev => prev.filter(p => p.id !== id));
        Swal.fire({ title: 'Deleted', icon: 'success', background: '#fcf9f5' });
      }
    }
  };

  // --- ২. CSV এক্সপোর্ট লজিক (Download All) ---
  const exportToCSV = () => {
    const headers = [
      'Reference ID, Patron Email, Masterpiece, Amount, Date, Status\n',
    ];
    const rows = payments.map(
      p =>
        `${p.id}, ${p.applicant_email}, ${p.foods?.name || 'N/A'}, ${p.price_usd}, ${new Date(p.created_at).toLocaleDateString()}, ${p.status}\n`,
    );
    const blob = new Blob([headers + rows.join('')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Boutique_Ledger_${new Date().toLocaleDateString()}.csv`;
    a.click();
  };

  // --- ৩. সিঙ্গেল ইনভয়েস প্রিন্ট লজিক ---
  const printInvoice = pay => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head><title>Invoice - ${pay.id}</title></head>
        <body style="font-family: sans-serif; padding: 40px; color: #1a1a1a;">
          <h1 style="text-transform: uppercase; letter-spacing: 2px;">The Spice Slice</h1>
          <hr/>
          <p><strong>Transaction ID:</strong> ${pay.id}</p>
          <p><strong>Patron:</strong> ${pay.applicant_email}</p>
          <p><strong>Masterpiece:</strong> ${pay.foods?.name}</p>
          <p><strong>Amount Paid:</strong> $${pay.price_usd}</p>
          <p><strong>Date:</strong> ${new Date(pay.created_at).toLocaleString()}</p>
          <p><strong>Status:</strong> ${pay.status.toUpperCase()}</p>
          <br/><br/>
          <p><em>Thank you for being a part of our boutique experience.</em></p>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const filteredPayments = payments.filter(
    p =>
      p.applicant_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) return <Loading />;

  return (
    <div className="space-y-10 font-sans pb-20">
      {/* --- HEADER --- */}
      <header className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h2 className="text-4xl font-black text-[#1a1a1a] tracking-tighter italic uppercase leading-none">
            Financial <span className="text-[#E65100] not-italic">Ledger.</span>
          </h2>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.4em] mt-3">
            Transaction & Revenue Records
          </p>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative group flex-1 md:w-80">
            <input
              type="text"
              placeholder="Search Identity..."
              className="w-full bg-white border border-black/5 rounded-2xl py-4 pl-12 pr-6 text-sm focus:border-[#E65100]/30 transition-all shadow-sm outline-none font-bold"
              onChange={e => setSearchTerm(e.target.value)}
            />
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
              size={18}
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={exportToCSV}
            className="p-4 bg-[#1a1a1a] text-white rounded-2xl shadow-xl hover:bg-[#E65100] transition-all flex items-center gap-2"
            title="Export to CSV"
          >
            <FileSpreadsheet size={20} />
            <span className="hidden lg:inline text-[10px] font-black uppercase tracking-widest">
              Export All
            </span>
          </motion.button>
        </div>
      </header>

      {/* --- TABLE --- */}
      <div className="bg-white rounded-[2.5rem] border border-black/5 shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#fcf9f5] border-b border-black/5">
              <th className="p-8 text-[10px] font-black uppercase tracking-widest text-gray-400">
                <div className="flex items-center gap-2">
                  <Hash size={12} /> Ref ID
                </div>
              </th>
              <th className="p-8 text-[10px] font-black uppercase tracking-widest text-gray-400">
                Patron Email
              </th>
              <th className="p-8 text-[10px] font-black uppercase tracking-widest text-gray-400">
                Masterpiece
              </th>
              <th className="p-8 text-[10px] font-black uppercase tracking-widest text-gray-400">
                Amount
              </th>
              <th className="p-8 text-[10px] font-black uppercase tracking-widest text-gray-400">
                Date
              </th>
              <th className="p-8 text-[10px] font-black uppercase tracking-widest text-gray-400">
                Status
              </th>
              <th className="p-8 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="text-sm">
            <AnimatePresence mode="popLayout">
              {filteredPayments.map((pay, i) => (
                <motion.tr
                  key={pay.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-black/[0.03] hover:bg-[#fcf9f5]/50 transition-all group"
                >
                  <td className="p-8 font-mono text-gray-400 text-[10px]">
                    #{pay.id.slice(0, 8)}
                  </td>
                  <td className="p-8 font-bold text-[#1a1a1a]">
                    {pay.applicant_email}
                  </td>
                  <td className="p-8 font-black text-[#1a1a1a] uppercase tracking-tighter">
                    {pay.foods?.name || 'N/A'}
                  </td>
                  <td className="p-8 font-black text-[#E65100] italic">
                    ${pay.price_usd}
                  </td>
                  <td className="p-8 text-gray-400 font-bold text-[11px] uppercase">
                    {new Date(pay.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-8">
                    <span
                      className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border ${pay.status === 'paid' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}
                    >
                      {pay.status || 'Pending'}
                    </span>
                  </td>
                  <td className="p-8 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => printInvoice(pay)}
                        className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                        title="Print Receipt"
                      >
                        <Printer size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(pay.id)}
                        className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                        title="Delete Record"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
        {filteredPayments.length === 0 && (
          <div className="p-20 text-center text-gray-400 italic">
            No financial records found...
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPayments;
