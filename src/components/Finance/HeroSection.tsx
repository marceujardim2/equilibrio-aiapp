import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useThemedColors } from '../../hooks/useThemedColors';
import { spacing as spacingTokens, borderRadius } from '../../theme/spacing';
import FinanceHeader from './FinanceHeader';
import HeroBalance from './HeroBalance';
import SummaryCards from './SummaryCards';
import Summary from './Summary';
import MonthlyBudget from './MonthlyBudget';
import { Ionicons } from '@expo/vector-icons';
import { typography } from '../../theme/typography';

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  balance: number;
  income: number;
  expense: number;
  saved: number;
  remaining: number;
  budget: number;
  onAdd: () => void;
  onEditBudget: () => void;
}

export default function HeroSection({
  title,
  subtitle,
  balance,
  income,
  expense,
  saved,
  remaining,
  budget,
  onAdd,
  onEditBudget,
}: HeroSectionProps) {
  const colors = useThemedColors();
  return (
    <View style={[styles.container, { backgroundColor: colors.surface1, borderColor: colors.border }]}> 
      <FinanceHeader title={title} subtitle={subtitle} />
      <View style={styles.balanceHeaderRow}>
        <View style={styles.balanceLabelRow}>
          <Ionicons name="wallet" size={18} color={colors.textSecondary} />
          <Text style={[styles.balanceLabel, { color: colors.textSecondary }]}>Saldo Atual</Text>
        </View>
      </View>
      <HeroBalance balance={balance} onAdd={onAdd} onTransfer={() => {}} />

      {/* Mini cards Receitas / Despesas */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { borderColor: colors.border }]}> 
          <View style={[styles.statIconBox, { backgroundColor: colors.success + '20' }]}> 
            <Ionicons name="arrow-down" size={16} color={colors.success} />
          </View>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Receitas</Text>
          <Text style={[styles.statValue, { color: colors.textPrimary }]}>R$ {income.toFixed(2)}</Text>
          <Text style={[styles.statHint, { color: colors.success }]}>Este mês</Text>
        </View>
        <View style={[styles.statCard, { borderColor: colors.border }]}> 
          <View style={[styles.statIconBox, { backgroundColor: colors.error + '20' }]}> 
            <Ionicons name="arrow-up" size={16} color={colors.error} />
          </View>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Despesas</Text>
          <Text style={[styles.statValue, { color: colors.textPrimary }]}>R$ {expense.toFixed(2)}</Text>
          <Text style={[styles.statHint, { color: colors.error }]}>Este mês</Text>
        </View>
      </View>

      <View style={styles.spacer} />
      <SummaryCards expense={expense} income={income} saved={saved} />
      <View style={styles.spacer} />
      <Summary expenses={expense} remaining={remaining} />
      <View style={styles.spacer} />
      <MonthlyBudget expenses={expense} budget={budget} onEdit={onEditBudget} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.xl,
    padding: spacingTokens.lg,
    borderWidth: 1,
    marginBottom: spacingTokens.lg,
  },
  balanceHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacingTokens.sm,
  },
  balanceLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  balanceLabel: { ...typography.caption },
  statsRow: {
    flexDirection: 'row',
    gap: spacingTokens.md,
    marginTop: spacingTokens.md,
  },
  statCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    padding: spacingTokens.md,
  },
  statIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacingTokens.sm,
  },
  statLabel: { ...typography.caption },
  statValue: { ...typography.h4, fontWeight: '700', marginTop: 2 },
  statHint: { ...typography.caption, marginTop: 2 },
  spacer: {
    height: spacingTokens.md,
  },
});


