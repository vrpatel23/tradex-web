import type { Config } from "tailwindcss";
const config: Config = {
  darkMode: "class",
  content: ["./src/pages/**/*.{js,ts,jsx,tsx,mdx}","./src/components/**/*.{js,ts,jsx,tsx,mdx}","./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: { 50:"#f0fdf4",100:"#dcfce7",200:"#bbf7d0",300:"#86efac",400:"#4ade80",500:"#22c55e",600:"#16a34a",700:"#15803d",800:"#166534",900:"#14532d",950:"#052e16" },
      },
      fontFamily: { sans: ["var(--font-geist-sans)","system-ui","sans-serif"] },
      boxShadow: { card:"0 1px 3px 0 rgb(0 0 0 / 0.06),0 1px 2px -1px rgb(0 0 0 / 0.06)", "card-hover":"0 4px 6px -1px rgb(0 0 0 / 0.08)" },
      keyframes: { "fade-in": { "0%":{opacity:"0",transform:"translateY(8px)"},"100%":{opacity:"1",transform:"translateY(0)"} } },
      animation: { "fade-in":"fade-in 0.3s ease-out" },
    },
  },
  plugins: [],
};
export default config;
