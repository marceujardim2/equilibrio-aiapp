import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemedColors } from '../../hooks/useThemedColors';
import { Card } from '../index';
import { spacing as spacingTokens, borderRadius } from '../../theme/spacing';
import { typography } from '../../theme/typography';

interface EmptyStateCardProps {
  title: string;
  subtitle: string;
}

export default function EmptyStateCard({ title, subtitle }: EmptyStateCardProps) {
  const colors = useThemedColors();
  return (
    <Card style={[styles.card, { alignItems: 'center' }]}> 
      <View style={[styles.iconBox, { backgroundColor: colors.muted + '20' }]}> 
        <Ionicons name="wallet" size={32} color={colors.muted} />
      </View>
      <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingVertical: spacingTokens.lg,
    borderRadius: borderRadius.xl,
  },
  iconBox: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacingTokens.md,
  },
  title: { ...typography.h4, marginBottom: spacingTokens.xs },
  subtitle: { ...typography.caption, textAlign: 'center' },
});


