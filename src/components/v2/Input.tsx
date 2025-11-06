/**
 * Input Component - Design System V2
 * Suporta diferentes estados e variantes
 */
import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../hooks/useThemeV2';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  containerStyle,
  inputStyle,
  ...textInputProps
}) => {
  const theme = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const getBorderColor = (): string => {
    if (error) return theme.colors.error;
    if (isFocused) return theme.colors.primary;
    return theme.colors.border;
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text
          style={[
            styles.label,
            {
              color: theme.colors['text-secondary'],
              fontSize: theme.typography.small.size,
              fontWeight: theme.typography.small.weight.toString(),
            },
          ]}
        >
          {label}
        </Text>
      )}
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: theme.colors['surface-1'],
            borderColor: getBorderColor(),
            borderRadius: theme.radii.md,
          },
          isFocused && { borderWidth: 2 },
        ]}
      >
        {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
        <TextInput
          {...textInputProps}
          style={[
            styles.input,
            {
              color: theme.colors['text-primary'],
              fontSize: theme.typography.body.size,
              flex: 1,
            },
            inputStyle,
          ]}
          placeholderTextColor={theme.colors['text-tertiary']}
          onFocus={(e) => {
            setIsFocused(true);
            textInputProps.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            textInputProps.onBlur?.(e);
          }}
        />
        {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
      </View>
      {(error || helperText) && (
        <Text
          style={[
            styles.helperText,
            {
              color: error ? theme.colors.error : theme.colors['text-tertiary'],
              fontSize: theme.typography.caption.size,
            },
          ]}
        >
          {error || helperText}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 16,
    minHeight: 48,
  },
  input: {
    padding: 0,
  },
  iconLeft: {
    marginRight: 12,
  },
  iconRight: {
    marginLeft: 12,
  },
  helperText: {
    marginTop: 6,
  },
});
