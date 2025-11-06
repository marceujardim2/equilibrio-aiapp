import React from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemedColors } from '../../hooks/useThemedColors';
import { borderRadius } from '../../theme/spacing';
import { spacing as spacingTokens } from '../../theme/spacing';

interface FloatingAddButtonProps {
  onPress: () => void;
  style?: ViewStyle;
}

export default function FloatingAddButton({ onPress, style }: FloatingAddButtonProps) {
  const colors = useThemedColors();
  return (
    <Pressable
      style={[styles.fab, { backgroundColor: colors.primary, shadowColor: colors.shadow }, style]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Adicionar transação"
    >
      <Ionicons name="add" size={28} color={colors.card} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: spacingTokens.lg,
    bottom: spacingTokens.lg,
    width: 56,
    height: 56,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    // subtle shadow (platform-agnostic)
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
});


