import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors, getColorScheme } from '../../constants/colors';
import { dummyPrograms, dummyUser } from '../../constants/dummyData';
import { useColorScheme } from '../../hooks/useColorScheme';
import Card from '../components/Card';
import Header from '../components/Header';
import { authUtils } from '../utils/auth';

const DashboardScreen = () => {
  const [user, setUser] = useState(null);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = getColorScheme(colorScheme === 'dark');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // In a real app, you would fetch this data from API
      // For now, using dummy data
      const userData = await authUtils.getUserData() || dummyUser;
      setUser(userData);
      setPrograms(dummyPrograms.filter(p => p.status === 'enrolled'));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await authUtils.logout();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  const handleProgramPress = (program) => {
    router.push({
      pathname: '/(tabs)/courses',
      params: { programId: program.id }
    });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Dashboard" showProfile onProfilePress={handleLogout} />
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.text.secondary }]}>
            Loading dashboard...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Dashboard" showProfile onProfilePress={handleLogout} />
      
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Welcome Section */}
        <Card style={styles.welcomeCard}>
          <View style={styles.welcomeHeader}>
            <View style={styles.avatarContainer}>
              <Ionicons name="person" size={40} color={Colors.primary[600]} />
            </View>
            <View style={styles.welcomeText}>
              <Text style={[styles.greeting, { color: colors.text.primary }]}>
                {getGreeting()}, {user?.name?.split(' ')[0]}!
              </Text>
              <Text style={[styles.studentId, { color: colors.text.secondary }]}>
                {user?.studentId}
              </Text>
            </View>
          </View>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: Colors.primary[600] }]}>
                {programs.length}
              </Text>
              <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
                Programs
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: Colors.success[600] }]}>
                {programs.reduce((acc, p) => acc + p.completedCourses, 0)}
              </Text>
              <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
                Courses Completed
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: Colors.warning[600] }]}>
                {programs.reduce((acc, p) => acc + (p.totalCourses - p.completedCourses), 0)}
              </Text>
              <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
                In Progress
              </Text>
            </View>
          </View>
        </Card>

        {/* Enrolled Programs */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
              Enrolled Programs
            </Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/programs')}>
              <Text style={[styles.seeAllText, { color: Colors.primary[600] }]}>
                See All
              </Text>
            </TouchableOpacity>
          </View>

          {programs.map((program) => (
            <Card
              key={program.id}
              style={styles.programCard}
              onPress={() => handleProgramPress(program)}
            >
              <View style={styles.programHeader}>
                <View style={styles.programInfo}>
                  <Text style={[styles.programName, { color: colors.text.primary }]}>
                    {program.name}
                  </Text>
                  <Text style={[styles.programCode, { color: colors.text.secondary }]}>
                    {program.code}
                  </Text>
                </View>
                <View style={styles.progressContainer}>
                  <Text style={[styles.progressText, { color: Colors.primary[600] }]}>
                    {program.progress}%
                  </Text>
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill, 
                        { 
                          width: `${program.progress}%`,
                          backgroundColor: Colors.primary[600]
                        }
                      ]} 
                    />
                  </View>
                </View>
              </View>
              <View style={styles.programDetails}>
                <View style={styles.detailItem}>
                  <Ionicons name="time-outline" size={16} color={colors.text.secondary} />
                  <Text style={[styles.detailText, { color: colors.text.secondary }]}>
                    {program.duration}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Ionicons name="book-outline" size={16} color={colors.text.secondary} />
                  <Text style={[styles.detailText, { color: colors.text.secondary }]}>
                    {program.completedCourses}/{program.totalCourses} courses
                  </Text>
                </View>
              </View>
            </Card>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary, marginBottom: 12 }]}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {/* Assignments */}
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: Colors.primary[100] }]}
              onPress={() => router.push('/(tabs)/assignments')}
            >
              <Ionicons name="document-text" size={28} color={Colors.primary[600]} />
              <Text style={[styles.actionText, { color: Colors.primary[600] }]}>Assignments</Text>
              <Text style={styles.actionSubtitle}>View & submit</Text>
              {/* Example badge for pending assignments */}
              <View style={styles.badge}>
                <Text style={styles.badgeText}>2</Text>
              </View>
            </TouchableOpacity>
            {/* Exams */}
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: Colors.success[100] }]}
              onPress={() => router.push('/(tabs)/exams')}
            >
              <Ionicons name="checkmark-circle" size={28} color={Colors.success[600]} />
              <Text style={[styles.actionText, { color: Colors.success[600] }]}>Exams</Text>
              <Text style={styles.actionSubtitle}>Upcoming & results</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>1</Text>
              </View>
            </TouchableOpacity>
            {/* Materials */}
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: Colors.warning[100] }]}
              onPress={() => router.push('/(tabs)/materials')}
            >
              <Ionicons name="folder" size={28} color={Colors.warning[600]} />
              <Text style={[styles.actionText, { color: Colors.warning[600] }]}>Materials</Text>
              <Text style={styles.actionSubtitle}>Library & downloads</Text>
            </TouchableOpacity>
            {/* Courses */}
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: Colors.secondary[100] }]}
              onPress={() => router.push('/(tabs)/courses')}
            >
              <Ionicons name="book" size={28} color={Colors.secondary[600]} />
              <Text style={[styles.actionText, { color: Colors.secondary[600] }]}>Courses</Text>
              <Text style={styles.actionSubtitle}>All enrolled</Text>
            </TouchableOpacity>
            {/* Programs */}
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: Colors.error[100] }]}
              onPress={() => router.push('/(tabs)/programs')}
            >
              <Ionicons name="school" size={28} color={Colors.error[600]} />
              <Text style={[styles.actionText, { color: Colors.error[600] }]}>Programs</Text>
              <Text style={styles.actionSubtitle}>Your programs</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
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
  welcomeCard: {
    margin: 16,
    padding: 20,
  },
  welcomeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  welcomeText: {
    flex: 1,
  },
  greeting: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  studentId: {
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '500',
  },
  programCard: {
    marginHorizontal: 16,
    marginBottom: 12,
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
  },
  programName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  programCode: {
    fontSize: 14,
  },
  progressContainer: {
    alignItems: 'flex-end',
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  progressBar: {
    width: 60,
    height: 4,
    backgroundColor: Colors.secondary[200],
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  programDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 12,
    marginLeft: 4,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  actionButton: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    minWidth: 100,
    width: '30%',
    marginBottom: 16,
    position: 'relative',
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  actionSubtitle: {
    fontSize: 11,
    color: '#888',
    marginTop: 2,
    textAlign: 'center',
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 12,
    backgroundColor: Colors.error[600],
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 1,
    minWidth: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default DashboardScreen; 