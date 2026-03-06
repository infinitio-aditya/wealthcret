import React, { ReactNode } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "../../hooks/useTheme";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, info);
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} onReset={this.resetError} />;
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error?: Error;
  onReset: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, onReset }) => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    errorContainer: {
      backgroundColor: theme.colors.error + "20",
      borderColor: theme.colors.error,
      borderWidth: 1,
      borderRadius: 12,
      padding: 20,
      marginBottom: 20,
    },
    title: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.colors.error,
      marginBottom: 10,
    },
    message: {
      fontSize: 14,
      color: theme.colors.text,
      marginBottom: 10,
      lineHeight: 20,
    },
    errorDetails: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      backgroundColor: theme.colors.background,
      padding: 10,
      borderRadius: 8,
      marginTop: 10,
      fontFamily: "Menlo",
    },
    button: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: 30,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: "center",
    },
    buttonText: {
      color: theme.colors.textOnPrimary,
      fontWeight: "bold",
      fontSize: 16,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.errorContainer}>
        <Text style={styles.title}>Oops! Something went wrong</Text>
        <Text style={styles.message}>
          The app encountered an unexpected error. Please try again or contact support if the
          problem persists.
        </Text>
        {error && (
          <Text style={styles.errorDetails}>{error.message || "Unknown error"}</Text>
        )}
      </View>
      <TouchableOpacity style={styles.button} onPress={onReset}>
        <Text style={styles.buttonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );
};
