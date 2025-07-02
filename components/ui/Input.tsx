import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';

interface InputProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  label?: string;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  multiline?: boolean;
  numberOfLines?: number;
  disabled?: boolean;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  style?: ViewStyle;
  inputStyle?: TextStyle;
}

export default function Input({
  placeholder,
  value,
  onChangeText,
  label,
  error,
  secureTextEntry = false,
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1,
  disabled = false,
  leftIcon,
  rightIcon,
  onRightIconPress,
  style,
  inputStyle,
}: InputProps) {
  const { colors } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const getContainerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderWidth: 1,
      borderRadius: 12,
      backgroundColor: colors.surface,
      flexDirection: 'row',
      alignItems: multiline ? 'flex-start' : 'center',
      paddingHorizontal: 16,
      minHeight: multiline ? numberOfLines * 24 + 32 : 48,
    };

    if (error) {
      baseStyle.borderColor = colors.error;
    } else if (isFocused) {
      baseStyle.borderColor = colors.primary;
    } else {
      baseStyle.borderColor = colors.border;
    }

    if (disabled) {
      baseStyle.opacity = 0.5;
    }

    return baseStyle;
  };

  const getInputStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      flex: 1,
      color: colors.text,
      fontSize: 16,
      paddingVertical: 12,
    };

    if (leftIcon) {
      baseStyle.marginLeft = 8;
    }

    if (rightIcon || secureTextEntry) {
      baseStyle.marginRight = 8;
    }

    if (multiline) {
      baseStyle.textAlignVertical = 'top';
    }

    return baseStyle;
  };

  const handleSecureTextEntry = () => {
    if (secureTextEntry) {
      setShowPassword(!showPassword);
    }
  };

  return (
    <View style={style}>
      {label && (
        <Text style={[styles.label, { color: colors.text, marginBottom: 8 }]}>
          {label}
        </Text>
      )}
      
      <View style={getContainerStyle()}>
        {leftIcon && (
          <Ionicons
            name={leftIcon as any}
            size={20}
            color={colors.textSecondary}
            style={{ marginRight: 8 }}
          />
        )}

        <TextInput
          style={[getInputStyle(), inputStyle]}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={numberOfLines}
          editable={!disabled}
        />

        {(rightIcon || secureTextEntry) && (
          <TouchableOpacity
            onPress={secureTextEntry ? handleSecureTextEntry : onRightIconPress}
            style={{ padding: 4 }}
          >
            <Ionicons
              name={
                secureTextEntry
                  ? (showPassword ? 'eye-off' : 'eye')
                  : (rightIcon as any)
              }
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <Text style={[styles.error, { color: colors.error, marginTop: 8 }]}>
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  error: {
    fontSize: 12,
  },
}); 