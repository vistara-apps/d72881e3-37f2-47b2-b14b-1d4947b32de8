/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: 'hsl(215 35% 10%)',
        text: 'hsl(210 30% 90%)',
        accent: 'hsl(170 70% 45%)',
        border: 'hsl(215 35% 30%)',
        primary: 'hsl(210 80% 50%)',
        surface: 'hsl(215 35% 15%)',
      },
      borderRadius: {
        lg: '12px',
        md: '8px',
        sm: '4px',
      },
      spacing: {
        lg: '16px',
        md: '8px',
        sm: '4px',
        xl: '24px',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-up': 'slideUp 0.2s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

