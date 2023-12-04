/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        fadeIn: "fadeIn 0.2s ease-in-out",
      },

      // that is actual animation
      keyframes: (theme) => ({
        fadeIn: {
          "0%": {
            opacity: 0,
            transformOrigin: "center",
            transform: "scale(0.9)",
          },
          "100%": {
            opacity: 1,
            transformOrigin: "center",
            transform: "scale(1)",
          },
        },
      }),
    },
  },
  plugins: [],
};
