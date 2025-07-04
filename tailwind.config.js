/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lumiere: {
          ivory: '#FAF8F3',
          navy: '#22304A',
          gold: '#C6A664',
          burgundy: '#7C3048',
          sage: '#A6B89A',
          grey: '#E5E2DD',
        },
        primary: {
          50: '#eff6ff',
          500: '#7C3048',
          600: '#6a2a3e',
          700: '#5a2334',
        }
      }
    },
  },
  plugins: [],
} 