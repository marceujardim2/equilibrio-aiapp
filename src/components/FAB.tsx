/**
 * FloatingActionButton (FAB) Component
 * Botão flutuante para ações rápidas
 */

import React from 'react';
import { StyleSheet, Pressable, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import { tokens } from '../hooks/tokens';
import { useThemedColors } from '../hooks/useThemedColors';

interface FABProps {
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  size?: 'small' | 'medium' | 'large';
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center';
  style?: ViewStyle;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const FAB: React.FC<FABProps> = ({
  onPress,
  icon = 'add',
  size = 'medium',
  position = 'bottom-right',
  style,
}) => {
  const colors = useThemedColors();
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.9, {
      damping: 15,
      stiffness: 300,
    });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 300,
    });
    rotation.value = withSequence(
      withSpring(rotation.value + 90, {
        damping: 10,
        stiffness: 100,
      }),
      withSpring(0, {
        damping: 10,
        stiffness: 100,
      })
    );
  };

  const getSize = () => {
    switch (size) {
      case 'small':
        return 48;
      case 'large':
        return 72;
      default:
        return 56;
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'small':
        return 24;
      case 'large':
        return 32;
      default:
        return 28;
    }
  };

  const getPosition = (): ViewStyle => {
    switch (position) {
      case 'bottom-left':
        return {
          bottom: tokens.spacing.xl,
          left: tokens.spacing.xl,
        };
      case 'bottom-center':
        return {
          bottom: tokens.spacing.xl,
          alignSelf: 'center',
        };
      default:
        return {
          bottom: tokens.spacing.xl,
          right: tokens.spacing.xl,
        };
    }
  };

  const fabSize = getSize();

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.fab,
        {
          width: fabSize,
          height: fabSize,
          borderRadius: fabSize / 2,
        },
        { backgroundColor: colors.primary },
        getPosition(),
        style,
        animatedStyle,
      ]}
    >
      <Ionicons
        name={icon}
        size={getIconSize()}
        color={colors.background}
      />
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    backgroundColor: tokens.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...tokens.shadows.lg,
    zIndex: tokens.zIndex.fab,
  },
});

