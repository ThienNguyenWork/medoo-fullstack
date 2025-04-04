/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  important: true,
  theme: {
    extend: {
      keyframes: {
        'fill-right': {
          '0%': { width: '0%' },
          '100%': { width: '100%' }
        }
      },
      colors: {
        purple: {
          600: '#8c52ff',
          700: '#7845d9',
        },
        blue: {
          500: '#3b82f6',
        }
      }
    }
  },
  plugins: [],
}