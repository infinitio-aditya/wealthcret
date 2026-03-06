import React, { useState, useRef } from "react";
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTheme } from "../../hooks/useTheme";
import Icon from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";
import {
  useForgotPasswordVerifyMutation,
  useForgotPasswordSendMutation,
} from "../../services/backend/authApi";
import { useAlert } from "../../context/AlertContext";

const OTPVerificationScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { showAlert } = useAlert();
  const { email } = (route.params as { email: string }) || {};

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [verifyOtp, { isLoading: isVerifying }] =
    useForgotPasswordVerifyMutation();
  const [resendOtp, { isLoading: isResending }] =
    useForgotPasswordSendMutation();
  const inputs = useRef<TextInput[]>([]);

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join("");
    if (otpCode.length === 6) {
      try {
        const result = await verifyOtp({ email, otp: otpCode }).unwrap();
        if (result.token) {
          await AsyncStorage.setItem("token", result.token);
        }
        (navigation as any).navigate("ResetPassword", { email, otp: otpCode });
      } catch (error: any) {
        showAlert("Error", error?.data?.message || "Invalid verification code");
      }
    } else {
      showAlert("Error", "Please enter the 6-digit code");
    }
  };

  const handleResend = async () => {
    try {
      await resendOtp({ email }).unwrap();
      showAlert("Success", "Verification code resent to your email");
    } catch (error: any) {
      showAlert("Error", error?.data?.message || "Failed to resend code");
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
    backButton: {
      position: "absolute",
      top: 60,
      left: 20,
      zIndex: 10,
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
      marginBottom: 40,
      lineHeight: 24,
    },
    otpContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 40,
    },
    otpInput: {
      width: 48,
      height: 56,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.effects.cardBorder,
      backgroundColor: theme.colors.card,
      color: theme.colors.text,
      fontSize: 24,
      fontWeight: "bold",
      textAlign: "center",
    },
    verifyButton: {
      height: 56,
      borderRadius: 16,
      overflow: "hidden",
    },
    gradient: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    verifyText: {
      color: "#FFF",
      fontSize: 16,
      fontWeight: "bold",
    },
    resendContainer: {
      flexDirection: "row",
      justifyContent: "center",
      marginTop: 32,
    },
    resendLabel: {
      color: theme.colors.textSecondary,
    },
    resendButton: {
      color: theme.colors.primary,
      fontWeight: "600",
      marginLeft: 4,
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
          <Icon name="shield-checkmark-outline" size={40} color="#FFF" />
        </LinearGradient>

        <Text style={styles.title}>Verification</Text>
        <Text style={styles.description}>
          We've sent a 6-digit code to your email. Enter it below to verify your
          account.
        </Text>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(el) => (inputs.current[index] = el!)}
              style={styles.otpInput}
              value={digit}
              onChangeText={(v) => handleOtpChange(v, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              selectionColor={theme.colors.primary}
            />
          ))}
        </View>

        <TouchableOpacity
          style={styles.verifyButton}
          onPress={handleVerify}
          disabled={isVerifying}
        >
          <LinearGradient
            colors={[theme.colors.primary, theme.colors.primary + "80"]}
            style={styles.gradient}
          >
            {isVerifying ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.verifyText}>Verify Code</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.resendContainer}>
          <Text style={styles.resendLabel}>Didn't receive code?</Text>
          <TouchableOpacity onPress={handleResend} disabled={isResending}>
            {isResending ? (
              <ActivityIndicator size="small" color={theme.colors.primary} />
            ) : (
              <Text style={styles.resendButton}>Resend</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default OTPVerificationScreen;
