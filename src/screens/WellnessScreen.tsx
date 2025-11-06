import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Modal, Platform, StatusBar, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card, Badge, Button } from '../components';
import { colors, spacing, typography, borderRadius, shadows } from '../theme';
import { auth } from '../services/firebase';

interface ActivityCardProps {
  title: string;
  duration: string;
  icon: keyof typeof Ionicons.glyphMap;
  gradient: string[];
  onPress: () => void;
  delay: number;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ title, duration, icon, gradient, onPress, delay }) => (
  <Animated.View entering={FadeInDown.delay(delay).springify()} style={styles.activityCard}>
    <Pressable onPress={onPress}>
      <LinearGradient colors={gradient} style={styles.gradientCard}>
        <View style={styles.activityContent}>
          <View style={styles.iconCircle}>
            <Ionicons name={icon} size={32} color={colors.card} />
          </View>
          <View style={styles.activityInfo}>
            <Text style={styles.activityTitle}>{title}</Text>
            <Text style={styles.activityDuration}>{duration}</Text>
          </View>
          <Ionicons name="play-circle" size={40} color={colors.card} />
        </View>
      </LinearGradient>
    </Pressable>
  </Animated.View>
);

export default function WellnessScreen() {
  const [streak, setStreak] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [completedActivities, setCompletedActivities] = useState<string[]>([]);

  useEffect(() => {
    loadStreak();
    loadCompletedActivities();
  }, []);

  useEffect(() => {
    let interval: any;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            handleActivityComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const loadStreak = async () => {
    try {
      const userId = auth.currentUser?.uid || 'guest';
      const data = await AsyncStorage.getItem(`wellness_streak_${userId}`);
      if (data) {
        const streakData = JSON.parse(data);
        const today = new Date().toISOString().split('T')[0];
        const lastDate = streakData.lastDate;
        
        if (lastDate === today) {
          setStreak(streakData.count);
        } else {
          const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
          if (lastDate === yesterday) {
            setStreak(streakData.count);
          } else {
            setStreak(0);
          }
        }
      }
    } catch (error) {
      console.error('Erro ao carregar streak:', error);
    }
  };

  const loadCompletedActivities = async () => {
    try {
      const userId = auth.currentUser?.uid || 'guest';
      const today = new Date().toISOString().split('T')[0];
      const data = await AsyncStorage.getItem(`wellness_activities_${userId}_${today}`);
      if (data) {
        setCompletedActivities(JSON.parse(data));
      }
    } catch (error) {
      console.error('Erro ao carregar atividades:', error);
    }
  };

  const handleStartActivity = (title: string, duration: string) => {
    const minutes = parseInt(duration);
    setSelectedActivity({ title, duration });
    setTimerSeconds(minutes * 60);
    setModalVisible(true);
  };

  const startTimer = () => {
    setIsTimerRunning(true);
  };

  const pauseTimer = () => {
    setIsTimerRunning(false);
  };

  const stopTimer = () => {
    setIsTimerRunning(false);
    setTimerSeconds(0);
    setModalVisible(false);
  };

  const handleActivityComplete = async () => {
    try {
      const userId = auth.currentUser?.uid || 'guest';
      const today = new Date().toISOString().split('T')[0];
      
      // Adicionar atividade completada
      const updated = [...completedActivities, selectedActivity.title];
      setCompletedActivities(updated);
      await AsyncStorage.setItem(`wellness_activities_${userId}_${today}`, JSON.stringify(updated));
      
      // Atualizar streak
      const streakData = await AsyncStorage.getItem(`wellness_streak_${userId}`);
      let newStreak = 1;
      
      if (streakData) {
        const parsed = JSON.parse(streakData);
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        if (parsed.lastDate === yesterday || parsed.lastDate === today) {
          newStreak = parsed.lastDate === today ? parsed.count : parsed.count + 1;
        }
      }
      
      await AsyncStorage.setItem(`wellness_streak_${userId}`, JSON.stringify({
        count: newStreak,
        lastDate: today,
      }));
      
      setStreak(newStreak);
      
      Alert.alert(
        'Parabéns! 🎉',
        `Você completou ${selectedActivity.title}!`,
        [{ text: 'OK', onPress: () => setModalVisible(false) }]
      );
    } catch (error) {
      console.error('Erro ao completar atividade:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 0 }}>
      <View style={styles.content}>
        <Animated.View entering={FadeInDown.springify()}>
          <Text style={styles.title}>Bem-estar</Text>
          <Text style={styles.subtitle}>Cuide da sua mente e corpo</Text>
        </Animated.View>

        {/* Streak Card */}
        <Animated.View entering={FadeInDown.delay(100).springify()}>
          <Card style={styles.streakCard}>
            <View style={styles.streakContent}>
              <View>
                <Text style={styles.streakNumber}>{streak} dias</Text>
                <Text style={styles.streakLabel}>Sequência atual 🔥</Text>
              </View>
              <View style={styles.badgeContainer}>
                <Badge text="Em chamas!" color={colors.warning} />
              </View>
            </View>
          </Card>
        </Animated.View>

        <Text style={styles.sectionTitle}>Meditações</Text>

        <ActivityCard
          title="Respiração Guiada"
          duration="5 minutos"
          icon="leaf"
          gradient={[colors.secondary, colors.activity]}
          onPress={() => handleStartActivity('Respiração Guiada', '5')}
          delay={200}
        />

        <ActivityCard
          title="Meditação Matinal"
          duration="10 minutos"
          icon="sunny"
          gradient={[colors.mood, '#F4A261']}
          onPress={() => handleStartActivity('Meditação Matinal', '10')}
          delay={300}
        />

        <ActivityCard
          title="Relaxamento Noturno"
          duration="15 minutos"
          icon="moon"
          gradient={[colors.primary, colors.tertiary]}
          onPress={() => handleStartActivity('Relaxamento Noturno', '15')}
          delay={400}
        />

        <Text style={styles.sectionTitle}>Exercícios</Text>

        <ActivityCard
          title="Alongamento Rápido"
          duration="7 minutos"
          icon="body"
          gradient={[colors.activity, '#43AA8B']}
          onPress={() => handleStartActivity('Alongamento Rápido', '7')}
          delay={500}
        />

        <ActivityCard
          title="Yoga para Iniciantes"
          duration="20 minutos"
          icon="fitness"
          gradient={[colors.tertiary, '#B8A4D8']}
          onPress={() => handleStartActivity('Yoga para Iniciantes', '20')}
          delay={600}
        />

        {/* Timer Card */}
        <Animated.View entering={FadeInDown.delay(700).springify()}>
          <Card style={styles.timerCard}>
            <Ionicons name="timer" size={48} color={colors.primary} />
            <Text style={styles.timerTitle}>Timer Personalizado</Text>
            <Text style={styles.timerSubtitle}>Configure seu próprio tempo</Text>
            <View style={styles.timerButtons}>
              {['5 min', '10 min', '15 min', '20 min'].map((time, i) => (
                <Pressable 
                  key={i} 
                  style={styles.timerButton}
                  onPress={() => handleStartActivity('Timer Personalizado', time.split(' ')[0])}
                >
                  <Text style={styles.timerButtonText}>{time}</Text>
                </Pressable>
              ))}
            </View>
          </Card>
        </Animated.View>
      </View>

      {/* Modal do Timer */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={stopTimer}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedActivity?.title}</Text>
              <Pressable onPress={stopTimer}>
                <Ionicons name="close" size={24} color={colors.text} />
              </Pressable>
            </View>

            <View style={styles.timerDisplay}>
              <Text style={styles.timerText}>{formatTime(timerSeconds)}</Text>
              <Text style={styles.timerSubtext}>
                {selectedActivity?.duration} minutos
              </Text>
            </View>

            <View style={styles.timerControls}>
              {!isTimerRunning ? (
                <Pressable style={styles.playButton} onPress={startTimer}>
                  <Ionicons name="play" size={48} color={colors.card} />
                </Pressable>
              ) : (
                <Pressable style={styles.pauseButton} onPress={pauseTimer}>
                  <Ionicons name="pause" size={48} color={colors.card} />
                </Pressable>
              )}
            </View>

            <Button
              title="Parar"
              onPress={stopTimer}
              variant="outline"
              style={styles.stopButton}
            />
          </View>
        </View>
      </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  streakCard: {
    backgroundColor: colors.warning + '10',
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
    marginBottom: spacing.lg,
  },
  streakContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  streakNumber: {
    ...typography.h2,
    color: colors.text,
    fontWeight: '700',
  },
  streakLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  badgeContainer: {
    alignItems: 'flex-end',
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
    marginTop: spacing.md,
  },
  activityCard: {
    marginBottom: spacing.md,
  },
  gradientCard: {
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.md,
  },
  activityContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    ...typography.h4,
    color: colors.card,
    marginBottom: spacing.xs / 2,
  },
  activityDuration: {
    ...typography.bodySmall,
    color: colors.card,
    opacity: 0.9,
  },
  timerCard: {
    alignItems: 'center',
    marginTop: spacing.md,
  },
  timerTitle: {
    ...typography.h3,
    color: colors.text,
    marginTop: spacing.md,
  },
  timerSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  timerButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  timerButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.primary + '20',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  timerButtonText: {
    ...typography.button,
    color: colors.primary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: spacing.xl,
    width: '85%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  modalTitle: {
    ...typography.h3,
    color: colors.text,
  },
  timerDisplay: {
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  timerText: {
    fontSize: 72,
    fontWeight: '700',
    color: colors.primary,
    fontVariant: ['tabular-nums'],
  },
  timerSubtext: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  timerControls: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pauseButton: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.full,
    backgroundColor: colors.warning,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopButton: {
    width: '100%',
  },
});
