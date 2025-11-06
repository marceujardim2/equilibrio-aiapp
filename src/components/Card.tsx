/**
 * Card Component - Redesigned with new dark theme
 * Suporta variantes e estados diferentes
 */

import React from 'react';
import { View, StyleSheet, Pressable, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { tokens } from '../hooks/tokens';
import { useThemedColors } from '../hooks/useThemedColors';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'outlined' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const Card: React.FC<CardProps> = ({ 
  children, 
  onPress, 
  style, 
  variant = 'default',
  padding = 'md',
}) => {
  const colors = useThemedColors();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (onPress) {
      scale.value = withSpring(tokens.motion.scale.press, {
        damping: 15,
        stiffness: 300,
      });
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 300,
    });
  };

  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: tokens.radii.lg,
    };

    switch (variant) {
      case 'default':
        return {
          ...baseStyle,
          backgroundColor: colors.card,
        };
      case 'elevated':
        return {
          ...baseStyle,
          backgroundColor: colors.surface1,
        };
      case 'outlined':
        return {
          ...baseStyle,
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.border,
        };
      case 'glass':
        return {
          ...baseStyle,
          backgroundColor: colors.glass,
          borderWidth: 1,
          borderColor: colors.border,
        };
      default:
        return {
          ...baseStyle,
          backgroundColor: colors.card,
        };
    }
  };

  const getPadding = () => {
    switch (padding) {
      case 'none':
        return 0;
      case 'sm':
        return tokens.spacing.sm;
      case 'md':
        return tokens.spacing.md;
      case 'lg':
        return tokens.spacing.lg;
      default:
        return tokens.spacing.md;
    }
  };

  const getShadow = () => {
    switch (variant) {
      case 'elevated':
        return tokens.shadows.lg;
      case 'glass':
        return tokens.shadows.sm;
      default:
        return tokens.shadows.md;
    }
  };

  const cardStyle = [
    styles.card,
    getCardStyle(),
    { padding: getPadding() },
    variant !== 'outlined' && variant !== 'glass' && getShadow(),
    style,
  ];

  if (onPress) {
    return (
      <AnimatedPressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[cardStyle, animatedStyle]}
      >
        {children}
      </AnimatedPressable>
    );
  }

  return (
    <View style={cardStyle}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
});
