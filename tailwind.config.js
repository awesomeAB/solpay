module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    fontFamily: {
      solpay: ["Oxygen", "sans-serif"],
    },
    extend: {
      colors: {
        dark: "#08070B",
        snow: "#f2f2f2",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
