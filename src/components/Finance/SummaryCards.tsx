import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../index';
import { spacing, typography, borderRadius } from '../../theme';
import { useThemedColors } from '../../hooks/useThemedColors';

type SummaryCardsProps = {
  expense: number;
  income: number;
  saved: number; // income - expense (>=0)
};

const MiniCard: React.FC<{ icon: keyof typeof Ionicons.glyphMap; label: string; value: string; color: string; }>
  = ({ icon, label, value, color }) => {
  const colors = useThemedColors();
  return (
    <View style={[styles.mini, { backgroundColor: colors.surface1, borderColor: colors.border }]}> 
      <Ionicons name={icon} size={18} color={color} />
      <Text style={[styles.miniLabel, { color: colors.textSecondary }]}>{label}</Text>
      <Text style={[styles.miniValue, { color }]}>{value}</Text>
    </View>
  );
};

const SummaryCards: React.FC<SummaryCardsProps> = ({ expense, income, saved }) => {
  const colors = useThemedColors();
  return (
    <View style={styles.row}>
      <MiniCard icon="arrow-down" label="Gasto mês" value={`R$ ${expense.toFixed(2)}`} color={colors.error} />
      <MiniCard icon="arrow-up" label="Receita" value={`R$ ${income.toFixed(2)}`} color={colors.success} />
      <MiniCard icon="shield-checkmark" label="Economizado" value={`R$ ${saved.toFixed(2)}`} color={colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  mini: { flex: 1, borderRadius: borderRadius.md, padding: spacing.md, borderWidth: 1 },
  miniLabel: { ...typography.caption, marginTop: spacing.xs / 2 },
  miniValue: { ...typography.h4, fontWeight: '700', marginTop: spacing.xs / 2 },
});

export default SummaryCards;


