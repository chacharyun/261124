import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          bg: "#FFF8F5",
          pink: "#F3B8CC",
          "pink-dark": "#C76D91",
          cream: "#FFF2DB",
          green: "#B9D5B0",
          "green-dark": "#7FA675",
          lavender: "#D8C9ED",
          "lavender-dark": "#9780B8",
          sky: "#BAE6FD",
          "sky-dark": "#38BDF8",
          text: "#51454A",
          "text-muted": "#8C7B83",
          card: "#FFFFFF",
          border: "#F0DFD8",
          warm: "#FAF0E6"
        },
      },
      fontFamily: {
        sans: [
          "Pretendard",
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "Roboto",
          "Helvetica Neue",
          "Segoe UI",
          "Apple SD Gothic Neo",
          "Malgun Gothic",
          "sans-serif",
        ],
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(81, 69, 74, 0.08)",
        "soft-lg": "0 10px 25px -3px rgba(81, 69, 74, 0.12)",
        cute: "0 6px 0px 0px rgba(199, 109, 145, 0.25)",
      },
      borderRadius: {
        "3xl": "1.75rem",
        "4xl": "2.25rem",
      },
    },
  },
  plugins: [],
};
export default config;
