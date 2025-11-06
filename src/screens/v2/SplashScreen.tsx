/**
 * Splash Screen - Design System V2
 * Tela de inicialização com animação suave
 */
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withRepeat, withSequence } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useThemeV2';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const theme = useTheme();
  const logoScale = useSharedValue(0.8);
  const logoOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(20);

  useEffect(() => {
    // Animação de entrada
    logoOpacity.value = withTiming(1, { duration: 600 });
    logoScale.value = withTiming(1, { duration: 600 });
    
    // Animação do texto
    setTimeout(() => {
      textOpacity.value = withTiming(1, { duration: 400 });
      textTranslateY.value = withTiming(0, { duration: 400 });
    }, 300);

    // Sair após 2 segundos
    setTimeout(() => {
      onFinish();
    }, 2000);
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslateY.value }],
  }));

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={theme.colors['gradient-surface']}
        style={StyleSheet.absoluteFill}
      />
      
      <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
        <View style={[styles.iconCircle, { backgroundColor: theme.colors.primary }]}>
          <Ionicons name="heart" size={64} color={theme.colors['text-primary']} />
        </View>
      </Animated.View>

      <Animated.View style={[styles.textContainer, textAnimatedStyle]}>
        <Text
          style={[
            styles.title,
            {
              color: theme.colors['text-primary'],
              fontSize: theme.typography.h1.size,
              fontWeight: theme.typography.h1.weight.toString(),
            },
          ]}
        >
          EquilíbrioAI
        </Text>
        <Text
          style={[
            styles.subtitle,
            {
              color: theme.colors['text-secondary'],
              fontSize: theme.typography.body.size,
            },
          ]}
        >
          seu app de finanças e bem-estar
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
  },
});
