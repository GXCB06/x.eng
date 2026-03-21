/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#5B5FDE",
        yellow: "#FFD60A",
        background: "#F5F3FF",
        text: "#111827",
        darkText: "#1a1a2e",
      },
      fontFamily: {
        sans: ["SF Pro Display", "Inter", "Poppins", "sans-serif"],
      },
      borderRadius: {
        xl: "24px",
        "2xl": "32px",
      },
      boxShadow: {
        iOS: "0 12px 40px rgba(0,0,0,0.1)",
        iosSm: "0 6px 20px rgba(0,0,0,0.08)",
      },
    },
  },
  plugins: [],
}
