import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from "react-native";
import { useTheme } from "../../../hooks/useTheme";
import { useAlert } from "../../../context/AlertContext";
import Card from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import ThemeDropdown from "../../../components/ui/ThemeDropdown";

const InviteScreen = () => {
  const { showAlert } = useAlert();
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState<"organization" | "user">(
    "organization",
  );
  const [loading, setLoading] = useState(false);

  // Organization Form States
  const [orgForm, setOrgForm] = useState({
    type: "service_provider",
    name: "",
    referrerOrg: "",
    email: "",
    firstName: "",
    middleName: "",
    lastName: "",
  });

  // User Form States
  const [userForm, setUserForm] = useState({
    orgType: "service_provider",
    organization: "",
    isAdmin: false,
    email: "",
    firstName: "",
    middleName: "",
    lastName: "",
  });

  const orgTypes = [
    { value: "admin", label: "Admin" },
    { value: "service_provider", label: "Service Provider" },
    { value: "referral_partner", label: "Referral Partner" },
    { value: "client", label: "Client" },
  ];

  const handleOrgInvite = () => {
    const { email, firstName, lastName, name, type, referrerOrg } = orgForm;
    if (
      !email ||
      !firstName ||
      !lastName ||
      !name ||
      (type === "client" && !referrerOrg)
    ) {
      showAlert("Error", "Please fill in all required fields");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showAlert("Success", "Organization invitation sent successfully!");
      setOrgForm({
        type: "service_provider",
        name: "",
        referrerOrg: "",
        email: "",
        firstName: "",
        middleName: "",
        lastName: "",
      });
    }, 1500);
  };

  const handleUserInvite = () => {
    const { email, firstName, lastName, organization } = userForm;
    if (!email || !firstName || !lastName || !organization) {
      showAlert("Error", "Please fill in all required fields");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showAlert("Success", "User invitation sent successfully!");
      setUserForm({
        orgType: "service_provider",
        organization: "",
        isAdmin: false,
        email: "",
        firstName: "",
        middleName: "",
        lastName: "",
      });
    }, 1500);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      padding: 16,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.colors.text,
    },
    subtitle: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginTop: 4,
    },
    tabs: {
      flexDirection: "row",
      backgroundColor: theme.effects.glassBackground,
      margin: 16,
      borderRadius: 12,
      padding: 4,
    },
    tab: {
      flex: 1,
      paddingVertical: 10,
      alignItems: "center",
      borderRadius: 8,
    },
    activeTab: {
      backgroundColor: theme.colors.primary,
    },
    tabText: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.textSecondary,
    },
    activeTabText: {
      color: theme.colors.textOnPrimary,
    },
    form: {
      padding: 16,
    },
    label: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 8,
      marginTop: 16,
    },
    pickerContainer: {
      backgroundColor: theme.effects.glassBackground,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.effects.cardBorder,
      overflow: "hidden",
    },
    row: {
      flexDirection: "row",
      gap: 12,
    },
    flex1: {
      flex: 1,
    },
    switchContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 16,
      paddingHorizontal: 4,
    },
    switchLabel: {
      fontSize: 16,
      color: theme.colors.text,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Invite</Text>
        <Text style={styles.subtitle}>
          Send invitations to new organizations and users
        </Text>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "organization" && styles.activeTab]}
          onPress={() => setActiveTab("organization")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "organization" && styles.activeTabText,
            ]}
          >
            Organization
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "user" && styles.activeTab]}
          onPress={() => setActiveTab("user")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "user" && styles.activeTabText,
            ]}
          >
            User
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.form}>
        {activeTab === "organization" ? (
          <Card>
            <ThemeDropdown
              label="Organization Type *"
              options={orgTypes}
              selectedValue={orgForm.type}
              onValueChange={(val) => setOrgForm({ ...orgForm, type: val })}
            />

            <Input
              label="Organization Name *"
              value={orgForm.name}
              onChangeText={(val) => setOrgForm({ ...orgForm, name: val })}
              placeholder="Enter organization name"
            />

            {orgForm.type === "client" && (
              <Input
                label="Referrer Org *"
                value={orgForm.referrerOrg}
                onChangeText={(val) =>
                  setOrgForm({ ...orgForm, referrerOrg: val })
                }
                placeholder="Enter referrer organization"
              />
            )}

            <Input
              label="Email Address *"
              value={orgForm.email}
              onChangeText={(val) => setOrgForm({ ...orgForm, email: val })}
              placeholder="organization@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <View style={styles.row}>
              <View style={styles.flex1}>
                <Input
                  label="First Name *"
                  value={orgForm.firstName}
                  onChangeText={(val) =>
                    setOrgForm({ ...orgForm, firstName: val })
                  }
                  placeholder="First Name"
                />
              </View>
              <View style={styles.flex1}>
                <Input
                  label="Last Name *"
                  value={orgForm.lastName}
                  onChangeText={(val) =>
                    setOrgForm({ ...orgForm, lastName: val })
                  }
                  placeholder="Last Name"
                />
              </View>
            </View>

            <Button
              title="Invite Organization"
              onPress={handleOrgInvite}
              loading={loading}
              style={{ marginTop: 24 }}
            />
          </Card>
        ) : (
          <Card>
            <ThemeDropdown
              label="Organization Type *"
              options={orgTypes}
              selectedValue={userForm.orgType}
              onValueChange={(val) =>
                setUserForm({ ...userForm, orgType: val })
              }
            />

            <Input
              label="Organization *"
              value={userForm.organization}
              onChangeText={(val) =>
                setUserForm({ ...userForm, organization: val })
              }
              placeholder="Select or enter organization"
            />

            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>Is Admin</Text>
              <Switch
                value={userForm.isAdmin}
                onValueChange={(val) =>
                  setUserForm({ ...userForm, isAdmin: val })
                }
                trackColor={{
                  false: theme.colors.textSecondary + "40",
                  true: theme.colors.primary,
                }}
                thumbColor={theme.colors.surface}
              />
            </View>

            <Input
              label="Email Address *"
              value={userForm.email}
              onChangeText={(val) => setUserForm({ ...userForm, email: val })}
              placeholder="user@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <View style={styles.row}>
              <View style={styles.flex1}>
                <Input
                  label="First Name *"
                  value={userForm.firstName}
                  onChangeText={(val) =>
                    setUserForm({ ...userForm, firstName: val })
                  }
                  placeholder="First Name"
                />
              </View>
              <View style={styles.flex1}>
                <Input
                  label="Last Name *"
                  value={userForm.lastName}
                  onChangeText={(val) =>
                    setUserForm({ ...userForm, lastName: val })
                  }
                  placeholder="Last Name"
                />
              </View>
            </View>

            <Button
              title="Invite User"
              onPress={handleUserInvite}
              loading={loading}
              style={{ marginTop: 24 }}
            />
          </Card>
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

export default InviteScreen;
