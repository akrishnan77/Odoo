import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../theme';

export function Card({ children, style }: { children?: React.ReactNode; style?: ViewStyle }) {
  return <View style={[styles.cardDefault as ViewStyle, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  cardDefault: {
    marginVertical: 8,
    marginHorizontal: 8,
    backgroundColor: colors.surface,
    borderRadius: 4,
    // Web-like shadow approximation
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 1,
  },
});
