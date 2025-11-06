/**
 * Check-in Screen - Design System V2
 * Tela de check-in diário com UX moderna e gamificada
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useThemeV2';
import { Button } from '../../components/v2/Button';
import { Card } from '../../components/v2/Card';
import { Input } from '../../components/v2/Input';

interface CheckinScreenProps {
  onComplete?: () => void;
}

const MOOD_OPTIONS = [
  { emoji: '😢', label: 'Péssimo', value: 1 },
  { emoji: '😕', label: 'Ruim', value: 2 },
  { emoji: '😐', label: 'Ok', value: 3 },
  { emoji: '🙂', label: 'Bom', value: 4 },
  { emoji: '😄', label: 'Ótimo', value: 5 },
];

export const CheckinScreen: React.FC<CheckinScreenProps> = ({ onComplete }) => {
  const theme = useTheme();
  const [sleepHours, setSleepHours] = useState(7);
  const [mood, setMood] = useState<number | null>(null);
  const [waterGlasses, setWaterGlasses] = useState(0);
  const [didExercise, setDidExercise] = useState(false);
  const [spentToday, setSpentToday] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    // Simular salvamento
    setTimeout(() => {
      setLoading(false);
      onComplete?.();
    }, 1000);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top', 'bottom']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
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
            Fazer Check-in 📝
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
            Registre seu dia e mantenha o equilíbrio
          </Text>
        </View>

        <View style={styles.content}>
          {/* Sono */}
          <Animated.View entering={FadeInDown.delay(100).springify()}>
            <Card variant="elevated" padding="lg" style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name="moon" size={24} color={theme.colors.accent} />
                <Text
                  style={[
                    styles.cardTitle,
                    {
                      color: theme.colors['text-primary'],
                      fontSize: theme.typography.h4.size,
                      fontWeight: theme.typography.h4.weight.toString(),
                      marginLeft: theme.spacing.sm,
                    },
                  ]}
                >
                  Quantas horas dormiu?
                </Text>
              </View>
              <View style={styles.sliderContainer}>
                <Text
                  style={[
                    styles.sliderValue,
                    {
                      color: theme.colors.primary,
                      fontSize: theme.typography.display.size,
                      fontWeight: theme.typography.display.weight.toString(),
                    },
                  ]}
                >
                  {sleepHours}h
                </Text>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={12}
                  step={0.5}
                  value={sleepHours}
                  onValueChange={setSleepHours}
                  minimumTrackTintColor={theme.colors.accent}
                  maximumTrackTintColor={theme.colors.border}
                  thumbTintColor={theme.colors.accent}
                />
              </View>
            </Card>
          </Animated.View>

          {/* Humor */}
          <Animated.View entering={FadeInDown.delay(200).springify()}>
            <Card variant="elevated" padding="lg" style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name="happy" size={24} color={theme.colors.warning} />
                <Text
                  style={[
                    styles.cardTitle,
                    {
                      color: theme.colors['text-primary'],
                      fontSize: theme.typography.h4.size,
                      fontWeight: theme.typography.h4.weight.toString(),
                      marginLeft: theme.spacing.sm,
                    },
                  ]}
                >
                  Como está seu humor?
                </Text>
              </View>
              <View style={styles.moodContainer}>
                {MOOD_OPTIONS.map((option) => (
                  <Pressable
                    key={option.value}
                    onPress={() => setMood(option.value)}
                    style={[
                      styles.moodOption,
                      {
                        backgroundColor:
                          mood === option.value
                            ? theme.colors.warning + '30'
                            : theme.colors['surface-1'],
                        borderColor:
                          mood === option.value ? theme.colors.warning : theme.colors.border,
                        borderWidth: mood === option.value ? 2 : 1,
                      },
                    ]}
                  >
                    <Text style={styles.moodEmoji}>{option.emoji}</Text>
                    <Text
                      style={[
                        styles.moodLabel,
                        {
                          color: theme.colors['text-secondary'],
                          fontSize: theme.typography.small.size,
                        },
                      ]}
                    >
                      {option.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </Card>
          </Animated.View>

          {/* Água */}
          <Animated.View entering={FadeInDown.delay(300).springify()}>
            <Card variant="elevated" padding="lg" style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name="water" size={24} color={theme.colors.accent} />
                <Text
                  style={[
                    styles.cardTitle,
                    {
                      color: theme.colors['text-primary'],
                      fontSize: theme.typography.h4.size,
                      fontWeight: theme.typography.h4.weight.toString(),
                      marginLeft: theme.spacing.sm,
                    },
                  ]}
                >
                  Quantos copos de água?
                </Text>
              </View>
              <View style={styles.waterContainer}>
                {Array.from({ length: 8 }).map((_, index) => (
                  <Pressable
                    key={index}
                    onPress={() => setWaterGlasses(index + 1)}
                    style={[
                      styles.waterGlass,
                      {
                        backgroundColor:
                          index < waterGlasses ? theme.colors.accent : theme.colors['surface-1'],
                        borderColor:
                          index < waterGlasses ? theme.colors.accent : theme.colors.border,
                      },
                    ]}
                  >
                    <Ionicons
                      name="water"
                      size={20}
                      color={index < waterGlasses ? theme.colors['text-primary'] : theme.colors['text-tertiary']}
                    />
                  </Pressable>
                ))}
              </View>
            </Card>
          </Animated.View>

          {/* Exercício */}
          <Animated.View entering={FadeInDown.delay(400).springify()}>
            <Card variant="elevated" padding="lg" style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name="fitness" size={24} color={theme.colors.success} />
                <Text
                  style={[
                    styles.cardTitle,
                    {
                      color: theme.colors['text-primary'],
                      fontSize: theme.typography.h4.size,
                      fontWeight: theme.typography.h4.weight.toString(),
                      marginLeft: theme.spacing.sm,
                    },
                  ]}
                >
                  Fez exercício hoje?
                </Text>
              </View>
              <View style={styles.exerciseContainer}>
                <Pressable
                  onPress={() => setDidExercise(true)}
                  style={[
                    styles.exerciseOption,
                    {
                      backgroundColor: didExercise ? theme.colors.success : theme.colors['surface-1'],
                      borderColor: didExercise ? theme.colors.success : theme.colors.border,
                    },
                  ]}
                >
                  <Ionicons
                    name="checkmark-circle"
                    size={24}
                    color={didExercise ? theme.colors['text-primary'] : theme.colors['text-tertiary']}
                  />
                  <Text
                    style={[
                      styles.exerciseText,
                      {
                        color: didExercise ? theme.colors['text-primary'] : theme.colors['text-secondary'],
                        fontSize: theme.typography.body.size,
                        fontWeight: didExercise ? '600' : '400',
                        marginLeft: theme.spacing.sm,
                      },
                    ]}
                  >
                    Sim
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setDidExercise(false)}
                  style={[
                    styles.exerciseOption,
                    {
                      backgroundColor: !didExercise ? theme.colors.error : theme.colors['surface-1'],
                      borderColor: !didExercise ? theme.colors.error : theme.colors.border,
                    },
                  ]}
                >
                  <Ionicons
                    name="close-circle"
                    size={24}
                    color={!didExercise ? theme.colors['text-primary'] : theme.colors['text-tertiary']}
                  />
                  <Text
                    style={[
                      styles.exerciseText,
                      {
                        color: !didExercise ? theme.colors['text-primary'] : theme.colors['text-secondary'],
                        fontSize: theme.typography.body.size,
                        fontWeight: !didExercise ? '600' : '400',
                        marginLeft: theme.spacing.sm,
                      },
                    ]}
                  >
                    Não
                  </Text>
                </Pressable>
              </View>
            </Card>
          </Animated.View>

          {/* Gasto do dia */}
          <Animated.View entering={FadeInDown.delay(500).springify()}>
            <Card variant="elevated" padding="lg" style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name="cash" size={24} color={theme.colors.primary} />
                <Text
                  style={[
                    styles.cardTitle,
                    {
                      color: theme.colors['text-primary'],
                      fontSize: theme.typography.h4.size,
                      fontWeight: theme.typography.h4.weight.toString(),
                      marginLeft: theme.spacing.sm,
                    },
                  ]}
                >
                  Quanto gastou hoje?
                </Text>
              </View>
              <Input
                placeholder="R$ 0,00"
                value={spentToday}
                onChangeText={setSpentToday}
                keyboardType="numeric"
                leftIcon={
                  <Ionicons name="cash-outline" size={20} color={theme.colors['text-tertiary']} />
                }
              />
            </Card>
          </Animated.View>

          {/* Botão de salvar */}
          <Animated.View entering={FadeInDown.delay(600).springify()} style={{ marginTop: theme.spacing.lg }}>
            <Button
              title="Salvar Check-in"
              onPress={handleSubmit}
              variant="primary"
              size="large"
              fullWidth
              loading={loading}
            />
          </Animated.View>
        </View>
      </ScrollView>
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
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {},
  content: {
    paddingHorizontal: 24,
    paddingBottom: 48,
  },
  card: {
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {},
  sliderContainer: {
    alignItems: 'center',
  },
  sliderValue: {
    marginBottom: 16,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  moodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  moodOption: {
    flex: 1,
    minWidth: '18%',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
  },
  moodEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  moodLabel: {},
  waterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  waterGlass: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  exerciseOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  exerciseText: {},
});
