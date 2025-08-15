import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Toolbar } from '../../ui/Toolbar';

export default function ComingSoon({ route, navigation }: { route: any; navigation: any }) {
  const title = route?.params?.title || 'Coming Soon';
  return (
    <View style={{ flex: 1 }}>
  <Toolbar title={title} onBack={() => navigation.goBack()} variant="primary" />
      <View style={styles.mainContainer}>
        <Image source={require('../../../assets/images/home/img_comming_soon.png')} style={{ width: 150, height: 150 }} />
        <Text style={styles.titleBig}>Coming Soon!</Text>
        <Text style={styles.titleSmall}>Something exciting is on the way!</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  titleBig: { fontSize: 32, fontWeight: '500', color: '#242424', marginTop: 24, marginBottom: 12 },
  titleSmall: { fontSize: 14, fontWeight: '400', color: '#242424' },
});
