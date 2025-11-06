import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, Badge } from '../index';
import { spacing, typography } from '../../theme';
import { useThemedColors } from '../../hooks/useThemedColors';

type InsightsProps = {
  message: string;
};

export const Insights: React.FC<InsightsProps> = ({ message }) => {
  const colors = useThemedColors();
  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Ionicons name="bulb" size={20} color={colors.warning} />
        <Text style={[styles.title, { color: colors.textPrimary }]}>Dica do Dia</Text>
      </View>
      <Text style={[styles.text, { color: colors.textSecondary }]}>{message}</Text>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: { marginBottom: spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  title: { ...typography.h4, fontWeight: '600' },
  text: { ...typography.body, lineHeight: 22, marginTop: spacing.xs },
});

export default Insights;


