import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase';
import { useTheme } from '../contexts/ThemeContext';
import { useThemedColors } from '../hooks/useThemedColors';
import { tokens } from '../hooks/tokens';
import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import RootNavigator from './index';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthScreen = 'onboarding' | 'login' | 'signup';

export default function AuthNavigator() {
  const { theme } = useTheme();
  const colors = useThemedColors();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentScreen, setCurrentScreen] = useState<AuthScreen>('onboarding');
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  useEffect(() => {
    // Verificar se já viu o onboarding
    checkOnboardingStatus();

    // Listener de autenticação
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const value = await AsyncStorage.getItem('@onboarding_complete');
      if (value === 'true') {
        setHasSeenOnboarding(true);
        setCurrentScreen('login');
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error);
    }
  };

  const handleOnboardingComplete = async () => {
    try {
      await AsyncStorage.setItem('@onboarding_complete', 'true');
      setHasSeenOnboarding(true);
      setCurrentScreen('login');
    } catch (error) {
      console.error('Error saving onboarding status:', error);
    }
  };

  const backgroundColor = colors.background;

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor }]}>
        <ActivityIndicator size="large" color={tokens.colors.primary} />
      </View>
    );
  }

  // Se o usuário está autenticado, mostra o app
  if (user) {
    return <RootNavigator />;
  }

  // Fluxo de autenticação
  if (!hasSeenOnboarding && currentScreen === 'onboarding') {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  if (currentScreen === 'login') {
    return (
      <LoginScreen
        onLoginSuccess={() => setUser(auth.currentUser)}
        onNavigateToSignup={() => setCurrentScreen('signup')}
      />
    );
  }

  if (currentScreen === 'signup') {
    return (
      <SignupScreen
        onSignupSuccess={() => setUser(auth.currentUser)}
        onNavigateToLogin={() => setCurrentScreen('login')}
      />
    );
  }

  return null;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
