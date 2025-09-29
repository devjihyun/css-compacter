/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        night: {
          DEFAULT: 'rgb(var(--color-night) / <alpha-value>)',
          card: 'rgb(var(--color-night-card) / <alpha-value>)',
          muted: 'rgb(var(--color-night-muted) / <alpha-value>)',
          text: 'rgb(var(--color-night-text) / <alpha-value>)',
          accent: 'rgb(var(--color-night-accent) / <alpha-value>)',
          border: 'rgb(var(--color-night-border) / <alpha-value>)',
          panel: 'rgb(var(--color-night-panel) / <alpha-value>)',
          button: 'rgb(var(--color-night-button) / <alpha-value>)',
          buttonHover: 'rgb(var(--color-night-button-hover) / <alpha-value>)',
          badgeBg: 'rgb(var(--color-night-badge-bg) / <alpha-value>)',
          badgeText: 'rgb(var(--color-night-badge-text) / <alpha-value>)',
          badgeBorder: 'rgb(var(--color-night-badge-border) / <alpha-value>)',
          hint: 'rgb(var(--color-night-hint) / <alpha-value>)',
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
