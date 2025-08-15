import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { colors } from '../theme';

export function Toolbar({ title, onBack, showBot = true, showBottomLine = true, variant = 'default', onSignOut }:{ title?: string; onBack?: () => void; showBot?: boolean; showBottomLine?: boolean; variant?: 'default' | 'primary'; onSignOut?: () => void; }) {
  const isPrimary = variant === 'primary';
  return (
    <View style={isPrimary ? styles.containerPrimary : (showBottomLine ? styles.containerWithBottomLine : styles.containerWithoutBottomLine)}>
      {onBack ? (
        <TouchableOpacity onPress={onBack}>
          <Image source={isPrimary ? require('../../assets/images/home/icon_back_white.png') : require('../../assets/images/home/icon_back.png')} style={styles.icon} />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 24, height: 24 }} />
      )}
      <Text style={isPrimary ? styles.titlePrimary : styles.title}>{title}</Text>
      {onSignOut ? (
        <TouchableOpacity onPress={onSignOut}>
          <Image source={isPrimary ? require('../../assets/images/home/icon_cross.png') : require('../../assets/images/home/icon_cross.png')} style={styles.icon} />
        </TouchableOpacity>
      ) : showBot ? (
        <TouchableOpacity onPress={() => {}}>
          <Image source={isPrimary ? require('../../assets/images/home/icon_bot.png') : require('../../assets/images/home/icon_bot_dark.png')} style={styles.icon} />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 24 }} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  containerWithoutBottomLine: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
    paddingTop: 8,
    backgroundColor: '#fff',
  },
  containerWithBottomLine: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
    paddingTop: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  containerPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
    paddingTop: 8,
    backgroundColor: '#5B57C7',
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: '500',
    color: colors.text,
    marginStart: 16,
  },
  titlePrimary: {
    flex: 1,
    fontSize: 20,
    fontWeight: '500',
    color: '#fff',
    marginStart: 16,
  },
  icon: { width: 24, height: 24 },
  action: { color: colors.primary, fontSize: 14, fontWeight: '500' },
  actionPrimary: { color: '#fff', fontSize: 14, fontWeight: '500' },
});
