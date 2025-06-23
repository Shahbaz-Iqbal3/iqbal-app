/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Enable dark mode with class strategy
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      fontFamily: {
        nastaliq: ["var(--font-nastaliq)"],
        sans: ["var(--font-gulzar)"],
        amiri: ["var(--font-amiri)"],
        poppins: ["var(--font-poppins)"],
        dancing: ["var(--font-dancing)"],
        roboto: ["var(--font-roboto)"],
        opensans: ["var(--font-opensans)"],
      },
      colors: {
        // Define custom colors for both light and dark modes
        primary: {
          DEFAULT: '#F2F4F7', // blue-600
          dark: '#1F2937', // blue-500
        },
        secondary: {
          DEFAULT: '#DBDBDB', // slate-800
          dark: '#374151', // slate-600
        },
        hover: {
          DEFAULT: '#d2d2d2', // slate-200
          dark: '#4b5563', // slate-800
        },
        quaternary: {
          DEFAULT: '#f9fafb', // slate-100
          dark: '#1f2937', // slate-800
        },
      },
      transitionProperty: {
        'opacity-transform': 'opacity, transform',
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
} 