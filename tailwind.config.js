/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Open Sans", "sans-serif"],
      },
      fontSize: {
        "7xl": "7rem", // Custom class for 7rem font size
      },
    },
  },
  plugins: [],
};
