/**
 * Button Component - Redesigned with new dark theme
 * Suporta variantes: primary, secondary, outline, ghost, destructive
 * States: default, pressed, disabled, loading
 */

import React from 'react';
import { Text, StyleSheet, Pressable, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { tokens } from '../hooks/tokens';
import { useThemedColors } from '../hooks/useThemedColors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  style,
  textStyle,
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
}) => {
  const colors = useThemedColors();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: disabled ? tokens.opacity.disabled : 1,
  }));

  const handlePressIn = () => {
    if (!disabled && !loading) {
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

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: tokens.radii.md,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: colors.primary,
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: colors.accent,
        };
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: colors.primary,
        };
      case 'ghost':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
        };
      case 'destructive':
        return {
          ...baseStyle,
          backgroundColor: colors.error,
        };
      default:
        return {
          ...baseStyle,
          backgroundColor: colors.primary,
        };
    }
  };

  const getTextColor = (): string => {
    switch (variant) {
      case 'primary':
      case 'secondary':
      case 'destructive':
        return colors.background;
      case 'outline':
        return colors.primary;
      case 'ghost':
        return colors.textPrimary;
      default:
        return colors.background;
    }
  };

  const getSizeStyles = (): ViewStyle => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: tokens.spacing.xs,
          paddingHorizontal: tokens.spacing.md,
        };
      case 'medium':
        return {
          paddingVertical: tokens.spacing.sm,
          paddingHorizontal: tokens.spacing.lg,
        };
      case 'large':
        return {
          paddingVertical: tokens.spacing.md,
          paddingHorizontal: tokens.spacing.xl,
        };
      default:
        return {
          paddingVertical: tokens.spacing.sm,
          paddingHorizontal: tokens.spacing.lg,
        };
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'small':
        return tokens.typography.small;
      case 'large':
        return tokens.typography.body;
      default:
        return tokens.typography.button;
    }
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      style={[
        styles.button,
        getButtonStyle(),
        getSizeStyles(),
        style,
        animatedStyle,
        variant !== 'ghost' && variant !== 'outline' && tokens.shadows.sm,
      ]}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={getTextColor()} 
        />
      ) : (
        <>
          {leftIcon && <>{leftIcon}</>}
          <Text style={[
            styles.text,
            getTextSize(),
            { color: getTextColor() },
            textStyle,
            leftIcon && styles.textWithIcon,
            rightIcon && styles.textWithIcon,
          ]}>
            {title}
          </Text>
          {rightIcon && <>{rightIcon}</>}
        </>
      )}
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  button: {
    minHeight: 44, // WCAG AA - mínimo tap target
  },
  text: {
    fontWeight: tokens.typography.button.fontWeight,
    letterSpacing: tokens.typography.button.letterSpacing,
  },
  textWithIcon: {
    marginHorizontal: tokens.spacing.xs,
  },
});
