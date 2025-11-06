import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../index';
import { spacing, typography, borderRadius } from '../../theme';
import { useThemedColors } from '../../hooks/useThemedColors';

type MonthlyBudgetProps = {
  expenses: number;
  budget: number;
  onEdit?: () => void;
};

export const MonthlyBudget: React.FC<MonthlyBudgetProps> = ({ expenses, budget, onEdit }) => {
  const colors = useThemedColors();
  const pct = budget > 0 ? Math.min(Math.max((expenses / budget) * 100, 0), 100) : 0;

  return (
    <Card style={styles.card}>
      <View style={styles.rowHeader}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Orçamento do Mês</Text>
        <Pressable onPress={onEdit} style={styles.editButton}>
          <Ionicons name="create-outline" size={16} color={colors.primary} />
          <Text style={[styles.editText, { color: colors.primary }]}>Editar</Text>
        </Pressable>
      </View>
      <Text style={[styles.amount, { color: colors.textPrimary }]}>R$ {expenses.toFixed(0)} / R$ {budget.toFixed(0)}</Text>
      <View style={[styles.progressBar, { backgroundColor: colors.surface2 }]}> 
        <View style={[styles.progressFill, { width: `${pct}%`, backgroundColor: pct > 80 ? colors.error : colors.primary }]} />
      </View>
      <Text style={[styles.caption, { color: colors.textSecondary }]}>{pct.toFixed(0)}% do orçamento usado</Text>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: { marginBottom: spacing.md },
  rowHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { ...typography.h4, fontWeight: '600' },
  amount: { ...typography.body, fontWeight: '700', marginTop: spacing.xs, marginBottom: spacing.sm },
  progressBar: { height: 8, borderRadius: borderRadius.full, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: borderRadius.full },
  caption: { ...typography.caption, marginTop: spacing.xs },
  editButton: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs / 2 },
  editText: { ...typography.caption, fontWeight: '600' },
});

export default MonthlyBudget;


