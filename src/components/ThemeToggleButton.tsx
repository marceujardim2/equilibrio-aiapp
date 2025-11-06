import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useThemedColors } from '../hooks/useThemedColors';

interface ThemeToggleButtonProps {
  size?: number;
  color?: string;
  style?: any;
}

export const ThemeToggleButton: React.FC<ThemeToggleButtonProps> = ({ 
  size = 24, 
  color,
  style 
}) => {
  const { theme, toggleTheme } = useTheme();
  const colors = useThemedColors();

  return (
    <Pressable 
      onPress={toggleTheme} 
      style={[styles.button, style]}
      hitSlop={8}
    >
      <Ionicons 
        name={theme === 'dark' ? 'sunny' : 'moon'} 
        size={size} 
        color={color || (theme === 'dark' ? colors.warning : colors.primary)} 
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
