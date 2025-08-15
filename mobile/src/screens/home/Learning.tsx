import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from '../../ui/Card';
import { Toolbar } from '../../ui/Toolbar';
import { getTrainingFiles } from '../../graph';

export default function Learning({ token, navigation, onSignOut }: { token: string; navigation: any; onSignOut?: () => void }) {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    (async () => {
      try { setItems(await getTrainingFiles(token)); }
      catch (e: any) { setError(e?.message); }
      finally { setLoading(false); }
    })();
  }, [token]);
  const getIconForMime = (mime?: string) => {
    switch ((mime || '').toLowerCase()) {
      case 'application/pdf':
        return require('../../../assets/images/home/icon_pdf.png');
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
        return require('../../../assets/images/home/icon_resources.png');
      case 'video/mp4':
        return require('../../../assets/images/home/icon_media.png');
      default:
        return require('../../../assets/images/home/icon_book.png');
    }
  };

  const topResources = useMemo(() => items.slice(0, 4), [items]);

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <Toolbar title="Learning" onBack={() => navigation.goBack()} variant="primary" onSignOut={onSignOut} />

      {/* Daily Training section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Daily Training</Text>
          <TouchableOpacity onPress={() => { /* navigate to full list later */ }}>
            <Text style={styles.viewAll}>View all</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.dailyTrainingContent}>
          <Image source={require('../../../assets/images/home/icon_media.png')} style={styles.trainingVideo} />
          <Text style={styles.trainingTitle}>Store Safety Protocols</Text>
          <Text style={styles.trainingDescription}>A quick video guide on new safety measures.</Text>
        </View>
      </View>

      {/* Resources section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Resources</Text>
          <TouchableOpacity onPress={() => { /* navigate to full list later */ }}>
            <Text style={styles.viewAll}>View all</Text>
          </TouchableOpacity>
        </View>
        {loading ? (
          <ActivityIndicator size="large" style={{ marginTop: 20 }} />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <FlatList
            data={topResources}
            horizontal
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.resourceList}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.resourceItem} onPress={() => { /* open item.webUrl if needed */ }}>
                <Image source={getIconForMime(item?.file?.mimeType)} style={styles.resourceIcon} />
                <Text style={styles.resourceTitle} numberOfLines={2}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { backgroundColor: '#fff', margin: 15, padding: 15, borderRadius: 10 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#242424' },
  viewAll: { fontSize: 14, color: '#5B57C7' },
  dailyTrainingContent: { alignItems: 'center' },
  trainingVideo: { width: '100%', height: 150, borderRadius: 10, backgroundColor: '#EEF0FF' },
  trainingTitle: { fontSize: 16, fontWeight: '700', marginTop: 10, color: '#242424' },
  trainingDescription: { fontSize: 14, color: '#666', textAlign: 'center', marginTop: 5 },
  resourceList: { paddingTop: 10 },
  resourceItem: { width: 120, alignItems: 'center', marginRight: 10 },
  resourceIcon: { width: 50, height: 50, marginBottom: 10 },
  resourceTitle: { fontSize: 14, textAlign: 'center' },
  errorText: { color: 'red', textAlign: 'center', marginTop: 20 },
});
