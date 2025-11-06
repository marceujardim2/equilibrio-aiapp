/**
 * FloatingActionButton Component - Design System V2
 * Botão flutuante para ações principais
 */
import React from 'react';
import { StyleSheet, Pressable, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useThemeV2';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

interface FABProps {
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  size?: 'small' | 'medium' | 'large';
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'center';
  style?: ViewStyle;
  disabled?: boolean;
}

export const FloatingActionButton: React.FC<FABProps> = ({
  onPress,
  icon = 'add',
  size = 'medium',
  position = 'bottom-right',
  style,
  disabled = false,
}) => {
  const theme = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (!disabled) {
      scale.value = withSpring(0.9, { damping: 15 });
    }
  };

  const handlePressOut = () => {
    if (!disabled) {
      scale.value = withSpring(1, { damping: 15 });
    }
  };

  const getSize = (): number => {
    switch (size) {
      case 'small':
        return 48;
      case 'medium':
        return 56;
      case 'large':
        return 64;
      default:
        return 56;
    }
  };

  const getIconSize = (): number => {
    switch (size) {
      case 'small':
        return 20;
      case 'medium':
        return 24;
      case 'large':
        return 28;
      default:
        return 24;
    }
  };

  const getPositionStyles = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      position: 'absolute',
      zIndex: theme.zIndex.fixed,
    };

    switch (position) {
      case 'bottom-right':
        return { ...baseStyle, bottom: 24, right: 24 };
      case 'bottom-left':
        return { ...baseStyle, bottom: 24, left: 24 };
      case 'top-right':
        return { ...baseStyle, top: 24, right: 24 };
      case 'top-left':
        return { ...baseStyle, top: 24, left: 24 };
      case 'center':
        return { ...baseStyle, bottom: '50%', right: '50%' };
      default:
        return { ...baseStyle, bottom: 24, right: 24 };
    }
  };

  const fabSize = getSize();

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={[
        getPositionStyles(),
        {
          width: fabSize,
          height: fabSize,
          borderRadius: fabSize / 2,
          opacity: disabled ? theme.opacity.disabled : 1,
        },
        style,
        animatedStyle,
      ]}
    >
      <LinearGradient
        colors={theme.colors['gradient-primary']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          StyleSheet.absoluteFill,
          {
            borderRadius: fabSize / 2,
          },
        ]}
      />
      <Ionicons
        name={icon}
        size={getIconSize()}
        color={theme.colors['text-primary']}
        style={{ alignSelf: 'center', marginTop: 'auto', marginBottom: 'auto' }}
      />
    </AnimatedPressable>
  );
};
