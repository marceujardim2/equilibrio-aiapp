/**
 * Onboarding Screen - Design System V2
 * Tela de onboarding com slides modernos e microcopy otimista
 */
import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable, FlatList } from 'react-native';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useThemeV2';
import { Button } from '../../components/v2/Button';
import { Card } from '../../components/v2/Card';

const { width } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  gradient: string[];
  emoji: string;
}

const slides: OnboardingSlide[] = [
  {
    id: '1',
    icon: 'wallet-outline',
    title: 'Controle seus gastos com clareza',
    description: 'Veja para onde vai seu dinheiro e tome decisões mais inteligentes',
    gradient: ['#7DE3B6', '#4FD9A0'],
    emoji: '💰',
  },
  {
    id: '2',
    icon: 'fitness-outline',
    title: 'Registre hábitos, evolua diariamente',
    description: 'Acompanhe seu bem-estar e construa uma rotina mais equilibrada',
    gradient: ['#60A7FF', '#3D8AFF'],
    emoji: '💪',
  },
  {
    id: '3',
    icon: 'trophy-outline',
    title: 'Conquiste seus objetivos',
    description: 'Ganhe badges, mantenha streaks e celebre cada conquista',
    gradient: ['#FFD166', '#FFB347'],
    emoji: '🎯',
  },
];

interface OnboardingScreenProps {
  onComplete: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const theme = useTheme();
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

  const renderSlide = ({ item }: { item: OnboardingSlide }) => (
    <View style={[styles.slide, { width }]}>
      <Animated.View
        entering={FadeInRight.duration(400)}
        exiting={FadeOutLeft.duration(400)}
        style={styles.slideContent}
      >
        <Card variant="elevated" padding="lg" style={styles.iconCard}>
          <LinearGradient
            colors={item.gradient}
            style={styles.iconGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.emoji}>{item.emoji}</Text>
            <Ionicons name={item.icon} size={48} color={theme.colors['text-primary']} />
          </LinearGradient>
        </Card>

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
          {item.title}
        </Text>
        <Text
          style={[
            styles.description,
            {
              color: theme.colors['text-secondary'],
              fontSize: theme.typography.body.size,
            },
          ]}
        >
          {item.description}
        </Text>
      </Animated.View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Pressable onPress={handleSkip} style={styles.skipButton}>
        <Text style={[styles.skipText, { color: theme.colors['text-secondary'] }]}>
          Pular
        </Text>
      </Pressable>

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
                {
                  backgroundColor:
                    index === currentIndex
                      ? theme.colors.primary
                      : theme.colors.border,
                  width: index === currentIndex ? 24 : 8,
                },
              ]}
            />
          ))}
        </View>

        <Button
          title={currentIndex === slides.length - 1 ? 'Começar agora' : 'Próximo'}
          onPress={handleNext}
          variant="primary"
          size="large"
          fullWidth
          icon={
            <Ionicons
              name="arrow-forward"
              size={20}
              color={theme.colors['text-primary']}
              style={{ marginRight: theme.spacing.xs }}
            />
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipButton: {
    position: 'absolute',
    top: 50,
    right: 24,
    zIndex: 10,
    padding: 12,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '500',
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  slideContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  iconCard: {
    marginBottom: 48,
    overflow: 'hidden',
  },
  iconGradient: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  description: {
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 48,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    transition: 'all 0.3s',
  },
});
