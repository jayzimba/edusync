import { Ionicons } from '@expo/vector-icons';
import { ResizeMode, Video } from 'expo-av';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
    Alert,
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Colors, getColorScheme } from '../constants/colors';
import { useColorScheme } from '../hooks/useColorScheme';
import Header from './components/Header';

const { width, height } = Dimensions.get('window');

const VideoLectureScreen = () => {
  const [status, setStatus] = useState({});
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  const router = useRouter();
  const { videoUrl, title } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const colors = getColorScheme(colorScheme === 'dark');

  const handlePlayPause = async () => {
    if (videoRef.current) {
      if (isPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        await videoRef.current.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleBackward = async () => {
    if (videoRef.current) {
      const currentPosition = status.positionMillis || 0;
      const newPosition = Math.max(0, currentPosition - 10000); // 10 seconds back
      await videoRef.current.setPositionAsync(newPosition);
    }
  };

  const handleForward = async () => {
    if (videoRef.current) {
      const currentPosition = status.positionMillis || 0;
      const newPosition = currentPosition + 10000; // 10 seconds forward
      await videoRef.current.setPositionAsync(newPosition);
    }
  };

  const formatTime = (millis) => {
    if (!millis) return '0:00';
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header 
        title={title || "Video Lecture"} 
        showBack 
        rightComponent={
          <TouchableOpacity onPress={() => Alert.alert('Video Options', 'More options coming soon')}>
            <Ionicons name="ellipsis-vertical" size={24} color={colors.text.primary} />
          </TouchableOpacity>
        }
      />
      
      <View style={styles.videoContainer}>
        <Video
          ref={videoRef}
          style={styles.video}
          source={{ uri: videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' }}
          useNativeControls={false}
          resizeMode={ResizeMode.CONTAIN}
          isLooping={false}
          onPlaybackStatusUpdate={setStatus}
          onLoad={() => console.log('Video loaded')}
          onError={(error) => console.log('Video error:', error)}
        />
        
        {/* Custom Controls */}
        <View style={styles.controlsOverlay}>
          <View style={styles.controlsContainer}>
            <TouchableOpacity onPress={handleBackward} style={styles.controlButton}>
              <Ionicons name="play-back" size={32} color="#ffffff" />
            </TouchableOpacity>
            
            <TouchableOpacity onPress={handlePlayPause} style={styles.playButton}>
              <Ionicons 
                name={isPlaying ? "pause" : "play"} 
                size={40} 
                color="#ffffff" 
              />
            </TouchableOpacity>
            
            <TouchableOpacity onPress={handleForward} style={styles.controlButton}>
              <Ionicons name="play-forward" size={32} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: status.durationMillis 
                    ? `${(status.positionMillis / status.durationMillis) * 100}%` 
                    : '0%' 
                }
              ]} 
            />
          </View>
          <View style={styles.timeContainer}>
            <Text style={[styles.timeText, { color: colors.text.secondary }]}>
              {formatTime(status.positionMillis)}
            </Text>
            <Text style={[styles.timeText, { color: colors.text.secondary }]}>
              {formatTime(status.durationMillis)}
            </Text>
          </View>
        </View>
      </View>

      {/* Video Info */}
      <View style={styles.infoContainer}>
        <Text style={[styles.videoTitle, { color: colors.text.primary }]}>
          {title || "Video Lecture"}
        </Text>
        <Text style={[styles.videoDescription, { color: colors.text.secondary }]}>
          This is a pre-recorded lecture video. You can pause, rewind, and fast-forward as needed.
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: Colors.primary[100] }]}
          onPress={() => Alert.alert('Notes', 'Note-taking feature coming soon')}
        >
          <Ionicons name="create-outline" size={24} color={Colors.primary[600]} />
          <Text style={[styles.actionText, { color: Colors.primary[600] }]}>
            Take Notes
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: Colors.success[100] }]}
          onPress={() => Alert.alert('Download', 'Download feature coming soon')}
        >
          <Ionicons name="download-outline" size={24} color={Colors.success[600]} />
          <Text style={[styles.actionText, { color: Colors.success[600] }]}>
            Download
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  videoContainer: {
    position: 'relative',
    backgroundColor: '#000',
  },
  video: {
    width: width,
    height: width * 9 / 16, // 16:9 aspect ratio
  },
  controlsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 40,
  },
  controlButton: {
    padding: 16,
  },
  playButton: {
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 50,
  },
  progressContainer: {
    padding: 16,
    backgroundColor: '#000',
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary[600],
    borderRadius: 2,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    fontSize: 12,
  },
  infoContainer: {
    padding: 16,
  },
  videoTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  videoDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  actionContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default VideoLectureScreen; 