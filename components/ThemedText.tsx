import React from 'react';
import { StyleProp, Text, TextProps, TextStyle } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface ThemedTextProps extends TextProps {
  style?: StyleProp<TextStyle>;
  children?: React.ReactNode;
}

export function ThemedText({ style, children, ...rest }: ThemedTextProps) {
  const { isDark } = useTheme();
  return (
    <Text
      style={[{ color: isDark ? '#fff' : '#18191B' }, style]}
      {...rest}
    >
      {children}
    </Text>
  );
} 