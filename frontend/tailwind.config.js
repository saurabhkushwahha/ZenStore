/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        emerald: {
          100: '#f5f5f5',  // very light gray
          200: '#e0e0e0',  // light gray
          300: '#bdbdbd',  // medium-light gray
          400: '#ffffff',  // medium gray, replaces bg-emerald-400
          500: 'rgb(0,0,0,0.1)',  // medium-dark gray, replaces bg-emerald-500
          600: 'rgb(0,0,0)',  // darker gray, replaces text-emerald-600
          700: '#4d4d4d',  // dark gray
          800: '#333333',  // very dark gray
          900: '#1a1a1a',  // almost black
        }
      }
    },
  },
  plugins: [],
}
