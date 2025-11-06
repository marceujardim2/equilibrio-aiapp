import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar, Platform } from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import AuthNavigator from './src/navigation/AuthNavigator';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';
import { useStatusBar } from './src/hooks/useStatusBar';

function AppContent() {
  const { theme } = useTheme();
  useStatusBar(); // Atualiza StatusBar dinamicamente
  
  const isDark = theme === 'dark';
  
  return (
    <SafeAreaProvider>
      {/* StatusBar do React Native para Android */}
      {Platform.OS === 'android' && (
        <StatusBar
          barStyle={isDark ? 'light-content' : 'dark-content'}
          backgroundColor={isDark ? '#0B0F14' : '#FAFBFC'}
          translucent={false}
        />
      )}
      {/* StatusBar do Expo para iOS */}
      <ExpoStatusBar style={isDark ? 'light' : 'dark'} />
      <AuthNavigator />
    </SafeAreaProvider>
  );
}

export default function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
