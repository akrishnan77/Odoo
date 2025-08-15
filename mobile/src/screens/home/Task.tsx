import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View, TextInput } from 'react-native';
import { colors, typography } from '../../theme';
import { FloatingButtonAdd } from '../../ui/FloatingButton';
import { getOdooTasks } from '../../odooApi';
import { Toolbar } from '../../ui/Toolbar';
import { useNavigation } from '@react-navigation/native';

export default function TaskScreen({ token, onOpenTask, onSignOut }: { token: string; onOpenTask: (id: string, title?: string) => void; onSignOut?: () => void }) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskDue, setNewTaskDue] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  async function handleCreateTask() {
    setCreating(true);
    setCreateError(null);
    try {
      // Call backend API to create task
      const res = await fetch('http://10.0.2.2:4000/api/project-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newTaskTitle,
          description: newTaskDesc,
          date_deadline: newTaskDue,
        })
      });
      if (!res.ok) throw new Error('Failed to create task');
      setShowCreateModal(false);
      setNewTaskTitle('');
      setNewTaskDesc('');
      setNewTaskDue('');
      // Refresh task list
      setItems(await getOdooTasks());
    } catch (err: any) {
      setCreateError(err?.message || 'Error creating task');
    } finally {
      setCreating(false);
    }
  }
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setItems(await getOdooTasks());
      } catch (e: any) {
        setError(e?.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const isOverdue = (dueDateTime?: { dateTime?: string }) => {
    if (!dueDateTime?.dateTime) return false;
    const dueDate = new Date(dueDateTime.dateTime);
    dueDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dueDate < today;
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'inProgress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      case 'notStarted':
      default:
        return 'Not Started';
    }
  };

  const getPriorityText = (importance?: string) => {
    switch (importance) {
      case 'high':
        return 'High';
      case 'low':
        return 'Low';
      case 'normal':
      default:
        return 'Normal';
    }
  };

  const getStatusTextColor = (status?: string) => {
    switch (status) {
      case 'completed':
        return '#4CAF50';
      case 'inProgress':
        return '#FFC107';
      default:
        return '#616161';
    }
  };

  const getPriorityTextColor = (importance?: string) => {
    return importance === 'high' ? '#D32F2F' : '#616161';
  };

  const formatDueDate = (dueDateTime?: { dateTime?: string }) => {
    if (!dueDateTime?.dateTime) return 'No due date';
    try {
      return new Date(dueDateTime.dateTime).toLocaleDateString();
    } catch {
      return 'No due date';
    }
  };

  const { assignedTasks, overdueTasks } = useMemo(() => {
    const overdue = items.filter((t) => t.status !== 'completed' && isOverdue(t.dueDateTime));
    const assigned = items.filter((t) => !overdue.some((o) => o.id === t.id));
    return { assignedTasks: assigned, overdueTasks: overdue };
  }, [items]);

  const renderItem = ({ item }: { item: any }) => {
    const statusText = getStatusText(item.status);
    const statusColor = getStatusTextColor(item.status);
    const priorityColor = getPriorityTextColor(item.importance);
    return (
      <View style={styles.itemContainer}>
        <TouchableOpacity onPress={() => {
          console.log('[TaskScreen] onOpenTask called with id:', item.id, 'title:', item.title);
          onOpenTask(item.id, item.title);
        }} style={styles.rowContainer}>
          <View style={{ flex: 1, flexDirection: 'column', gap: 5 }}>
            <View style={styles.rowContainer}>
              <Text style={[typography.subtitle, { flex: 1 } as any]}>Due: {formatDueDate(item.dueDateTime)}</Text>
              <View style={[styles.itemContainerWithBg, { marginEnd: 8 }]}>
                <Text style={[typography.subtitle, { color: priorityColor }]}>{getPriorityText(item.importance)}</Text>
              </View>
            </View>
            <Text style={[typography.title, { marginTop: 5 }]}>{item.title}</Text>
            <Text style={[typography.subtitle, { color: statusColor }]}>{statusText}</Text>
          </View>
          <Image source={require('../../../assets/images/home/icon_arrow.png')} style={styles.iconSmallest} />
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.mainContainer}>
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.mainContainer}>
        <Text style={{ color: 'red', margin: 16 }}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
  <Toolbar title="Tasks" onBack={() => navigation.goBack()} variant="primary" onSignOut={onSignOut} />
      <View style={[styles.rowHeader, { padding: 16, marginTop: 16, marginBottom: 16 }]}>
        <Text style={[typography.titleStrong, { flex: 1 }]}>
          Assigned Task
        </Text>
        <TouchableOpacity>
          <Image source={require('../../../assets/images/home/icon_filter.png')} style={styles.iconSmallest} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={assignedTasks}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
  ListEmptyComponent={<Text style={styles.emptyListText}>No assigned tasks.</Text>}
      />

      <View style={[styles.rowHeader, { padding: 16, marginTop: 16, marginBottom: 16 }]}>
  <Text style={typography.titleStrong}>Overdue Task</Text>
      </View>
      <FlatList
        data={overdueTasks}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.emptyListText}>No overdue tasks.</Text>}
      />
  <FloatingButtonAdd onPress={() => setShowCreateModal(true)} />
  {/* Create Task Modal */}
  {showCreateModal && (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center', zIndex: 10 }}>
      <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 24, width: '80%' }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>Add New Task</Text>
        <Text style={{ marginBottom: 8 }}>Title</Text>
        <View style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 6, marginBottom: 12 }}>
          <TextInput value={newTaskTitle} onChangeText={setNewTaskTitle} placeholder="Task title" style={{ padding: 8 }} />
        </View>
        <Text style={{ marginBottom: 8 }}>Description</Text>
        <View style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 6, marginBottom: 12 }}>
          <TextInput value={newTaskDesc} onChangeText={setNewTaskDesc} placeholder="Description" style={{ padding: 8 }} />
        </View>
        <Text style={{ marginBottom: 8 }}>Due Date (YYYY-MM-DD)</Text>
        <View style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 6, marginBottom: 12 }}>
          <TextInput value={newTaskDue} onChangeText={setNewTaskDue} placeholder="2025-08-15" style={{ padding: 8 }} />
        </View>
        {createError && <Text style={{ color: 'red', marginBottom: 8 }}>{createError}</Text>}
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 12 }}>
          <TouchableOpacity onPress={() => setShowCreateModal(false)} style={{ padding: 10 }}><Text style={{ color: '#616161' }}>Cancel</Text></TouchableOpacity>
          <TouchableOpacity onPress={handleCreateTask} style={{ backgroundColor: '#5B57C7', borderRadius: 6, padding: 10 }} disabled={creating || !newTaskTitle}>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>{creating ? 'Adding...' : 'Add Task'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 0,
    margin: 0,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  itemContainer: {
    padding: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  itemContainerWithBg: {
    backgroundColor: '#FDF3F4',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  iconSmallest: {
    width: 24,
    height: 24,
  },
  emptyListText: {
    padding: 16,
    textAlign: 'center',
    color: '#616161',
  },
});
