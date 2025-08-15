import React from 'react';
import { Image, TouchableOpacity, StyleSheet } from 'react-native';

export function FloatingButtonAdd({ onPress }: { onPress?: () => void }) {
  return (
    <TouchableOpacity style={styles.floatingButton} onPress={onPress}>
      <Image source={require('../../assets/images/home/icon_add.png')} style={{ width: 24, height: 24 }} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#0255DC',
    borderRadius: 100,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});
