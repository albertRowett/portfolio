/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        "albert-sans": ["Albert Sans", "sans-serif"],
      },
      spacing: {
        7.5: "1.875rem",
        15: "3.75rem",
        23: "5.75rem",
        140: "35rem",
        "2/3": "66.667%",
        "4/5": "80%",
      },
      borderWidth: {
        5: "5px",
        6: "6px",
      },
    },
  },
  plugins: [],
};
