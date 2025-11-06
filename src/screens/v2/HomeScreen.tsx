/**
 * Home/Dashboard Screen - Design System V2
 * Dashboard completo com métricas financeiras e bem-estar
 */
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useThemeV2';
import { Card } from '../../components/v2/Card';
import { FloatingActionButton } from '../../components/v2/FloatingActionButton';
import Svg, { Circle } from 'react-native-svg';

interface MetricCardProps {
  title: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  delay: number;
  onPress?: () => void;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, color, delay, onPress }) => {
  const theme = useTheme();
  return (
    <Animated.View entering={FadeInDown.delay(delay).springify()} style={{ flex: 1, marginHorizontal: 6 }}>
      <Card variant="elevated" padding="md" onPress={onPress}>
        <View style={styles.metricContent}>
          <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
            <Ionicons name={icon} size={24} color={color} />
          </View>
          <Text style={[styles.metricTitle, { color: theme.colors['text-secondary'], fontSize: theme.typography.small.size }]}>
            {title}
          </Text>
          <Text style={[styles.metricValue, { color }]}>
            {value}
          </Text>
        </View>
      </Card>
    </Animated.View>
  );
};

const ScoreCircle: React.FC<{ score: number }> = ({ score }) => {
  const theme = useTheme();
  const size = 180;
  const strokeWidth = 16;
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
          stroke={theme.colors.border}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={theme.colors.primary}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={styles.scoreTextContainer}>
        <Text style={[styles.scoreNumber, { color: theme.colors.primary, fontSize: theme.typography.display.size }]}>
          {score}
        </Text>
        <Text style={[styles.scoreLabel, { color: theme.colors['text-secondary'], fontSize: theme.typography.small.size }]}>
          Equilíbrio
        </Text>
      </View>
    </View>
  );
};

export const HomeScreen: React.FC = () => {
  const theme = useTheme();
  const [equilibriumScore, setEquilibriumScore] = useState(72);
  const [sleepHours, setSleepHours] = useState(7.5);
  const [mood, setMood] = useState('Bom');
  const [activityMinutes, setActivityMinutes] = useState(30);
  const [monthlySpent, setMonthlySpent] = useState(2450);
  const [monthlyBudget, setMonthlyBudget] = useState(3000);
  const [insight, setInsight] = useState('Que tal fazer um check-in hoje? 📝');

  const today = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const budgetProgress = monthlyBudget > 0 ? Math.min((monthlySpent / monthlyBudget) * 100, 100) : 0;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top', 'bottom']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text
              style={[
                styles.greeting,
                {
                  color: theme.colors['text-primary'],
                  fontSize: theme.typography.h2.size,
                  fontWeight: theme.typography.h2.weight.toString(),
                },
              ]}
            >
              Olá! 👋
            </Text>
            <Text
              style={[
                styles.date,
                {
                  color: theme.colors['text-secondary'],
                  fontSize: theme.typography.small.size,
                  textTransform: 'capitalize',
                },
              ]}
            >
              {today}
            </Text>
          </View>
          <Pressable>
            <Ionicons name="notifications-outline" size={24} color={theme.colors['text-primary']} />
          </Pressable>
        </View>

        <View style={styles.content}>
          {/* Score Circle */}
          <Animated.View entering={FadeInDown.springify()}>
            <ScoreCircle score={equilibriumScore} />
          </Animated.View>

          {/* Métricas */}
          <Text
            style={[
              styles.sectionTitle,
              {
                color: theme.colors['text-primary'],
                fontSize: theme.typography.h3.size,
                fontWeight: theme.typography.h3.weight.toString(),
                marginTop: theme.spacing.lg,
                marginBottom: theme.spacing.md,
              },
            ]}
          >
            Suas Métricas
          </Text>
          <View style={styles.metricsGrid}>
            <MetricCard
              title="Sono"
              value={sleepHours > 0 ? `${sleepHours}h` : '--'}
              icon="moon"
              color={theme.colors.accent}
              delay={100}
            />
            <MetricCard
              title="Humor"
              value={mood || '--'}
              icon="happy"
              color={theme.colors.warning}
              delay={200}
            />
            <MetricCard
              title="Atividade"
              value={activityMinutes > 0 ? `${activityMinutes} min` : '--'}
              icon="fitness"
              color={theme.colors.success}
              delay={300}
            />
            <MetricCard
              title="Gastos"
              value={`R$ ${monthlySpent.toFixed(0)}`}
              icon="cash"
              color={budgetProgress > 80 ? theme.colors.error : theme.colors.primary}
              delay={400}
            />
          </View>

          {/* Orçamento */}
          {monthlyBudget > 0 && (
            <Animated.View entering={FadeInDown.delay(500).springify()} style={{ marginTop: theme.spacing.lg }}>
              <Card variant="elevated" padding="lg">
                <View style={styles.budgetHeader}>
                  <Text
                    style={[
                      styles.budgetTitle,
                      {
                        color: theme.colors['text-primary'],
                        fontSize: theme.typography.h4.size,
                        fontWeight: theme.typography.h4.weight.toString(),
                      },
                    ]}
                  >
                    Orçamento do Mês
                  </Text>
                  <Text
                    style={[
                      styles.budgetAmount,
                      {
                        color: theme.colors['text-secondary'],
                        fontSize: theme.typography.body.size,
                      },
                    ]}
                  >
                    R$ {monthlySpent.toFixed(0)} / R$ {monthlyBudget.toFixed(0)}
                  </Text>
                </View>
                <View style={[styles.progressBar, { backgroundColor: theme.colors.border }]}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${budgetProgress}%`,
                        backgroundColor:
                          budgetProgress > 80 ? theme.colors.error : theme.colors.primary,
                      },
                    ]}
                  />
                </View>
              </Card>
            </Animated.View>
          )}

          {/* Insight Card */}
          <Animated.View entering={FadeInDown.delay(600).springify()} style={{ marginTop: theme.spacing.lg }}>
            <Card variant="glass" padding="lg">
              <View style={styles.insightHeader}>
                <Ionicons name="bulb" size={24} color={theme.colors.warning} />
                <Text
                  style={[
                    styles.insightTitle,
                    {
                      color: theme.colors['text-primary'],
                      fontSize: theme.typography.h4.size,
                      fontWeight: theme.typography.h4.weight.toString(),
                      marginLeft: theme.spacing.sm,
                    },
                  ]}
                >
                  Dica do Dia
                </Text>
              </View>
              <Text
                style={[
                  styles.insightText,
                  {
                    color: theme.colors['text-secondary'],
                    fontSize: theme.typography.body.size,
                    marginTop: theme.spacing.sm,
                  },
                ]}
              >
                {insight}
              </Text>
            </Card>
          </Animated.View>
        </View>
      </ScrollView>

      <FloatingActionButton
        onPress={() => {}}
        icon="add"
        position="bottom-right"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  greeting: {
    marginBottom: 4,
  },
  date: {},
  content: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  scoreContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 32,
  },
  scoreTextContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  scoreNumber: {
    fontWeight: '700',
  },
  scoreLabel: {
    marginTop: 4,
  },
  sectionTitle: {},
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  metricContent: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  metricTitle: {
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '600',
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  budgetTitle: {},
  budgetAmount: {},
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  insightTitle: {},
  insightText: {},
});
