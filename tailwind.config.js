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
        solanaGreen: "#07C596",
        buildspaceFrom: "#CB5EEE",
        buildspaceTo: "#4BE1EC",
      },
      animation: {
        tilt: "tilt 10s infinite linear",
      },
      keyframes: {
        tilt: {
          "0%, 50%, 100%": {
            transform: "rotate(0deg)",
          },
          "25%": {
            transform: "rotate(5deg)",
          },
          "75%": {
            transform: "rotate(-5deg)",
          },
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
