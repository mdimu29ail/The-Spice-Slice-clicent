// tailwind.config.js (ESM version)
import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1D4ED8',
        secondary: '#F59E0B',
        accent: '#10B981',
        neutral: '#1F2937',
        background: '#F3F4F6',
      },
      animation: {
        'gradient-x': 'gradient-x 15s ease infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        customtheme: {
          primary: '#1D4ED8',
          secondary: '#F59E0B',
          accent: '#10B981',
          neutral: '#1F2937',
          'base-100': '#F3F4F6',
        },
      },
      'dark',
    ],
  },
};
