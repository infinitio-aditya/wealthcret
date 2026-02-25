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
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
import { useTheme } from "../../hooks/useTheme";
import { useAlert } from "../../context/AlertContext";
import { setUser, setToken } from "../../store/slices/authSlice";
import { login } from "../../services/authService";
import { UserRole } from "../../types";

const LoginScreen = () => {
  const { showAlert } = useAlert();
  const theme = useTheme();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>("admin");
  const [loading, setLoading] = useState(false);

  const roles: { value: UserRole; label: string }[] = [
    { value: "admin", label: "Admin" },
    { value: "service_provider", label: "Service Provider" },
    { value: "referral_partner", label: "Referral Partner" },
    { value: "client", label: "Client" },
  ];

  const handleLogin = async () => {
    if (!email || !password) {
      showAlert("Error", "Please enter both email and password");
      return;
    }

    setLoading(true);

    // 1. Determine the role locally
    let roleToUse: UserRole = "admin"; // Default
    const trimmedEmail = email.trim().toLowerCase();

    if (trimmedEmail == "s") {
      roleToUse = "service_provider";
    } else if (trimmedEmail == "r") {
      roleToUse = "referral_partner";
    } else if (trimmedEmail == "c") {
      roleToUse = "client";
    }

    // 2. Update the state for future renders
    setSelectedRole(roleToUse);
    console.log("Determined Role:", roleToUse);

    try {
      // 3. Use the local variable 'roleToUse' for the API call
      const response = await login({ email, password, role: roleToUse });
      dispatch(setUser(response.user));
      dispatch(setToken(response.token));
    } catch (error) {
      showAlert("Error", "Login failed. Please try again.");
    } finally {
      setLoading(false);
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
    roleContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      marginBottom: 24,
    },
    roleButton: {
      flex: 1,
      minWidth: "48%",
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 12,
      borderWidth: 1,
      alignItems: "center",
    },
    roleButtonText: {
      fontSize: 14,
      fontWeight: "500",
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
    footer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 32,
      gap: 4,
    },
    footerText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    signUpText: {
      fontSize: 14,
      color: theme.colors.primary,
      fontWeight: "700",
    },
  });

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

          {/* Role Selection */}
          {/* <Text style={styles.label}>Select Role</Text>
                    <View style={styles.roleContainer}>
                        {roles.map((role) => (
                            <TouchableOpacity
                                key={role.value}
                                onPress={() => setSelectedRole(role.value)}
                                style={[
                                    styles.roleButton,
                                    {
                                        borderColor: theme.effects.cardBorder,
                                        backgroundColor:
                                            selectedRole === role.value
                                                ? theme.colors.primary
                                                : theme.effects.glassBackground,
                                    },
                                ]}>
                                <Text
                                    style={[
                                        styles.roleButtonText,
                                        {
                                            color:
                                                selectedRole === role.value
                                                    ? theme.colors.textOnPrimary
                                                    : theme.colors.text,
                                        },
                                    ]}>
                                    {role.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View> */}

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
            />
          </View>

          {/* Forgot Password */}
          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={() => navigation.navigate("ForgotPassword" as never)}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            disabled={loading}
          >
            <LinearGradient
              colors={[theme.colors.primary, theme.colors.primary + "80"]}
              style={styles.loginButtonGradient}
            >
              {loading ? (
                <ActivityIndicator color={theme.colors.textOnPrimary} />
              ) : (
                <Text style={styles.loginButtonText}>Sign In</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        {/* <View style={styles.footer}>
                    <Text style={styles.footerText}>Don't have an account?</Text>
                    <TouchableOpacity onPress={() => console.log('Sign Up')}>
                        <Text style={styles.signUpText}>Sign Up</Text>
                    </TouchableOpacity>
                </View> */}
      </ScrollView>
    </View>
  );
};

export default LoginScreen;
