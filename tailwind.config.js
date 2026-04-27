/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      gridTemplateColumns: {
        '24': 'repeat(24, minmax(0, 1fr))',
      },
      fontFamily: {
        mono: ['"IBM Plex Mono"', 'monospace'],
        sans: ['"IBM Plex Mono"', 'monospace'],
      },
      colors: {
        'cyber-green': '#00ff41',
        'cyber-pink': '#ff0055',
        'system-bg': '#050505',
        'system-border': 'rgba(0, 255, 65, 0.2)',
        background: '#050505',
        foreground: '#00ff41',
        primary: {
          DEFAULT: '#00ff41',
          foreground: '#050505',
        },
        muted: {
          DEFAULT: 'rgba(0, 255, 65, 0.1)',
          foreground: 'rgba(0, 255, 65, 0.6)',
        },
        border: 'rgba(0, 255, 65, 0.2)',
        input: 'rgba(0, 255, 65, 0.1)',
        ring: '#00ff41',
      },
      keyframes: {
        glitch: {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
          '100%': { transform: 'translate(0)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        'pulse-fast': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        }
      },
      animation: {
        glitch: 'glitch 0.3s cubic-bezier(.25,.46,.45,.94) both infinite',
        scanline: 'scanline 8s linear infinite',
        'pulse-fast': 'pulse-fast 1s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
}