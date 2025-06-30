import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getColorScheme } from '../../constants/colors';
import { useColorScheme } from '../../hooks/useColorScheme';

const Card = ({
  children,
  title,
  subtitle,
  onPress,
  style,
  titleStyle,
  subtitleStyle,
  showShadow = true,
  padding = 16,
  ...props
}) => {
  const colorScheme = useColorScheme();
  const colors = getColorScheme(colorScheme === 'dark');

  const CardContainer = onPress ? TouchableOpacity : View;

  return (
    <CardContainer
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          padding,
          shadowColor: showShadow ? '#000' : 'transparent',
        },
        style
      ]}
      onPress={onPress}
      activeOpacity={onPress ? 0.8 : 1}
      {...props}
    >
      {(title || subtitle) && (
        <View style={styles.header}>
          {title && (
            <Text style={[
              styles.title,
              { color: colors.text.primary },
              titleStyle
            ]}>
              {title}
            </Text>
          )}
          {subtitle && (
            <Text style={[
              styles.subtitle,
              { color: colors.text.secondary },
              subtitleStyle
            ]}>
              {subtitle}
            </Text>
          )}
        </View>
      )}
      <View style={styles.content}>
        {children}
      </View>
    </CardContainer>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
  },
  content: {
    flex: 1,
  },
});

export default Card; 