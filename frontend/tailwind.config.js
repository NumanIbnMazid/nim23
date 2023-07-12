module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./layout/*.{js,jsx,ts,tsx}",
  ],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    fontFamily: {
      inter: ["Inter", "sans-serif"],
      sarina: ["Sarina", "cursive"],
      barlow: ["Barlow", "sans-serif"],
      mono: ["monospace"],
    },
    extend: {
      colors: {
        darkPrimary: "#111827",
        darkSecondary: "#1F2937",
        darkThird: "#10192D",
        darkFourth: "#151e30",
        darkFifth: "#0d1423",
        darkWhite: "#f2f5fa",
        darkWhitePrimary: "#fafdff",
        darkWhiteSecondary: "#e8ecf9",
      },
      listStyleType: {
        square: "square",
        roman: "upper-roman",
      },
      animation: {
        wiggle: "wiggle 1s ease-in-out infinite",
        "photo-spin": "photo-spin 2s 1 linear forwards",
      },
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        "photo-spin": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      screens: {
        "3xl": "2000px",
        xs: "480px",
      },
    },
  },
  plugins: [
    require("@tailwindcss/line-clamp"),
    require("@tailwindcss/typography"),
  ],
};
