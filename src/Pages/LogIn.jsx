import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import animationData from '../assets/login.json';
import { AuthContext } from '../Auth/AuthContext';
import Swal from 'sweetalert2';
import {
  Mail,
  Lock,
  Sparkles,
  ChefHat,
  ShieldCheck,
  KeyRound,
  Fingerprint,
} from 'lucide-react';

const LogIn = () => {
  const { logIn, signinWithGoogle } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = location.state?.from || '/';

  const handleLogin = async e => {
    e.preventDefault();
    setIsSubmitting(true);
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    try {
      await logIn(email, password);
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Authenticated Successfully.',
        showConfirmButton: false,
        timer: 2000,
        background: '#1a1a1a',
        color: '#fff',
      });
      navigate(from, { replace: true });
    } catch (error) {
      Swal.fire({
        title: 'Access Denied',
        text: 'The credentials provided are incorrect.',
        icon: 'error',
        confirmButtonColor: '#E65100',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcf9f5] flex items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-orange-100">
      {/* --- BACKGROUND DECOR --- */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-[10%] left-[15%] w-64 h-64 bg-orange-100/40 rounded-full blur-[100px]"
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] select-none">
          <h1 className="text-[30vw] font-black italic leading-none text-[#1a1a1a]">
            SPICE
          </h1>
        </div>
      </div>

      <div className="container max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12 z-10">
        {/* --- LEFT SIDE: BRANDING --- */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="hidden lg:flex flex-col justify-center items-start w-1/2 p-12"
        >
          <div className="w-16 h-16 bg-[#1a1a1a] rounded-3xl flex items-center justify-center mb-8 shadow-2xl">
            <ChefHat className="text-[#E65100]" size={32} />
          </div>
          <h2 className="text-6xl font-black text-[#1a1a1a] leading-tight tracking-tighter uppercase italic mb-6">
            Entry into <br />{' '}
            <span className="text-[#E65100] not-italic">The Vault.</span>
          </h2>
          <p className="text-gray-500 text-lg font-medium leading-relaxed max-w-sm mb-10">
            Sign in to access your curated collection of flavors and artisanal
            masterpieces.
          </p>
          <div className="w-full max-w-xs opacity-60">
            <Lottie animationData={animationData} loop={true} />
          </div>
        </motion.div>

        {/* --- RIGHT SIDE: LOGIN CARD --- */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full lg:w-[480px] bg-white/70 backdrop-blur-3xl p-10 lg:p-14 rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] border border-white relative"
        >
          <header className="mb-12 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-100 mb-6">
              <Sparkles size={14} className="text-[#E65100]" />
              <span className="text-[10px] font-black uppercase tracking-widest text-[#E65100]">
                Patron Portal
              </span>
            </div>
            <h3 className="text-3xl font-black text-[#1a1a1a] tracking-tighter uppercase leading-none">
              Sign In.
            </h3>
          </header>

          <form onSubmit={handleLogin} className="space-y-8">
            {/* Identity Input */}
            <div className="group relative border-b border-black/10 focus-within:border-[#E65100] transition-all duration-500 pb-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 group-focus-within:text-[#E65100]">
                Identity (Email)
              </label>
              <div className="flex items-center gap-4">
                <Mail
                  size={18}
                  className="text-gray-300 group-focus-within:text-[#E65100] transition-colors"
                />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="patron@spiceslice.com"
                  className="w-full bg-transparent outline-none text-sm font-bold text-[#1a1a1a] placeholder:text-gray-200"
                />
              </div>
            </div>

            {/* Secret Input */}
            <div className="group relative border-b border-black/10 focus-within:border-[#E65100] transition-all duration-500 pb-2">
              <div className="flex justify-between items-center mb-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block group-focus-within:text-[#E65100]">
                  Secret (Password)
                </label>
                <button
                  type="button"
                  className="text-[9px] font-black text-[#E65100] uppercase tracking-tighter hover:underline"
                >
                  Recover?
                </button>
              </div>
              <div className="flex items-center gap-4">
                <KeyRound
                  size={18}
                  className="text-gray-300 group-focus-within:text-[#E65100] transition-colors"
                />
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-transparent outline-none text-sm font-bold text-[#1a1a1a] placeholder:text-gray-200"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isSubmitting}
              className="w-full bg-[#1a1a1a] text-[#fcf9f5] py-5 rounded-2xl flex items-center justify-center gap-4 shadow-2xl hover:bg-[#E65100] transition-all duration-500 disabled:opacity-50"
            >
              <span className="text-[11px] font-black uppercase tracking-[0.4em]">
                {isSubmitting ? 'Verifying...' : 'Authorize Access'}
              </span>
              {!isSubmitting && <Fingerprint size={20} />}
            </motion.button>
          </form>

          {/* Social Auth Section */}
          <div className="mt-12">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-[1px] flex-1 bg-black/5" />
              <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">
                Or Continue with
              </span>
              <div className="h-[1px] flex-1 bg-black/5" />
            </div>

            <motion.button
              type="button"
              onClick={() => signinWithGoogle()}
              whileHover={{ y: -2, backgroundColor: '#fcf9f5' }}
              className="w-full border border-black/5 py-4 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 group"
            >
              {/* Manual Google SVG Icon to prevent import error */}
              <svg
                className="w-5 h-5 group-hover:scale-110 transition-transform"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#EA4335"
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.908 3.152-1.928 4.176-1.248 1.248-3.216 2.592-6.9 2.592-5.976 0-10.656-4.8-10.656-10.824s4.68-10.824 10.656-10.824c3.24 0 5.61 1.272 7.392 2.952l2.304-2.304c-2.424-2.28-5.592-3.6-9.696-3.6-7.824 0-14.28 6.456-14.28 14.28s6.456 14.28 14.28 14.28c4.32 0 7.392-1.44 9.696-3.84 2.4-2.4 3.12-5.76 3.12-8.4 0-.6-.048-1.2-.12-1.8h-12.72z"
                />
              </svg>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-[#1a1a1a]">
                Google SSO
              </span>
            </motion.button>
          </div>

          {/* Registration Footer */}
          <p className="mt-12 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">
            New to the boutique?
            <Link
              to="/register"
              className="text-[#E65100] ml-2 underline underline-offset-4 hover:text-[#1a1a1a] transition-colors font-black"
            >
              Create Identity
            </Link>
          </p>

          <div className="mt-8 flex justify-center items-center gap-2 text-green-600/50">
            <ShieldCheck size={14} />
            <p className="text-[9px] font-black uppercase tracking-widest">
              Secured Patron Link
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LogIn;
