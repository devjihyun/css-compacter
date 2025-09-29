/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        night: {
          DEFAULT: '#0b1220',
          card: '#121a2b',
          muted: '#9bb0d3',
          text: '#e6ecff',
          accent: '#6aa4ff',
          border: '#1c2742',
          panel: '#0e1526',
          button: '#111a2e',
          buttonHover: '#15203a',
          badgeBg: '#0e3a7a',
          badgeText: '#cfe3ff',
          badgeBorder: '#1f58b9',
          hint: '#a8b6d8',
        },
      },
      boxShadow: {
        card: '0 6px 24px rgba(0, 0, 0, 0.25)',
      },
      fontFamily: {
        sans: [
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
        mono: [
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'Liberation Mono',
          'Courier New',
          'monospace',
        ],
      },
    },
  },
  plugins: [],
};
