export interface AppTheme {
  mode: 'light' | 'dark';
  colors: {
    background: string;
    backgroundOverlay: string;
    card: string;
    panel: string;
    panelInset: string;
    border: string;
    borderSubtle: string;
    text: string;
    muted: string;
    hint: string;
    accent: string;
    accentHover: string;
    accentSoft: string;
    button: string;
    buttonHover: string;
    badgeBg: string;
    badgeText: string;
    badgeBorder: string;
  };
  radii: {
    md: string;
    lg: string;
    xl: string;
    pill: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
  };
  fonts: {
    sans: string;
    mono: string;
  };
  shadows: {
    card: string;
  };
  transitions: {
    base: string;
  };
}

const common = {
  radii: {
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    pill: '999px',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
  },
  fonts: {
    sans: `'Pretendard', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif`,
    mono: `ui-monospace, Menlo, Consolas, Monaco`,
  },
  shadows: {
    card: '0 6px 24px rgba(0, 0, 0, 0.25)',
  },
  transitions: {
    base: '0.3s ease-in-out',
  },
};

export const darkTheme: AppTheme = {
  mode: 'dark',
  colors: {
    background: '#0d1117',
    backgroundOverlay: 'rgba(13, 17, 23, 0.95)',
    card: '#161b22',
    panel: '#1c2128',
    panelInset: '#1c2128',
    border: '#30363d',
    borderSubtle: 'rgba(48, 54, 61, 0.7)',
    text: '#f0f6fc',
    muted: '#c9d1d9',
    hint: '#8b949e',
    accent: '#2f81f7',
    accentHover: '#58a6ff',
    accentSoft: 'rgba(47, 129, 247, 0.28)',
    button: '#21262d',
    buttonHover: '#30363d',
    badgeBg: '#0e4429',
    badgeText: '#3fb950',
    badgeBorder: '#238636',
  },
  ...common,
};

export const lightTheme: AppTheme = {
  mode: 'light',
  colors: {
    background: '#f6f8ff',
    backgroundOverlay: 'rgba(246, 248, 255, 0.95)',
    card: '#ffffff',
    panel: '#f1f4ff',
    panelInset: '#e7ebff',
    border: '#d7dff5',
    borderSubtle: 'rgba(215, 223, 245, 0.8)',
    text: '#0b1220',
    muted: '#526086',
    hint: '#6c7a9d',
    accent: '#3b67ff',
    accentHover: '#5c7fff',
    accentSoft: 'rgba(59, 103, 255, 0.24)',
    button: '#e7ecff',
    buttonHover: '#d9e2ff',
    badgeBg: '#e3eaff',
    badgeText: '#233a6d',
    badgeBorder: '#97adf3',
  },
  ...common,
};
