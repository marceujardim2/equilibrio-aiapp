import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../index';
import { spacing, typography, borderRadius } from '../../theme';
import { useThemedColors } from '../../hooks/useThemedColors';

type SummaryProps = {
  expenses: number;
  remaining: number;
};

export const Summary: React.FC<SummaryProps> = ({ expenses, remaining }) => {
  const colors = useThemedColors();

  return (
    <Card style={styles.summaryCard}>
      <View style={styles.summaryRow}>
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Gasto</Text>
          <Text style={[styles.summaryValue, { color: colors.error }]}>R$ {expenses.toFixed(2)}</Text>
        </View>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Restante</Text>
          <Text style={[styles.summaryValue, { color: colors.success }]}>R$ {remaining.toFixed(2)}</Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  summaryCard: {
    marginBottom: spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.xs,
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryLabel: {
    ...typography.bodySmall,
    marginBottom: spacing.xs,
  },
  summaryValue: {
    ...typography.h3,
    fontWeight: '700',
  },
  divider: {
    width: 1,
    marginHorizontal: spacing.md,
  },
});

export default Summary;


