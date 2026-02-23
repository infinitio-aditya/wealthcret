import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from "react-native";
import { useTheme } from "../../../hooks/useTheme";
import { useAlert } from "../../../context/AlertContext";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Icon from "react-native-vector-icons/Ionicons";
import Modal from "react-native-modal";
import LinearGradient from "react-native-linear-gradient";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface Role {
  id: string;
  name: string;
  key: string;
  description: string;
  membersCount: number;
  color: string;
}

const MemberRolesScreen = () => {
  const { showAlert } = useAlert();
  const theme = useTheme();
  const [roles, setRoles] = useState<Role[]>([
    {
      id: "1",
      name: "Administrator",
      key: "ADMINISTRATOR",
      description: "Full system access and control",
      membersCount: 3,
      color: "#ef4444",
    },
    {
      id: "2",
      name: "Service Provider",
      key: "SERVICE_PROVIDER",
      description: "Manage clients and services",
      membersCount: 12,
      color: "#3b82f6",
    },
    {
      id: "3",
      name: "Referral Partner",
      key: "REFERRAL_PARTNER",
      description: "Limited access for partners",
      membersCount: 8,
      color: "#8b5cf6",
    },
    {
      id: "4",
      name: "Support Staff",
      key: "SUPPORT_STAFF",
      description: "Customer support team",
      membersCount: 5,
      color: "#f59e0b",
    },
  ]);

  const [isModalVisible, setModalVisible] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    key: "",
    description: "",
    color: theme.colors.primary,
  });

  const generateKey = (name: string) => {
    return name
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");
  };

  const handleOpenModal = (role?: Role) => {
    if (role) {
      setEditingRole(role);
      setFormData({
        name: role.name,
        key: role.key,
        description: role.description,
        color: role.color,
      });
    } else {
      setEditingRole(null);
      setFormData({
        name: "",
        key: "",
        description: "",
        color: theme.colors.primary,
      });
    }
    setModalVisible(true);
  };

  const handleSaveRole = () => {
    if (!formData.name || !formData.description) {
      showAlert(
        "Permissions Updated",
        `${formData.name} permissions have been successfully updated.`, // Assuming formData.name is the roleName
        [{ text: "OK" }],
      );
      return;
    }

    if (editingRole) {
      setRoles(
        roles.map((r) =>
          r.id === editingRole.id ? { ...editingRole, ...formData } : r,
        ),
      );
    } else {
      const newRole: Role = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        membersCount: 0,
      };
      setRoles([...roles, newRole]);
    }
    setModalVisible(false);
  };

  const handleDeleteRole = (id: string) => {
    showAlert(
      "Delete Role",
      "Are you sure you want to delete this role? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => setRoles(roles.filter((r) => r.id !== id)),
        },
      ],
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      padding: 20,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.colors.text,
    },
    subtitle: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    statsRow: {
      flexDirection: "row",
      paddingHorizontal: 16,
      gap: 12,
      marginBottom: 20,
    },
    statCard: {
      flex: 1,
      padding: 16,
    },
    statValue: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
    statIconContainer: {
      position: "absolute",
      right: 12,
      top: 12,
      padding: 8,
      borderRadius: 10,
    },
    content: {
      padding: 16,
    },
    roleCard: {
      marginBottom: 16,
      padding: 16,
    },
    roleHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 12,
    },
    roleInfo: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    iconBox: {
      width: 48,
      height: 48,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
    },
    roleName: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.colors.text,
    },
    memberCount: {
      fontSize: 13,
      color: theme.colors.textSecondary,
    },
    actions: {
      flexDirection: "row",
      gap: 8,
    },
    actionButton: {
      padding: 8,
      borderRadius: 8,
    },
    roleDescription: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      lineHeight: 20,
    },
    modal: {
      margin: 0,
      justifyContent: "flex-end",
    },
    modalContent: {
      backgroundColor: theme.colors.surface,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: 24,
      // paddingBottom: 40,
      maxHeight: SCREEN_HEIGHT * 0.8,
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 24,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.colors.text,
    },
    form: {
      gap: 16,
    },
    formGroup: {
      gap: 8,
    },
    label: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.text,
    },
    readOnlyInput: {
      // backgroundColor: theme.colors.text,
      opacity: 0.7,
    },
    colorPicker: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
      marginTop: 8,
    },
    colorOption: {
      width: 40,
      height: 40,
      borderRadius: 20,
      borderWidth: 2,
      borderColor: "transparent",
    },
    colorOptionSelected: {
      borderColor: theme.colors.text,
    },
    saveButton: {
      marginTop: 24,
    },
    headerButtons: { flexDirection: "row", gap: 12 },
  });

  const presetColors = [
    "#ef4444",
    "#3b82f6",
    "#8b5cf6",
    "#f59e0b",
    "#10b981",
    "#06b6d4",
    "#ec4899",
    "#6366f1",
  ];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Member Roles</Text>
            <Text style={styles.subtitle}>Define and manage user roles</Text>
          </View>
          {/* <TouchableOpacity onPress={() => handleOpenModal()}>
                        <LinearGradient
                            colors={theme.effects.buttonGradient as string[]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={{ padding: 10, borderRadius: 12 }}
                        >
                            <Icon name="add" size={24} color={theme.colors.textOnPrimary} />
                        </LinearGradient>
                    </TouchableOpacity> */}
          <View style={styles.headerButtons}>
            <TouchableOpacity onPress={() => handleOpenModal()}>
              <Icon name="add-circle" size={32} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <View
              style={[
                styles.statIconContainer,
                { backgroundColor: theme.colors.primary + "20" },
              ]}
            >
              <Icon
                name="shield-outline"
                size={20}
                color={theme.colors.primary}
              />
            </View>
            <Text style={styles.statValue}>{roles.length}</Text>
            <Text style={styles.statLabel}>Total Roles</Text>
          </Card>
          <Card style={styles.statCard}>
            <View
              style={[
                styles.statIconContainer,
                { backgroundColor: theme.colors.secondary + "20" },
              ]}
            >
              <Icon
                name="people-outline"
                size={20}
                color={theme.colors.secondary}
              />
            </View>
            <Text style={styles.statValue}>
              {roles.reduce((sum, role) => sum + role.membersCount, 0)}
            </Text>
            <Text style={styles.statLabel}>Total Members</Text>
          </Card>
        </View>

        <View style={styles.content}>
          {roles.map((role) => (
            <Card key={role.id} style={styles.roleCard}>
              <View style={styles.roleHeader}>
                <View style={styles.roleInfo}>
                  <View
                    style={[
                      styles.iconBox,
                      { backgroundColor: role.color + "20" },
                    ]}
                  >
                    <Icon name="shield" size={24} color={role.color} />
                  </View>
                  <View>
                    <Text style={styles.roleName}>{role.name}</Text>
                    <Text style={styles.memberCount}>
                      {role.membersCount} members
                    </Text>
                  </View>
                </View>
                <View style={styles.actions}>
                  <TouchableOpacity
                    style={[
                      styles.actionButton,
                      { backgroundColor: theme.colors.primary + "15" },
                    ]}
                    onPress={() => handleOpenModal(role)}
                  >
                    <Icon
                      name="create-outline"
                      size={18}
                      color={theme.colors.primary}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.actionButton,
                      { backgroundColor: theme.colors.error + "15" },
                    ]}
                    onPress={() => handleDeleteRole(role.id)}
                  >
                    <Icon
                      name="trash-outline"
                      size={18}
                      color={theme.colors.error}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={styles.roleDescription}>{role.description}</Text>
            </Card>
          ))}
        </View>
      </ScrollView>

      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setModalVisible(false)}
        onBackButtonPress={() => setModalVisible(false)}
        swipeDirection={["down"]}
        onSwipeComplete={() => setModalVisible(false)}
        style={styles.modal}
        backdropOpacity={0.5}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {editingRole ? "Edit Role" : "Create Role"}
            </Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Icon name="close" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Role Name</Text>
              <Input
                placeholder="e.g. Service Provider"
                value={formData.name}
                onChangeText={(text) =>
                  setFormData({
                    ...formData,
                    name: text,
                    key: generateKey(text),
                  })
                }
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Role Key (Auto-generated)</Text>
              <Input
                value={formData.key}
                editable={false}
                style={[styles.readOnlyInput, { color: theme.colors.text }]}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Description</Text>
              <Input
                placeholder="Role description..."
                value={formData.description}
                onChangeText={(text) =>
                  setFormData({ ...formData, description: text })
                }
                multiline
                numberOfLines={3}
                style={[
                  styles.readOnlyInput,
                  {
                    height: 80,
                    textAlignVertical: "top",
                    color: theme.colors.text,
                  },
                ]}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Role Color</Text>
              <View style={styles.colorPicker}>
                {presetColors.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorOption,
                      { backgroundColor: color },
                      formData.color === color && styles.colorOptionSelected,
                    ]}
                    onPress={() => setFormData({ ...formData, color })}
                  />
                ))}
              </View>
            </View>

            <Button
              title={editingRole ? "Update Role" : "Create Role"}
              onPress={handleSaveRole}
              style={styles.saveButton}
            />
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

export default MemberRolesScreen;
