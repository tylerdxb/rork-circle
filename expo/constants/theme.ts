import { StyleSheet } from 'react-native';

// Updated colors to match the Circle logo
export const Colors = {
  dark: {
    background: '#000000', // Deep black
    card: '#121212', // Slightly lighter black
    text: '#FFFFFF',
    subtext: 'rgba(255, 255, 255, 0.7)',
    primary: '#5c7aff', // Neon blue from logo
    secondary: '#20f0c6', // Teal from logo
    border: 'rgba(255, 255, 255, 0.1)',
    error: '#FF5252',
    success: '#4CAF50',
    inactive: '#555555',
    inputBackground: 'rgba(255, 255, 255, 0.05)',
  }
};

export const theme = {
  colors: Colors.dark,
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: '700',
      color: Colors.dark.text,
      letterSpacing: 0.5,
    },
    h2: {
      fontSize: 24,
      fontWeight: '700',
      color: Colors.dark.text,
      letterSpacing: 0.5,
    },
    h3: {
      fontSize: 20,
      fontWeight: '600',
      color: Colors.dark.text,
      letterSpacing: 0.5,
    },
    body: {
      fontSize: 16,
      fontWeight: '400',
      color: Colors.dark.text,
      letterSpacing: 0.3,
    },
    bodySmall: {
      fontSize: 14,
      fontWeight: '400',
      color: Colors.dark.subtext,
      letterSpacing: 0.2,
    },
    button: {
      fontSize: 16,
      fontWeight: '600',
      color: Colors.dark.text,
      letterSpacing: 0.5,
    },
  },
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    padding: theme.spacing.md,
  },
  card: {
    backgroundColor: Colors.dark.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
});