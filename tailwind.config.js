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
        background: 'hsl(215, 35%, 10%)',
        foreground: 'hsl(210, 30%, 90%)',
        accent: 'hsl(170, 70%, 45%)',
        border: 'hsl(215, 35%, 30%)',
        primary: 'hsl(210, 80%, 50%)',
        surface: 'hsl(215, 35%, 15%)',
        muted: 'hsl(215, 35%, 20%)',
        'muted-foreground': 'hsl(210, 30%, 70%)',
      },
      borderRadius: {
        lg: '12px',
        md: '8px',
        sm: '4px',
      },
      spacing: {
        'xl': '24px',
        'lg': '16px',
        'md': '8px',
        'sm': '4px',
      },
      boxShadow: {
        'card': '0 2px 8px hsla(0, 0%, 0%, 0.1)',
        'modal': '0 10px 30px hsla(0, 0%, 0%, 0.2)',
        'neon': '0 0 20px hsl(170, 70%, 45%)',
        'neon-sm': '0 0 10px hsl(170, 70%, 45%)',
      },
      animation: {
        'pulse-neon': 'pulse-neon 2s ease-in-out infinite alternate',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        'pulse-neon': {
          '0%': { boxShadow: '0 0 5px hsl(170, 70%, 45%)' },
          '100%': { boxShadow: '0 0 20px hsl(170, 70%, 45%), 0 0 30px hsl(170, 70%, 45%)' },
        },
        'glow': {
          '0%': { textShadow: '0 0 5px hsl(170, 70%, 45%)' },
          '100%': { textShadow: '0 0 10px hsl(170, 70%, 45%), 0 0 15px hsl(170, 70%, 45%)' },
        },
      },
    },
  },
  plugins: [],
}
