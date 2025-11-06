import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { spacing as spacingTokens } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { useThemedColors } from '../../hooks/useThemedColors';

interface FinanceHeaderProps {
  title: string;
  subtitle?: string;
}

export default function FinanceHeader({ title, subtitle }: FinanceHeaderProps) {
  const colors = useThemedColors();
  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
      {subtitle ? (
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacingTokens.lg,
  },
  title: {
    ...typography.h2,
    marginBottom: spacingTokens.xs,
  },
  subtitle: {
    ...typography.body,
  },
});


