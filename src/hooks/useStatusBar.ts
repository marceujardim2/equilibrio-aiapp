/**
 * Hook para atualizar StatusBar e NavigationBar do Android dinamicamente
 */
import { useEffect } from 'react';
import { StatusBar, Platform } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';
import { useTheme } from '../contexts/ThemeContext';
import { tokens } from './tokens';

export const useStatusBar = () => {
  const { theme } = useTheme();
  
  useEffect(() => {
    if (Platform.OS === 'android') {
      const isDark = theme === 'dark';
      const backgroundColor = isDark ? tokens.colors.background : '#FAFBFC';
      
      // Configurar StatusBar
      StatusBar.setBarStyle(isDark ? 'light-content' : 'dark-content', true);
      StatusBar.setBackgroundColor(backgroundColor, true);
      
      // Configurar NavigationBar do sistema Android
      NavigationBar.setBackgroundColorAsync(backgroundColor);
      NavigationBar.setButtonStyleAsync(isDark ? 'light' : 'dark');
    }
  }, [theme]);
};

