/**
 * Button Component - Design System V2
 * Suporta variantes: primary, secondary, outline, ghost, destructive
 * Estados: default, pressed, disabled, loading
 */
import React from 'react';
import { Text, StyleSheet, Pressable, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../hooks/useThemeV2';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
export type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  style,
  textStyle,
  disabled = false,
  loading = false,
  icon,
  fullWidth = false,
}) => {
  const theme = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (!disabled && !loading) {
      scale.value = withSpring(0.95, { damping: 15 });
    }
  };

  const handlePressOut = () => {
    if (!disabled && !loading) {
      scale.value = withSpring(1, { damping: 15 });
    }
  };

  const getButtonStyles = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: theme.radii.md,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      opacity: disabled ? theme.opacity.disabled : 1,
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          ...theme.shadows.md,
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: theme.colors.accent,
          ...theme.shadows.md,
        };
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderColor: theme.colors.primary,
        };
      case 'ghost':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
        };
      case 'destructive':
        return {
          ...baseStyle,
          backgroundColor: theme.colors.error,
          ...theme.shadows.md,
        };
      default:
        return baseStyle;
    }
  };

  const getTextColor = (): string => {
    switch (variant) {
      case 'primary':
        return theme.colors['text-primary'];
      case 'secondary':
        return theme.colors['text-primary'];
      case 'outline':
      case 'ghost':
        return theme.colors.primary;
      case 'destructive':
        return theme.colors['text-primary'];
      default:
        return theme.colors['text-primary'];
    }
  };

  const getSizeStyles = (): ViewStyle => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: theme.spacing.xs,
          paddingHorizontal: theme.spacing.sm,
          minHeight: 36,
        };
      case 'medium':
        return {
          paddingVertical: theme.spacing.sm,
          paddingHorizontal: theme.spacing.lg,
          minHeight: 48,
        };
      case 'large':
        return {
          paddingVertical: theme.spacing.md,
          paddingHorizontal: theme.spacing.xl,
          minHeight: 56,
        };
      default:
        return {
          paddingVertical: theme.spacing.sm,
          paddingHorizontal: theme.spacing.lg,
          minHeight: 48,
        };
    }
  };

  const getTypography = () => {
    return theme.typography.button;
  };

  const buttonContent = (
    <>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={getTextColor()}
          style={{ marginRight: theme.spacing.xs }}
        />
      ) : icon ? (
        <>{icon}</>
      ) : null}
      <Text
        style={[
          {
            fontSize: getTypography().size,
            fontWeight: getTypography().weight.toString(),
            color: getTextColor(),
            letterSpacing: getTypography().letterSpacing,
          },
          textStyle,
        ]}
      >
        {title}
      </Text>
    </>
  );

  if (variant === 'primary') {
    return (
      <AnimatedPressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        style={[
          getButtonStyles(),
          getSizeStyles(),
          fullWidth && { width: '100%' },
          style,
          animatedStyle,
        ]}
      >
        <LinearGradient
          colors={theme.colors['gradient-primary']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
            StyleSheet.absoluteFill,
            {
              borderRadius: theme.radii.md,
            },
          ]}
        />
        {buttonContent}
      </AnimatedPressable>
    );
  }

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      style={[
        getButtonStyles(),
        getSizeStyles(),
        fullWidth && { width: '100%' },
        style,
        animatedStyle,
      ]}
    >
      {buttonContent}
    </AnimatedPressable>
  );
};
