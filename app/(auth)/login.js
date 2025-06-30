import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Colors, getColorScheme } from '../../constants/colors';
import { useColorScheme } from '../../hooks/useColorScheme';
import Button from '../components/Button';
import Card from '../components/Card';
import { authUtils } from '../utils/auth';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = getColorScheme(colorScheme === 'dark');

  useEffect(() => {
    // Check if user is already logged in
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const isLoggedIn = await authUtils.isLoggedIn();
    if (isLoggedIn) {
      router.replace('/(tabs)/dashboard');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const result = await authUtils.login({ email, password });
      
      if (result.success) {
        router.replace('/(tabs)/dashboard');
      } else {
        Alert.alert('Login Failed', result.error || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      // Demo login with dummy credentials
      const result = await authUtils.login({ 
        email: 'demo@student.edu', 
        password: 'demo123' 
      });
      
      if (result.success) {
        router.replace('/(tabs)/dashboard');
      } else {
        Alert.alert('Demo Login Failed', 'Please try again');
      }
    } catch (error) {
      console.error('Demo login error:', error);
      Alert.alert('Error', 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Ionicons 
            name="school" 
            size={80} 
            color={Colors.primary[600]} 
          />
          <Text style={[styles.title, { color: colors.text.primary }]}>
            EduSync
          </Text>
          <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
            Your Learning Management System
          </Text>
        </View>

        <Card style={styles.loginCard}>
          <Text style={[styles.cardTitle, { color: colors.text.primary }]}>
            Student Login
          </Text>
          
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text.primary }]}>
              Email
            </Text>
            <View style={[
              styles.inputWrapper,
              { 
                borderColor: errors.email ? Colors.error[400] : Colors.secondary[300],
                backgroundColor: colors.surface
              }
            ]}>
              <Ionicons 
                name="mail-outline" 
                size={20} 
                color={colors.text.secondary} 
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { color: colors.text.primary }]}
                placeholder="Enter your email"
                placeholderTextColor={colors.text.disabled}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            {errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text.primary }]}>
              Password
            </Text>
            <View style={[
              styles.inputWrapper,
              { 
                borderColor: errors.password ? Colors.error[400] : Colors.secondary[300],
                backgroundColor: colors.surface
              }
            ]}>
              <Ionicons 
                name="lock-closed-outline" 
                size={20} 
                color={colors.text.secondary} 
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { color: colors.text.primary }]}
                placeholder="Enter your password"
                placeholderTextColor={colors.text.disabled}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity 
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons 
                  name={showPassword ? "eye-off-outline" : "eye-outline"} 
                  size={20} 
                  color={colors.text.secondary} 
                />
              </TouchableOpacity>
            </View>
            {errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}
          </View>

          <Button
            title="Login"
            onPress={handleLogin}
            loading={loading}
            style={styles.loginButton}
          />

          <View style={styles.divider}>
            <View style={[styles.dividerLine, { backgroundColor: colors.text.disabled }]} />
            <Text style={[styles.dividerText, { color: colors.text.secondary }]}>
              OR
            </Text>
            <View style={[styles.dividerLine, { backgroundColor: colors.text.disabled }]} />
          </View>

          <Button
            title="Try Demo"
            onPress={handleDemoLogin}
            variant="outline"
            loading={loading}
            style={styles.demoButton}
          />
        </Card>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.text.secondary }]}>
            Don't have an account? Contact your institution
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  loginCard: {
    padding: 24,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
  },
  eyeIcon: {
    padding: 4,
  },
  errorText: {
    color: Colors.error[600],
    fontSize: 14,
    marginTop: 4,
  },
  loginButton: {
    marginTop: 8,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    fontWeight: '500',
  },
  demoButton: {
    marginTop: 8,
  },
  footer: {
    alignItems: 'center',
    marginTop: 40,
  },
  footerText: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default LoginScreen; 