/**
 * Design Tokens - EquilíbrioAI
 * Sistema de design completo com dark e light theme
 * Compatível com React Native / Expo
 */

export type ThemeMode = 'dark' | 'light';

export interface ThemeColors {
  background: string;
  'surface-1': string;
  'surface-2': string;
  'surface-3': string;
  card: string;
  primary: string;
  'primary-variant': string;
  'primary-dark': string;
  accent: string;
  'accent-variant': string;
  muted: string;
  'text-primary': string;
  'text-secondary': string;
  'text-tertiary': string;
  success: string;
  warning: string;
  error: string;
  info: string;
  glass: string;
  border: string;
  'border-strong': string;
  overlay: string;
  'gradient-primary': string[];
  'gradient-accent': string[];
  'gradient-surface': string[];
}

export interface ThemeTypography {
  'font-family': string;
  h1: TypographyStyle;
  h2: TypographyStyle;
  h3: TypographyStyle;
  h4: TypographyStyle;
  body: TypographyStyle;
  'body-medium': TypographyStyle;
  small: TypographyStyle;
  caption: TypographyStyle;
  button: TypographyStyle;
  display: TypographyStyle;
}

export interface TypographyStyle {
  size: number;
  weight: number;
  lineHeight: number;
  letterSpacing?: number;
}

export interface ThemeSpacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  '2xl': number;
  '3xl': number;
}

export interface ThemeRadii {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  full: number;
}

export interface ThemeShadows {
  sm: ShadowStyle;
  md: ShadowStyle;
  lg: ShadowStyle;
  xl: ShadowStyle;
}

export interface ShadowStyle {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
}

export interface Theme {
  colors: ThemeColors;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  radii: ThemeRadii;
  shadows: ThemeShadows;
  opacity: {
    disabled: number;
    hover: number;
    pressed: number;
    overlay: number;
  };
  zIndex: {
    base: number;
    dropdown: number;
    sticky: number;
    fixed: number;
    'modal-backdrop': number;
    modal: number;
    popover: number;
    tooltip: number;
  };
  animation: {
    duration: {
      fast: number;
      normal: number;
      slow: number;
    };
    easing: {
      'ease-in': string;
      'ease-out': string;
      'ease-in-out': string;
    };
  };
}

