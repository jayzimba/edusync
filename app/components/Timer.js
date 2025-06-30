import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors, getColorScheme } from '../../constants/colors';
import { useColorScheme } from '../../hooks/useColorScheme';

const Timer = ({
  duration, // in minutes
  onTimeUp,
  onTick,
  showWarning = true,
  warningThreshold = 5, // minutes
  style,
  textStyle,
}) => {
  const [timeLeft, setTimeLeft] = useState(duration * 60); // Convert to seconds
  const [isRunning, setIsRunning] = useState(true);
  const colorScheme = useColorScheme();
  const colors = getColorScheme(colorScheme === 'dark');

  const formatTime = useCallback((seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const getTimerColor = useCallback(() => {
    const minutesLeft = timeLeft / 60;
    
    if (minutesLeft <= warningThreshold && showWarning) {
      return Colors.error[600];
    } else if (minutesLeft <= warningThreshold * 2) {
      return Colors.warning[600];
    }
    return colors.text.primary;
  }, [timeLeft, warningThreshold, showWarning, colors.text.primary]);

  useEffect(() => {
    let interval = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          const newTime = prevTime - 1;
          
          if (onTick) {
            onTick(newTime);
          }
          
          if (newTime <= 0) {
            setIsRunning(false);
            if (onTimeUp) {
              onTimeUp();
            }
            return 0;
          }
          
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, timeLeft, onTimeUp, onTick]);

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resumeTimer = () => {
    setIsRunning(true);
  };

  const resetTimer = () => {
    setTimeLeft(duration * 60);
    setIsRunning(true);
  };

  const isWarning = timeLeft / 60 <= warningThreshold && showWarning;
  const isLow = timeLeft / 60 <= warningThreshold * 2;

  return (
    <View style={[styles.container, style]}>
      <View style={[
        styles.timerContainer,
        {
          backgroundColor: isWarning ? Colors.error[50] : isLow ? Colors.warning[50] : colors.surface,
          borderColor: isWarning ? Colors.error[200] : isLow ? Colors.warning[200] : Colors.secondary[200],
        }
      ]}>
        <Text style={[
          styles.timerText,
          { color: getTimerColor() },
          textStyle
        ]}>
          {formatTime(timeLeft)}
        </Text>
        {isWarning && (
          <Text style={[styles.warningText, { color: Colors.error[600] }]}>
            Time is running out!
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  timerContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    minWidth: 120,
  },
  timerText: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  warningText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
});

export default Timer; 