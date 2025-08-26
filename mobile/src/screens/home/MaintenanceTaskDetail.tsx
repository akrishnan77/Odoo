import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, TextInput } from 'react-native';
import { getMaintenanceRequestById } from '../../odooApi';
import { Toolbar } from '../../ui/Toolbar';
import { colors, typography, spacing } from '../../theme';

export default function MaintenanceTaskDetail({ route, navigation }: any) {
  const { taskId } = route.params;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [request, setRequest] = useState<any>(null);
  const [updating, setUpdating] = useState(false);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    async function fetchRequest() {
      setLoading(true);
      console.log('[MaintenanceTaskDetail] Fetching maintenance request with id:', taskId);
      try {
        const data = await getMaintenanceRequestById(taskId);
        setRequest(data);
      } catch (err: any) {
        setError(err?.message || 'Error fetching request');
      } finally {
        setLoading(false);
      }
    }
    fetchRequest();
  }, [taskId]);

  async function handleRepaired() {
    setUpdating(true);
    try {
      // Use updateMaintenanceRequestStatus to mark as repaired (stage_id = 3)
      const { updateMaintenanceRequestStatus } = await import('../../odooApi');
  const result = await updateMaintenanceRequestStatus(taskId, "3");
      setRequest({ ...request, stage_id: 3 });
      console.log('[MaintenanceTaskDetail] Marked as repaired:', result);
    } catch (err: any) {
      setError(err?.message || 'Error updating status');
    } finally {
      setUpdating(false);
    }
  }

  if (loading) return <View style={styles.loadingContainer}><ActivityIndicator size="large" color={colors.primary} /></View>;
  if (error) return <View style={styles.errorContainer}><Text style={styles.error}>{error}</Text></View>;
  if (!request) return <View style={styles.errorContainer}><Text style={styles.error}>No request found.</Text></View>;

  return (
    <View style={styles.container}>
      <Toolbar title={'Maintenance Task'} onBack={() => navigation.goBack()} variant="primary" />
      <View style={styles.card}>
        <Text style={typography.h6}>{request.name}</Text>
        <View style={styles.divider} />
        <Text style={typography.subtitle}>Description:</Text>
        <Text style={typography.body}>{request.description || 'No description'}</Text>
        <Text style={typography.subtitle}>Status:</Text>
        <Text style={typography.body}>
          {request.stage_id === 1 ? 'New' : request.stage_id === 2 ? 'In Progress' : 'Repaired'}
        </Text>

        <Text style={typography.subtitle}>Notes:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter notes about this maintenance..."
          value={notes}
          onChangeText={setNotes}
          multiline
        />

        {request.stage_id === 1 && (
          <TouchableOpacity
            style={styles.button}
            onPress={async () => {
              setUpdating(true);
              try {
                const { updateMaintenanceRequestStatus } = await import('../../odooApi');
                const result = await updateMaintenanceRequestStatus(taskId, "2");
                setRequest({ ...request, stage_id: 2 });
                console.log('[MaintenanceTaskDetail] Marked as in progress:', result);
              } catch (err: any) {
                setError(err?.message || 'Error updating status');
              } finally {
                setUpdating(false);
              }
            }}
            disabled={updating}
          >
            <Text style={typography.button}>Start Maintenance</Text>
          </TouchableOpacity>
        )}
        {request.stage_id === 2 && (
          <TouchableOpacity style={styles.button} onPress={handleRepaired} disabled={updating || !notes.trim()}>
            <Text style={typography.button}>Mark as Repaired</Text>
          </TouchableOpacity>
        )}
        {updating && <ActivityIndicator size="small" color={colors.primary} style={{ marginTop: spacing.md }} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.surfaceAlt },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.surfaceAlt },
  error: { color: 'red', marginTop: spacing.lg, fontSize: 16 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: spacing.lg,
    margin: spacing.lg,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  input: {
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 8,
    padding: spacing.md,
    marginTop: spacing.md,
    marginBottom: spacing.md,
    minHeight: 48,
    fontSize: 16,
    backgroundColor: colors.surfaceAlt,
    color: colors.text,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
});
