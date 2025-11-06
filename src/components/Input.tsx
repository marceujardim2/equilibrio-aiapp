/**
 * Input Component - Redesigned with new dark theme
 * Suporta estados: default, focused, error, disabled
 */

import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  Text, 
  StyleSheet, 
  TextInputProps, 
  ViewStyle,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { tokens } from '../hooks/tokens';
import { useThemedColors } from '../hooks/useThemedColors';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  style,
  ...textInputProps
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const colors = useThemedColors();

  const getBorderColor = () => {
    if (error) return colors.error;
    if (isFocused) return colors.primary;
    return colors.border;
  };

  const getBackgroundColor = () => {
    if (textInputProps.editable === false) {
      return colors.surface2;
    }
    return colors.surface1;
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, { color: colors.textPrimary }]}>{label}</Text>
      )}
      
      <View
        style={[
          styles.inputContainer,
          {
            borderColor: getBorderColor(),
            backgroundColor: getBackgroundColor(),
            borderWidth: isFocused ? 2 : 1,
          },
          error && styles.inputContainerError,
        ]}
      >
        {leftIcon && (
          <Ionicons
            name={leftIcon}
            size={20}
            color={isFocused ? colors.primary : colors.muted}
            style={styles.leftIcon}
          />
        )}
        
        <TextInput
          style={[
            styles.input,
            leftIcon && styles.inputWithLeftIcon,
            rightIcon && styles.inputWithRightIcon,
            { color: colors.textPrimary },
            style,
          ]}
          placeholderTextColor={colors.textTertiary}
          onFocus={(e) => {
            setIsFocused(true);
            textInputProps.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            textInputProps.onBlur?.(e);
          }}
          {...textInputProps}
        />
        
        {rightIcon && (
          <Pressable
            onPress={onRightIconPress}
            style={styles.rightIconContainer}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={rightIcon}
              size={20}
              color={isFocused ? colors.primary : colors.muted}
            />
          </Pressable>
        )}
      </View>
      
      {error && (
        <Animated.View entering={FadeInDown.duration(200)}>
          <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
        </Animated.View>
      )}
      
      {helperText && !error && (
        <Text style={[styles.helperText, { color: colors.textSecondary }]}>{helperText}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: tokens.spacing.md,
  },
  label: {
    ...tokens.typography.label,
    color: tokens.colors.textPrimary,
    marginBottom: tokens.spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: tokens.radii.md,
    paddingHorizontal: tokens.spacing.md,
    minHeight: 48, // WCAG AA
  },
  inputContainerError: {
    borderColor: tokens.colors.error,
  },
  input: {
    flex: 1,
    ...tokens.typography.body,
    color: tokens.colors.textPrimary,
    paddingVertical: tokens.spacing.sm,
  },
  inputWithLeftIcon: {
    marginLeft: tokens.spacing.xs,
  },
  inputWithRightIcon: {
    marginRight: tokens.spacing.xs,
  },
  leftIcon: {
    marginRight: tokens.spacing.xs,
  },
  rightIconContainer: {
    padding: tokens.spacing.xs,
  },
  errorText: {
    ...tokens.typography.small,
    color: tokens.colors.error,
    marginTop: tokens.spacing.xs,
  },
  helperText: {
    ...tokens.typography.small,
    color: tokens.colors.textSecondary,
    marginTop: tokens.spacing.xs,
  },
});

