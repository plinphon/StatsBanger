/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['NaturalMono', 'monospace'],
        kagoda: ['Kagoda', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
