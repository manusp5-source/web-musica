import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        marfil: "#FAF7F2",
        marfil2: "#F2ECE2",
        carbon: "#1C1B19",
        carbon2: "#33312D",
        dorado: "#C9A86A",
        doradoDark: "#A6854B",
        bronce: "#7A5F2E", // acento dorado oscuro para texto sobre fondos claros (AA)
        burdeos: "#5E2A33",
        oliva: "#5A5A3C",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        widest2: "0.25em",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.8s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
