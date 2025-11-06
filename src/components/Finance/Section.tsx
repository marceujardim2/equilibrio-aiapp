import React, { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../../components';
import { spacing as spacingTokens } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { useThemedColors } from '../../hooks/useThemedColors';

interface SectionProps {
  title?: string;
  children: ReactNode;
  inset?: boolean;
  footer?: ReactNode;
}

export default function Section({ title, children, inset = true, footer }: SectionProps) {
  const colors = useThemedColors();
  return (
    <View style={styles.wrapper}>
      {title ? (
        <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
      ) : null}
      <Card style={[styles.card, inset && styles.cardInset]}>
        {children}
      </Card>
      {footer ? <View style={styles.footer}>{footer}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacingTokens.lg,
  },
  title: {
    ...typography.h4,
    marginBottom: spacingTokens.md,
  },
  card: {},
  cardInset: {
    padding: spacingTokens.md,
  },
  footer: {
    marginTop: spacingTokens.sm,
    alignItems: 'flex-end',
  },
});


