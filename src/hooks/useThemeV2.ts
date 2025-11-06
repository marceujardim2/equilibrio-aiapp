/**
 * Hook para usar o tema atual com os novos design tokens
 */
import { useTheme as useThemeContext } from '../contexts/ThemeContext';
import { getTheme, Theme, ThemeMode } from './v2/theme';

export const useTheme = (): Theme => {
  const { theme } = useThemeContext();
  return getTheme(theme);
};

export const useThemeMode = (): ThemeMode => {
  const { theme } = useThemeContext();
  return theme;
};

export default useTheme;
