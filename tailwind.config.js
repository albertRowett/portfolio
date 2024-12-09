/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        "albert-sans": ["Albert Sans", "sans-serif"],
      },
      spacing: {
        23: "5.75rem",
      },
    },
  },
  plugins: [],
};
