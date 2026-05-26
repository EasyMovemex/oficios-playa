/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0891B2',
          light: '#0EA5E9',
        },
        secondary: '#EA580C',
        accent: '#059669',
        background: '#F0F9FF',
        surface: '#FFFFFF',
        'text-primary': '#0C4A6E',
        'text-secondary': '#64748B',
        border: '#E2E8F0',
        danger: '#EF4444',
        warning: '#F59E0B',
      },
      fontFamily: {
        poppins: ['Poppins_400Regular'],
        'poppins-medium': ['Poppins_500Medium'],
        'poppins-semibold': ['Poppins_600SemiBold'],
        'poppins-bold': ['Poppins_700Bold'],
      },
      borderRadius: {
        input: '8px',
        button: '12px',
        card: '16px',
        pill: '999px',
      },
    },
  },
  plugins: [],
};
