import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Text, TouchableOpacity, View, StyleSheet, ScrollView } from 'react-native';
import { Card } from '../../ui/Card';
import { AnnouncementCard, WorkdayCard } from '../../components/nrf_app/Card';
import { Toolbar } from '../../ui/Toolbar';
import { getTodoTasks } from '../../graph';
import { getOdooTasks } from '../../odooApi';
import { colors, typography } from '../../theme';

export default function Dashboard({ token, onViewTasks, showToolbar = true, onBack, onSignOut }: { token: string; onViewTasks: () => void; showToolbar?: boolean; onBack?: () => void; onSignOut?: () => void }) {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<any[]>([]);
  useEffect(() => {
    (async () => {
      try { setTasks(await getOdooTasks()); } finally { setLoading(false); }
    })();
  }, []);
  const first = tasks[0];
  return (
    <View style={{ flex: 1 }}>
  {showToolbar && <Toolbar title="Dashboard" onBack={onBack} variant="primary" onSignOut={onSignOut} />}
  <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 24 }}>
        {/* Announcements */}
        <AnnouncementCard
          style={{ marginBottom: 8 }}
          items={[
            { id: '1', text: 'Quarterly results town hall at 3 PM.' },
            { id: '2', text: 'Safety training due this week.' },
          ]}
          onSeeAll={() => {}}
        />
        {/* Shift card placeholder to mirror layout */}
  <Card>
          <View style={[styles.headerRow]}>
            <Image source={require('../../../assets/images/home/icon_shift.png')} style={styles.iconSmall} />
            <Text style={typography.headingSm}>Shift</Text>
          </View>
          <Text style={[typography.title, { paddingHorizontal: 16 }]}>2 Clocked In</Text>
          <Text style={[typography.subtitle, { paddingHorizontal: 16, marginBottom: 8 }]}>First shift - 8:00 AM - 5:00 PM</Text>
          <TouchableOpacity style={[styles.button, { marginLeft: 16, marginBottom: 16 }]}>
            <Text style={[typography.button, { color: colors.primary }]}>Details</Text>
          </TouchableOpacity>
        </Card>

  {/* Tasks */}
        <Card>
          <View style={styles.headerRow}>
            <Image source={require('../../../assets/images/home/icon_task_list.png')} style={styles.iconSmall} />
            <Text style={typography.headingSm}>Tasks</Text>
            <View style={{ flex: 1 }} />
            <Text style={typography.subtitle}>{tasks.length > 0 ? `1/${tasks.length} Task` : '0 Task'}</Text>
          </View>
          {loading ? (
            <View style={{ padding: 16, alignItems: 'center' }}><ActivityIndicator /></View>
          ) : tasks.length > 0 ? (
            <View style={{ padding: 16, flexDirection: 'row', alignItems: 'center' }}>
              <Text style={typography.title}>{first?.title}</Text>
              <View style={{ flex: 1 }} />
              <Text style={typography.subtitle}>{statusText(first?.status)}</Text>
            </View>
          ) : (
            <View style={{ padding: 16 }}><Text style={typography.title}>No tasks found.</Text></View>
          )}
          <TouchableOpacity style={[styles.button, { marginLeft: 16, marginBottom: 16 }]} onPress={onViewTasks}>
            <Text style={[typography.button, { color: colors.primary }]}>View All</Text>
          </TouchableOpacity>
        </Card>

  {/* Workday */}
  <WorkdayCard subtitle="Next shift starts tomorrow 8:00 AM - 5:00 PM" onOpen={() => {}} />
      </ScrollView>
    </View>
  );
}

function statusText(status?: string) {
  switch (status) {
    case 'inProgress': return 'In Progress';
    case 'completed': return 'Completed';
    default: return 'Not Started';
  }
}

const styles = StyleSheet.create({
  headerRow: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconSmall: { width: 24, height: 24, marginRight: 8 },
  button: { borderWidth: 1, borderColor: '#5B57C7', borderRadius: 4, paddingVertical: 6, paddingHorizontal: 12, alignSelf: 'flex-start' },
  
});
