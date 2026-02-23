import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Modal from "react-native-modal";
import { useTheme } from "../../hooks/useTheme";
import Button from "./Button";
import Card from "./Card";

export interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: "default" | "cancel" | "destructive";
}

interface CustomAlertProps {
  isVisible: boolean;
  title?: string;
  message?: string;
  buttons?: AlertButton[];
  onClose: () => void;
}

const { width } = Dimensions.get("window");

const CustomAlert: React.FC<CustomAlertProps> = ({
  isVisible,
  title,
  message,
  buttons = [{ text: "OK" }],
  onClose,
}) => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    modal: {
      justifyContent: "center",
      alignItems: "center",
      margin: 0,
    },
    container: {
      width: width * 0.85,
      padding: 24,
      borderRadius: 24,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.effects.cardBorder,
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: 12,
      textAlign: "center",
    },
    message: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      marginBottom: 24,
      textAlign: "center",
      lineHeight: 22,
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "center",
      gap: 12,
    },
    verticalButtonContainer: {
      flexDirection: "column",
      gap: 12,
    },
    button: {
      flex: 1,
    },
  });

  const handleButtonPress = (onPress?: () => void) => {
    onClose();
    if (onPress) {
      setTimeout(() => {
        onPress();
      }, 300); // Wait for modal animation to finish
    }
  };

  const isVertical = buttons.length > 2;

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      backdropOpacity={0.5}
      animationIn="zoomIn"
      animationOut="zoomOut"
      useNativeDriver
      hideModalContentWhileAnimating
      style={styles.modal}
    >
      <Card style={styles.container}>
        {title && <Text style={styles.title}>{title}</Text>}
        {message && <Text style={styles.message}>{message}</Text>}
        <View
          style={
            isVertical ? styles.verticalButtonContainer : styles.buttonContainer
          }
        >
          {buttons.map((button, index) => (
            <Button
              key={index}
              title={button.text}
              onPress={() => handleButtonPress(button.onPress)}
              variant={
                button.style === "cancel"
                  ? "secondary"
                  : button.style === "destructive"
                    ? "outline" // Plan said destructive uses outline variant or similar
                    : "primary"
              }
              style={!isVertical ? styles.button : undefined}
            />
          ))}
        </View>
      </Card>
    </Modal>
  );
};

export default CustomAlert;
