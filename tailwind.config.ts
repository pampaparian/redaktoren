import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#F4EEDF',
        oyster: '#EFE6D8',
        ink: '#171412',
        wine: '#5A1025',
        rose: '#E2A0B7',
        ember: '#D6464E',
        rule: 'rgba(23, 20, 18, 0.14)',
      },
      boxShadow: {
        crisp: '0 0 0 1px rgba(23, 20, 18, 0.14), 0 18px 50px rgba(23, 20, 18, 0.08)',
      },
      backgroundImage: {
        grain:
          'radial-gradient(circle at top left, rgba(255,255,255,0.28), transparent 34%), radial-gradient(circle at bottom right, rgba(23,20,18,0.05), transparent 30%)',
      },
      keyframes: {
        glow: {
          '0%, 100%': { opacity: '0.52', transform: 'scale(1)' },
          '50%': { opacity: '0.9', transform: 'scale(1.04)' },
        },
      },
      animation: {
        glow: 'glow 7s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

export default config
