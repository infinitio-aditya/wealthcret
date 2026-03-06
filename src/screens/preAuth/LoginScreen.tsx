import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
import { useTheme } from "../../hooks/useTheme";
import { useAlert } from "../../context/AlertContext";
import { useAuth } from "../../app/contexts/AuthContext";

const LoginScreen = () => {
  const { showAlert } = useAlert();
  const theme = useTheme();
  const navigation = useNavigation();
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      showAlert("Error", "Please enter both email and password");
      return;
    }

    setIsLoading(true);

    try {
      // Call the authentication context's login function
      // It will handle token storage, Redux state updates, etc.
      await login({
        email: email.trim().toLowerCase(),
        password,
      });

      // Navigation will be handled automatically by AppNavigator
      // based on the isLoggedIn state
    } catch (error: any) {
      const errorMessage = error?.data?.detail || error?.message || "Login failed";
      showAlert("Error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollView: {
      flex: 1,
    },
    content: {
      flex: 1,
      justifyContent: "center",
      padding: 24,
    },
    logoContainer: {
      alignItems: "center",
      marginBottom: 48,
    },
    logoGradient: {
      width: 80,
      height: 80,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 16,
    },
    logoText: {
      fontSize: 32,
      fontWeight: "bold",
      color: theme.colors.text,
    },
    subtitle: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      textAlign: "center",
    },
    formContainer: {
      backgroundColor: theme.effects.cardBackground,
      borderRadius: 24,
      padding: 24,
      borderWidth: 1,
      borderColor: theme.effects.cardBorder,
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: 8,
    },
    description: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 32,
    },
    label: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 8,
    },
    inputContainer: {
      backgroundColor: theme.effects.glassBackground,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.effects.cardBorder,
      paddingHorizontal: 16,
      paddingVertical: 12,
      marginBottom: 16,
    },
    input: {
      fontSize: 16,
      color: theme.colors.text,
      padding: 0,
    },
    loginButton: {
      borderRadius: 12,
      overflow: "hidden",
      marginTop: 8,
    },
    loginButtonGradient: {
      paddingVertical: 16,
      alignItems: "center",
    },
    loginButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.textOnPrimary,
    },
    forgotPassword: {
      alignSelf: "flex-end",
      marginTop: 8,
      marginBottom: 24,
    },
    forgotPasswordText: {
      fontSize: 14,
      color: theme.colors.primary,
      fontWeight: "600",
    },
  });

  const currentLoading = isLoading || loading;

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <LinearGradient
            colors={[theme.colors.primary, theme.colors.primary + "80"]}
            style={styles.logoGradient}
          >
            <Text style={{ fontSize: 32, color: theme.colors.textOnPrimary }}>
              W
            </Text>
          </LinearGradient>
          <Text style={styles.logoText}>Wealthcret</Text>
          <Text style={styles.subtitle}>Enterprise Financial Operations</Text>
        </View>

        {/* Login Form */}
        <View style={styles.formContainer}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.description}>
            Sign in to your Wealthcret account
          </Text>

          {/* Email Input */}
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor={theme.colors.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!currentLoading}
            />
          </View>

          {/* Password Input */}
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              placeholderTextColor={theme.colors.textSecondary}
              secureTextEntry
              editable={!currentLoading}
            />
          </View>

          {/* Forgot Password */}
          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={() => navigation.navigate("ForgotPassword" as never)}
            disabled={currentLoading}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            disabled={currentLoading}
          >
            <LinearGradient
              colors={[theme.colors.primary, theme.colors.primary + "80"]}
              style={styles.loginButtonGradient}
            >
              {currentLoading ? (
                <ActivityIndicator color={theme.colors.textOnPrimary} />
              ) : (
                <Text style={styles.loginButtonText}>Sign In</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default LoginScreen;
