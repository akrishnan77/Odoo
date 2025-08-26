import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList } from 'react-native';

const gridItems = [
  { title: 'Workforce Management', image: require('../../../assets/images/home/img11.png') },
  { title: 'Maintenance', image: require('../../../assets/images/home/img22.png') },
  { title: 'Inventory', image: require('../../../assets/images/home/img33.png') },
  { title: 'Store Operations', image: require('../../../assets/images/home/img44.png') },
  { title: 'Orders & Return', image: require('../../../assets/images/home/img55.png') },
  { title: 'mPOS', image: require('../../../assets/images/home/img66.png') },
];

export default function LandingGrid({ userName, onSelect }: { userName?: string; onSelect: (index: number, title: string) => void }) {
  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <View style={{ flexDirection: 'column', flex: 1 }}>
          <Text style={styles.toolbarTitle}>{userName || 'Welcome'}</Text>
          <Text style={styles.toolbarSub}>General Store, Cincinnati</Text>
        </View>
        <Image source={require('../../../assets/images/home/icon_bot.png')} style={styles.iconSm} />
        <Image source={require('../../../assets/images/home/icon_notification.png')} style={[styles.iconSm, { marginLeft: 16 }]} />
      </View>
      <FlatList
        data={gridItems}
        numColumns={3}
        keyExtractor={(item, idx) => `${item.title}-${idx}`}
  ListHeaderComponent={<Image source={require('../../../assets/images/home/icon_harman_banner2.png')} style={styles.banner} />}
  contentContainerStyle={[styles.grid, { paddingBottom: 24 }]}
        renderItem={({ item, index }) => (
          <TouchableOpacity style={styles.card} onPress={() => onSelect(index, item.title)}>
            <Image source={item.image} style={styles.cardImage} />
            <Text style={styles.cardTitle}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  toolbar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 16, backgroundColor: '#5B57C7' },
  toolbarTitle: { fontSize: 16, fontWeight: '500', color: '#fff' },
  toolbarSub: { fontSize: 13, fontWeight: '400', color: '#fff' },
  iconSm: { width: 24, height: 24 },
  banner: { width: '100%', height: 45, resizeMode: 'contain', marginTop: 8, marginBottom: 8 },
  grid: { paddingHorizontal: 8, paddingBottom: 16 },
  card: { flex: 1 / 3, backgroundColor: '#fff', borderRadius: 8, margin: 8, overflow: 'hidden', elevation: 1 },
  cardImage: { width: '100%', height: 90, resizeMode: 'cover' },
  cardTitle: { padding: 8, fontSize: 14, color: '#242424' },
});
