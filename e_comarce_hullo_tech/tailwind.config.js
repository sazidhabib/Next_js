const config = {
  content: [
    "./src/pages/**/*.{js,jsx,md}",
    "./src/components/**/*.{js,jsx,md}",
    "./src/app/**/*.{js,jsx,md}",
  ],
  theme: {
    extend: {
      colors: {
        "star-blue": "#1979d2",
        "star-dark-blue": "#0d5ea6",
        "star-light-gray": "#f8f9fa",
        "star-gray": "#e5e7eb",
        "star-text": "#333333",
        "star-red": "#e53935",
        "star-orange": "#ff6d00",
        "star-green": "#43a047",
        "star-yellow": "#ffc107",
      },
      fontFamily: {
        sans: ["Inter", "Segoe UI", "sans-serif"],
        heading: ["Inter", "Segoe UI", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
