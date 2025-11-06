/**
 * Onboarding Screen - Redesigned with new dark theme
 * 3 slides com microcopy otimista e motivacional
 */

import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { tokens } from '../hooks/tokens';
import { useThemedColors } from '../hooks/useThemedColors';
import { Button } from '../components';
import { useTheme } from '../contexts/ThemeContext';

const { width, height } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  emoji: string;
  title: string;
  description: string;
  gradient: [string, string];
}

const slides: OnboardingSlide[] = [
  {
    id: '1',
    icon: 'wallet',
    emoji: '💰',
    title: 'Controle seus gastos com clareza',
    description: 'Registre suas transações de forma rápida e visualize onde seu dinheiro está indo.',
    gradient: ['#000', '#000'], // substituído dinamicamente no render
  },
  {
    id: '2',
    icon: 'heart',
    emoji: '💚',
    title: 'Registre hábitos, evolua diariamente',
    description: 'Faça check-ins diários e acompanhe seu bem-estar com métricas simples e objetivas.',
    gradient: ['#000', '#000'], // substituído dinamicamente no render
  },
  {
    id: '3',
    icon: 'trending-up',
    emoji: '📈',
    title: 'Acompanhe seu equilíbrio',
    description: 'Veja como suas finanças e bem-estar se connectam em um dashboard completo.',
    gradient: ['#000', '#000'], // substituído dinamicamente no render
  },
];

interface OnboardingScreenProps {
  onComplete: () => void;
}

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const { theme, toggleTheme } = useTheme();
  const colors = useThemedColors();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      const nextIndex = currentIndex + 1;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const renderSlide = ({ item, index }: { item: OnboardingSlide; index: number }) => {
    const gradientByIndex: [string, string] =
      index === 0
        ? [colors.primary, colors.accent]
        : index === 1
        ? [colors.accent, colors.primary]
        : [colors.primary, colors.success];

    return (
      <View style={styles.slide}>
        <View style={styles.slideContent}>
          <LinearGradient
            colors={gradientByIndex}
            style={styles.iconContainer}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.emoji}>{item.emoji}</Text>
            <Ionicons name={item.icon} size={48} color={colors.background} style={styles.icon} />
          </LinearGradient>

          <Text style={[styles.title, { color: colors.textPrimary }]}>{item.title}</Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>{item.description}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable onPress={handleSkip} style={styles.skipButton}>
          <Text style={[styles.skipText, { color: colors.textSecondary }]}>Pular</Text>
        </Pressable>
        
        <Pressable onPress={toggleTheme} style={[styles.themeButton, { backgroundColor: colors.surface1 }]}>
          <Ionicons 
            name={theme === 'dark' ? 'sunny' : 'moon'} 
            size={24} 
            color={colors.textSecondary} 
          />
        </Pressable>
      </View>

      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        keyExtractor={(item) => item.id}
      />

      <View style={styles.footer}>
        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                { backgroundColor: colors.border },
                index === currentIndex && { width: 24, backgroundColor: colors.primary },
              ]}
            />
          ))}
        </View>

        <Button
          title={currentIndex === slides.length - 1 ? 'Começar agora' : 'Próximo'}
          onPress={handleNext}
          variant="primary"
          size="large"
          rightIcon={
            <Ionicons 
              name="arrow-forward" 
              size={20} 
              color={colors.background} 
            />
          }
          style={styles.nextButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: tokens.spacing.lg,
    paddingTop: tokens.spacing.md,
    paddingBottom: tokens.spacing.sm,
  },
  skipButton: {
    padding: tokens.spacing.sm,
  },
  themeButton: {
    padding: tokens.spacing.sm,
    borderRadius: tokens.radii.md,
    backgroundColor: tokens.colors.surface1,
    ...tokens.shadows.sm,
  },
  skipText: {
    ...tokens.typography.body,
    color: tokens.colors.textSecondary,
  },
  slide: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: tokens.spacing.xl,
  },
  slideContent: {
    alignItems: 'center',
    maxWidth: 320,
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: tokens.spacing.xl,
    position: 'relative',
  },
  emoji: {
    fontSize: 48,
    position: 'absolute',
    top: -10,
    right: -10,
  },
  icon: {
    marginTop: 10,
  },
  title: {
    ...tokens.typography.h1,
    color: tokens.colors.textPrimary,
    textAlign: 'center',
    marginBottom: tokens.spacing.md,
  },
  description: {
    ...tokens.typography.body,
    color: tokens.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: tokens.spacing.xl,
    paddingBottom: tokens.spacing.xl + 20,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: tokens.spacing.lg,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: tokens.colors.border,
    marginHorizontal: tokens.spacing.xs / 2,
  },
  dotActive: {
    width: 24,
    backgroundColor: tokens.colors.primary,
  },
  nextButton: {
    width: '100%',
  },
});
