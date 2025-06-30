import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
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
import { dummyCourses, dummyPrograms } from '../../constants/dummyData';
import { useColorScheme } from '../../hooks/useColorScheme';
import Card from '../components/Card';
import Header from '../components/Header';

const CoursesScreen = () => {
  const [courses, setCourses] = useState([]);
  const [program, setProgram] = useState(null);
  const [filter, setFilter] = useState('all'); // all, completed, in-progress
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const router = useRouter();
  const { programId } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const colors = getColorScheme(colorScheme === 'dark');

  useEffect(() => {
    loadCourses();
  }, [programId]);

  const loadCourses = async () => {
    try {
      // In a real app, you would fetch this data from API
      const programData = dummyPrograms.find(p => p.id === parseInt(programId));
      setProgram(programData);
      
      const programCourses = dummyCourses.filter(c => c.programId === parseInt(programId));
      setCourses(programCourses);
    } catch (error) {
      console.error('Error loading courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCourses();
    setRefreshing(false);
  };

  const getFilteredCourses = () => {
    switch (filter) {
      case 'completed':
        return courses.filter(c => c.status === 'completed');
      case 'in-progress':
        return courses.filter(c => c.status === 'in-progress');
      default:
        return courses;
    }
  };

  const handleCoursePress = (course) => {
    router.push({
      pathname: '/course-detail',
      params: { id: course.id }
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return Colors.success[600];
      case 'in-progress':
        return Colors.warning[600];
      default:
        return Colors.secondary[600];
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in-progress':
        return 'In Progress';
      default:
        return 'Not Started';
    }
  };

  const renderCourse = ({ item }) => (
    <Card
      style={styles.courseCard}
      onPress={() => handleCoursePress(item)}
    >
      <View style={styles.courseHeader}>
        <View style={styles.courseInfo}>
          <Text style={[styles.courseName, { color: colors.text.primary }]}>
            {item.name}
          </Text>
          <Text style={[styles.courseCode, { color: colors.text.secondary }]}>
            {item.code}
          </Text>
          <Text style={[styles.courseDescription, { color: colors.text.secondary }]} numberOfLines={2}>
            {item.description}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {getStatusText(item.status)}
          </Text>
        </View>
      </View>

      <View style={styles.courseDetails}>
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Ionicons name="person-outline" size={16} color={colors.text.secondary} />
            <Text style={[styles.detailText, { color: colors.text.secondary }]}>
              {item.instructor}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="star-outline" size={16} color={colors.text.secondary} />
            <Text style={[styles.detailText, { color: colors.text.secondary }]}>
              {item.credits} credits
            </Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={16} color={colors.text.secondary} />
            <Text style={[styles.detailText, { color: colors.text.secondary }]}>
              {item.duration}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="document-text-outline" size={16} color={colors.text.secondary} />
            <Text style={[styles.detailText, { color: colors.text.secondary }]}>
              {item.topics?.length || 0} topics
            </Text>
          </View>
        </View>

        {item.status !== 'not-started' && (
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
        <Header title="Courses" showBack />
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.text.secondary }]}>
            Loading courses...
          </Text>
        </View>
      </View>
    );
  }

  const filteredCourses = getFilteredCourses();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title={program?.name || "Courses"} showBack />
      
      {program && (
        <View style={styles.programInfo}>
          <Text style={[styles.programName, { color: colors.text.primary }]}>
            {program.name}
          </Text>
          <Text style={[styles.programCode, { color: colors.text.secondary }]}>
            {program.code}
          </Text>
        </View>
      )}
      
      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        {renderFilterButton('all', 'All', 'apps')}
        {renderFilterButton('completed', 'Completed', 'checkmark-circle')}
        {renderFilterButton('in-progress', 'In Progress', 'time')}
      </View>

      <FlatList
        data={filteredCourses}
        renderItem={renderCourse}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="graduationcap-outline" size={64} color={colors.text.disabled} />
            <Text style={[styles.emptyText, { color: colors.text.secondary }]}>
              No courses found
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.text.disabled }]}>
              {filter === 'completed' ? 'No completed courses yet' :
               filter === 'in-progress' ? 'No courses in progress' :
               'No courses available for this program'}
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
  programInfo: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.secondary[200],
  },
  programName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  programCode: {
    fontSize: 14,
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
  courseCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  courseInfo: {
    flex: 1,
    marginRight: 12,
  },
  courseName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  courseCode: {
    fontSize: 14,
    marginBottom: 8,
  },
  courseDescription: {
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
  courseDetails: {
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

export default CoursesScreen; 