
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'binance-blue': '#0098db',
        'binance-green': '#11c26d',
        'binance-red': '#e74c3c',
        'binance-gray': '#2c2f33',
      },
    },
  },
  plugins: [],
};