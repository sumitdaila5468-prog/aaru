import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: 'rgb(var(--ink-rgb) / <alpha-value>)',
        'ink-dark': 'rgb(var(--ink-dark-rgb) / <alpha-value>)',
        rose: 'rgb(var(--rose-rgb) / <alpha-value>)',
        roseglow: 'rgb(var(--roseglow-rgb) / <alpha-value>)',
        blush: 'rgb(var(--blush-rgb) / <alpha-value>)',
        cream: 'rgb(var(--cream-rgb) / <alpha-value>)',
        wine: 'rgb(var(--wine-rgb) / <alpha-value>)',
        'wine-light': 'rgb(var(--wine-light-rgb) / <alpha-value>)',
        gold: 'rgb(var(--gold-rgb) / <alpha-value>)',
        lavender: 'rgb(var(--lavender-rgb) / <alpha-value>)',
        night: 'rgb(var(--night-rgb) / <alpha-value>)',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'sunset-blush': 'linear-gradient(180deg, #FFE8EE 0%, #FFF7F8 35%, #FFE8C7 72%, #F8C8D4 100%)',
        'wine-lavender': 'linear-gradient(180deg, #5A1832 0%, #7A2945 45%, #9E3D5C 75%, #E8D9FF 100%)',
      },
    },
  },
  plugins: [],
} satisfies Config
