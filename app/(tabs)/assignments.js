import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Colors, getColorScheme } from '../../constants/colors';
import { dummyAssignments } from '../../constants/dummyData';
import { useColorScheme } from '../../hooks/useColorScheme';
import Card from '../components/Card';
import Header from '../components/Header';

const AssignmentsScreen = () => {
  const [assignments, setAssignments] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = getColorScheme(colorScheme === 'dark');

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      setAssignments(dummyAssignments);
    } catch (error) {
      console.error('Error loading assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAssignments();
    setRefreshing(false);
  };

  const getFilteredAssignments = () => {
    switch (filter) {
      case 'pending':
        return assignments.filter(a => a.status === 'pending');
      case 'submitted':
        return assignments.filter(a => a.status === 'submitted');
      default:
        return assignments;
    }
  };

  const handleAssignmentPress = (assignment) => {
    router.push({
      pathname: '/assignment-detail',
      params: { id: assignment.id }
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'submitted':
        return Colors.success[600];
      case 'pending':
        return Colors.warning[600];
      default:
        return Colors.secondary[600];
    }
  };

  const renderAssignment = ({ item }) => (
    <Card
      style={styles.assignmentCard}
      onPress={() => handleAssignmentPress(item)}
    >
      <View style={styles.assignmentHeader}>
        <View style={styles.assignmentInfo}>
          <Text style={[styles.assignmentTitle, { color: colors.text.primary }]}>
            {item.title}
          </Text>
          <Text style={[styles.assignmentDescription, { color: colors.text.secondary }]} numberOfLines={2}>
            {item.description}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status}
          </Text>
        </View>
      </View>

      <View style={styles.assignmentDetails}>
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Ionicons name="calendar-outline" size={16} color={colors.text.secondary} />
            <Text style={[styles.detailText, { color: colors.text.secondary }]}>
              Due: {new Date(item.dueDate).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="star-outline" size={16} color={colors.text.secondary} />
            <Text style={[styles.detailText, { color: colors.text.secondary }]}>
              {item.maxGrade} points
            </Text>
          </View>
        </View>

        {item.grade && (
          <View style={styles.gradeSection}>
            <Text style={[styles.gradeText, { color: Colors.primary[600] }]}>
              Grade: {item.grade}/{item.maxGrade}
            </Text>
          </View>
        )}
      </View>
    </Card>
  );

  const renderFilterButton = (filterType, label, icon) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        {
          backgroundColor: filter === filterType ? Colors.primary[600] : colors.surface,
          borderColor: filter === filterType ? Colors.primary[600] : Colors.secondary[300],
        }
      ]}
      onPress={() => setFilter(filterType)}
    >
      <Ionicons 
        name={icon} 
        size={16} 
        color={filter === filterType ? '#ffffff' : colors.text.secondary} 
      />
      <Text style={[
        styles.filterText,
        { color: filter === filterType ? '#ffffff' : colors.text.secondary }
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Assignments" showBack />
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.text.secondary }]}>
            Loading assignments...
          </Text>
        </View>
      </View>
    );
  }

  const filteredAssignments = getFilteredAssignments();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Assignments" showBack />
      
      <View style={styles.filterContainer}>
        {renderFilterButton('all', 'All', 'apps')}
        {renderFilterButton('pending', 'Pending', 'time')}
        {renderFilterButton('submitted', 'Submitted', 'checkmark-circle')}
      </View>

      <FlatList
        data={filteredAssignments}
        renderItem={renderAssignment}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={64} color={colors.text.disabled} />
            <Text style={[styles.emptyText, { color: colors.text.secondary }]}>
              No assignments found
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    gap: 4,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  listContainer: {
    paddingBottom: 20,
  },
  assignmentCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
  },
  assignmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  assignmentInfo: {
    flex: 1,
    marginRight: 12,
  },
  assignmentTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  assignmentDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  assignmentDetails: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    marginLeft: 4,
  },
  gradeSection: {
    alignItems: 'center',
  },
  gradeText: {
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
});

export default AssignmentsScreen; 