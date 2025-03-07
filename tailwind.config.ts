import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/flowbite-react/**/*.js", // ✅ Correct Flowbite import
  ],
  theme: {
    extend: {},
  },
  plugins: [require("flowbite/plugin")], // ✅ Correct Flowbite plugin import
};

export default config;
