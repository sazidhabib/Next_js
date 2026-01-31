/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2355e7', // lush green
          dark: '#48caf9',
          light: '#8ddefb',
        },
        background: {
          DEFAULT: '#f0f6fdff', // very light green tint
        }
      },
      fontFamily: {
        sans: ['"Hind Siliguri"', 'sans-serif'],
      }
    },
  },
  plugins: [],
};
