import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  StyleProp
} from 'react-native';
import { theme } from '@/constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  fullWidth?: boolean;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  fullWidth = false,
}: ButtonProps) {
  const getButtonStyle = () => {
    const baseStyle: ViewStyle[] = [styles.button];
    
    // Size
    if (size === 'small') baseStyle.push(styles.buttonSmall);
    if (size === 'large') baseStyle.push(styles.buttonLarge);
    
    // Variant
    if (variant === 'primary') baseStyle.push(styles.buttonPrimary);
    if (variant === 'secondary') baseStyle.push(styles.buttonSecondary);
    if (variant === 'outline') baseStyle.push(styles.buttonOutline);
    if (variant === 'text') baseStyle.push(styles.buttonText);
    
    // Width
    if (fullWidth) baseStyle.push(styles.fullWidth);
    
    // Disabled
    if (disabled) baseStyle.push(styles.buttonDisabled);
    
    return baseStyle;
  };
  
  const getTextStyle = () => {
    const baseStyle: TextStyle[] = [styles.buttonLabel];
    
    // Size
    if (size === 'small') baseStyle.push(styles.buttonLabelSmall);
    if (size === 'large') baseStyle.push(styles.buttonLabelLarge);
    
    // Variant
    if (variant === 'outline') baseStyle.push(styles.buttonLabelOutline);
    if (variant === 'text') baseStyle.push(styles.buttonLabelText);
    
    // Disabled
    if (disabled) baseStyle.push(styles.buttonLabelDisabled);
    
    return baseStyle;
  };
  
  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === 'outline' || variant === 'text' 
            ? theme.colors.primary 
            : theme.colors.text} 
          size="small" 
        />
      ) : (
        <Text style={[getTextStyle(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSmall: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
  },
  buttonLarge: {
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
  },
  buttonPrimary: {
    backgroundColor: theme.colors.primary,
  },
  buttonSecondary: {
    backgroundColor: theme.colors.secondary,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  buttonText: {
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
  },
  buttonDisabled: {
    backgroundColor: theme.colors.inactive,
    borderColor: theme.colors.inactive,
  },
  fullWidth: {
    width: '100%',
  },
  buttonLabel: {
    ...theme.typography.button,
    color: theme.colors.text,
  },
  buttonLabelSmall: {
    fontSize: 14,
  },
  buttonLabelLarge: {
    fontSize: 18,
  },
  buttonLabelOutline: {
    color: theme.colors.primary,
  },
  buttonLabelText: {
    color: theme.colors.primary,
  },
  buttonLabelDisabled: {
    color: theme.colors.subtext,
  },
});