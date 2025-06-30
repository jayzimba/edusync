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
import { dummyMaterials } from '../../constants/dummyData';
import { useColorScheme } from '../../hooks/useColorScheme';
import FileViewer from '../components/FileViewer';
import Header from '../components/Header';

const MaterialsScreen = () => {
  const [materials, setMaterials] = useState([]);
  const [filter, setFilter] = useState('all'); // all, downloaded, videos, documents
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = getColorScheme(colorScheme === 'dark');

  useEffect(() => {
    loadMaterials();
  }, []);

  const loadMaterials = async () => {
    try {
      // In a real app, you would fetch this data from API
      setMaterials(dummyMaterials);
    } catch (error) {
      console.error('Error loading materials:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMaterials();
    setRefreshing(false);
  };

  const getFilteredMaterials = () => {
    switch (filter) {
      case 'downloaded':
        return materials.filter(m => m.downloaded);
      case 'videos':
        return materials.filter(m => m.type === 'mp4' || m.type === 'avi' || m.type === 'mov');
      case 'documents':
        return materials.filter(m => m.type === 'pdf' || m.type === 'doc' || m.type === 'docx' || m.type === 'ppt' || m.type === 'pptx');
      default:
        return materials;
    }
  };

  const handleDownload = (material, fileUri) => {
    // Update the material as downloaded
    setMaterials(prev => 
      prev.map(m => 
        m.id === material.id 
          ? { ...m, downloaded: true }
          : m
      )
    );
    
    Alert.alert('Success', `${material.name} downloaded successfully!`);
  };

  const handleView = (material) => {
    if (material.type === 'mp4' || material.type === 'avi' || material.type === 'mov') {
      router.push({
        pathname: '/video-lecture',
        params: { 
          videoUrl: material.downloadUrl,
          title: material.name
        }
      });
    } else {
      Alert.alert('View File', `Opening ${material.name}`);
      // You can implement file viewing logic here
    }
  };

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

  const renderMaterial = ({ item }) => (
    <View style={styles.materialContainer}>
      <FileViewer
        file={item}
        onDownload={handleDownload}
        onView={handleView}
        showDownloadButton={true}
        showViewButton={true}
      />
      {item.downloaded && (
        <View style={styles.downloadedBadge}>
          <Ionicons name="checkmark-circle" size={16} color={Colors.success[600]} />
          <Text style={[styles.downloadedText, { color: Colors.success[600] }]}>
            Downloaded
          </Text>
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Materials" showBack />
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.text.secondary }]}>
            Loading materials...
          </Text>
        </View>
      </View>
    );
  }

  const filteredMaterials = getFilteredMaterials();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Materials Library" showBack />
      
      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        {renderFilterButton('all', 'All', 'apps')}
        {renderFilterButton('downloaded', 'Downloaded', 'checkmark-circle')}
        {renderFilterButton('videos', 'Videos', 'videocam')}
        {renderFilterButton('documents', 'Documents', 'document-text')}
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: Colors.primary[600] }]}>
            {materials.length}
          </Text>
          <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
            Total Files
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: Colors.success[600] }]}>
            {materials.filter(m => m.downloaded).length}
          </Text>
          <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
            Downloaded
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: Colors.warning[600] }]}>
            {materials.filter(m => m.type === 'mp4' || m.type === 'avi' || m.type === 'mov').length}
          </Text>
          <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
            Videos
          </Text>
        </View>
      </View>

      <FlatList
        data={filteredMaterials}
        renderItem={renderMaterial}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="folder-outline" size={64} color={colors.text.disabled} />
            <Text style={[styles.emptyText, { color: colors.text.secondary }]}>
              No materials found
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.text.disabled }]}>
              {filter === 'downloaded' ? 'No downloaded materials yet' :
               filter === 'videos' ? 'No video materials available' :
               filter === 'documents' ? 'No document materials available' :
               'No materials available'}
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.secondary[200],
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  materialContainer: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  downloadedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    gap: 4,
  },
  downloadedText: {
    fontSize: 12,
    fontWeight: '500',
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

export default MaterialsScreen; 