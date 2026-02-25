import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Linking,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../hooks/useTheme";
import Header from "../../components/Header";
import Icon from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";

const ContactSupportScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!subject || !message) return;
    // Handle send logic
    navigation.goBack();
  };

  const handleCall = () => {
    Linking.openURL("tel:+1234567890");
  };

  const handleEmail = () => {
    Linking.openURL("mailto:support@wealthcret.com");
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      padding: 24,
    },
    contactCards: {
      flexDirection: "row",
      gap: 12,
      marginBottom: 32,
    },
    contactCard: {
      flex: 1,
      backgroundColor: theme.colors.card,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.effects.cardBorder,
      padding: 16,
      alignItems: "center",
      gap: 8,
    },
    cardLabel: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.text,
    },
    cardValue: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
    formLabel: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: 12,
    },
    input: {
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.effects.cardBorder,
      padding: 16,
      color: theme.colors.text,
      marginBottom: 16,
    },
    textArea: {
      minHeight: 120,
      textAlignVertical: "top",
    },
    sendButton: {
      height: 56,
      borderRadius: 16,
      overflow: "hidden",
      marginTop: 16,
    },
    gradient: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    sendText: {
      color: "#FFF",
      fontSize: 16,
      fontWeight: "bold",
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Contact Support" showBack />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.contactCards}>
            <TouchableOpacity style={styles.contactCard} onPress={handleCall}>
              <Icon
                name="call-outline"
                size={24}
                color={theme.colors.primary}
              />
              <Text style={styles.cardLabel}>Call Us</Text>
              <Text style={styles.cardValue}>+1 (234) 567-890</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactCard} onPress={handleEmail}>
              <Icon
                name="mail-outline"
                size={24}
                color={theme.colors.secondary}
              />
              <Text style={styles.cardLabel}>Email Us</Text>
              <Text style={styles.cardValue}>support@wealth.com</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.formLabel}>Send us a message</Text>

          <TextInput
            style={styles.input}
            placeholder="Subject"
            placeholderTextColor={theme.colors.textSecondary}
            value={subject}
            onChangeText={setSubject}
          />

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="How can we help you today?"
            placeholderTextColor={theme.colors.textSecondary}
            multiline
            numberOfLines={5}
            value={message}
            onChangeText={setMessage}
          />

          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <LinearGradient
              colors={[theme.colors.primary, theme.colors.primary + "80"]}
              style={styles.gradient}
            >
              <Text style={styles.sendText}>Send Message</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ContactSupportScreen;
