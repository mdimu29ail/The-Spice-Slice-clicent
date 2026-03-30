import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ArrowUpRight, Flame, Globe } from 'lucide-react';

// সোশ্যাল আইকনগুলোর জন্য কাস্টম SVG কোড (এরর এড়ানোর জন্য)
const SocialIcons = {
  Facebook: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  ),
  Instagram: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  ),
  Twitter: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  ),
  Youtube: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z" />
      <path d="m10 15 5-3-5-3z" />
    </svg>
  ),
};

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: 'Menu',
      links: ['All Foods', 'Signature Slices', "Chef's Special", 'Gallery'],
    },
    {
      title: 'Boutique',
      links: ['Our Story', 'Artisanal Kitchen', 'Patrons', 'Contact'],
    },
    {
      title: 'Legal',
      links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy'],
    },
  ];

  return (
    <footer className="bg-[#fcf9f5] pt-24 pb-12 border-t border-black/5 overflow-hidden">
      <div className="container mx-auto px-6 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 mb-20">
          {/* --- BRAND COLUMN --- */}
          <div className="lg:col-span-4 space-y-8">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-[#1a1a1a] rounded-2xl flex items-center justify-center shadow-xl group-hover:rotate-12 transition-transform duration-500">
                <img
                  src="https://i.ibb.co/MxBvKxGY/Chat-GPT-Image-AM.png"
                  alt="logo"
                  className="w-8 brightness-200"
                />
              </div>
              <span className="text-3xl font-black tracking-tighter uppercase italic text-[#1a1a1a]">
                Spice<span className="text-[#E65100] not-italic">Slice.</span>
              </span>
            </Link>

            <p className="text-gray-500 text-sm font-medium leading-relaxed max-w-xs">
              Crafting unforgettable culinary journeys since 2024. Every slice
              is a testament to our artisanal heritage and spicy passion.
            </p>

            <div className="flex gap-4">
              {Object.keys(SocialIcons).map((key, i) => {
                const Icon = SocialIcons[key];
                return (
                  <motion.a
                    key={i}
                    href="#"
                    whileHover={{
                      y: -5,
                      backgroundColor: '#E65100',
                      color: '#fff',
                    }}
                    className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center text-gray-400 transition-colors"
                  >
                    <Icon />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* --- LINKS COLUMNS --- */}
          <div className="lg:col-span-5 grid grid-cols-2 md:grid-cols-3 gap-8">
            {footerLinks.map((section, idx) => (
              <div key={idx} className="space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#E65100]">
                  {section.title}
                </h4>
                <ul className="space-y-4">
                  {section.links.map((link, i) => (
                    <li key={i}>
                      <Link
                        to="#"
                        className="text-sm font-bold text-gray-400 hover:text-[#1a1a1a] transition-colors flex items-center gap-1 group"
                      >
                        {link}
                        <ArrowUpRight
                          size={12}
                          className="opacity-0 group-hover:opacity-100 -translate-y-1 group-hover:translate-y-0 transition-all"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* --- CONTACT COLUMN --- */}
          <div className="lg:col-span-3 space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#E65100]">
              Visit Us
            </h4>
            <div className="space-y-4 text-sm font-bold text-[#1a1a1a]">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-[#E65100] shrink-0" />
                <p className="leading-tight">
                  12/A Boutique Avenue,
                  <br />
                  Spice District, Dhaka
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-[#E65100]" />
                <p>+880 1234 567 890</p>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-[#E65100]" />
                <p>hello@spiceslice.com</p>
              </div>
            </div>

            {/* Newsletter */}
            <div className="pt-6">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Join the Circle"
                  className="w-full bg-white border border-black/5 rounded-full py-4 pl-6 pr-12 text-xs font-bold focus:outline-none focus:border-[#E65100]/30 shadow-sm"
                />
                <button className="absolute right-2 top-2 bg-[#1a1a1a] text-white p-2.5 rounded-full hover:bg-[#E65100] transition-colors shadow-lg">
                  <ArrowUpRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
