/**
 * Home/Dashboard Screen - Redesigned with new dark theme
 * Dashboard completo com métricas financeiras e bem-estar
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useThemedColors } from '../hooks/useThemedColors';
import { tokens } from '../theme';
import { Card } from '../components';
import { auth } from '../services/firebase';
import Svg, { Circle } from 'react-native-svg';

interface MetricCardProps {
  title: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  delay: number;
  onPress?: () => void;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, color, delay, onPress }) => (
  <Animated.View entering={FadeInDown.delay(delay).springify()}>
    <Card variant="elevated" padding="md" onPress={onPress}>
      <View style={styles.metricContent}>
        <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
          <Ionicons name={icon} size={24} color={color} />
        </View>
        <Text style={styles.metricTitle}>{title}</Text>
        <Text style={[styles.metricValue, { color }]}>{value}</Text>
      </View>
    </Card>
  </Animated.View>
);

const ScoreCircle: React.FC<{ score: number; colors: ReturnType<typeof useThemedColors> }> = ({ score, colors }) => {
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
          stroke={colors.border}
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
        <Text style={[styles.scoreNumber, { color: colors.primary }]}>{score}</Text>
        <Text style={[styles.scoreLabel, { color: colors.textSecondary }]}>Equilíbrio</Text>
      </View>
    </View>
  );
};

export default function HomeScreen() {
  const colors = useThemedColors();
  const [equilibriumScore, setEquilibriumScore] = useState(0);
  const [sleepHours, setSleepHours] = useState(0);
  const [mood, setMood] = useState('');
  const [activityMinutes, setActivityMinutes] = useState(0);
  const [financialBalance, setFinancialBalance] = useState(0);
  const [monthlySpent, setMonthlySpent] = useState(0);
  const [monthlyBudget, setMonthlyBudget] = useState(3000);
  const [userName, setUserName] = useState('');
  const [insight, setInsight] = useState('Faça seu primeiro check-in para ver suas métricas!');

  const today = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  useEffect(() => {
    loadUserData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadTodayData();
    }, [])
  );

  const loadUserData = () => {
    const user = auth.currentUser;
    if (user?.displayName) {
      setUserName(user.displayName.split(' ')[0]);
    }
  };

  const loadTodayData = async () => {
    try {
      const userId = auth.currentUser?.uid || 'guest';
      const todayDate = new Date().toISOString().split('T')[0];
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();

      // Carregar check-in do dia
      const checkinKey = `checkin_${todayDate}`;
      const checkinData = await AsyncStorage.getItem(checkinKey);

      // Carregar transações do mês
      const transactionsKey = `transactions_${userId}`;
      const transactionsData = await AsyncStorage.getItem(transactionsKey);

      // Carregar atividades de wellness
      const wellnessKey = `wellness_activities_${userId}_${todayDate}`;
      const wellnessData = await AsyncStorage.getItem(wellnessKey);

      let sleepScore = 0;
      let moodScore = 0;
      let activityScore = 0;
      let financeScore = 0;

      // Processar check-in
      if (checkinData) {
        const checkin = JSON.parse(checkinData);

        setSleepHours(checkin.sleepHours || 0);
        if (checkin.sleepHours >= 7 && checkin.sleepHours <= 9) {
          sleepScore = 10;
        } else if (checkin.sleepHours >= 6 && checkin.sleepHours <= 10) {
          sleepScore = 7;
        } else {
          sleepScore = 4;
        }

        setMood(getMoodLabel(checkin.mood));
        moodScore = (checkin.mood || 3) * 2;

        if (checkin.physicalActivity) {
          activityScore = 10;
          setActivityMinutes(30);
        }
      }

      // Processar atividades de wellness
      if (wellnessData) {
        const activities = JSON.parse(wellnessData);
        const totalMinutes = activities.length * 10;
        setActivityMinutes((prev) => prev + totalMinutes);
        activityScore = Math.min(10, activityScore + activities.length * 2);
      }

      // Processar finanças
      if (transactionsData) {
        const transactions = JSON.parse(transactionsData);
        const monthTransactions = transactions.filter((t: any) => {
          const tDate = new Date(t.date);
          return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;
        });

        const expenses = monthTransactions
          .filter((t: any) => t.type === 'expense')
          .reduce((sum: number, t: any) => sum + t.amount, 0);

        const income = monthTransactions
          .filter((t: any) => t.type === 'income')
          .reduce((sum: number, t: any) => sum + t.amount, 0);

        const balance = income - expenses;
        setFinancialBalance(balance);
        setMonthlySpent(expenses);

        if (balance > 0) {
          financeScore = 10;
        } else if (balance > -500) {
          financeScore = 7;
        } else {
          financeScore = 4;
        }
      } else {
        financeScore = 5;
      }

      // Calcular score total
      const totalScore = Math.round(
        (sleepScore * 2.5 + moodScore * 2.5 + activityScore * 2.5 + financeScore * 2.5)
      );
      setEquilibriumScore(totalScore);

      // Gerar insight
      generateInsight(sleepScore, moodScore, activityScore, financeScore);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const getMoodLabel = (moodValue: number): string => {
    const moods = ['Péssimo', 'Ruim', 'Ok', 'Bom', 'Ótimo'];
    return moods[moodValue - 1] || 'Ok';
  };

  const generateInsight = (sleep: number, mood: number, activity: number, finance: number) => {
    const scores = [
      { name: 'sono', value: sleep, message: 'Você dormiu bem! Continue mantendo essa rotina. 😴' },
      { name: 'humor', value: mood, message: 'Seu humor está ótimo! Aproveite o dia. 😊' },
      { name: 'atividade', value: activity, message: 'Parabéns pela atividade física! Continue assim. 💪' },
      { name: 'finanças', value: finance, message: 'Suas finanças estão equilibradas! 💰' },
    ];

    const weakest = scores.reduce((prev, current) =>
      current.value < prev.value ? current : prev
    );

    if (weakest.value < 5) {
      const suggestions: any = {
        sono: 'Tente dormir mais cedo hoje. O sono é fundamental para o equilíbrio! 🌙',
        humor: 'Que tal uma meditação ou conversar com alguém querido? 💚',
        atividade: 'Uma caminhada de 15 minutos pode fazer maravilhas! 🚶',
        finanças: 'Revise seus gastos e veja onde pode economizar. 📊',
      };
      setInsight(suggestions[weakest.name]);
    } else {
      setInsight(scores.reduce((prev, current) =>
        current.value > prev.value ? current : prev
      ).message);
    }
  };

  // Progresso do orçamento com proteção contra divisões inválidas/NaN
  const budgetProgress = monthlyBudget && Number.isFinite(monthlyBudget) && monthlyBudget > 0
    ? Math.min(Math.max((monthlySpent / monthlyBudget) * 100, 0), 100)
    : 0;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 0 }}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.textPrimary }]}>
              Olá{userName ? `, ${userName}` : ''}! 👋
            </Text>
            <Text style={[styles.date, { color: colors.textSecondary }]}>{today}</Text>
          </View>
        </View>

        <View style={styles.content}>
          {/* Score Circle */}
          <Animated.View entering={FadeInDown.springify()}>
            <ScoreCircle score={equilibriumScore} colors={colors} />
          </Animated.View>

          {/* Métricas */}
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Suas Métricas</Text>
          <View style={styles.metricsGrid}>
            <MetricCard
              title="Sono"
              value={sleepHours > 0 ? `${sleepHours}h` : '--'}
              icon="moon"
              color={colors.accent}
              delay={100}
            />
            <MetricCard
              title="Humor"
              value={mood || '--'}
              icon="happy"
              color={colors.warning}
              delay={200}
            />
            <MetricCard
              title="Atividade"
              value={activityMinutes > 0 ? `${activityMinutes} min` : '--'}
              icon="fitness"
              color={colors.success}
              delay={300}
            />
            <MetricCard
              title="Saldo"
              value={financialBalance !== 0 ? `R$ ${financialBalance.toFixed(0)}` : '--'}
              icon="wallet"
              color={financialBalance >= 0 ? colors.success : colors.error}
              delay={400}
            />
          </View>

          {/* Card de Orçamento */}
          {monthlyBudget > 0 && (
            <Animated.View entering={FadeInDown.delay(500).springify()}>
              <Card variant="elevated" padding="lg">
                <View style={styles.budgetHeader}>
                  <Text style={[styles.budgetTitle, { color: colors.textPrimary }]}>Orçamento do Mês</Text>
                  <Text style={[styles.budgetAmount, { color: colors.textPrimary }]}>
                    R$ {monthlySpent.toFixed(0)} / R$ {monthlyBudget.toFixed(0)}
                  </Text>
                </View>
                <View style={[styles.progressBar, { backgroundColor: colors.surface2 }]}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${budgetProgress}%`,
                        backgroundColor:
                          budgetProgress > 80 ? colors.error : colors.primary,
                      },
                    ]}
                  />
                </View>
              </Card>
            </Animated.View>
          )}

          {/* Insight Card */}
          <Animated.View entering={FadeInDown.delay(600).springify()}>
            <Card variant="glass" padding="lg">
              <View style={styles.insightHeader}>
                <Ionicons name="bulb" size={24} color={colors.warning} />
                <Text style={[styles.insightTitle, { color: colors.textPrimary }]}>Dica do Dia</Text>
              </View>
              <Text style={[styles.insightText, { color: colors.textSecondary }]}>{insight}</Text>
            </Card>
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: tokens.spacing.lg,
    paddingTop: tokens.spacing.md,
    paddingBottom: tokens.spacing.lg,
  },
  greeting: {
    ...tokens.typography.h2,
    marginBottom: tokens.spacing.xs,
  },
  date: {
    ...tokens.typography.bodySm,
    textTransform: 'capitalize',
  },
  content: {
    paddingHorizontal: tokens.spacing.lg,
    paddingBottom: tokens.spacing.xl,
  },
  scoreContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: tokens.spacing.xl,
  },
  scoreTextContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  scoreNumber: {
    ...tokens.typography.h1,
    fontSize: 48,
    fontWeight: '700',
  },
  scoreLabel: {
    ...tokens.typography.bodySm,
    marginTop: tokens.spacing.xs,
  },
  sectionTitle: {
    ...tokens.typography.h3,
    marginBottom: tokens.spacing.md,
    marginTop: tokens.spacing.lg,
    fontWeight: '600',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: -tokens.spacing.xs,
    marginBottom: tokens.spacing.lg,
  },
  metricContent: {
    alignItems: 'center',
    paddingVertical: tokens.spacing.sm,
    flex: 1,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: tokens.radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: tokens.spacing.sm,
  },
  metricTitle: {
    ...tokens.typography.bodySm,
    marginBottom: tokens.spacing.xs,
    fontWeight: '500',
  },
  metricValue: {
    ...tokens.typography.h4,
    fontWeight: '700',
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tokens.spacing.md,
  },
  budgetTitle: {
    ...tokens.typography.h4,
    fontWeight: '600',
  },
  budgetAmount: {
    ...tokens.typography.body,
    fontWeight: '700',
  },
  progressBar: {
    height: 8,
    borderRadius: tokens.radii.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: tokens.radii.sm,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: tokens.spacing.sm,
  },
  insightTitle: {
    ...tokens.typography.h4,
    marginLeft: tokens.spacing.sm,
    fontWeight: '600',
  },
  insightText: {
    ...tokens.typography.body,
    lineHeight: tokens.typography.body.lineHeight,
  },
});
