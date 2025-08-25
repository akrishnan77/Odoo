const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    padding: 0,
    width: "100%",
    height: "100%",
    paddingBottom: 0,
  },
  content: {
    width: "100%",
    padding: 0,
    height: "100%",
    backgroundColor: "#fff"
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  errorText: {
    fontSize: 16,
    color: "#C50F1F",
    textAlign: "center",
  },
  noDataContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  noDataText: {
    fontSize: 16,
    color: "#616161",
  },
  taskDetailscard: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    padding: 16,
    margin: 16,
    elevation: 2,
  },
  titleContainer: {
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
  },
  titleIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
    marginLeft: 6,
  },
  statusPriorityRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  status: {
    fontSize: 14,
    fontWeight: "400",
  },
  priorityChip: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#FDF3F4",
    alignItems: "center",
  },
  priorityText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  highPriority: {
    color: "#960B18",
  },
  mediumPriority: {
    color: "#8A3707",
  },
  lowPriority: {
    color: "#0C5E0C",
  },
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 8,
  },
  detailRow: {
    flexDirection: "column",
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: "#757575",
  },
  value: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#212121",
    marginTop: 4,
  },
  toggleContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  toggleInnerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  toggleIcon: {
    width: 16,
    height: 16,
    marginRight: 8,
    marginTop: 4,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#5B57D4",
  },
  checklistContainer: {
    borderRadius: 8,
    padding: 16,
    margin: 16,
    elevation: 2,
    paddingBottom: 80,
  },
  checkListHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  checklistTopTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#242424",
  },
  checklistItem: {
    padding: 0,
  },
  viewAllContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewAllText: {
    fontSize: 14,
    color: "#5B57C7",
    fontWeight: "500",
    marginRight: 2,
  },
  arrowIcon: {
    width: 16,
    height: 16,
    resizeMode: "contain",
  },
  checklistItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  checkbox: {
    marginRight: 8,
  },
  checkboxImage: {
    width: 24,
    height: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    paddingBottom: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 18,
    color: "#888",
  },
  modalItemText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
  checklistProgress: {
    fontSize: 14, right: 2, textAlign: "right", color: "#616161", position: "absolute",
    top: 0, marginBottom: 8
  },
  checklistItemTitle: { fontSize: 16, fontWeight: "bold", color: "#242424" },
  aiAnalyticsContainer: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    padding: 10,
    elevation: 2,
    marginBottom: 20,
    paddingBottom: 20,
  },
  aiDiscriptionContainer: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    padding: 10,
    margin: 10,
    elevation: 2,
    marginBottom: 16,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  aiText: { fontSize: 14, fontWeight: "bold", marginLeft: 8, color: "#242424", },
  aiTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 8, color: "#323130" },
  analyticsIcon: {
    width: 30,
    height: 30,
    borderRadius: 4,
    marginRight: 8,
    marginLeft: 16,
  },
  aiDescription: { fontSize: 16, color: "#616161", marginBottom: 8 },
  navigationButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ddd',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  previousButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  previousbuttonText: {
    fontSize: 16,
    color: '#5B57C7',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  navButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: "#5B57C7",
  },
  navbuttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  disabledButton: {
    paddingVertical: 10,
    borderColor: '#ccc',
  },
  disabledCompleteButton: {
    backgroundColor: '#ccc',
  },
  disabledButtonText: {
    color: '#ccc',
  },
});
import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Modal, FlatList, ActivityIndicator } from 'react-native';
import { getOdooTaskById } from '../../odooApi';
import { getOdooProducts } from '../../odooApi';
import { Toolbar } from '../../ui/Toolbar';
// Import assets (update paths as needed)
const TitleIcon = require('../../assets/images/task/icon_task_title.png');
const ViewMoreIcon = require('../../assets/images/task/icon_viewmore.png');
const ViewLessIcon = require('../../assets/images/task/icon_viewless.png');
const AnalyticsIcon = require('../../assets/images/task/icon_ai_new.png');
const CheckBoxSelectedIcon = require('../../assets/images/task/icon_checkbox.png');
const CheckboxUnselected = require('../../assets/images/task/icon_uncheck.png');

