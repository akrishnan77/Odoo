import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Card } from '../../ui/Card';
import { colors, spacing } from '../../theme';

export { Card };

type CardBaseProps = {
  title: string;
  icon?: any;
  right?: React.ReactNode;
};

function CardHeader({ title, icon, right }: CardBaseProps) {
  return (
    <View style={styles.headerRow}>
      {icon ? <Image source={icon} style={styles.iconSmall} /> : null}
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={{ flex: 1 }} />
      {right}
    </View>
  );
}

export function AnnouncementCard({ title = 'Announcements', items = [], onSeeAll, style }: { title?: string; items?: Array<{ id: string; text: string }>; onSeeAll?: () => void; style?: ViewStyle }) {
  return (
    <Card style={style}>
      <CardHeader title={title} icon={require('../../assets/images/home/icon_notification.png')} right={
        <TouchableOpacity onPress={onSeeAll} accessibilityRole="button">
          <Text style={styles.link}>See All</Text>
        </TouchableOpacity>
      } />
      <View style={{ padding: spacing.lg }}>
        {items.length === 0 ? (
          <Text style={styles.bodyText}>No announcements.</Text>
        ) : (
          items.slice(0, 3).map((a) => (
            <View key={a.id} style={styles.announcementRow}>
              <Image source={require('../../assets/images/home/icon_noti_news.png')} style={styles.bulletIcon} />
              <Text style={[styles.bodyText, { flex: 1 }]}>{a.text}</Text>
            </View>
          ))
        )}
      </View>
    </Card>
  );
}

export function WorkdayCard({ title = 'Workday', subtitle, onOpen, style }: { title?: string; subtitle?: string; onOpen?: () => void; style?: ViewStyle }) {
  return (
    <Card style={style}>
      <CardHeader title={title} icon={require('../../assets/images/home/icon_workday.png')} />
      <View style={{ padding: spacing.lg }}>
        {subtitle ? <Text style={[styles.bodyText, { marginBottom: spacing.md }]}>{subtitle}</Text> : null}
        <TouchableOpacity style={styles.ctaButton} onPress={onOpen} accessibilityRole="button">
          <Text style={styles.ctaText}>Open</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
}

export function StoreLayoutCard({ title = 'Store Layout', subtitle, onOpen, style }: { title?: string; subtitle?: string; onOpen?: () => void; style?: ViewStyle }) {
  return (
    <Card style={style}>
      <CardHeader title={title} icon={require('../../assets/images/home/img_store_layout.png')} />
      <View style={{ padding: spacing.lg }}>
        {subtitle ? <Text style={[styles.bodyText, { marginBottom: spacing.md }]}>{subtitle}</Text> : null}
        <TouchableOpacity style={styles.ctaButton} onPress={onOpen} accessibilityRole="button">
          <Text style={styles.ctaText}>Open</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconSmall: { width: 24, height: 24, marginRight: spacing.sm },
  headerTitle: { fontSize: 16, fontWeight: '600', color: '#424242' },
  link: { fontSize: 14, color: colors.primary, fontWeight: '500' },
  bodyText: { fontSize: 14, color: '#424242' },
  announcementRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  bulletIcon: { width: 16, height: 16, marginRight: spacing.sm },
  ctaButton: { borderWidth: 1, borderColor: colors.primary, borderRadius: 4, paddingVertical: 6, paddingHorizontal: 12, alignSelf: 'flex-start' },
  ctaText: { color: colors.primary, fontSize: 14, fontWeight: '500' },
});
