import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable, Alert } from 'react-native';
import Animated, { FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card, Button } from '../components';
import { colors, spacing, typography, borderRadius } from '../theme';
import { auth } from '../services/firebase';

const MOODS = [
  { emoji: '😔', label: 'Péssimo', value: 1 },
  { emoji: '🙁', label: 'Ruim', value: 2 },
  { emoji: '😐', label: 'Ok', value: 3 },
  { emoji: '😊', label: 'Bom', value: 4 },
  { emoji: '🤩', label: 'Ótimo', value: 5 },
];

export default function CheckinScreen() {
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
        setSleepHours(checkin.sleepHours);
        setMood(checkin.mood);
        setWaterCups(checkin.waterCups);
        setActivity(checkin.physicalActivity);
        setSpending(checkin.spending?.toString() || '');
      }
    } catch (error) {
      console.error('Erro ao carregar check-in:', error);
    }
  };

  const handleSave = async () => {
    // Validações
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

      // Salvar check-in do dia
      await AsyncStorage.setItem(`checkin_${today}`, JSON.stringify(checkinData));
      
      // Atualizar histórico
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

      // 🔥 NOVO: Criar transação automática se houver gasto
      if (spending && parseFloat(spending) > 0) {
        const transactionsKey = `transactions_${userId}`;
        const existingTransactions = await AsyncStorage.getItem(transactionsKey);
        const transactions = existingTransactions ? JSON.parse(existingTransactions) : [];
        
        // Verificar se já existe transação do check-in de hoje
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
          fromCheckin: true, // Flag para identificar
        };
        
        if (existingTransactionIndex >= 0) {
          // Atualizar transação existente
          transactions[existingTransactionIndex] = newTransaction;
        } else {
          // Adicionar nova transação
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
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Animated.View entering={FadeInDown.springify()}>
          <Text style={styles.title}>Check-in Diário</Text>
          <Text style={styles.subtitle}>Como foi seu dia hoje?</Text>
        </Animated.View>

        {/* Sono */}
        <Animated.View entering={FadeInDown.delay(100).springify()}>
          <Card style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="moon" size={24} color={colors.sleep} />
              <Text style={styles.cardTitle}>Sono</Text>
            </View>
            <Text style={styles.valueText}>{sleepHours.toFixed(1)} horas</Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={12}
              step={0.5}
              value={sleepHours}
              onValueChange={setSleepHours}
              minimumTrackTintColor={colors.sleep}
              maximumTrackTintColor={colors.gray200}
              thumbTintColor={colors.sleep}
            />
          </Card>
        </Animated.View>

        {/* Humor */}
        <Animated.View entering={FadeInDown.delay(200).springify()}>
          <Card style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="happy" size={24} color={colors.mood} />
              <Text style={styles.cardTitle}>Humor</Text>
            </View>
            <View style={styles.moodContainer}>
              {MOODS.map((m) => (
                <Pressable
                  key={m.value}
                  onPress={() => setMood(m.value)}
                  style={[
                    styles.moodButton,
                    mood === m.value && styles.moodButtonActive,
                  ]}
                >
                  <Text style={styles.moodEmoji}>{m.emoji}</Text>
                  <Text style={styles.moodLabel}>{m.label}</Text>
                </Pressable>
              ))}
            </View>
          </Card>
        </Animated.View>

        {/* Água */}
        <Animated.View entering={FadeInDown.delay(300).springify()}>
          <Card style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="water" size={24} color={colors.info} />
              <Text style={styles.cardTitle}>Água</Text>
            </View>
            <Text style={styles.valueText}>{waterCups} copos</Text>
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
                    color={i < waterCups ? colors.info : colors.gray300}
                  />
                </Pressable>
              ))}
            </View>
          </Card>
        </Animated.View>

        {/* Atividade Física */}
        <Animated.View entering={FadeInDown.delay(400).springify()}>
          <Card style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="fitness" size={24} color={colors.activity} />
              <Text style={styles.cardTitle}>Atividade Física</Text>
            </View>
            <View style={styles.activityContainer}>
              <Pressable
                onPress={() => setActivity(true)}
                style={[
                  styles.activityButton,
                  activity && styles.activityButtonActive,
                ]}
              >
                <Ionicons
                  name="checkmark-circle"
                  size={32}
                  color={activity ? colors.activity : colors.gray300}
                />
                <Text style={styles.activityText}>Sim</Text>
              </Pressable>
              <Pressable
                onPress={() => setActivity(false)}
                style={[
                  styles.activityButton,
                  !activity && styles.activityButtonActive,
                ]}
              >
                <Ionicons
                  name="close-circle"
                  size={32}
                  color={!activity ? colors.error : colors.gray300}
                />
                <Text style={styles.activityText}>Não</Text>
              </Pressable>
            </View>
          </Card>
        </Animated.View>

        {/* Gasto */}
        <Animated.View entering={FadeInDown.delay(500).springify()}>
          <Card style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="wallet" size={24} color={colors.financePositive} />
              <Text style={styles.cardTitle}>Gasto Rápido</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="R$ 0,00"
              placeholderTextColor={colors.gray400}
              value={spending}
              onChangeText={setSpending}
              keyboardType="numeric"
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
    marginBottom: spacing.xl,
  },
  card: {
    marginBottom: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  cardTitle: {
    ...typography.h4,
    color: colors.text,
    marginLeft: spacing.sm,
  },
  valueText: {
    ...typography.h3,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  moodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  moodButton: {
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.gray100,
    flex: 1,
    marginHorizontal: spacing.xs / 2,
  },
  moodButtonActive: {
    backgroundColor: colors.mood + '20',
    borderWidth: 2,
    borderColor: colors.mood,
  },
  moodEmoji: {
    fontSize: 32,
    marginBottom: spacing.xs,
  },
  moodLabel: {
    ...typography.caption,
    color: colors.text,
  },
  waterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  waterCup: {
    padding: spacing.xs,
  },
  activityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  activityButton: {
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    backgroundColor: colors.gray100,
    flex: 1,
    marginHorizontal: spacing.sm,
  },
  activityButtonActive: {
    backgroundColor: colors.activity + '10',
  },
  activityText: {
    ...typography.body,
    color: colors.text,
    marginTop: spacing.xs,
  },
  input: {
    ...typography.h3,
    color: colors.text,
    textAlign: 'center',
    padding: spacing.md,
    backgroundColor: colors.gray100,
    borderRadius: borderRadius.md,
  },
  buttonContainer: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  saveButton: {
    width: '100%',
  },
});
