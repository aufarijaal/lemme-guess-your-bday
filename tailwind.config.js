/** @type {import('tailwindcss').Config} */
import defaultTheme from "tailwindcss/defaultTheme";

export default {
  content: ["./index.html", "./src/**/*.{tsx,ts,jsx,js,html}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Manrope", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};
