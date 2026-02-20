import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../hooks/useTheme";
import Header from "../../components/Header";

const TermsAndConditionsScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      padding: 24,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: 12,
    },
    paragraph: {
      fontSize: 15,
      color: theme.colors.textSecondary,
      lineHeight: 22,
      marginBottom: 12,
    },
    lastUpdated: {
      fontSize: 13,
      color: theme.colors.textSecondary,
      marginBottom: 32,
      fontStyle: "italic",
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Terms & Conditions" showBack />
      <ScrollView style={styles.content}>
        <Text style={styles.lastUpdated}>Last Updated: January 15, 2024</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Agreement to Terms</Text>
          <Text style={styles.paragraph}>
            By accessing or using our services, you agree to be bound by these
            Terms and Conditions. If you do not agree to these terms, do not use
            our services.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Use of Services</Text>
          <Text style={styles.paragraph}>
            You may use our services only for lawful purposes and in accordance
            with these Terms. You agree not to use our services in any way that
            violates any applicable federal, state, local, or international law
            or regulation.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Intellectual Property</Text>
          <Text style={styles.paragraph}>
            The services and their entire contents, features, and functionality
            (including but not limited to all information, software, text,
            displays, images, video, and audio) are owned by Wealthcret and are
            protected by international copyright, trademark, and other
            intellectual property laws.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Limitation of Liability</Text>
          <Text style={styles.paragraph}>
            In no event will Wealthcret, its affiliates, or their licensors,
            service providers, employees, agents, officers, or directors be
            liable for damages of any kind under any legal theory.
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default TermsAndConditionsScreen;
