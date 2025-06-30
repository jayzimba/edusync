import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors, getColorScheme } from '../constants/colors';
import { dummyAssignments } from '../constants/dummyData';
import { useColorScheme } from '../hooks/useColorScheme';
import Button from './components/Button';
import Card from './components/Card';
import FileViewer from './components/FileViewer';
import Header from './components/Header';

const AssignmentDetailScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const colors = getColorScheme(colorScheme === 'dark');

  const [assignment, setAssignment] = useState(null);
  const [submission, setSubmission] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAssignment();
  }, [id]);

  const loadAssignment = async () => {
    try {
      const foundAssignment = dummyAssignments.find(a => a.id.toString() === id);
      setAssignment(foundAssignment);
    } catch (error) {
      setAssignment(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAttachment = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (result.canceled === false) {
        const newAttachment = {
          id: Date.now(),
          name: result.assets[0].name,
          size: result.assets[0].size,
          uri: result.assets[0].uri,
          type: result.assets[0].mimeType,
        };
        setAttachments(prev => [...prev, newAttachment]);
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'Failed to add attachment');
    }
  };

  const handleRemoveAttachment = (attachmentId) => {
    setAttachments(prev => prev.filter(a => a.id !== attachmentId));
  };

  const handleSubmit = () => {
    if (!submission.trim()) {
      Alert.alert('Error', 'Please enter your submission text');
      return;
    }

    Alert.alert(
      'Submit Assignment',
      'Are you sure you want to submit this assignment?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Submit',
          onPress: () => {
            setAssignment(prev => ({
              ...prev,
              status: 'submitted',
              submittedAt: new Date().toISOString(),
            }));
            Alert.alert('Success', 'Assignment submitted successfully!');
          },
        },
      ]
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return Colors.warning[600];
      case 'submitted':
        return Colors.primary[600];
      case 'graded':
        return Colors.success[600];
      case 'overdue':
        return Colors.error[600];
      default:
        return Colors.secondary[600];
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'submitted':
        return 'Submitted';
      case 'graded':
        return 'Graded';
      case 'overdue':
        return 'Overdue';
      default:
        return 'Unknown';
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Assignment Details" showBack />
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.text.secondary }]}>
            Loading assignment...
          </Text>
        </View>
      </View>
    );
  }

  if (!assignment) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Assignment Details" showBack />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={Colors.error[600]} />
          <Text style={[styles.errorText, { color: colors.text.primary }]}>
            Assignment not found
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Assignment Details" showBack />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Assignment Header */}
        <Card style={styles.headerCard}>
          <View style={styles.headerRow}>
            <View style={styles.titleSection}>
              <Text style={[styles.title, { color: colors.text.primary }]}>
                {assignment.title}
              </Text>
              <Text style={[styles.courseName, { color: colors.text.secondary }]}>
                {assignment.courseId ? `Course ID: ${assignment.courseId}` : ''}
              </Text>
            </View>
            <View style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(assignment.status) }
            ]}>
              <Text style={styles.statusText}>
                {getStatusText(assignment.status)}
              </Text>
            </View>
          </View>
        </Card>

        {/* Assignment Info */}
        <Card style={styles.infoCard}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            Assignment Information
          </Text>
          
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={20} color={colors.text.secondary} />
            <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>
              Due Date:
            </Text>
            <Text style={[styles.infoValue, { color: colors.text.primary }]}>
              {new Date(assignment.dueDate).toLocaleDateString()}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={20} color={colors.text.secondary} />
            <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>
              Time Remaining:
            </Text>
            <Text style={[styles.infoValue, { color: colors.text.primary }]}>
              {assignment.status === 'overdue' ? 'Overdue' : '2 days left'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="star-outline" size={20} color={colors.text.secondary} />
            <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>
              Points:
            </Text>
            <Text style={[styles.infoValue, { color: colors.text.primary }]}>
              {assignment.points} points
            </Text>
          </View>

          {assignment.grade && (
            <View style={styles.infoRow}>
              <Ionicons name="trophy-outline" size={20} color={Colors.success[600]} />
              <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>
                Grade:
              </Text>
              <Text style={[styles.infoValue, { color: Colors.success[600], fontWeight: '600' }]}>
                {assignment.grade}/100
              </Text>
            </View>
          )}
        </Card>

        {/* Assignment Description */}
        <Card style={styles.descriptionCard}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            Description
          </Text>
          <Text style={[styles.description, { color: colors.text.secondary }]}>
            {assignment.description}
          </Text>
        </Card>

        {/* Assignment Files */}
        {assignment.files && assignment.files.length > 0 && (
          <Card style={styles.filesCard}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
              Assignment Files
            </Text>
            {assignment.files.map((file, index) => (
              <FileViewer
                key={index}
                file={file}
                onView={() => Alert.alert('View File', `Opening ${file.name}`)}
                showDownloadButton={true}
                showViewButton={true}
              />
            ))}
          </Card>
        )}

        {/* Submission Section */}
        {assignment.status === 'pending' && (
          <Card style={styles.submissionCard}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
              Your Submission
            </Text>
            
            <TextInput
              style={[
                styles.submissionInput,
                {
                  backgroundColor: colors.surface,
                  color: colors.text.primary,
                  borderColor: Colors.secondary[300],
                }
              ]}
              placeholder="Enter your submission here..."
              placeholderTextColor={colors.text.disabled}
              value={submission}
              onChangeText={setSubmission}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />

            {/* Attachments */}
            <View style={styles.attachmentsSection}>
              <Text style={[styles.attachmentsTitle, { color: colors.text.primary }]}>
                Attachments ({attachments.length})
              </Text>
              
              {attachments.map((attachment) => (
                <View key={attachment.id} style={styles.attachmentItem}>
                  <View style={styles.attachmentInfo}>
                    <Ionicons name="document-outline" size={20} color={colors.text.secondary} />
                    <Text style={[styles.attachmentName, { color: colors.text.primary }]}>
                      {attachment.name}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleRemoveAttachment(attachment.id)}
                    style={styles.removeButton}
                  >
                    <Ionicons name="close-circle" size={20} color={Colors.error[600]} />
                  </TouchableOpacity>
                </View>
              ))}

              <TouchableOpacity
                onPress={handleAddAttachment}
                style={[styles.addAttachmentButton, { borderColor: Colors.primary[600] }]}
              >
                <Ionicons name="add-circle-outline" size={20} color={Colors.primary[600]} />
                <Text style={[styles.addAttachmentText, { color: Colors.primary[600] }]}>
                  Add Attachment
                </Text>
              </TouchableOpacity>
            </View>

            <Button
              title="Submit Assignment"
              onPress={() => setShowSubmitModal(true)}
              style={styles.submitButton}
              disabled={!submission.trim()}
            />
          </Card>
        )}

        {/* Submitted Work */}
        {assignment.status === 'submitted' && (
          <Card style={styles.submittedCard}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
              Submitted Work
            </Text>
            <Text style={[styles.submittedText, { color: colors.text.secondary }]}>
              Your assignment has been submitted successfully.
            </Text>
            <Text style={[styles.submittedDate, { color: colors.text.secondary }]}>
              Submitted on: {new Date(assignment.submittedAt).toLocaleDateString()}
            </Text>
          </Card>
        )}

        {/* Feedback */}
        {assignment.feedback && (
          <Card style={styles.feedbackCard}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
              Instructor Feedback
            </Text>
            <Text style={[styles.feedback, { color: colors.text.secondary }]}>
              {assignment.feedback}
            </Text>
          </Card>
        )}
      </ScrollView>

      {/* Submit Modal */}
      <Modal
        visible={showSubmitModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSubmitModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            <Text style={[styles.modalTitle, { color: colors.text.primary }]}>
              Confirm Submission
            </Text>
            <Text style={[styles.modalText, { color: colors.text.secondary }]}>
              Are you sure you want to submit this assignment? You won't be able to edit it after submission.
            </Text>
            <View style={styles.modalButtons}>
              <Button
                title="Cancel"
                onPress={() => setShowSubmitModal(false)}
                variant="outline"
                style={styles.modalButton}
              />
              <Button
                title="Submit"
                onPress={handleSubmit}
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    fontSize: 18,
    marginTop: 16,
    textAlign: 'center',
  },
  headerCard: {
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleSection: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  courseName: {
    fontSize: 16,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  infoCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    marginLeft: 8,
    marginRight: 8,
    minWidth: 100,
  },
  infoValue: {
    fontSize: 14,
    flex: 1,
  },
  descriptionCard: {
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  filesCard: {
    marginBottom: 16,
  },
  submissionCard: {
    marginBottom: 16,
  },
  submissionInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    minHeight: 120,
  },
  attachmentsSection: {
    marginBottom: 16,
  },
  attachmentsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  attachmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    marginBottom: 8,
  },
  attachmentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  attachmentName: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  removeButton: {
    padding: 4,
  },
  addAttachmentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 16,
    marginTop: 8,
  },
  addAttachmentText: {
    fontSize: 14,
    marginLeft: 8,
  },
  submitButton: {
    marginTop: 8,
  },
  submittedCard: {
    marginBottom: 16,
  },
  submittedText: {
    fontSize: 16,
    marginBottom: 8,
  },
  submittedDate: {
    fontSize: 14,
  },
  feedbackCard: {
    marginBottom: 16,
  },
  feedback: {
    fontSize: 16,
    lineHeight: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    margin: 20,
    borderRadius: 12,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 8,
  },
});

export default AssignmentDetailScreen; 