import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, getColorScheme } from '../../constants/colors';
import { useColorScheme } from '../../hooks/useColorScheme';

const FileViewer = ({
  file,
  onDownload,
  onView,
  showDownloadButton = true,
  showViewButton = true,
  style,
}) => {
  const [downloading, setDownloading] = useState(false);
  const colorScheme = useColorScheme();
  const colors = getColorScheme(colorScheme === 'dark');

  const getFileIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return 'document-text';
      case 'doc':
      case 'docx':
        return 'document';
      case 'ppt':
      case 'pptx':
        return 'easel';
      case 'mp4':
      case 'avi':
      case 'mov':
        return 'videocam';
      case 'mp3':
      case 'wav':
        return 'musical-notes';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return 'image';
      case 'zip':
      case 'rar':
        return 'archive';
      default:
        return 'document';
    }
  };

  const getFileColor = (type) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return Colors.error[600];
      case 'doc':
      case 'docx':
        return Colors.primary[600];
      case 'ppt':
      case 'pptx':
        return Colors.warning[600];
      case 'mp4':
      case 'avi':
      case 'mov':
        return Colors.success[600];
      case 'mp3':
      case 'wav':
        return Colors.secondary[600];
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return Colors.primary[500];
      default:
        return Colors.secondary[600];
    }
  };

  const handleDownload = async () => {
    if (!file.downloadUrl) {
      Alert.alert('Error', 'Download URL not available');
      return;
    }

    setDownloading(true);
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant permission to save files');
        return;
      }

      const fileName = file.name || `file_${Date.now()}.${file.type}`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;

      const downloadResult = await FileSystem.downloadAsync(
        file.downloadUrl,
        fileUri
      );

      if (downloadResult.status === 200) {
        await MediaLibrary.saveToLibraryAsync(downloadResult.uri);
        Alert.alert('Success', 'File downloaded successfully');
        
        if (onDownload) {
          onDownload(file, downloadResult.uri);
        }
      } else {
        Alert.alert('Error', 'Failed to download file');
      }
    } catch (error) {
      console.error('Download error:', error);
      Alert.alert('Error', 'Failed to download file');
    } finally {
      setDownloading(false);
    }
  };

  const handleView = () => {
    if (onView) {
      onView(file);
    } else {
      // Default view behavior
      if (file.downloadUrl) {
        // You can implement file viewing logic here
        Alert.alert('View File', `Opening ${file.name}`);
      }
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }, style]}>
      <View style={styles.fileInfo}>
        <View style={[styles.iconContainer, { backgroundColor: getFileColor(file.type) + '20' }]}>
          <Ionicons 
            name={getFileIcon(file.type)} 
            size={24} 
            color={getFileColor(file.type)} 
          />
        </View>
        <View style={styles.fileDetails}>
          <Text style={[styles.fileName, { color: colors.text.primary }]} numberOfLines={2}>
            {file.name}
          </Text>
          <Text style={[styles.fileSize, { color: colors.text.secondary }]}>
            {file.size} • {file.type.toUpperCase()}
          </Text>
        </View>
      </View>
      
      <View style={styles.actions}>
        {showViewButton && (
          <TouchableOpacity 
            onPress={handleView}
            style={[styles.actionButton, { backgroundColor: Colors.primary[100] }]}
          >
            <Ionicons name="eye" size={20} color={Colors.primary[600]} />
          </TouchableOpacity>
        )}
        
        {showDownloadButton && (
          <TouchableOpacity 
            onPress={handleDownload}
            disabled={downloading}
            style={[
              styles.actionButton, 
              { backgroundColor: downloading ? Colors.secondary[200] : Colors.success[100] }
            ]}
          >
            <Ionicons 
              name={downloading ? 'hourglass' : 'download'} 
              size={20} 
              color={downloading ? Colors.secondary[600] : Colors.success[600]} 
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    marginVertical: 4,
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  fileDetails: {
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  fileSize: {
    fontSize: 14,
    fontWeight: '400',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
});

export default FileViewer; 