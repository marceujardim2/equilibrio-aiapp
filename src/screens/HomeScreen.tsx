import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components';
import { colors, spacing, typography, borderRadius, shadows } from '../theme';
import Svg, { Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');

interface CategoryCardProps {
  title: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  delay: number;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ title, value, icon, color, delay }) => (
  <Animated.View entering={FadeInDown.delay(delay).springify()} style={styles.categoryCard}>
    <Card style={styles.card}>
      <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <Text style={styles.categoryTitle}>{title}</Text>
      <Text style={[styles.categoryValue, { color }]}>{value}</Text>
    </Card>
  </Animated.View>
);

const ScoreCircle: React.FC<{ score: number }> = ({ score }) => {
  const size = 200;
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = (score / 100) * circumference;

  return (
    <View style={styles.scoreContainer}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.gray200}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.primary}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <View style={styles.scoreTextContainer}>
        <Text style={styles.scoreNumber}>{score}</Text>
        <Text style={styles.scoreLabel}>Equilíbrio</Text>
      </View>
    </View>
  );
};

export default function HomeScreen() {
  const equilibriumScore = 78;
  const today = new Date().toLocaleDateString('pt-BR', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long' 
  });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={[colors.primary + '15', colors.background]}
        style={styles.header}
      >
        <Text style={styles.greeting}>Olá! 👋</Text>
        <Text style={styles.date}>{today}</Text>
      </LinearGradient>

      <View style={styles.content}>
        <Animated.View entering={FadeInDown.springify()}>
          <ScoreCircle score={equilibriumScore} />
        </Animated.View>

        <Text style={styles.sectionTitle}>Suas Métricas</Text>

        <View style={styles.grid}>
          <CategoryCard
            title="Sono"
            value="7.5h"
            icon="moon"
            color={colors.sleep}
            delay={100}
          />
          <CategoryCard
            title="Humor"
            value="Ótimo"
            icon="happy"
            color={colors.mood}
            delay={200}
          />
          <CategoryCard
            title="Atividade"
            value="45 min"
            icon="fitness"
            color={colors.activity}
            delay={300}
          />
          <CategoryCard
            title="Finanças"
            value="R$ 450"
            icon="wallet"
            color={colors.financePositive}
            delay={400}
          />
        </View>

        <Animated.View entering={FadeInDown.delay(500).springify()}>
          <Card style={styles.insightCard}>
            <View style={styles.insightHeader}>
              <Ionicons name="bulb" size={24} color={colors.warning} />
              <Text style={styles.insightTitle}>Dica do Dia</Text>
            </View>
            <Text style={styles.insightText}>
              Você dormiu bem! Aproveite para fazer uma atividade física leve hoje.
            </Text>
          </Card>
        </Animated.View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  greeting: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  date: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    textTransform: 'capitalize',
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  scoreContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.xl,
  },
  scoreTextContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  scoreNumber: {
    ...typography.h1,
    fontSize: 48,
    color: colors.primary,
    fontWeight: '700',
  },
  scoreLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs,
    marginBottom: spacing.lg,
  },
  categoryCard: {
    width: '50%',
    padding: spacing.xs,
  },
  card: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  categoryTitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  categoryValue: {
    ...typography.h4,
    fontWeight: '700',
  },
  insightCard: {
    backgroundColor: colors.warning + '10',
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  insightTitle: {
    ...typography.h4,
    color: colors.text,
    marginLeft: spacing.sm,
  },
  insightText: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
  },
});
