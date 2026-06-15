const config = {
  content: [
    "./src/pages/**/*.{js,jsx,md}",
    "./src/components/**/*.{js,jsx,md}",
    "./src/app/**/*.{js,jsx,md}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#0077e5",
        "primary-dark": "#010d21",
        "hullo-blue": "#0077e5",
        "hullo-navy": "#010d21",
        "hullo-gray": "#f8fafc",
        "star-blue": "#0077e5",
        "star-dark-blue": "#010d21",
        "star-light-gray": "var(--hullo-gray)",
        "star-gray": "#e5e7eb",
        "star-text": "var(--hullo-text)",
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
