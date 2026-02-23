import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useSelector } from "react-redux";
import { useTheme } from "../../../hooks/useTheme";
import { useAlert } from "../../../context/AlertContext";
import { RootState } from "../../../store";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import ThemeDropdown from "../../../components/ui/ThemeDropdown";
import { Payout } from "../../../types";
import Icon1 from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { PayoutStackParamList } from "../../../navigation/NavigationParams";

type NavigationProp = StackNavigationProp<PayoutStackParamList, "Payout">;

const mockPayouts: Payout[] = [
  {
    id: "1",
    partnerId: "p1",
    partnerName: "Elite Financial Services",
    amount: 2500.0,
    status: "pending",
    requestDate: "2023-11-15",
    payoutDate: "2023-11-25",
  },
  {
    id: "2",
    partnerId: "p2",
    partnerName: "Sunset Advisory",
    amount: 3200.5,
    status: "completed",
    requestDate: "2023-10-10",
    payoutDate: "2023-10-20",
  },
  {
    id: "3",
    partnerId: "p3",
    partnerName: "Capital Partners",
    amount: 1500.0,
    status: "processing",
    requestDate: "2023-11-18",
    payoutDate: "2023-11-30",
  },
];

const PayoutScreen = () => {
  const { showAlert } = useAlert();
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const user = useSelector((state: RootState) => state.auth.user);
  const [loading, setLoading] = useState(true);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);

  // New Payout Form State
  const [newPayout, setNewPayout] = useState({
    name: "",
    month: "",
    year: "",
    commissionType: "manual",
    serviceProviderId: "",
  });

  const months = [
    { label: "January", value: "01" },
    { label: "February", value: "02" },
    { label: "March", value: "03" },
    { label: "April", value: "04" },
    { label: "May", value: "05" },
    { label: "June", value: "06" },
    { label: "July", value: "07" },
    { label: "August", value: "08" },
    { label: "September", value: "09" },
    { label: "October", value: "10" },
    { label: "November", value: "11" },
    { label: "December", value: "12" },
  ];

  const years = [
    { label: "2024", value: "2024" },
    { label: "2025", value: "2025" },
    { label: "2026", value: "2026" },
  ];

  const commissionTypes = [
    { label: "Manual Entry", value: "manual" },
    { label: "File Upload", value: "file" },
  ];

  const referralPartners = [
    { id: "p1", name: "Elite Financial Services" },
    { id: "p2", name: "Global Wealth Partners" },
    { id: "p3", name: "Alpha Advisors" },
    { id: "p4", name: "Premium Wealth" },
  ];

  useEffect(() => {
    // Mock loading payout data with role filtering
    setTimeout(() => {
      let filteredPayouts = mockPayouts;
      if (
        user?.role === "service_provider" ||
        user?.role === "referral_partner"
      ) {
        filteredPayouts = mockPayouts.filter(
          (p) => p.partnerName === user.name,
        );
      }
      // For demo purposes, if filtered results are empty, show all but with a note
      setPayouts(filteredPayouts.length > 0 ? filteredPayouts : mockPayouts);
      setLoading(false);
    }, 500);
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return theme.colors.success;
      case "pending":
        return theme.colors.warning;
      case "processing":
        return theme.colors.info;
      case "failed":
        return theme.colors.error;
      default:
        return theme.colors.textSecondary;
    }
  };

  const handleCreatePayout = () => {
    if (
      !newPayout.name ||
      !newPayout.month ||
      !newPayout.year ||
      !newPayout.serviceProviderId
    ) {
      showAlert("Required Fields", "Please fill in all fields.");
      return;
    }

    const partner = referralPartners.find(
      (p) => p.id === newPayout.serviceProviderId,
    );
    if (!partner) return;

    const payout: Payout = {
      id: Math.random().toString(36).substr(2, 9),
      partnerId: partner.id,
      partnerName: partner.name,
      amount: 0,
      status: "pending",
      requestDate: new Date().toISOString().split("T")[0],
      payoutDate: `${newPayout.year}-${newPayout.month}-25`,
    };

    setPayouts([payout, ...payouts]);
    setIsAddModalVisible(false);
    setNewPayout({
      name: "",
      month: "",
      year: "",
      commissionType: "manual",
      serviceProviderId: "",
    });

    // Navigate to edit screen immediately to add services
    navigation.navigate("PayoutEdit", { payoutId: payout.id });
  };

  const renderPayoutItem = ({ item }: { item: Payout }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => navigation.navigate("PayoutEdit", { payoutId: item.id })}
    >
      <Card style={styles.payoutCard}>
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 4,
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: theme.colors.primary + "15",
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 12,
                }}
              >
                <Icon1
                  name="business-outline"
                  size={20}
                  color={theme.colors.primary}
                />
              </View>
              <View>
                <Text style={styles.partnerName}>{item.partnerName}</Text>
                <Text style={styles.dateText}>
                  Requested: {item.requestDate}
                </Text>
              </View>
            </View>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.amountText}>
              ${item.amount.toLocaleString()}
            </Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(item.status) + "20" },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  { color: getStatusColor(item.status) },
                ]}
              >
                {item.status}
              </Text>
            </View>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

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
      marginBottom: 8,
    },
    payoutCard: {
      marginBottom: 12,
      marginHorizontal: 16,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    partnerName: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.colors.text,
    },
    dateText: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginTop: 4,
    },
    amountText: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.colors.primary,
      marginBottom: 4,
    },
    statusBadge: {
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 10,
    },
    statusText: {
      fontSize: 10,
      fontWeight: "bold",
      textTransform: "uppercase",
    },
    addButton: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 12,
    },
    addButtonText: {
      color: theme.colors.textOnPrimary,
      fontWeight: "600",
      fontSize: 14,
    },
    subtitle: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 8,
    },
    headerButtons: { flexDirection: "row", gap: 12 },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "flex-end",
    },
    modalContent: {
      backgroundColor: theme.colors.surface,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      maxHeight: "90%",
      padding: 24,
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
    modalButtons: {
      flexDirection: "row",
      gap: 12,
      marginTop: 24,
      marginBottom: 8,
    },
  });

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.row, { marginBottom: 8 }]}>
          <Text style={styles.title}>Payout Management</Text>
          {user?.role === "admin" && (
            <View style={styles.headerButtons}>
              <TouchableOpacity onPress={() => setIsAddModalVisible(true)}>
                <Icon1
                  name="add-circle"
                  size={32}
                  color={theme.colors.primary}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
        <Text style={styles.subtitle}>
          Manage commission payouts and processing
        </Text>
      </View>
      <FlatList
        data={payouts}
        renderItem={renderPayoutItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {/* Add Payout Modal */}
      <Modal
        visible={isAddModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsAddModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Payout</Text>
              <TouchableOpacity onPress={() => setIsAddModalVisible(false)}>
                <Icon1 name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Input
                label="Payout Name"
                placeholder="e.g. Monthly Commission"
                value={newPayout.name}
                onChangeText={(text) =>
                  setNewPayout({ ...newPayout, name: text })
                }
              />

              <View style={{ flexDirection: "row", gap: 12 }}>
                <View style={{ flex: 1 }}>
                  <ThemeDropdown
                    label="Month"
                    options={months}
                    selectedValue={newPayout.month}
                    onValueChange={(val) =>
                      setNewPayout({ ...newPayout, month: val })
                    }
                    placeholder="Month"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <ThemeDropdown
                    label="Year"
                    options={years}
                    selectedValue={newPayout.year}
                    onValueChange={(val) =>
                      setNewPayout({ ...newPayout, year: val })
                    }
                    placeholder="Year"
                  />
                </View>
              </View>

              <ThemeDropdown
                label="Commission Type"
                options={commissionTypes}
                selectedValue={newPayout.commissionType}
                onValueChange={(val) =>
                  setNewPayout({ ...newPayout, commissionType: val })
                }
              />

              <ThemeDropdown
                label="Service Provider"
                options={referralPartners.map((p) => ({
                  label: p.name,
                  value: p.id,
                }))}
                selectedValue={newPayout.serviceProviderId}
                onValueChange={(val) =>
                  setNewPayout({ ...newPayout, serviceProviderId: val })
                }
                placeholder="Select Provider"
              />
            </ScrollView>

            <View style={styles.modalButtons}>
              <Button
                title="Cancel"
                variant="outline"
                onPress={() => setIsAddModalVisible(false)}
                style={{ flex: 1 }}
              />
              <Button
                title="Create"
                onPress={handleCreatePayout}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default PayoutScreen;
