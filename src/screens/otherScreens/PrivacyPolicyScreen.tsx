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

const PrivacyPolicyScreen = () => {
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
      <Header title="Privacy Policy" showBack />
      <ScrollView style={styles.content}>
        <Text style={styles.lastUpdated}>Last Updated: January 15, 2024</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Information We Collect</Text>
          <Text style={styles.paragraph}>
            We collect information you provide directly to us, such as when you
            create or modify your account, request on-demand services, contact
            customer support, or otherwise communicate with us.
          </Text>
          <Text style={styles.paragraph}>
            This information may include: name, email, phone number, postal
            address, profile picture, payment method, financial information, and
            other information you choose to provide.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. How We Use Information</Text>
          <Text style={styles.paragraph}>
            We use the information we collect to provide, maintain, and improve
            our services, such as to facilitate payments, send receipts, provide
            products and services you request, and develop new features.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Sharing of Information</Text>
          <Text style={styles.paragraph}>
            We may share the information we collect about you as described in
            this statement or as described at the time of collection or sharing,
            including sharing with vendors, consultants, and other service
            providers.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Data Security</Text>
          <Text style={styles.paragraph}>
            We use commercially reasonable physical, managerial, and technical
            safeguards to preserve the integrity and security of your personal
            information.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Contact Us</Text>
          <Text style={styles.paragraph}>
            If you have any questions about this Privacy Policy, please contact
            us at privacy@wealthcret.com.
          </Text>
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default PrivacyPolicyScreen;
