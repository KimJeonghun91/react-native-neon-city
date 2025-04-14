/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#E8FFFE',
      },
      fontFamily: {
        'orbitron-bold': ['Orbitron-Bold'],
        'orbitron-extrabold': ['Orbitron-ExtraBold'],
        'orbitron-medium': ['Orbitron-Medium'],
        'orbitron-semibold': ['Orbitron-SemiBold'],
      },
    },
  },
  plugins: [],
};
