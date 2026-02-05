import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../hooks/useTheme';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

const ForgotPasswordScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!email) return;
    setSubmitted(true);
    // In a real app, send reset link
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
      padding: 24,
      justifyContent: 'center',
    },
    backButton: {
      position: 'absolute',
      top: 60,
      left: 20,
      zIndex: 10,
    },
    iconContainer: {
      width: 80,
      height: 80,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 32,
      alignSelf: 'center',
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: theme.colors.text,
      textAlign: 'center',
      marginBottom: 12,
    },
    description: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: 32,
      lineHeight: 24,
    },
    inputContainer: {
      marginBottom: 24,
    },
    label: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 8,
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.effects.cardBorder,
      paddingHorizontal: 16,
    },
    input: {
      flex: 1,
      height: 50,
      color: theme.colors.text,
      marginLeft: 12,
    },
    submitButton: {
      height: 56,
      borderRadius: 16,
      overflow: 'hidden',
      marginTop: 8,
    },
    gradient: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    submitText: {
      color: '#FFF',
      fontSize: 16,
      fontWeight: 'bold',
    },
    successContainer: {
      alignItems: 'center',
    },
    resendButton: {
      marginTop: 24,
    },
    resendText: {
      color: theme.colors.primary,
      fontWeight: '600',
    },
  });

  if (submitted) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.successContainer}>
            <LinearGradient
              colors={['#10B981', '#059669']}
              style={styles.iconContainer}
            >
              <Icon name="checkmark-circle-outline" size={48} color="#FFF" />
            </LinearGradient>
            <Text style={styles.title}>Check Your Email</Text>
            <Text style={styles.description}>
              We've sent a password reset link to {email}. Please check your
              inbox and spam folder.
            </Text>
            <TouchableOpacity
              style={styles.resendButton}
              onPress={() => navigation.navigate('OTPVerification' as never)}
            >
              <Text style={styles.resendText}>Enter Reset Code</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.resendButton, { marginTop: 12 }]}
              onPress={() => setSubmitted(false)}
            >
              <Text
                style={[
                  styles.resendText,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Back to Login
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <LinearGradient
          colors={[theme.colors.primary, theme.colors.secondary]}
          style={styles.iconContainer}
        >
          <Icon name="key-outline" size={40} color="#FFF" />
        </LinearGradient>

        <Text style={styles.title}>Forgot Password?</Text>
        <Text style={styles.description}>
          Don't worry, it happens. Enter your email and we'll send you a link to
          reset your password.
        </Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email Address</Text>
          <View style={styles.inputWrapper}>
            <Icon
              name="mail-outline"
              size={20}
              color={theme.colors.textSecondary}
            />
            <TextInput
              style={styles.input}
              placeholder="name@company.com"
              placeholderTextColor={theme.colors.textSecondary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <LinearGradient
            colors={[theme.colors.primary, theme.colors.secondary]}
            style={styles.gradient}
          >
            <Text style={styles.submitText}>Send Reset Link</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ForgotPasswordScreen;
