/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bgDark: "#09090B",
        cardDark: "#111827",
        secCardDark: "#1A2233",
        accentBlue: "#3B82F6",
        accentGlow: "#60A5FA",
        statusSuccess: "#22C55E",
        statusWarning: "#F59E0B",
        statusDanger: "#EF4444",
        textSec: "#9CA3AF",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulseGlow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 12s linear infinite',
        'reverse-spin': 'reverseSpin 18s linear infinite',
        'wave': 'wave 1.5s ease-in-out infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        reverseSpin: {
          from: { transform: 'rotate(360deg)' },
          to: { transform: 'rotate(0deg)' },
        },
        wave: {
          '0%, 100%': { height: '8px' },
          '50%': { height: '32px' },
        }
      }
    },
  },
  plugins: [],
}
