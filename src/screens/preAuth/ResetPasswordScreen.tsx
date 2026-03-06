import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../hooks/useTheme";
import Icon from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";
import { useAlert } from "../../context/AlertContext";
import { useResetPasswordMutation } from "../../services/backend/authApi";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ResetPasswordScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { showAlert } = useAlert();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const handleSubmit = async () => {
    if (!password) {
      showAlert("Error", "Please enter a new password");
      return;
    }
    if (password.length < 8) {
      showAlert("Error", "Password must be at least 8 characters long");
      return;
    }
    if (password !== confirmPassword) {
      showAlert("Error", "Passwords do not match");
      return;
    }

    try {
      await resetPassword({ password, confirmPassword }).unwrap();
      // Clear the temporary token after successful reset
      await AsyncStorage.removeItem("token");
      showAlert("Success", "Password updated successfully!");
      navigation.navigate("Login" as never);
    } catch (error: any) {
      showAlert("Error", error?.data?.message || "Failed to reset password");
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
      padding: 24,
      justifyContent: "center",
    },
    iconContainer: {
      width: 80,
      height: 80,
      borderRadius: 24,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 32,
      alignSelf: "center",
    },
    title: {
      fontSize: 32,
      fontWeight: "bold",
      color: theme.colors.text,
      textAlign: "center",
      marginBottom: 12,
    },
    description: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      textAlign: "center",
      marginBottom: 32,
      lineHeight: 24,
    },
    inputContainer: {
      marginBottom: 20,
    },
    label: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 8,
    },
    inputWrapper: {
      flexDirection: "row",
      alignItems: "center",
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
      overflow: "hidden",
      marginTop: 12,
    },
    gradient: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    submitText: {
      color: "#FFF",
      fontSize: 16,
      fontWeight: "bold",
    },
    requirement: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginTop: 4,
    },
    requirementText: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <LinearGradient
          colors={[theme.colors.primary, theme.colors.primary + "80"]}
          style={styles.iconContainer}
        >
          <Icon name="lock-open-outline" size={40} color="#FFF" />
        </LinearGradient>

        <Text style={styles.title}>New Password</Text>
        <Text style={styles.description}>
          Set a strong password to protect your Wealthcret account.
        </Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>New Password</Text>
          <View style={styles.inputWrapper}>
            <Icon
              name="lock-closed-outline"
              size={20}
              color={theme.colors.textSecondary}
            />
            <TextInput
              style={styles.input}
              placeholder="Min. 8 characters"
              placeholderTextColor={theme.colors.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Icon
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color={theme.colors.textSecondary}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Confirm Password</Text>
          <View style={styles.inputWrapper}>
            <Icon
              name="lock-closed-outline"
              size={20}
              color={theme.colors.textSecondary}
            />
            <TextInput
              style={styles.input}
              placeholder="Repeat your password"
              placeholderTextColor={theme.colors.textSecondary}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showPassword}
            />
          </View>
        </View>

        <View style={{ marginBottom: 24 }}>
          <View style={styles.requirement}>
            <Icon
              name="checkmark-circle"
              size={14}
              color={
                password.length >= 8
                  ? theme.colors.success
                  : theme.colors.textSecondary
              }
            />
            <Text style={styles.requirementText}>
              At least 8 characters long
            </Text>
          </View>
          <View style={styles.requirement}>
            <Icon
              name="checkmark-circle"
              size={14}
              color={
                password === confirmPassword && password.length > 0
                  ? theme.colors.success
                  : theme.colors.textSecondary
              }
            />
            <Text style={styles.requirementText}>Passwords must match</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <LinearGradient
            colors={[theme.colors.primary, theme.colors.primary + "80"]}
            style={styles.gradient}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.submitText}>Reset Password</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ResetPasswordScreen;
