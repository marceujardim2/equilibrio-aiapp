/**
 * Check-in Screen - Redesigned with new dark theme
 * Tela de check-in diário moderna e intuitiva
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useThemedColors } from '../hooks/useThemedColors';
import { tokens } from '../hooks/tokens';
import { Card, Button, Input } from '../components';
import { auth } from '../services/firebase';

const MOODS = [
  { emoji: '😔', label: 'Péssimo', value: 1 },
  { emoji: '🙁', label: 'Ruim', value: 2 },
  { emoji: '😐', label: 'Ok', value: 3 },
  { emoji: '😊', label: 'Bom', value: 4 },
  { emoji: '🤩', label: 'Ótimo', value: 5 },
];

export default function CheckinScreen() {
  const colors = useThemedColors();
  const [sleepHours, setSleepHours] = useState(7);
  const [mood, setMood] = useState(3);
  const [waterCups, setWaterCups] = useState(4);
  const [activity, setActivity] = useState(false);
  const [spending, setSpending] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    loadTodayCheckin();
  }, []);

  const loadTodayCheckin = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const key = `checkin_${today}`;
      const data = await AsyncStorage.getItem(key);

      if (data) {
        const checkin = JSON.parse(data);
        setSleepHours(checkin.sleepHours || 7);
        setMood(checkin.mood || 3);
        setWaterCups(checkin.waterCups || 4);
        setActivity(checkin.physicalActivity || false);
        setSpending(checkin.spending?.toString() || '');
      }
    } catch (error) {
      console.error('Erro ao carregar check-in:', error);
    }
  };

  const handleSave = async () => {
    if (sleepHours < 1 || sleepHours > 12) {
      Alert.alert('Atenção', 'O sono deve estar entre 1 e 12 horas');
      return;
    }
    if (waterCups < 0 || waterCups > 20) {
      Alert.alert('Atenção', 'A quantidade de água deve estar entre 0 e 20 copos');
      return;
    }
    if (spending && parseFloat(spending) < 0) {
      Alert.alert('Atenção', 'O gasto não pode ser negativo');
      return;
    }

    try {
      const today = new Date().toISOString().split('T')[0];
      const userId = auth.currentUser?.uid || 'guest';

      const checkinData = {
        id: `${userId}_${today}`,
        userId,
        date: today,
        sleepHours,
        mood,
        waterCups,
        physicalActivity: activity,
        spending: spending ? parseFloat(spending) : undefined,
        createdAt: Date.now(),
      };

      await AsyncStorage.setItem(`checkin_${today}`, JSON.stringify(checkinData));

      const historyKey = `checkin_history_${userId}`;
      const historyData = await AsyncStorage.getItem(historyKey);
      const history = historyData ? JSON.parse(historyData) : [];

      const existingIndex = history.findIndex((c: any) => c.date === today);
      if (existingIndex >= 0) {
        history[existingIndex] = checkinData;
      } else {
        history.push(checkinData);
      }

      await AsyncStorage.setItem(historyKey, JSON.stringify(history));

      if (spending && parseFloat(spending) > 0) {
        const transactionsKey = `transactions_${userId}`;
        const existingTransactions = await AsyncStorage.getItem(transactionsKey);
        const transactions = existingTransactions ? JSON.parse(existingTransactions) : [];

        const checkinTransactionId = `checkin_${today}`;
        const existingTransactionIndex = transactions.findIndex(
          (t: any) => t.id === checkinTransactionId
        );

        const newTransaction = {
          id: checkinTransactionId,
          userId,
          type: 'expense',
          amount: parseFloat(spending),
          category: 'others',
          description: 'Gasto rápido (Check-in)',
          date: today,
          createdAt: Date.now(),
          fromCheckin: true,
        };

        if (existingTransactionIndex >= 0) {
          transactions[existingTransactionIndex] = newTransaction;
        } else {
          transactions.push(newTransaction);
        }

        await AsyncStorage.setItem(transactionsKey, JSON.stringify(transactions));
      }

      setShowSuccess(true);
      setTimeout(() => {
        Alert.alert(
          'Check-in Completo! 🎉',
          spending && parseFloat(spending) > 0
            ? 'Seus dados foram salvos e o gasto foi registrado nas finanças.'
            : 'Seus dados foram salvos com sucesso.',
          [{ text: 'OK', onPress: () => setShowSuccess(false) }]
        );
      }, 500);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o check-in. Tente novamente.');
      console.error('Erro ao salvar check-in:', error);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 0 }}>
        <View style={styles.content}>
          <Animated.View entering={FadeInDown.springify()}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>Fazer Check-in</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Como foi seu dia hoje?</Text>
          </Animated.View>

          {/* Sono */}
          <Animated.View entering={FadeInDown.delay(100).springify()}>
            <Card variant="elevated" padding="lg">
              <View style={styles.cardHeader}>
                <View style={[styles.iconWrapper, { backgroundColor: colors.accent + '20' }]}>
                  <Ionicons name="moon" size={24} color={colors.accent} />
                </View>
                <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Sono</Text>
              </View>
              <Text style={[styles.valueText, { color: colors.primary }]}>{sleepHours.toFixed(1)} horas</Text>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={12}
                step={0.5}
                value={sleepHours}
                onValueChange={setSleepHours}
                minimumTrackTintColor={colors.accent}
                maximumTrackTintColor={colors.border}
                thumbTintColor={colors.accent}
              />
            </Card>
          </Animated.View>

          {/* Humor */}
          <Animated.View entering={FadeInDown.delay(200).springify()}>
            <Card variant="elevated" padding="lg">
              <View style={styles.cardHeader}>
                <View style={[styles.iconWrapper, { backgroundColor: colors.warning + '20' }]}>
                  <Ionicons name="happy" size={24} color={colors.warning} />
                </View>
                <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Humor</Text>
              </View>
              <View style={styles.moodContainer}>
                {MOODS.map((m) => (
                  <Pressable
                    key={m.value}
                    onPress={() => setMood(m.value)}
                    style={[
                      styles.moodButton,
                      { backgroundColor: colors.surface2 },
                      mood === m.value && { backgroundColor: colors.warning + '20', borderColor: colors.warning, borderWidth: 1 },
                    ]}
                  >
                    <Text style={styles.moodEmoji}>{m.emoji}</Text>
                    <Text style={[styles.moodLabel, { color: mood === m.value ? colors.warning : colors.textSecondary }]}>{m.label}</Text>
                  </Pressable>
                ))}
              </View>
            </Card>
          </Animated.View>

          {/* Água */}
          <Animated.View entering={FadeInDown.delay(300).springify()}>
            <Card variant="elevated" padding="lg">
              <View style={styles.cardHeader}>
                <View style={[styles.iconWrapper, { backgroundColor: colors.info + '20' }]}>
                  <Ionicons name="water" size={24} color={colors.info} />
                </View>
                <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Água</Text>
              </View>
              <Text style={[styles.valueText, { color: colors.primary }]}>{waterCups} copos</Text>
              <View style={styles.waterContainer}>
                {[...Array(8)].map((_, i) => (
                  <Pressable
                    key={i}
                    onPress={() => setWaterCups(i + 1)}
                    style={styles.waterCup}
                  >
                    <Ionicons
                      name={i < waterCups ? 'water' : 'water-outline'}
                      size={32}
                      color={i < waterCups ? colors.info : colors.muted}
                    />
                  </Pressable>
                ))}
              </View>
            </Card>
          </Animated.View>

          {/* Atividade Física */}
          <Animated.View entering={FadeInDown.delay(400).springify()}>
            <Card variant="elevated" padding="lg">
              <View style={styles.cardHeader}>
                <View style={[styles.iconWrapper, { backgroundColor: colors.success + '20' }]}>
                  <Ionicons name="fitness" size={24} color={colors.success} />
                </View>
                <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Atividade Física</Text>
              </View>
              <View style={styles.activityContainer}>
                <Pressable
                  onPress={() => setActivity(true)}
                  style={[
                    styles.activityButton,
                    { backgroundColor: colors.surface2 },
                    activity && { backgroundColor: colors.success + '20', borderColor: colors.success, borderWidth: 1 },
                  ]}
                >
                  <Ionicons
                    name="checkmark-circle"
                    size={32}
                    color={activity ? colors.success : colors.muted}
                  />
                  <Text style={[styles.activityText, { color: activity ? colors.success : colors.textSecondary }]}>Sim</Text>
                </Pressable>
                <Pressable
                  onPress={() => setActivity(false)}
                  style={[
                    styles.activityButton,
                    { backgroundColor: colors.surface2 },
                    !activity && { backgroundColor: colors.error + '20', borderColor: colors.error, borderWidth: 1 },
                  ]}
                >
                  <Ionicons
                    name="close-circle"
                    size={32}
                    color={!activity ? colors.error : colors.muted}
                  />
                  <Text style={[styles.activityText, { color: !activity ? colors.error : colors.textSecondary }]}>Não</Text>
                </Pressable>
              </View>
            </Card>
          </Animated.View>

          {/* Gasto Rápido */}
          <Animated.View entering={FadeInDown.delay(500).springify()}>
            <Card variant="elevated" padding="lg">
              <View style={styles.cardHeader}>
                <View style={[styles.iconWrapper, { backgroundColor: colors.primary + '20' }]}>
                  <Ionicons name="wallet" size={24} color={colors.primary} />
                </View>
                <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Gasto Rápido</Text>
              </View>
              <Input
                placeholder="R$ 0,00"
                value={spending}
                onChangeText={setSpending}
                keyboardType="numeric"
                containerStyle={styles.spendingInput}
              />
            </Card>
          </Animated.View>

          {/* Botão Salvar */}
          <Animated.View entering={FadeInUp.delay(600).springify()} style={styles.buttonContainer}>
            <Button
              title={showSuccess ? '✓ Salvo!' : 'Salvar Check-in'}
              onPress={handleSave}
              variant="primary"
              size="large"
              style={styles.saveButton}
            />
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
  content: {
    padding: tokens.spacing.lg,
  },
  title: {
    ...tokens.typography.h2,
    marginBottom: tokens.spacing.xs,
  },
  subtitle: {
    ...tokens.typography.body,
    marginBottom: tokens.spacing.xl,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: tokens.spacing.md,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: tokens.radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: tokens.spacing.sm,
  },
  cardTitle: {
    ...tokens.typography.h4,
  },
  valueText: {
    ...tokens.typography.h3,
    textAlign: 'center',
    marginBottom: tokens.spacing.sm,
    fontWeight: '700',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  moodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: tokens.spacing.xs,
  },
  moodButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: tokens.spacing.sm,
    borderRadius: tokens.radii.md,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  moodEmoji: {
    fontSize: 32,
    marginBottom: tokens.spacing.xs,
  },
  moodLabel: {
    ...tokens.typography.caption,
    fontWeight: '500',
  },
  waterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: tokens.spacing.sm,
    marginTop: tokens.spacing.sm,
  },
  waterCup: {
    padding: tokens.spacing.xs,
  },
  activityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: tokens.spacing.sm,
  },
  activityButton: {
    alignItems: 'center',
    paddingVertical: tokens.spacing.md,
    paddingHorizontal: tokens.spacing.lg,
    borderRadius: tokens.radii.md,
    flex: 1,
    marginHorizontal: tokens.spacing.sm,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  activityText: {
    ...tokens.typography.body,
    marginTop: tokens.spacing.xs,
    fontWeight: '500',
  },
  spendingInput: {
    marginBottom: 0,
  },
  buttonContainer: {
    marginTop: tokens.spacing.lg,
    marginBottom: tokens.spacing.xl,
  },
  saveButton: {
    width: '100%',
  },
});
