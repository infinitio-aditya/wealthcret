import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import { useTheme } from "../../../hooks/useTheme";
import LinearGradient from "react-native-linear-gradient";
import { mockTickets, mockMappings } from "../../../utils/mockData";
import ThemeDropdown from "../../../components/ui/ThemeDropdown";
import ThemeBottomSheet from "../../../components/ui/ThemeBottomSheet";

const CreateTicketScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();

  // Derived organization list for dropdown
  const organizations = Array.from(
    new Set([
      ...mockTickets.map((t) => t.organizationName),
      ...mockMappings.map((m) => m.customerName),
    ]),
  ).filter(Boolean);

  const [organization, setOrganization] = useState(organizations[0] || "");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    // In real app, dispatch action or call API
    Alert.alert("Success", "Ticket created successfully", [
      { text: "OK", onPress: () => navigation.goBack() },
    ]);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)", // Backdrop effect
      justifyContent: "flex-end",
    },
    modalContainer: {
      flex: 1,
      justifyContent: "flex-end",
      margin: 0,
    },
    sheetContent: {
      backgroundColor: theme.colors.surface,
      borderTopLeftRadius: 32,
      borderTopRightRadius: 32,
      paddingTop: 8,
      paddingHorizontal: 24,
      paddingBottom: Platform.OS === "ios" ? 40 : 24,
      maxHeight: "90%",
    },
    dragHandle: {
      width: 40,
      height: 4,
      backgroundColor: theme.effects.cardBorder,
      borderRadius: 2,
      alignSelf: "center",
      marginBottom: 20,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 24,
    },
    headerTitle: {
      fontSize: 22,
      fontWeight: "bold",
      color: theme.colors.text,
    },
    closeButton: {
      padding: 4,
    },
    formGroup: {
      marginBottom: 20,
    },
    label: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.textSecondary,
      marginBottom: 8,
      marginLeft: 4,
    },
    inputContainer: {
      backgroundColor: theme.effects.glassBackground,
      borderWidth: 1,
      borderColor: theme.effects.cardBorder,
      borderRadius: 16,
      overflow: "hidden",
    },
    input: {
      padding: 16,
      fontSize: 16,
      color: theme.colors.text,
    },
    textArea: {
      minHeight: 120,
      textAlignVertical: "top",
    },
    pickerWrapper: {
      backgroundColor: theme.effects.glassBackground,
      borderWidth: 1,
      borderColor: theme.effects.cardBorder,
      borderRadius: 16,
      overflow: "hidden",
    },
    picker: {
      color: theme.colors.text,
      height: 55,
    },
    submitButton: {
      borderRadius: 16,
      marginTop: 10,
      overflow: "hidden",
    },
    gradient: {
      padding: 18,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: 10,
    },
    submitButtonText: {
      color: theme.colors.textOnPrimary,
      fontSize: 16,
      fontWeight: "bold",
    },
  });

  return (
    <View style={styles.container}>
      <ThemeBottomSheet
        isVisible={true}
        onClose={() => navigation.goBack()}
        title="Create Support Ticket"
      >
        <ThemeDropdown
          label="Organization"
          options={organizations.map((org) => ({ label: org, value: org }))}
          selectedValue={organization}
          onValueChange={(value) => setOrganization(value)}
        />

        <View style={styles.formGroup}>
          <Text style={styles.label}>Ticket Title</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Brief summary of the issue"
              placeholderTextColor={theme.colors.textSecondary}
              value={title}
              onChangeText={setTitle}
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Description</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe the problem in detail..."
              placeholderTextColor={theme.colors.textSecondary}
              value={description}
              onChangeText={setDescription}
              multiline
            />
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleSubmit}
          style={styles.submitButton}
        >
          <LinearGradient
            colors={theme.effects.buttonGradient as any}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradient}
          >
            <Text style={styles.submitButtonText}>Submit Ticket</Text>
            <Icon
              name="send-outline"
              size={18}
              color={theme.colors.textOnPrimary}
            />
          </LinearGradient>
        </TouchableOpacity>
      </ThemeBottomSheet>
    </View>
  );
};

export default CreateTicketScreen;
