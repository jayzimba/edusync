import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Colors, getColorScheme } from '../../constants/colors';
import { useColorScheme } from '../../hooks/useColorScheme';

const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  ...props
}) => {
  const colorScheme = useColorScheme();
  const colors = getColorScheme(colorScheme === 'dark');

  const getButtonStyle = () => {
    const baseStyle = [styles.button, styles[size]];
    
    switch (variant) {
      case 'primary':
        baseStyle.push([
          styles.primary,
          { backgroundColor: disabled ? Colors.secondary[300] : Colors.primary[600] }
        ]);
        break;
      case 'secondary':
        baseStyle.push([
          styles.secondary,
          { 
            backgroundColor: 'transparent',
            borderColor: disabled ? Colors.secondary[300] : Colors.primary[600]
          }
        ]);
        break;
      case 'outline':
        baseStyle.push([
          styles.outline,
          { 
            backgroundColor: 'transparent',
            borderColor: disabled ? Colors.secondary[300] : Colors.secondary[400]
          }
        ]);
        break;
      case 'danger':
        baseStyle.push([
          styles.danger,
          { backgroundColor: disabled ? Colors.secondary[300] : Colors.error[600] }
        ]);
        break;
      default:
        baseStyle.push(styles.primary);
    }

    if (disabled) {
      baseStyle.push(styles.disabled);
    }

    return baseStyle;
  };

  const getTextStyle = () => {
    const baseTextStyle = [styles.text, styles[`${size}Text`]];
    
    switch (variant) {
      case 'primary':
        baseTextStyle.push({ color: '#ffffff' });
        break;
      case 'secondary':
        baseTextStyle.push({ 
          color: disabled ? Colors.secondary[400] : Colors.primary[600] 
        });
        break;
      case 'outline':
        baseTextStyle.push({ 
          color: disabled ? Colors.secondary[400] : colors.text.primary 
        });
        break;
      case 'danger':
        baseTextStyle.push({ color: '#ffffff' });
        break;
      default:
        baseTextStyle.push({ color: '#ffffff' });
    }

    if (disabled) {
      baseTextStyle.push(styles.disabledText);
    }

    return baseTextStyle;
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'primary' || variant === 'danger' ? '#ffffff' : Colors.primary[600]} 
        />
      ) : (
        <Text style={[getTextStyle(), textStyle]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  // Size variants
  small: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 36,
  },
  medium: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    minHeight: 44,
  },
  large: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    minHeight: 52,
  },
  // Variant styles
  primary: {
    // backgroundColor handled dynamically
  },
  secondary: {
    borderWidth: 2,
  },
  outline: {
    borderWidth: 1,
  },
  danger: {
    // backgroundColor handled dynamically
  },
  // Text styles
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
  // Disabled styles
  disabled: {
    opacity: 0.6,
  },
  disabledText: {
    opacity: 0.8,
  },
});

export default Button; 