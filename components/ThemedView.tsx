import React from 'react';
import { StyleProp, View, ViewProps, ViewStyle } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface ThemedViewProps extends ViewProps {
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

export function ThemedView({ style, children, ...rest }: ThemedViewProps) {
  const { isDark } = useTheme();
  return (
    <View
      style={[{ backgroundColor: isDark ? '#18191B' : '#fff' }, style]}
      {...rest}
    >
      {children}
    </View>
  );
} 