/**
 * Hook para obter cores dinâmicas baseadas no tema atual
 * Retorna cores que mudam automaticamente com o tema claro/escuro
 */
import { useTheme } from '../contexts/ThemeContext';
import { tokens } from './tokens';

export const useThemedColors = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return {
    // Backgrounds
    background: isDark ? tokens.colors.background : '#F9FAFB',
    surface1: isDark ? tokens.colors.surface1 : '#FFFFFF',
    surface2: isDark ? tokens.colors.surface2 : '#F3F4F6',
    surface3: isDark ? tokens.colors.surface3 : '#EEF2F7',
    card: isDark ? tokens.colors.card : '#FFFFFF',

    // Textos
    textPrimary: isDark ? tokens.colors.textPrimary : '#1C1C1E',
    textSecondary: isDark ? tokens.colors.textSecondary : '#6B7280',
    textTertiary: isDark ? tokens.colors.textTertiary : '#9CA3AF',

    // Cores principais
    primary: isDark ? tokens.colors.primary : '#00C896',
    primaryVariant: tokens.colors.primaryVariant,
    accent: isDark ? tokens.colors.accent : '#0077FF',
    muted: isDark ? tokens.colors.muted : '#9CA3AF',

    // Estados
    success: tokens.colors.success,
    warning: tokens.colors.warning,
    error: tokens.colors.error,
    info: tokens.colors.info,

    // Bordas e overlays
    border: isDark ? tokens.colors.border : '#E5E7EB',
    borderLight: isDark ? tokens.colors.borderLight : '#E5E7EB',
    divider: isDark ? tokens.colors.divider : '#E5E7EB',
    glass: isDark ? tokens.colors.glass : 'rgba(0,0,0,0.04)',
    overlay: tokens.colors.overlay,
  };
};
