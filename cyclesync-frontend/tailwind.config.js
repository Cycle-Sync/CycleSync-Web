/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF69B4', // Pink accent
        secondary: '#FFE6F0', // Light pink background
        glow: '#C2185B', // Darker pink for glow
      },
    },
  },
  plugins: [],
};