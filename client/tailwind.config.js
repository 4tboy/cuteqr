import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Quicksand', 'sans-serif'],
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        cupcake: {
          "primary": "#FFB3D9",      // Soft pastel pink
          "secondary": "#B3E5FC",    // Baby blue
          "accent": "#FFE082",       // Peach
          "neutral": "#2C3E50",      // Slate blue
          "base-100": "#FFFDFE",     // Light off-white
          "base-200": "#FFF0F6",     // Soft pink-blush
          "base-300": "#FFE3EE",     // Slightly darker blush
          "info": "#64B5F6",
          "success": "#81C784",
          "warning": "#FFB74D",
          "error": "#E57373",
        }
      },
      "pastel",
      "light"
    ]
  }
}
