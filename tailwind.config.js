/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        serif: ["Cormorant Garamond", "Georgia", "serif"],
      },
      colors: {
        graphite: "#101113",
        panel: "#17191d",
        panelSoft: "#1f2228",
        line: "rgba(255,255,255,0.09)",
        gold: "#d7b56d",
        herb: "#74a86f",
        coral: "#dd7c6f",
        glacier: "#7ab8c8",
        ink: "#f4f1eb",
      },
      boxShadow: {
        premium: "0 18px 55px rgba(0,0,0,0.32)",
        lift: "0 10px 24px rgba(0,0,0,0.22)",
      },
    },
  },
  plugins: [],
};
