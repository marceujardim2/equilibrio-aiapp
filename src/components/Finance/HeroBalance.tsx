import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { spacing, typography, borderRadius } from '../../theme';
import { useThemedColors } from '../../hooks/useThemedColors';

type HeroBalanceProps = {
  balance: number; // saldo disponível (receitas - despesas)
  onAdd?: () => void;
  onTransfer?: () => void;
};

const HeroBalance: React.FC<HeroBalanceProps> = ({ balance, onAdd, onTransfer }) => {
  const colors = useThemedColors();

  return (
    <LinearGradient
      colors={[
        colors.primary + '33',
        colors.accent + '33',
      ]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.hero, { backgroundColor: colors.surface1 }]}
    >
      <Text style={[styles.title, { color: colors.textSecondary }]}>Saldo disponível</Text>
      <Text style={[styles.balance, { color: colors.textPrimary }]}>R$ {balance.toFixed(2)}</Text>

      <View style={styles.actionsRow}>
        <Pressable onPress={onAdd} style={[styles.actionBtn, { backgroundColor: colors.primary }]}> 
          <Ionicons name="add" size={18} color={colors.card} />
          <Text style={[styles.actionText, { color: colors.card }]}>Adicionar</Text>
        </Pressable>
        <Pressable onPress={onTransfer} style={[styles.actionBtnOutline, { borderColor: colors.border }]}> 
          <Ionicons name="swap-horizontal" size={18} color={colors.textPrimary} />
          <Text style={[styles.actionTextOutline, { color: colors.textPrimary }]}>Transferir</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  hero: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
  },
  title: { ...typography.body },
  balance: { ...typography.h1, fontWeight: '700', marginTop: spacing.xs },
  actionsRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  actionBtn: { flexDirection: 'row', gap: spacing.xs / 2, alignItems: 'center', paddingVertical: spacing.sm, paddingHorizontal: spacing.md, borderRadius: borderRadius.md },
  actionText: { ...typography.button },
  actionBtnOutline: { flexDirection: 'row', gap: spacing.xs / 2, alignItems: 'center', paddingVertical: spacing.sm, paddingHorizontal: spacing.md, borderRadius: borderRadius.md, borderWidth: 1 },
  actionTextOutline: { ...typography.button },
});

export default HeroBalance;