export default function TaskDetail({ route, navigation }: any) {
  const { id, title } = route.params;
  useEffect(() => {
    console.log('[TaskDetail] Mounted with id:', id);
  }, [id]);
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  // Static checklist data
  const staticChecklistData = [
    { id: 'static-1', displayName: 'Check stock levels for new arrivals.', isChecked: false },
    { id: 'static-2', displayName: 'Update promotional displays.', isChecked: false },
    { id: 'static-3', displayName: 'Clear out old signage.', isChecked: false },
  ];
  const [checklist, setChecklist] = useState(staticChecklistData);
  const [currentChecklistIndex, setCurrentChecklistIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);
  const [isChecklistVisible, setChecklistVisible] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setTask(await getOdooTaskById(id));
      } catch (e: any) {
        setError(e?.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // Helper functions
  const getPriorityText = (importance?: string) => {
    switch (importance) {
      case 'low': return 'Low';
      case 'normal': return 'Medium';
      case 'high': return 'High';
      default: return 'Medium';
    }
  };
  const getPriorityColor = (importance?: string) => {
    if (importance === 'high') return styles.highPriority;
    if (importance === 'normal') return styles.mediumPriority;
    return styles.lowPriority;
  };
  const getStatusText = (status?: string) => {
    switch (status) {
      case 'notStarted': return 'Not Started';
      case 'inProgress': return 'In Progress';
      case 'completed': return 'Completed';
      default: return 'Not Started';
    }
  };
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'completed': return '#0E700E';
      case 'inProgress': return '#BC4B09';
      default: return '#616161';
    }
  };
  const formatDueDate = (dueDateTime?: { dateTime?: string }) => {
    if (!dueDateTime?.dateTime) return 'No due date';
    return new Date(dueDateTime.dateTime).toLocaleDateString();
  };
  const currentChecklist = checklist[currentChecklistIndex] || {};
  const isCompleteDisabled = !checklist.every(item => item.isChecked);
  const handleToggleMore = () => setShowMore(!showMore);
  const handleViewAllPress = () => setChecklistVisible(true);
  const closeModal = () => setChecklistVisible(false);
  const handleNextOrComplete = () => {
    if (currentChecklistIndex < (checklist.length - 1)) {
      setCurrentChecklistIndex(prev => prev + 1);
    }
  };
  const handlePrevious = () => {
    setCurrentChecklistIndex((prev) => Math.max(0, prev - 1));
  };
  const toggleCheckbox = (checklistItemId: string) => {
    const updatedChecklist = checklist.map(item =>
      item.id === checklistItemId ? { ...item, isChecked: !item.isChecked } : item
    );
    setChecklist(updatedChecklist);
  };

  if (loading) {
    return <View style={styles.loadingContainer}><ActivityIndicator size="large" color="#0000ff" /></View>;
  }
  if (error) {
    return <View style={styles.errorContainer}><Text style={styles.errorText}>Error: {error}</Text></View>;
  }
  if (!task) {
    return <View style={styles.noDataContainer}><Text style={styles.noDataText}>No task details available.</Text></View>;
  }

  return (
    <ScrollView style={styles.container} bounces={false} overScrollMode="never">
      <View style={styles.content}>
  <Toolbar title={'Task Details'} onBack={() => navigation.goBack()} variant="primary" />
        <View style={styles.taskDetailscard}>
          <View style={styles.titleContainer}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>{task.title}</Text>
              <Image source={TitleIcon} style={styles.titleIcon} />
            </View>
            <View style={styles.statusPriorityRow}>
              <Text style={[styles.status, { color: getStatusColor(task.status) }]}> 
                {getStatusText(task.status)}
              </Text>
              <View style={styles.priorityChip}>
                <Text style={[styles.priorityText, getPriorityColor(task.importance)]}>
                  {getPriorityText(task.importance)}
                </Text>
              </View>
            </View>
          </View>
          {/* Task Description at the top */}
          <View style={styles.divider} />
          {showMore && (
            <>
              <View style={styles.detailRow}>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.label}>Due By:</Text>
                <Text style={styles.value}>{formatDueDate(task.dueDateTime)}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.label}>Description:</Text>
                <Text style={styles.value}>{task.description || 'No description'}</Text>
              </View>
            </>
          )}
          <View style={styles.toggleContainer}>
            <TouchableOpacity onPress={handleToggleMore} style={styles.toggleInnerContainer}>
              <Image source={showMore ? ViewLessIcon : ViewMoreIcon} style={styles.toggleIcon} />
              <Text style={styles.toggleText}>{showMore ? "View Less" : "View More"}</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* Complete Task button as a separate section after View More/View Less */}
        {['product.template', 'stock.picking', 'stock.inventory', 'stock.scrap', 'stock.move'].includes(task.res_model) && (
          <View style={{ marginTop: 8, marginBottom: 8, alignItems: 'center', backgroundColor: '#F5F5F5', borderRadius: 8, padding: 16 }}>
            <TouchableOpacity
              style={{ backgroundColor: '#5B57C7', paddingVertical: 10, paddingHorizontal: 32, borderRadius: 8 }}
              onPress={async () => {
                if (task.res_model === 'product.template') {
                  try {
                    const products = await getOdooProducts();
                    const compareName = task.res_name.replace(/\s*\[.*?\]/g, '').trim();
                    let variant = products.find((p: any) => p.product_tmpl_id === task.res_id);
                    if (!variant) {
                      variant = products.find((p: any) => p.name.replace(/\s*\[.*?\]/g, '').trim().toLowerCase() === compareName.toLowerCase());
                    }
                    if (variant) {
                      navigation.navigate('Inventory', { productId: variant.id, productName: variant.name });
                      return;
                    }
                  } catch (err) {}
                }
                navigation.navigate('Inventory', { productId: task.res_id, productName: task.res_name });
              }}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Complete Task</Text>
            </TouchableOpacity>
          </View>
        )}
        {/* Checklist Section */}
        <View style={styles.checklistContainer}>
          <View style={styles.checkListHeader}>
            <Text style={styles.checklistTopTitle}>Task Checklist</Text>
            <TouchableOpacity style={styles.viewAllContainer} onPress={handleViewAllPress}>
              <Text style={styles.viewAllText}>View All</Text>
              {/* Removed missing icon_right_arrow.png */}
            </TouchableOpacity>
          </View>
          <Modal visible={isChecklistVisible} animationType="fade" transparent={true} onRequestClose={closeModal}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Task Checklist</Text>
                  <TouchableOpacity onPress={closeModal} style={styles.closeButton}><Text style={styles.closeButtonText}>✕</Text></TouchableOpacity>
                </View>
                <FlatList
                  data={checklist}
                  renderItem={({ item }) => <Text style={styles.modalItemText}>{item.displayName}</Text>}
                  keyExtractor={(item) => item.id}
                />
              </View>
            </View>
          </Modal>
          <View style={styles.checklistItem}>
            <View style={styles.checklistItemContainer}>
              <TouchableOpacity onPress={() => toggleCheckbox(currentChecklist.id)} style={styles.checkbox}>
                <Image source={currentChecklist.isChecked ? CheckBoxSelectedIcon : CheckboxUnselected} style={styles.checkboxImage} />
              </TouchableOpacity>
              <Text style={styles.checklistItemTitle}>{currentChecklist.displayName}</Text>
            </View>
            <Text style={styles.checklistProgress}>{currentChecklistIndex + 1}/{checklist.length}</Text>
          </View>
          <View style={styles.aiAnalyticsContainer}>
            <View style={styles.rowContainer}>
              <Image source={AnalyticsIcon} style={styles.analyticsIcon} />
              <Text style={styles.aiText}>AI Insights</Text>
            </View>
            <View style={styles.aiDiscriptionContainer}>
              <Text style={styles.aiTitle}>Always place older stock in front of newer stock to ensure freshness.</Text>
              <Text style={styles.aiDescription}>Data collected on inventory management resource repository.</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.navigationButtonContainer}>
        <TouchableOpacity
          style={[styles.previousButton, currentChecklistIndex === 0 && styles.disabledButton]}
          onPress={handlePrevious}
          disabled={currentChecklistIndex === 0}
        >
          <Text style={[styles.previousbuttonText, currentChecklistIndex === 0 && styles.disabledButtonText]}>Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navButton, (currentChecklistIndex === checklist.length - 1 && isCompleteDisabled) && styles.disabledCompleteButton]}
          disabled={currentChecklistIndex === checklist.length - 1 && isCompleteDisabled}
          onPress={handleNextOrComplete}
        >
          <Text style={styles.navbuttonText}>{currentChecklistIndex === checklist.length - 1 ? 'Complete' : 'Next'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// ...existing styles from TaskDetails.jsx, update asset paths as needed
