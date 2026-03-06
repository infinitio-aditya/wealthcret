import React from "react";
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import { useTheme } from "../../hooks/useTheme";

interface LoadingScreenProps {
  message?: string;
  fullScreen?: boolean;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ message, fullScreen = true }) => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      ...(fullScreen ? { flex: 1 } : {}),
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.background,
      padding: 20,
      minHeight: fullScreen ? "100%" : 200,
    },
    message: {
      marginTop: 16,
      fontSize: 14,
      color: theme.colors.textSecondary,
      textAlign: "center",
    },
  });

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  fullScreen?: boolean;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Error",
  message = "Something went wrong. Please try again.",
  onRetry,
  fullScreen = true,
}) => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      ...(fullScreen ? { flex: 1 } : {}),
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.background,
      padding: 20,
      minHeight: fullScreen ? "100%" : 200,
    },
    errorBox: {
      backgroundColor: theme.colors.error + "20",
      borderColor: theme.colors.error,
      borderWidth: 1,
      borderRadius: 12,
      padding: 20,
      marginBottom: onRetry ? 20 : 0,
    },
    title: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.colors.error,
      marginBottom: 8,
    },
    message: {
      fontSize: 14,
      color: theme.colors.text,
      lineHeight: 20,
    },
    retryButton: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: 30,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: "center",
    },
    retryButtonText: {
      color: theme.colors.textOnPrimary,
      fontWeight: "bold",
      fontSize: 16,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.errorBox}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
      </View>
      {onRetry && (
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: string;
  action?: {
    label: string;
    onPress: () => void;
  };
  fullScreen?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No Data",
  message = "There's nothing to show here yet.",
  action,
  fullScreen = true,
}) => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      ...(fullScreen ? { flex: 1 } : {}),
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.background,
      padding: 20,
      minHeight: fullScreen ? "100%" : 200,
    },
    title: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: 8,
      textAlign: "center",
    },
    message: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      textAlign: "center",
      marginBottom: action ? 20 : 0,
      lineHeight: 20,
    },
    actionButton: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: 30,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: "center",
    },
    actionButtonText: {
      color: theme.colors.textOnPrimary,
      fontWeight: "bold",
      fontSize: 16,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {action && (
        <TouchableOpacity style={styles.actionButton} onPress={action.onPress}>
          <Text style={styles.actionButtonText}>{action.label}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
