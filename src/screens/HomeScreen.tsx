import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card } from '../components';
import { colors, spacing, typography, borderRadius, shadows } from '../theme';
import { auth } from '../services/firebase';
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
  const [equilibriumScore, setEquilibriumScore] = useState(0);
  const [sleepHours, setSleepHours] = useState(0);
  const [mood, setMood] = useState('');
  const [activityMinutes, setActivityMinutes] = useState(0);
  const [financialBalance, setFinancialBalance] = useState(0);
  const [userName, setUserName] = useState('');
  const [insight, setInsight] = useState('Faça seu primeiro check-in para ver suas métricas!');

  const today = new Date().toLocaleDateString('pt-BR', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long' 
  });

  useEffect(() => {
    loadUserData();
    loadTodayData();
  }, []);

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

      // Carregar check-in do dia
      const checkinKey = `checkin_${todayDate}`;
      const checkinData = await AsyncStorage.getItem(checkinKey);
      
      // Carregar transações
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
        
        // Sono (0-10 pontos, ideal 7-9h)
        setSleepHours(checkin.sleepHours);
        if (checkin.sleepHours >= 7 && checkin.sleepHours <= 9) {
          sleepScore = 10;
        } else if (checkin.sleepHours >= 6 && checkin.sleepHours <= 10) {
          sleepScore = 7;
        } else {
          sleepScore = 4;
        }

        // Humor (0-10 pontos)
        setMood(getMoodLabel(checkin.mood));
        moodScore = checkin.mood * 2;

        // Atividade física
        if (checkin.physicalActivity) {
          activityScore = 10;
          setActivityMinutes(30); // Estimativa
        }
      }

      // Processar atividades de wellness
      if (wellnessData) {
        const activities = JSON.parse(wellnessData);
        const totalMinutes = activities.length * 10; // Estimativa
        setActivityMinutes(prev => prev + totalMinutes);
        activityScore = Math.min(10, activityScore + activities.length * 2);
      }

      // Processar finanças
      if (transactionsData) {
        const transactions = JSON.parse(transactionsData);
        const expenses = transactions
          .filter((t: any) => t.type === 'expense')
          .reduce((sum: number, t: any) => sum + t.amount, 0);
        
        const income = transactions
          .filter((t: any) => t.type === 'income')
          .reduce((sum: number, t: any) => sum + t.amount, 0);

        const balance = income - expenses;
        setFinancialBalance(balance);

        // Score financeiro (0-10 pontos)
        if (balance > 0) {
          financeScore = 10;
        } else if (balance > -500) {
          financeScore = 7;
        } else {
          financeScore = 4;
        }
      } else {
        financeScore = 5; // Neutro se não há dados
      }

      // Calcular score total (média ponderada)
      const totalScore = Math.round(
        (sleepScore * 2.5 + moodScore * 2.5 + activityScore * 2.5 + financeScore * 2.5)
      );
      setEquilibriumScore(totalScore);

      // Gerar insight personalizado
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
      { name: 'sono', value: sleep, message: 'Você dormiu bem! Continue mantendo essa rotina.' },
      { name: 'humor', value: mood, message: 'Seu humor está ótimo! Aproveite o dia.' },
      { name: 'atividade', value: activity, message: 'Parabéns pela atividade física! Continue assim.' },
      { name: 'finanças', value: finance, message: 'Suas finanças estão equilibradas!' },
    ];

    // Encontrar o ponto mais forte
    const strongest = scores.reduce((prev, current) => 
      current.value > prev.value ? current : prev
    );

    // Encontrar o ponto mais fraco
    const weakest = scores.reduce((prev, current) => 
      current.value < prev.value ? current : prev
    );

    if (weakest.value < 5) {
      const suggestions: any = {
        sono: 'Tente dormir mais cedo hoje. O sono é fundamental para o equilíbrio!',
        humor: 'Que tal uma meditação ou conversar com alguém querido?',
        atividade: 'Uma caminhada de 15 minutos pode fazer maravilhas!',
        finanças: 'Revise seus gastos e veja onde pode economizar.',
      };
      setInsight(suggestions[weakest.name]);
    } else {
      setInsight(strongest.message);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={[colors.primary + '15', colors.background]}
        style={styles.header}
      >
        <Text style={styles.greeting}>
          Olá{userName ? `, ${userName}` : ''}! 👋
        </Text>
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
            value={sleepHours > 0 ? `${sleepHours}h` : '--'}
            icon="moon"
            color={colors.sleep}
            delay={100}
          />
          <CategoryCard
            title="Humor"
            value={mood || '--'}
            icon="happy"
            color={colors.mood}
            delay={200}
          />
          <CategoryCard
            title="Atividade"
            value={activityMinutes > 0 ? `${activityMinutes} min` : '--'}
            icon="fitness"
            color={colors.activity}
            delay={300}
          />
          <CategoryCard
            title="Finanças"
            value={financialBalance !== 0 ? `R$ ${financialBalance.toFixed(0)}` : '--'}
            icon="wallet"
            color={financialBalance >= 0 ? colors.financePositive : colors.finance}
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
              {insight}
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
