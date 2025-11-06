/**
 * Transaction Detail Screen - Redesigned with new dark theme
 * Tela de detalhes de transação
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { tokens } from '../hooks/tokens';
import { useThemedColors } from '../hooks/useThemedColors';
import { Card, Button } from '../components';

interface TransactionDetailScreenProps {
  transaction?: {
    id: string;
    type: 'income' | 'expense';
    amount: number;
    category: string;
    description: string;
    date: string;
    createdAt: number;
  };
  onEdit?: () => void;
  onDelete?: () => void;
  onBack?: () => void;
}

export default function TransactionDetailScreen({
  transaction,
  onEdit,
  onDelete,
  onBack,
}: TransactionDetailScreenProps) {
  const colors = useThemedColors();
  if (!transaction) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.emptyContainer}>
          <Ionicons name="receipt-outline" size={64} color={colors.muted} />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Transação não encontrada</Text>
          <Button title="Voltar" onPress={onBack || (() => {})} variant="outline" />
        </View>
      </SafeAreaView>
    );
  }

  const isIncome = transaction.type === 'income';
  const categoryIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
    food: 'restaurant',
    transport: 'car',
    entertainment: 'game-controller',
    health: 'medical',
    shopping: 'bag',
    bills: 'receipt',
    income: 'cash',
    others: 'ellipse',
  };

  const categoryLabels: Record<string, string> = {
    food: 'Alimentação',
    transport: 'Transporte',
    entertainment: 'Lazer',
    health: 'Saúde',
    shopping: 'Compras',
    bills: 'Contas',
    income: 'Renda',
    others: 'Outros',
  };

  const date = new Date(transaction.date);
  const formattedDate = date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Detalhes</Text>
          <View style={styles.backButton} />
        </View>

        <View style={styles.content}>
          {/* Card Principal */}
          <Animated.View entering={FadeInDown.springify()}>
            <Card variant="elevated" padding="lg">
              <View style={styles.iconContainer}>
                <View
                  style={[
                    styles.iconWrapper,
                    {
                      backgroundColor: isIncome
                        ? colors.success + '20'
                        : colors.error + '20',
                    },
                  ]}
                >
                  <Ionicons
                    name={categoryIcons[transaction.category] || 'ellipse'}
                    size={48}
                    color={isIncome ? colors.success : colors.error}
                  />
                </View>
              </View>

              <Text style={[styles.amount, { color: colors.textPrimary }]}>
                {isIncome ? '+' : '-'} R$ {Math.abs(transaction.amount).toFixed(2)}
              </Text>
              <Text style={[styles.category, { color: colors.textSecondary }]}>{categoryLabels[transaction.category] || 'Outros'}</Text>
              <Text style={[styles.description, { color: colors.textSecondary }]}>{transaction.description}</Text>
            </Card>
          </Animated.View>

          {/* Informações */}
          <Animated.View entering={FadeInDown.delay(100).springify()}>
            <Card variant="outlined" padding="lg">
              <View style={styles.infoRow}>
                <View style={styles.infoLeft}>
                  <Ionicons name="calendar" size={20} color={colors.muted} />
                  <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Data</Text>
                </View>
                <Text style={[styles.infoValue, { color: colors.textPrimary }]}>{formattedDate}</Text>
              </View>

              <View style={[styles.divider, { backgroundColor: colors.divider }]} />

              <View style={styles.infoRow}>
                <View style={styles.infoLeft}>
                  <Ionicons name="time" size={20} color={colors.muted} />
                  <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Registrado em</Text>
                </View>
                <Text style={[styles.infoValue, { color: colors.textPrimary }]}>
                  {new Date(transaction.createdAt).toLocaleString('pt-BR')}
                </Text>
              </View>

              <View style={[styles.divider, { backgroundColor: colors.divider }]} />

              <View style={styles.infoRow}>
                <View style={styles.infoLeft}>
                  <Ionicons
                    name={isIncome ? 'trending-up' : 'trending-down'}
                    size={20}
                    color={colors.muted}
                  />
                  <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Tipo</Text>
                </View>
                <View
                  style={[
                    styles.typeBadge,
                    {
                      backgroundColor: isIncome
                        ? colors.success + '20'
                        : colors.error + '20',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.typeText,
                      { color: isIncome ? colors.success : colors.error },
                    ]}
                  >
                    {isIncome ? 'Receita' : 'Despesa'}
                  </Text>
                </View>
              </View>
            </Card>
          </Animated.View>

          {/* Ações */}
          <View style={styles.actions}>
            <Button
              title="Editar"
              onPress={onEdit || (() => {})}
              variant="outline"
              size="large"
              leftIcon={<Ionicons name="create" size={20} color={colors.primary} />}
              style={styles.actionButton}
            />
            <Button
              title="Excluir"
              onPress={onDelete || (() => {})}
              variant="destructive"
              size="large"
              leftIcon={<Ionicons name="trash" size={20} color={colors.background} />}
              style={styles.actionButton}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: tokens.spacing.lg,
    paddingTop: tokens.spacing.md,
    paddingBottom: tokens.spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...tokens.typography.h3,
    color: tokens.colors.textPrimary,
  },
  content: {
    padding: tokens.spacing.lg,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: tokens.spacing.lg,
  },
  iconWrapper: {
    width: 100,
    height: 100,
    borderRadius: tokens.radii.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  amount: {
    ...tokens.typography.h1,
    fontSize: 36,
    color: tokens.colors.textPrimary,
    textAlign: 'center',
    marginBottom: tokens.spacing.xs,
    fontWeight: '700',
  },
  category: {
    ...tokens.typography.body,
    color: tokens.colors.textSecondary,
    textAlign: 'center',
    marginBottom: tokens.spacing.sm,
  },
  description: {
    ...tokens.typography.bodySm,
    color: tokens.colors.textSecondary,
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: tokens.spacing.sm,
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.sm,
  },
  infoLabel: {
    ...tokens.typography.bodySm,
    color: tokens.colors.textSecondary,
  },
  infoValue: {
    ...tokens.typography.body,
    color: tokens.colors.textPrimary,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: tokens.colors.divider,
    marginVertical: tokens.spacing.sm,
  },
  typeBadge: {
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.xs,
    borderRadius: tokens.radii.sm,
  },
  typeText: {
    ...tokens.typography.small,
    fontWeight: '600',
  },
  actions: {
    marginTop: tokens.spacing.xl,
    gap: tokens.spacing.md,
  },
  actionButton: {
    width: '100%',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: tokens.spacing.xl,
  },
  emptyText: {
    ...tokens.typography.body,
    color: tokens.colors.textSecondary,
    marginTop: tokens.spacing.lg,
    marginBottom: tokens.spacing.xl,
  },
});

