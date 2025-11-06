/**
 * Design Tokens - EquilíbrioAI Dark Theme
 * Tokens completos para uso no React Native
 */

export const designTokens = {
  colors: {
    background: '#0B0F14',
    surface1: '#0F1418',
    surface2: '#12171C',
    surface3: '#1A2024',
    card: '#121820',
    
    primary: '#7DE3B6',
    primaryVariant: '#4FD9A0',
    primaryLight: '#A4F0D0',
    primaryDark: '#3DB585',
    
    accent: '#60A7FF',
    accentVariant: '#3D8AFF',
    
    muted: '#98A0AA',
    
    textPrimary: '#E6EEF2',
    textSecondary: '#B9C4CC',
    textTertiary: '#8A9399',
    
    success: '#5EE3B4',
    successDark: '#3DB585',
    warning: '#FFD166',
    warningDark: '#FFB84D',
    error: '#FF6B6B',
    errorDark: '#FF4757',
    info: '#60A7FF',
    
    glass: 'rgba(255,255,255,0.04)',
    glassLight: 'rgba(255,255,255,0.08)',
    overlay: 'rgba(0,0,0,0.7)',
    border: 'rgba(255,255,255,0.08)',
    borderLight: 'rgba(255,255,255,0.12)',
    divider: 'rgba(255,255,255,0.06)',
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
  
  typography: {
    fontFamily: 'Inter, System',
    fontFamilyMono: 'Menlo, Monaco, monospace',
    
    h1: {
      fontSize: 28,
      fontWeight: '700' as const,
      lineHeight: 36,
      letterSpacing: -0.5,
    },
    h2: {
      fontSize: 22,
      fontWeight: '600' as const,
      lineHeight: 30,
      letterSpacing: -0.3,
    },
    h3: {
      fontSize: 20,
      fontWeight: '600' as const,
      lineHeight: 28,
      letterSpacing: 0,
    },
    h4: {
      fontSize: 18,
      fontWeight: '600' as const,
      lineHeight: 24,
      letterSpacing: 0,
    },
    body: {
      fontSize: 16,
      fontWeight: '400' as const,
      lineHeight: 22,
      letterSpacing: 0,
    },
    bodySm: {
      fontSize: 14,
      fontWeight: '400' as const,
      lineHeight: 20,
      letterSpacing: 0,
    },
    small: {
      fontSize: 13,
      fontWeight: '400' as const,
      lineHeight: 18,
      letterSpacing: 0,
    },
    caption: {
      fontSize: 12,
      fontWeight: '400' as const,
      lineHeight: 16,
      letterSpacing: 0.2,
    },
    button: {
      fontSize: 16,
      fontWeight: '600' as const,
      lineHeight: 24,
      letterSpacing: 0.3,
    },
    label: {
      fontSize: 13,
      fontWeight: '600' as const,
      lineHeight: 18,
      letterSpacing: 0.2,
    },
  },
  
  shadows: {
    sm: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.6,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.7,
      shadowRadius: 8,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.8,
      shadowRadius: 16,
      elevation: 8,
    },
    xl: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.9,
      shadowRadius: 24,
      elevation: 12,
    },
  },
  
  motion: {
    duration: {
      fast: 150,
      normal: 300,
      slow: 500,
    },
    easing: {
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    },
    scale: {
      press: 0.97,
      hover: 1.02,
    },
  },
  
  zIndex: {
    base: 0,
    dropdown: 1000,
    sticky: 1100,
    overlay: 1200,
    modal: 1300,
    popover: 1400,
    tooltip: 1500,
    fab: 100,
  },
  
  opacity: {
    disabled: 0.5,
    hover: 0.8,
    overlayLight: 0.4,
    overlayMedium: 0.6,
    overlayHeavy: 0.8,
  },
};

// Helper para acesso fácil
export const tokens = designTokens;

// Função helper para spacing
export const spacing = (multiplier: number = 1) => designTokens.spacing.md * multiplier;

// Função helper para cores com opacidade
export const colorWithOpacity = (color: string, opacity: number) => {
  // Converte hex para rgba
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export type DesignTokens = typeof designTokens;

