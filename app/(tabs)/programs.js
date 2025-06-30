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
import { dummyPrograms } from '../../constants/dummyData';
import { useColorScheme } from '../../hooks/useColorScheme';
import Card from '../components/Card';
import Header from '../components/Header';

const ProgramsScreen = () => {
  const [programs, setPrograms] = useState([]);
  const [filter, setFilter] = useState('all'); // all, enrolled, available
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = getColorScheme(colorScheme === 'dark');

  useEffect(() => {
    loadPrograms();
  }, []);

  const loadPrograms = async () => {
    try {
      // In a real app, you would fetch this data from API
      setPrograms(dummyPrograms);
    } catch (error) {
      console.error('Error loading programs:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPrograms();
    setRefreshing(false);
  };

  const getFilteredPrograms = () => {
    switch (filter) {
      case 'enrolled':
        return programs.filter(p => p.status === 'enrolled');
      case 'available':
        return programs.filter(p => p.status === 'available');
      default:
        return programs;
    }
  };

  const handleProgramPress = (program) => {
    if (program.status === 'enrolled') {
      router.push({
        pathname: '/(tabs)/courses',
        params: { programId: program.id }
      });
    } else {
      // Show enrollment options
      router.push({
        pathname: '/program-detail',
        params: { programId: program.id }
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'enrolled':
        return Colors.success[600];
      case 'available':
        return Colors.primary[600];
      default:
        return Colors.secondary[600];
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'enrolled':
        return 'Enrolled';
      case 'available':
        return 'Available';
      default:
        return 'Unknown';
    }
  };

  const renderProgram = ({ item }) => (
    <Card
      style={styles.programCard}
      onPress={() => handleProgramPress(item)}
    >
      <View style={styles.programHeader}>
        <View style={styles.programInfo}>
          <Text style={[styles.programName, { color: colors.text.primary }]}>
            {item.name}
          </Text>
          <Text style={[styles.programCode, { color: colors.text.secondary }]}>
            {item.code}
          </Text>
          <Text style={[styles.programDescription, { color: colors.text.secondary }]} numberOfLines={2}>
            {item.description}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {getStatusText(item.status)}
          </Text>
        </View>
      </View>

      <View style={styles.programDetails}>
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={16} color={colors.text.secondary} />
            <Text style={[styles.detailText, { color: colors.text.secondary }]}>
              {item.duration}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="book-outline" size={16} color={colors.text.secondary} />
            <Text style={[styles.detailText, { color: colors.text.secondary }]}>
              {item.totalCourses} courses
            </Text>
          </View>
        </View>

        {item.status === 'enrolled' && (
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={[styles.progressLabel, { color: colors.text.secondary }]}>
                Progress
              </Text>
              <Text style={[styles.progressText, { color: Colors.primary[600] }]}>
                {item.progress}%
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${item.progress}%`,
                    backgroundColor: Colors.primary[600]
                  }
                ]} 
              />
            </View>
            <Text style={[styles.coursesText, { color: colors.text.secondary }]}>
              {item.completedCourses} of {item.totalCourses} courses completed
            </Text>
          </View>
        )}

        <View style={styles.dateSection}>
          <View style={styles.dateItem}>
            <Ionicons name="calendar-outline" size={16} color={colors.text.secondary} />
            <Text style={[styles.dateText, { color: colors.text.secondary }]}>
              Start: {new Date(item.startDate).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.dateItem}>
            <Ionicons name="calendar-outline" size={16} color={colors.text.secondary} />
            <Text style={[styles.dateText, { color: colors.text.secondary }]}>
              End: {new Date(item.endDate).toLocaleDateString()}
            </Text>
          </View>
        </View>
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
        <Header title="Programs" showBack />
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.text.secondary }]}>
            Loading programs...
          </Text>
        </View>
      </View>
    );
  }

  const filteredPrograms = getFilteredPrograms();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Programs" showBack />
      
      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        {renderFilterButton('all', 'All', 'apps')}
        {renderFilterButton('enrolled', 'Enrolled', 'checkmark-circle')}
        {renderFilterButton('available', 'Available', 'add-circle')}
      </View>

      <FlatList
        data={filteredPrograms}
        renderItem={renderProgram}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="book-outline" size={64} color={colors.text.disabled} />
            <Text style={[styles.emptyText, { color: colors.text.secondary }]}>
              No programs found
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.text.disabled }]}>
              {filter === 'enrolled' ? 'You are not enrolled in any programs yet' :
               filter === 'available' ? 'No available programs at the moment' :
               'No programs available'}
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
  programCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
  },
  programHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  programInfo: {
    flex: 1,
    marginRight: 12,
  },
  programName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  programCode: {
    fontSize: 14,
    marginBottom: 8,
  },
  programDescription: {
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
  programDetails: {
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
  progressSection: {
    gap: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressBar: {
    height: 6,
    backgroundColor: Colors.secondary[200],
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  coursesText: {
    fontSize: 12,
  },
  dateSection: {
    gap: 4,
  },
  dateItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    marginLeft: 4,
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
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});

export default ProgramsScreen; 