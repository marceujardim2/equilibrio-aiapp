import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../index';
import { spacing as spacingTokens, borderRadius } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { useThemedColors } from '../../hooks/useThemedColors';

export type Transaction = {
  id: string;
  type: 'expense' | 'income';
  amount: number;
  category: string;
  description: string;
  date: string;
  fromCheckin?: boolean;
};

type TransactionsProps = {
  transactions: Transaction[];
  onEdit: (t: Transaction) => void;
  onDelete: (id: string) => void;
};

export const Transactions: React.FC<TransactionsProps> = ({ transactions, onEdit, onDelete }) => {
  const colors = useThemedColors();

  return (
    <Card style={styles.card}>
      {transactions.map((t, index) => (
        <View key={t.id} style={[styles.item, { borderBottomColor: colors.border }]}>
          <View style={styles.left}>
            <View style={[styles.icon, { backgroundColor: t.type === 'income' ? colors.success + '20' : colors.error + '20' }]}>
              <Ionicons name={t.type === 'income' ? 'trending-up' : 'trending-down'} size={20} color={t.type === 'income' ? colors.success : colors.error} />
            </View>
            <View style={styles.info}>
              <Text style={[styles.desc, { color: colors.textPrimary }]}>{t.description}</Text>
              <Text style={[styles.date, { color: colors.textSecondary }]}>
                {new Date(t.date).toLocaleDateString('pt-BR')}
                {t.fromCheckin && ' • Check-in'}
              </Text>
            </View>
          </View>
          <View style={styles.right}>
            <Text style={[styles.amount, { color: t.type === 'income' ? colors.success : colors.error }]}>
              {t.type === 'income' ? '+' : '-'} R$ {t.amount.toFixed(2)}
            </Text>
            <View style={styles.actions}>
              <Pressable onPress={() => onEdit(t)} style={styles.actionBtn}>
                <Ionicons name="create-outline" size={18} color={colors.primary} />
              </Pressable>
              <Pressable onPress={() => onDelete(t.id)} style={styles.actionBtn}>
                <Ionicons name="trash-outline" size={18} color={colors.error} />
              </Pressable>
            </View>
          </View>
        </View>
      ))}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: { marginBottom: spacingTokens.md },
  item: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacingTokens.md, borderBottomWidth: 1 },
  left: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  icon: { width: 40, height: 40, borderRadius: borderRadius.md, alignItems: 'center', justifyContent: 'center', marginRight: spacingTokens.sm },
  info: { flex: 1 },
  desc: { ...typography.body, fontWeight: '600' },
  date: { ...typography.caption },
  right: { alignItems: 'flex-end' },
  amount: { ...typography.body, fontWeight: '700', marginBottom: spacingTokens.xs / 2 },
  actions: { flexDirection: 'row', gap: spacingTokens.sm },
  actionBtn: { padding: spacingTokens.xs / 2 },
});

export default Transactions;


