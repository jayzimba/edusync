import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Colors, getColorScheme } from '../../constants/colors';
import { dummyExams } from '../../constants/dummyData';
import { useColorScheme } from '../../hooks/useColorScheme';
import Card from '../components/Card';
import Header from '../components/Header';

const ExamsScreen = () => {
  const [exams, setExams] = useState([]);
  const [filter, setFilter] = useState('all'); // all, upcoming, completed
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = getColorScheme(colorScheme === 'dark');

  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = async () => {
    try {
      setExams(dummyExams);
    } catch (error) {
      console.error('Error loading exams:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadExams();
    setRefreshing(false);
  };

  const getFilteredExams = () => {
    switch (filter) {
      case 'upcoming':
        return exams.filter(e => e.status === 'upcoming');
      case 'completed':
        return exams.filter(e => e.status === 'completed');
      default:
        return exams;
    }
  };

  const handleExamPress = (exam) => {
    if (exam.status === 'upcoming') {
      Alert.alert(
        'Start Exam',
        `Are you ready to start "${exam.title}"?\n\nDuration: ${exam.duration} minutes\nQuestions: ${exam.totalQuestions}`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Start',
            onPress: () => {
              router.push({
                pathname: '/exam-detail',
                params: { examId: exam.id }
              });
            },
          },
        ]
      );
    } else {
      router.push({
        pathname: '/exam-detail',
        params: { examId: exam.id }
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return Colors.success[600];
      case 'upcoming':
        return Colors.primary[600];
      default:
        return Colors.secondary[600];
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'upcoming':
        return 'Upcoming';
      default:
        return 'Unknown';
    }
  };

  const renderExam = ({ item }) => (
    <Card
      style={styles.examCard}
      onPress={() => handleExamPress(item)}
    >
      <View style={styles.examHeader}>
        <View style={styles.examInfo}>
          <Text style={[styles.examTitle, { color: colors.text.primary }]}>
            {item.title}
          </Text>
          <Text style={[styles.examDescription, { color: colors.text.secondary }]} numberOfLines={2}>
            {item.description}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {getStatusText(item.status)}
          </Text>
        </View>
      </View>

      <View style={styles.examDetails}>
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={16} color={colors.text.secondary} />
            <Text style={[styles.detailText, { color: colors.text.secondary }]}>
              {item.duration} min
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="help-circle-outline" size={16} color={colors.text.secondary} />
            <Text style={[styles.detailText, { color: colors.text.secondary }]}>
              {item.totalQuestions} questions
            </Text>
          </View>
        </View>

        {item.status === 'upcoming' && (
          <View style={styles.scheduleSection}>
            <View style={styles.scheduleItem}>
              <Ionicons name="calendar-outline" size={16} color={colors.text.secondary} />
              <Text style={[styles.scheduleText, { color: colors.text.secondary }]}>
                Start: {new Date(item.startTime).toLocaleString()}
              </Text>
            </View>
            <View style={styles.scheduleItem}>
              <Ionicons name="calendar-outline" size={16} color={colors.text.secondary} />
              <Text style={[styles.scheduleText, { color: colors.text.secondary }]}>
                End: {new Date(item.endTime).toLocaleString()}
              </Text>
            </View>
          </View>
        )}

        {item.status === 'completed' && item.score !== null && (
          <View style={styles.scoreSection}>
            <Text style={[styles.scoreText, { color: Colors.primary[600] }]}>
              Score: {item.score}/{item.maxScore}
            </Text>
            <Text style={[styles.scorePercentage, { color: colors.text.secondary }]}>
              {Math.round((item.score / item.maxScore) * 100)}%
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
        <Header title="Exams" showBack />
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.text.secondary }]}>
            Loading exams...
          </Text>
        </View>
      </View>
    );
  }

  const filteredExams = getFilteredExams();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Online Exams" showBack />
      
      <View style={styles.filterContainer}>
        {renderFilterButton('all', 'All', 'apps')}
        {renderFilterButton('upcoming', 'Upcoming', 'time')}
        {renderFilterButton('completed', 'Completed', 'checkmark-circle')}
      </View>

      <FlatList
        data={filteredExams}
        renderItem={renderExam}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="checkmark-circle-outline" size={64} color={colors.text.disabled} />
            <Text style={[styles.emptyText, { color: colors.text.secondary }]}>
              No exams found
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.text.disabled }]}>
              {filter === 'upcoming' ? 'No upcoming exams' :
               filter === 'completed' ? 'No completed exams' :
               'No exams available'}
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
  examCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
  },
  examHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  examInfo: {
    flex: 1,
    marginRight: 12,
  },
  examTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  examDescription: {
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
  examDetails: {
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
  scheduleSection: {
    gap: 4,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scheduleText: {
    fontSize: 12,
    marginLeft: 4,
  },
  scoreSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 16,
    fontWeight: '600',
  },
  scorePercentage: {
    fontSize: 14,
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

export default ExamsScreen; 