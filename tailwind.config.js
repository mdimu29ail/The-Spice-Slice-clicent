// tailwind.config.js (High-End Spice-Slice Version)
import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,jsx}'],
  theme: {
    extend: {
      colors: {
        // মডার্ন লাক্সারি কালার প্যালেট
        primary: '#E65100', // Deep Spicy Orange (Brand Color)
        secondary: '#2D2424', // Charcoal Black (Expensive Look)
        accent: '#D84315', // Chili Red Accent
        neutral: '#4A4A4A', // Soft Grey for text
        background: '#fcf9f5', // Your requested Alabaster White
      },
      fontFamily: {
        // 'Playfair Display' এবং 'Inter' ব্যবহার করলে সাইট দামী মনে হয়
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'gradient-x': 'gradient-x 15s ease infinite',
        reveal: 'reveal 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        float: 'float 4s ease-in-out infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
        reveal: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
      boxShadow: {
        luxury: '0 20px 50px -12px rgba(0, 0, 0, 0.08)',
        premium: '0 35px 60px -15px rgba(230, 81, 0, 0.15)',
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        spiceTheme: {
          primary: '#E65100',
          secondary: '#2D2424',
          accent: '#D84315',
          neutral: '#4A4A4A',
          'base-100': '#fcf9f5', // Your base color
          info: '#3ABFF8',
          success: '#2D5A27', // Forest Green for Freshness
          warning: '#FBBD23',
          error: '#F87272',
        },
      },
      'dark', // Optional dark mode
    ],
  },
};
