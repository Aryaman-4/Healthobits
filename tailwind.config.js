/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#F7F7F7',
        duoCharcoal: '#3C3C3C',
        duoMuted: '#777777',
        duoBorder: '#E5E5E5',
        body: {
          DEFAULT: '#FF4B4B',
          dark: '#EA2B2B',
          tint: '#FFDFE0',
        },
        mind: {
          DEFAULT: '#1CB0F6',
          dark: '#1899D6',
          tint: '#DDF4FF',
        },
        craft: {
          DEFAULT: '#FFC800',
          dark: '#E5A400',
          tint: '#FFF5D6',
        },
        bonds: {
          DEFAULT: '#58CC02',
          dark: '#46A302',
          tint: '#D7FFB8',
        },
        empire: {
          DEFAULT: '#CE82FF',
          dark: '#A560E8',
          tint: '#F3E5FF',
        },
      },
      fontFamily: {
        fredoka: ['Fredoka', 'Nunito', 'Plus Jakarta Sans', 'sans-serif'],
        nunito: ['Nunito', 'Fredoka', 'Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        '3d-sm': '0 3px 0 0 rgba(0, 0, 0, 0.1)',
        '3d-md': '0 4px 0 0 rgba(0, 0, 0, 0.15)',
        '3d-lg': '0 8px 0 0 rgba(0, 0, 0, 0.15)',
      },
      keyframes: {
        bounceSmall: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        pop: {
          '0%': { transform: 'scale(0.95)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      animation: {
        'bounce-soft': 'bounceSmall 2s infinite ease-in-out',
        'wiggle': 'wiggle 0.5s ease-in-out infinite',
        'pop': 'pop 0.25s ease-out',
      },
    },
  },
  plugins: [],
}

