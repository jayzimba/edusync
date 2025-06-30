import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getColorScheme } from '../../constants/colors';
import { useColorScheme } from '../../hooks/useColorScheme';
import { SafeAreaView } from 'react-native-safe-area-context';

const Header = ({ 
  title, 
  showBack = false, 
  showProfile = false, 
  onBackPress, 
  onProfilePress,
  rightComponent 
}) => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = getColorScheme(colorScheme === 'dark');

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  const handleProfilePress = () => {
    if (onProfilePress) {
      onProfilePress();
    } else {
      router.push('/profile');
    }
  };

  return (
    <SafeAreaView style={[styles.header, { backgroundColor: colors.background }]}>
      <View style={styles.leftSection}>
        {showBack && (
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <Ionicons 
              name="chevron-back" 
              size={24} 
              color={colors.text.primary} 
            />
          </TouchableOpacity>
        )}
        <Text style={[styles.title, { color: colors.text.primary }]}>
          {title}
        </Text>
      </View>
      
      <View style={styles.rightSection}>
        {rightComponent}
        {showProfile && (
          <TouchableOpacity onPress={handleProfilePress} style={styles.profileButton}>
            <Ionicons 
              name="person-circle-outline" 
              size={28} 
              color={colors.text.primary} 
            />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    flex: 1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileButton: {
    padding: 4,
  },
});

export default Header; 