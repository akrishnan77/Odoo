import React, { useEffect, useMemo, useState } from 'react';
import { Image, Text, TouchableOpacity, View, StyleSheet, ScrollView, ActivityIndicator, FlatList } from 'react-native';
import { Card } from '../../../ui/Card';
import { Toolbar } from '../../../ui/Toolbar';
import { colors, typography } from '../../../theme';
import { getTodoTasks } from '../../../graph';

type Props = {
  token?: string;
  onViewTasks: () => void;
  onOpenReports?: () => void;
  onOpenTraining?: () => void;
  showToolbar?: boolean;
  onBack?: () => void;
  onSignOut?: () => void;
};

const ANNOUNCEMENTS = [
  { id: 'a1', text: 'New health and safety regulations implemented. Review updated policies.' },
  { id: 'a2', text: 'Scheduled POS maintenance tonight 10 PM – 2 AM.' },
  { id: 'a3', text: 'Holiday sale starts next week. Prepare your team.' },
];

const RECOMMENDED_TASKS = [
  { id: 'r1', title: 'Curbside Fulfillment' },
  { id: 'r2', title: 'Product Rotation' },
  { id: 'r3', title: 'Cart Retrieval' },
];

export default function DashboardEx({ token, onViewTasks, onOpenReports, onOpenTraining, showToolbar = true, onBack, onSignOut }: Props) {
  const [loading, setLoading] = useState<boolean>(!!token);
  const [tasks, setTasks] = useState<any[]>([]);
  const [viewMore, setViewMore] = useState(false);

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const data = await getTodoTasks(token);
        setTasks(data);
      } catch (e) {
        // keep empty on failure
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  const metrics = useMemo(() => {
    const urgent = tasks.filter(t => (t.importance || '').toLowerCase() === 'high').length;
    const inProgress = tasks.filter(t => t.status === 'inProgress').length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const yetToStart = tasks.filter(t => !t.status || t.status === 'notStarted').length;
    return { urgent, inProgress, completed, yetToStart };
  }, [tasks]);

  return (
    <View style={{ flex: 1 }}>
  {showToolbar && <Toolbar title="Executive Dashboard" onBack={onBack} variant="primary" onSignOut={onSignOut} />}
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 24 }}>
        {/* Announcements */}
        <Card style={{ marginBottom: 12 }}>
          <View style={styles.headerRow}>
            <Image source={require('../../../../assets/images/home/icon_notification.png')} style={styles.iconSmall} />
            <Text style={typography.headingSm}>Announcements</Text>
            <View style={{ flex: 1 }} />
            <TouchableOpacity onPress={() => {}}><Text style={typography.link}>See All</Text></TouchableOpacity>
          </View>
          <View style={{ padding: 16 }}>
            {ANNOUNCEMENTS.slice(0, 3).map(a => (
              <View key={a.id} style={styles.announcementRow}>
                <Image source={require('../../../../assets/images/home/icon_noti_news.png')} style={styles.bulletIcon} />
                <Text style={typography.body}>{a.text}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Shift */}
        <Card style={{ marginBottom: 12 }}>
          <View style={styles.headerRow}>
            <Image source={require('../../../../assets/images/home/icon_shift.png')} style={styles.iconSmall} />
            <Text style={typography.headingSm}>Shift</Text>
          </View>
          <Text style={[typography.title, { paddingHorizontal: 16 }]}>2 Clocked In</Text>
          <Text style={[typography.subtitle, { paddingHorizontal: 16, marginBottom: 8 }]}>First shift - 8:00 AM - 5:00 PM</Text>
          <TouchableOpacity style={[styles.button, { marginLeft: 16, marginBottom: 16 }]}> 
            <Text style={styles.buttonText}>Details</Text>
          </TouchableOpacity>
        </Card>

        {/* Associate's Tasks metrics */}
        <Card style={{ marginBottom: 12 }}>
          <View style={styles.headerRow}>
            <Image source={require('../../../../assets/images/home/icon_task_list.png')} style={styles.iconSmall} />
            <Text style={typography.headingSm}>Associate's Tasks</Text>
          </View>
          <View style={{ padding: 16 }}>
            {loading ? (
              <ActivityIndicator />
            ) : (
              <View style={styles.metricsGrid}>
                <MetricTile title="Urgent" value={metrics.urgent} bg="#FBEDED" />
                <MetricTile title="Yet To Start" value={metrics.yetToStart} bg="#E7F3F9" />
                <MetricTile title="In Progress" value={metrics.inProgress} bg="#F8F0E2" />
                <MetricTile title="Completed" value={metrics.completed} bg="#E6F7EE" />
              </View>
            )}
          </View>
          <TouchableOpacity style={[styles.button, { marginLeft: 16, marginBottom: 16 }]} onPress={onViewTasks}>
            <Text style={styles.buttonText}>View</Text>
          </TouchableOpacity>
        </Card>

        {/* Task Recommendation */}
        <Card style={{ marginBottom: 12 }}>
          <View style={styles.headerRow}>
            <Image source={require('../../../../assets/images/home/icon_task_recomm.png')} style={styles.iconSmall} />
            <Text style={typography.headingSm}>Task Recommendation</Text>
          </View>
          {viewMore && (
            <View style={{ padding: 16 }}>
              <Text style={[typography.title, { marginBottom: 4 }]}>3 new identified tasks!</Text>
              <Text style={[typography.subtitle, { marginBottom: 12 }]}>Report based on data collection at 9:15 AM</Text>
              <FlatList
                data={RECOMMENDED_TASKS}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <Text style={typography.body}>{`• ${item.title}`}</Text>}
              />
              <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
                <TouchableOpacity style={styles.button} onPress={onViewTasks}><Text style={styles.buttonText}>Review Task</Text></TouchableOpacity>
                {/* <TouchableOpacity style={styles.button}><Text style={styles.buttonText}>Regenerate</Text></TouchableOpacity> */}
              </View>
            </View>
          )}
          <TouchableOpacity style={{ alignSelf: 'center', padding: 16, flexDirection: 'row', alignItems: 'center' }} onPress={() => setViewMore(!viewMore)}>
            <Image source={viewMore ? require('../../../../assets/images/task/icon_viewless.png') : require('../../../../assets/images/task/icon_viewmore.png')} style={{ width: 16, height: 16, marginRight: 8 }} />
            <Text style={[typography.button, { color: colors.primary }]}>{viewMore ? 'View Less' : 'View More'}</Text>
          </TouchableOpacity>
        </Card>

        {/* Reports / Training */}
        <View style={styles.cardsRow}> 
          <Card style={{ flex: 1, marginRight: 8 }}>
            <View style={styles.headerRow}>
              <Image source={require('../../../../assets/images/home/icon_report.png')} style={styles.iconSmall} />
              <Text style={typography.headingSm}>Reports</Text>
            </View>
            <View style={{ padding: 16 }}>
              <Text style={[typography.body, { marginBottom: 12 }]}>Click to view the monthly report</Text>
              <TouchableOpacity style={styles.button} onPress={onOpenReports}><Text style={styles.buttonText}>Open</Text></TouchableOpacity>
            </View>
          </Card>
          <Card style={{ flex: 1, marginLeft: 8 }}>
            <View style={styles.headerRow}>
              <Image source={require('../../../../assets/images/home/icon_book.png')} style={styles.iconSmall} />
              <Text style={typography.headingSm}>Training</Text>
            </View>
            <View style={{ padding: 16 }}>
              <Text style={[typography.body, { marginBottom: 12 }]}>Assign weekly training to staff</Text>
              <TouchableOpacity style={styles.button} onPress={onOpenTraining}><Text style={styles.buttonText}>Assign</Text></TouchableOpacity>
            </View>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}

function MetricTile({ title, value, bg }: { title: string; value: number; bg: string }) {
  return (
    <View style={[styles.metricTile, { backgroundColor: bg }]}> 
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricTitle}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#E0E0E0', flexDirection: 'row', alignItems: 'center' },
  iconSmall: { width: 24, height: 24, marginRight: 8 },
  button: { borderWidth: 1.5, borderColor: '#5B57C7', borderRadius: 4, paddingVertical: 6, paddingHorizontal: 12, alignSelf: 'flex-start' },
  buttonText: { color: '#5B57C7', fontSize: 14, fontWeight: '500' },
  announcementRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  bulletIcon: { width: 16, height: 16, marginRight: 8 },
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  metricTile: { width: '48%', borderRadius: 8, paddingVertical: 16, paddingHorizontal: 12 },
  metricValue: { fontSize: 20, fontWeight: '700', color: '#242424' },
  metricTitle: { fontSize: 14, color: '#424242', marginTop: 4 },
  cardsRow: { flexDirection: 'row' },
});
