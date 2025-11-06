/**
 * Card Component - Design System V2
 * Suporta diferentes elevações e variantes
 */
import React from 'react';
import { View, StyleSheet, Pressable, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useTheme } from '../../hooks/useThemeV2';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type CardVariant = 'default' | 'elevated' | 'outlined' | 'glass';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  variant?: CardVariant;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  onPress,
  style,
  variant = 'default',
  padding = 'md',
}) => {
  const theme = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (onPress) {
      scale.value = withSpring(0.97, { damping: 15 });
    }
  };

  const handlePressOut = () => {
    if (onPress) {
      scale.value = withSpring(1, { damping: 15 });
    }
  };

  const getCardStyles = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: theme.radii.md,
      backgroundColor: theme.colors.card,
    };

    switch (variant) {
      case 'default':
        return {
          ...baseStyle,
          ...theme.shadows.sm,
        };
      case 'elevated':
        return {
          ...baseStyle,
          ...theme.shadows.lg,
        };
      case 'outlined':
        return {
          ...baseStyle,
          borderWidth: 1,
          borderColor: theme.colors.border,
        };
      case 'glass':
        return {
          ...baseStyle,
          backgroundColor: theme.colors.glass,
          borderWidth: 1,
          borderColor: theme.colors.border,
        };
      default:
        return baseStyle;
    }
  };

  const getPadding = (): number => {
    switch (padding) {
      case 'none':
        return 0;
      case 'sm':
        return theme.spacing.sm;
      case 'md':
        return theme.spacing.md;
      case 'lg':
        return theme.spacing.lg;
      default:
        return theme.spacing.md;
    }
  };

  const cardStyle = [
    getCardStyles(),
    { padding: getPadding() },
    style,
    onPress && animatedStyle,
  ];

  if (onPress) {
    return (
      <AnimatedPressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={cardStyle}
      >
        {children}
      </AnimatedPressable>
    );
  }

  return <View style={cardStyle}>{children}</View>;
};
