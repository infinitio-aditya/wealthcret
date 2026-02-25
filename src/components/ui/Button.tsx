import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useTheme } from "../../hooks/useTheme";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline";
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: any;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
}) => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    button: {
      borderRadius: 12,
      overflow: "hidden",
      width: fullWidth ? "100%" : "auto",
      opacity: disabled ? 0.5 : 1,
    },
    gradient: {
      paddingVertical: 14,
      paddingHorizontal: 24,
      alignItems: "center",
      justifyContent: "center",
      minHeight: 48,
    },
    secondary: {
      backgroundColor: theme.effects.glassBackground,
      borderWidth: 1,
      borderColor: theme.effects.cardBorder,
    },
    outline: {
      backgroundColor: "transparent",
      borderWidth: 2,
      borderColor: theme.colors.primary,
    },
    text: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.textOnPrimary,
    },
    secondaryText: {
      color: theme.colors.text,
    },
    outlineText: {
      color: theme.colors.primary,
    },
  });

  const renderContent = () => {
    if (loading) {
      return (
        <ActivityIndicator
          color={
            variant === "primary"
              ? theme.colors.textOnPrimary
              : theme.colors.primary
          }
        />
      );
    }
    return (
      <Text
        style={[
          styles.text,
          variant === "secondary" && styles.secondaryText,
          variant === "outline" && styles.outlineText,
        ]}
      >
        {title}
      </Text>
    );
  };

  if (variant === "primary") {
    return (
      <TouchableOpacity
        style={[styles.button, style]}
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={[theme.colors.primary, theme.colors.primary + "80"]}
          style={styles.gradient}
        >
          {renderContent()}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[
        styles.button,
        variant === "secondary" ? styles.secondary : styles.outline,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      <View style={styles.gradient}>{renderContent()}</View>
    </TouchableOpacity>
  );
};

export default Button;
