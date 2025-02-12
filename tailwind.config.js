/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        albert: ['"Albert Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
