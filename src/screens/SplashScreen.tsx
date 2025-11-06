/**
 * Splash Screen - Redesigned with new dark theme
 * Tela inicial com logo e animação de entrada
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSpring,
  withSequence,
  runOnJS,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { tokens } from '../hooks/tokens';
import { useThemedColors } from '../hooks/useThemedColors';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const colors = useThemedColors();
  const logoScale = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(20);

  useEffect(() => {
    // Animação de entrada
    logoScale.value = withSpring(1, {
      damping: 10,
      stiffness: 100,
    });
    logoOpacity.value = withTiming(1, { duration: 600 });
    
    // Texto aparece após logo
    setTimeout(() => {
      textOpacity.value = withTiming(1, { duration: 400 });
      textTranslateY.value = withSpring(0, {
        damping: 15,
        stiffness: 100,
      });
    }, 400);

    // Completa após 2 segundos
    setTimeout(() => {
      onComplete();
    }, 2000);
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslateY.value }],
  }));

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      <LinearGradient
        colors={[colors.background, colors.surface1]}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <Animated.View style={[styles.logoContainer, logoStyle]}>
            <View style={[styles.iconWrapper, { backgroundColor: colors.glass, borderColor: colors.primary }]}>
              <Ionicons name="heart-circle" size={100} color={colors.primary} />
            </View>
          </Animated.View>
          
          <Animated.View style={[styles.textContainer, textStyle]}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>EquilíbrioAI</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Seu app de finanças e bem-estar
            </Text>
          </Animated.View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.background,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: tokens.spacing.xl,
  },
  logoContainer: {
    marginBottom: tokens.spacing.xl,
  },
  iconWrapper: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: tokens.colors.glass,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: tokens.colors.primary,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    ...tokens.typography.h1,
    color: tokens.colors.textPrimary,
    marginBottom: tokens.spacing.sm,
    fontWeight: '700',
  },
  subtitle: {
    ...tokens.typography.body,
    color: tokens.colors.textSecondary,
    textAlign: 'center',
  },
});

