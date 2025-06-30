import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { Colors, getColorScheme } from '../constants/colors';
import { dummyCourses } from '../constants/dummyData';
import { useColorScheme } from '../hooks/useColorScheme';
import Card from './components/Card';
import Header from './components/Header';

const CourseDetailScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const colors = getColorScheme(colorScheme === 'dark');

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourse();
  }, [id]);

  const loadCourse = async () => {
    try {
      const foundCourse = dummyCourses.find(c => c.id.toString() === id);
      setCourse(foundCourse);
    } catch (error) {
      setCourse(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Course Details" showBack />
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.text.secondary }]}>Loading course...</Text>
        </View>
      </View>
    );
  }

  if (!course) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Course Details" showBack />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={Colors.error[600]} />
          <Text style={[styles.errorText, { color: colors.text.primary }]}>Course not found</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <Header title="Course Details" showBack />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Card style={styles.headerCard}>
          <Text style={[styles.title, { color: colors.text.primary }]}>{course.name}</Text>
          <Text style={[styles.subtitle, { color: colors.text.secondary }]}>{course.code}</Text>
        </Card>
        <Card style={styles.infoCard}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Course Information</Text>
          <View style={styles.infoRow}>
            <Ionicons name="person-outline" size={20} color={colors.text.secondary} />
            <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>Instructor:</Text>
            <Text style={[styles.infoValue, { color: colors.text.primary }]}>{course.instructor}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={20} color={colors.text.secondary} />
            <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>Duration:</Text>
            <Text style={[styles.infoValue, { color: colors.text.primary }]}>{course.duration}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="star-outline" size={20} color={colors.text.secondary} />
            <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>Credits:</Text>
            <Text style={[styles.infoValue, { color: colors.text.primary }]}>{course.credits}</Text>
          </View>
        </Card>
        <Card style={styles.modulesCard}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Topics</Text>
          {(course.topics || []).map((topic, idx) => (
            <View key={topic.id} style={styles.moduleItem}>
              <Ionicons name="book-outline" size={18} color={Colors.primary[600]} />
              <View style={{ marginLeft: 8 }}>
                <Text style={[styles.moduleText, { color: colors.text.primary }]}>{topic.title}</Text>
                <Text style={{ color: colors.text.secondary, fontSize: 13 }}>{topic.duration}</Text>
                {(topic.materials || []).map((mat) => (
                  <View key={mat.id} style={styles.materialItem}>
                    <Ionicons name="document-outline" size={16} color={Colors.secondary[600]} />
                    <Text style={[styles.materialText, { color: colors.text.primary }]}>{mat.name} ({mat.type}, {mat.size})</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </Card>
        <Card style={styles.descriptionCard}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Description</Text>
          <Text style={[styles.description, { color: colors.text.secondary }]}>{course.description}</Text>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1, padding: 16 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontSize: 16 },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  errorText: { fontSize: 18, marginTop: 16, textAlign: 'center' },
  headerCard: { marginBottom: 16 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 4 },
  subtitle: { fontSize: 16 },
  infoCard: { marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 16 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  infoLabel: { fontSize: 14, marginLeft: 8, marginRight: 8, minWidth: 100 },
  infoValue: { fontSize: 14, flex: 1 },
  modulesCard: { marginBottom: 16 },
  moduleItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  moduleText: { fontSize: 15, fontWeight: '500' },
  materialItem: { flexDirection: 'row', alignItems: 'center', marginLeft: 24, marginTop: 2 },
  materialText: { fontSize: 14, marginLeft: 6 },
  descriptionCard: { marginBottom: 16 },
  description: { fontSize: 16, lineHeight: 24 },
});

export default CourseDetailScreen; 