// Dark Theme
export const darkTheme: Theme = {
  colors: {
    background: '#0B0F14',
    'surface-1': '#0F1418',
    'surface-2': '#12171C',
    'surface-3': '#121820',
    card: '#121820',
    primary: '#7DE3B6',
    'primary-variant': '#4FD9A0',
    'primary-dark': '#2DB67D',
    accent: '#60A7FF',
    'accent-variant': '#3D8AFF',
    muted: '#98A0AA',
    'text-primary': '#E6EEF2',
    'text-secondary': '#B9C4CC',
    'text-tertiary': '#98A0AA',
    success: '#5EE3B4',
    warning: '#FFD166',
    error: '#FF6B6B',
    info: '#60A7FF',
    glass: 'rgba(255,255,255,0.04)',
    border: 'rgba(255,255,255,0.08)',
    'border-strong': 'rgba(255,255,255,0.12)',
    overlay: 'rgba(0,0,0,0.7)',
    'gradient-primary': ['#7DE3B6', '#4FD9A0'],
    'gradient-accent': ['#60A7FF', '#3D8AFF'],
    'gradient-surface': ['#0F1418', '#12171C'],
  },
  typography: {
    'font-family': 'Inter, System',
    h1: { size: 28, weight: 700, lineHeight: 36, letterSpacing: -0.5 },
    h2: { size: 22, weight: 600, lineHeight: 30, letterSpacing: -0.3 },
    h3: { size: 20, weight: 600, lineHeight: 28, letterSpacing: 0 },
    h4: { size: 18, weight: 600, lineHeight: 26, letterSpacing: 0 },
    body: { size: 16, weight: 400, lineHeight: 22, letterSpacing: 0 },
    'body-medium': { size: 16, weight: 500, lineHeight: 22, letterSpacing: 0 },
    small: { size: 13, weight: 400, lineHeight: 18, letterSpacing: 0 },
    caption: { size: 11, weight: 400, lineHeight: 16, letterSpacing: 0.2 },
    button: { size: 16, weight: 600, lineHeight: 22, letterSpacing: 0.2 },
    display: { size: 36, weight: 700, lineHeight: 44, letterSpacing: -1 },
  },
  spacing: {
    xs: 6,
    sm: 12,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
    '3xl': 64,
  },
  radii: {
    xs: 4,
    sm: 8,
    md: 14,
    lg: 20,
    xl: 28,
    full: 9999,
  },
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.6,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.7,
      shadowRadius: 8,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.8,
      shadowRadius: 16,
      elevation: 8,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.9,
      shadowRadius: 24,
      elevation: 12,
    },
  },
  opacity: {
    disabled: 0.4,
    hover: 0.8,
    pressed: 0.6,
    overlay: 0.7,
  },
  zIndex: {
    base: 0,
    dropdown: 1000,
    sticky: 1100,
    fixed: 1200,
    'modal-backdrop': 1300,
    modal: 1400,
    popover: 1500,
    tooltip: 1600,
  },
  animation: {
    duration: {
      fast: 150,
      normal: 250,
      slow: 400,
    },
    easing: {
      'ease-in': 'cubic-bezier(0.4, 0, 1, 1)',
      'ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
      'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },
};

// Light Theme
export const lightTheme: Theme = {
  colors: {
    background: '#FAFBFC',
    'surface-1': '#FFFFFF',
    'surface-2': '#F7F9FA',
    'surface-3': '#F2F4F6',
    card: '#FFFFFF',
    primary: '#2DB67D',
    'primary-variant': '#4FD9A0',
    'primary-dark': '#1F8F5E',
    accent: '#3D8AFF',
    'accent-variant': '#60A7FF',
    muted: '#718096',
    'text-primary': '#1A202C',
    'text-secondary': '#4A5568',
    'text-tertiary': '#718096',
    success: '#2DB67D',
    warning: '#F6AD55',
    error: '#E53E3E',
    info: '#3D8AFF',
    glass: 'rgba(255,255,255,0.8)',
    border: 'rgba(0,0,0,0.08)',
    'border-strong': 'rgba(0,0,0,0.12)',
    overlay: 'rgba(0,0,0,0.5)',
    'gradient-primary': ['#2DB67D', '#4FD9A0'],
    'gradient-accent': ['#3D8AFF', '#60A7FF'],
    'gradient-surface': ['#FFFFFF', '#F7F9FA'],
  },
  typography: {
    'font-family': 'Inter, System',
    h1: { size: 28, weight: 700, lineHeight: 36, letterSpacing: -0.5 },
    h2: { size: 22, weight: 600, lineHeight: 30, letterSpacing: -0.3 },
    h3: { size: 20, weight: 600, lineHeight: 28, letterSpacing: 0 },
    h4: { size: 18, weight: 600, lineHeight: 26, letterSpacing: 0 },
    body: { size: 16, weight: 400, lineHeight: 22, letterSpacing: 0 },
    'body-medium': { size: 16, weight: 500, lineHeight: 22, letterSpacing: 0 },
    small: { size: 13, weight: 400, lineHeight: 18, letterSpacing: 0 },
    caption: { size: 11, weight: 400, lineHeight: 16, letterSpacing: 0.2 },
    button: { size: 16, weight: 600, lineHeight: 22, letterSpacing: 0.2 },
    display: { size: 36, weight: 700, lineHeight: 44, letterSpacing: -1 },
  },
  spacing: {
    xs: 6,
    sm: 12,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
    '3xl': 64,
  },
  radii: {
    xs: 4,
    sm: 8,
    md: 14,
    lg: 20,
    xl: 28,
    full: 9999,
  },
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.25,
      shadowRadius: 24,
      elevation: 12,
    },
  },
  opacity: {
    disabled: 0.4,
    hover: 0.8,
    pressed: 0.6,
    overlay: 0.5,
  },
  zIndex: {
    base: 0,
    dropdown: 1000,
    sticky: 1100,
    fixed: 1200,
    'modal-backdrop': 1300,
    modal: 1400,
    popover: 1500,
    tooltip: 1600,
  },
  animation: {
    duration: {
      fast: 150,
      normal: 250,
      slow: 400,
    },
    easing: {
      'ease-in': 'cubic-bezier(0.4, 0, 1, 1)',
      'ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
      'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },
};

// Helper function to get theme based on mode
export const getTheme = (mode: ThemeMode = 'dark'): Theme => {
  return mode === 'dark' ? darkTheme : lightTheme;
};

// Helper function for spacing multiplier
export const spacing = (multiplier: number): number => {
  return multiplier * 4;
};

// Export default (dark theme)
export const theme = darkTheme;

export default theme;
