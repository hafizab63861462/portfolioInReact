/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,mdx}"],
  theme: {
    extend: {
      colors: {
        "deep-blue": "#010026",
        blue: "#2CBCE9",
        red: "#DC4492",
        yellow: "#FDCC49",
        grey: "#ededed",
        "dark-grey": "#757575",
        "opaque-black": "rgba(0,0,0,0.35)",
      },
      backgroundImage: {
        "gradient-rainbow":
          "linear-gradient(81.66deg, #00B5EE 7.21%, #FF45A4 45.05%, #FFBA00 78.07%)",
        "gradient-rainblue":
          "linear-gradient(90deg, #24CBFF 14.53%, #FC59FF 69.36%, #FFBD0C 117.73%)",
      },
      // Keys stay `playfair`/`opensans` so every existing font-playfair /
      // font-opensans class keeps working. Values now point at the CSS
      // variables injected by next/font in src/app/layout.jsx.
      fontFamily: {
        playfair: ["var(--font-playfair)", "Playfair Display", "serif"],
        opensans: ["var(--font-opensans)", "Open Sans", "sans-serif"],
      },
      content: {
        // Root-absolute so it is passed through verbatim by the bundler and
        // served straight from public/. A relative url() would resolve against
        // src/app/globals.css and break.
        brush: "url('/assets/brush.png')",
      },
    },
    // NOTE: on `theme`, not `theme.extend` — this deliberately REPLACES
    // Tailwind's default breakpoints. md: is 1060px here, sm: is 768px.
    screens: {
      xs: "480px",
      ss: "620px",
      sm: "768px",
      md: "1060px",
      lg: "1200px",
      xl: "1700px",
    },
  },
  plugins: [],
};
