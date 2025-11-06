import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInLeft } from 'react-native-reanimated';
import { spacing as spacingTokens, borderRadius } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { useThemedColors } from '../../hooks/useThemedColors';

export interface CategoryRow {
  name: string;
  amount: number;
  percentage: number;
  color: string;
  icon: keyof typeof Ionicons.glyphMap;
}

interface CategoriesListProps {
  data: CategoryRow[];
}

export default function CategoriesList({ data }: CategoriesListProps) {
  const colors = useThemedColors();

  if (!data || data.length === 0) {
    return (
      <Text style={[styles.empty, { color: colors.textSecondary }]}>Nenhuma transação registrada ainda</Text>
    );
  }

  return (
    <View>
      {data.map((item, index) => (
        <Animated.View
          key={item.name}
          entering={FadeInLeft.delay(100 + index * 50).springify()}
          style={[styles.row, { borderBottomColor: colors.border }]}
        >
          <View style={[styles.icon, { backgroundColor: item.color + '20' }]}>
            <Ionicons name={item.icon} size={20} color={item.color} />
          </View>
          <View style={styles.info}>
            <Text style={[styles.name, { color: colors.textPrimary }]}>{item.name}</Text>
            <Text style={[styles.percent, { color: colors.textSecondary }]}>{item.percentage}%</Text>
          </View>
          <Text style={[styles.amount, { color: colors.textPrimary }]}>R$ {item.amount.toFixed(2)}</Text>
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacingTokens.md,
    borderBottomWidth: 1,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacingTokens.sm,
  },
  info: { flex: 1 },
  name: { ...typography.body },
  percent: { ...typography.caption },
  amount: { ...typography.h4, fontWeight: '600' },
  empty: { ...typography.body, textAlign: 'center', padding: spacingTokens.lg },
});


