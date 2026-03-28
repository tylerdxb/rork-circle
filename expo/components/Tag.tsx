import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ViewStyle, 
  TextStyle,
  StyleProp
} from 'react-native';
import { theme } from '@/constants/theme';

interface TagProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
}

export default function Tag({
  label,
  selected = false,
  onPress,
  style,
  textStyle,
  disabled = false,
}: TagProps) {
  return (
    <TouchableOpacity
      style={[
        styles.tag,
        selected ? styles.tagSelected : null,
        disabled ? styles.tagDisabled : null,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || !onPress}
      activeOpacity={0.7}
    >
      <Text 
        style={[
          styles.tagText,
          selected ? styles.tagTextSelected : null,
          disabled ? styles.tagTextDisabled : null,
          textStyle,
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tag: {
    backgroundColor: theme.colors.inputBackground,
    borderRadius: theme.borderRadius.full,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    marginRight: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  tagSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  tagDisabled: {
    backgroundColor: theme.colors.inactive,
    borderColor: theme.colors.inactive,
  },
  tagText: {
    color: theme.colors.text,
    fontSize: 14,
  },
  tagTextSelected: {
    color: '#FFFFFF',
  },
  tagTextDisabled: {
    color: theme.colors.subtext,
  },
});