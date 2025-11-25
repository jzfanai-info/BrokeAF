/** @type {import('tailwindcss').Config} */
export default {
content: [
  "./index.html",
  "./*.{js,ts,jsx,tsx}",     // ← ADDED
  "./components/**/*.{js,ts,jsx,tsx}",
  "./services/**/*.{js,ts,jsx,tsx}",
],

  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'broke-pink': '#ec4899',
        'broke-purple': '#8b5cf6',
        'broke-teal': '#06b6d4',
        'broke-dark': '#130b20',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'Inter', 'sans-serif'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" }
        },
        fadeInUp: {
          "0%": { opacity: 0, transform: "translateY(20px)" },
          "100%": { opacity: 1, transform: "translateY(0)" }
        },
      },
    },
  },
  plugins: [],
}
