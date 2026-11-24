/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Tokens oficiais REVENDI (README_IDENTIDADE_VISUAL.md)
        revendi: {
          bg: '#09090B',
          surface: '#18181B',
          border: '#27272A',
          neon: '#22C55E',
          mint: '#4ADE80',
          text: '#F4F4F5',
          muted: '#A1A1AA',
        },
        // Aliases semânticos usados pelo CSS legado (preserva o visual atual)
        bg: '#09090B',
        surface: '#18181B',
        border: '#27272A',
        neon: '#22C55E',
        mint: '#4ADE80',
        text: '#F4F4F5',
        muted: '#A1A1AA',
        kraft: '#09090B',
        card: '#18181B',
        ink: '#F4F4F5',
        'ink-muted': '#A1A1AA',
        line: '#27272A',
        ochre: '#22C55E',
        focus: '#4ADE80',
        profit: '#22C55E',
        'profit-bg': 'rgba(34, 197, 94, 0.12)',
        loss: '#F87171',
        'loss-bg': 'rgba(248, 113, 113, 0.12)',
        'neon-strong': '#16A34A',
        'loss-strong': '#962E27',
      },
      fontFamily: {
        serif: ['Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'Consolas', 'monospace'],
      },
      boxShadow: {
        modal: '0 4px 16px rgba(31, 42, 36, 0.12)',
        auth: '0 24px 60px -40px rgba(34, 197, 94, 0.35)',
        card: '0 12px 28px -18px rgba(34, 197, 94, 0.3)',
      },
      keyframes: {
        'rise-in': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'hero-glow': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.9' },
        },
        spin: {
          to: { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'rise-in': 'rise-in 0.7s ease-out both',
        'hero-glow': 'hero-glow 6s ease-in-out infinite',
        'spin': 'spin 0.8s linear infinite',
      },
    },
  },
  plugins: [],
}