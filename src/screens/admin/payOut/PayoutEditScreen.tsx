import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  FlatList,
  SafeAreaView,
} from "react-native";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { useTheme } from "../../../hooks/useTheme";
import Icon from "react-native-vector-icons/Ionicons";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import ThemeDropdown from "../../../components/ui/ThemeDropdown";
import Input from "../../../components/ui/Input";
import { Payout } from "../../../types";
import { StackNavigationProp } from "@react-navigation/stack";
import { PayoutStackParamList } from "../../../navigation/NavigationParams";

type RouteParams = {
  PayoutEdit: {
    payoutId: string;
  };
};

type NavigationProp = StackNavigationProp<PayoutStackParamList, "PayoutEdit">;

interface Service {
  id: string;
  name: string;
  revenue: number;
  commission: number;
  partnerId: string;
  partnerName: string;
}

const PayoutEditScreen = () => {
  const theme = useTheme();
  const route = useRoute<RouteProp<RouteParams, "PayoutEdit">>();
  const navigation = useNavigation<NavigationProp>();

  // State
  const [payout, setPayout] = useState<Payout | null>(null);
  const [loading, setLoading] = useState(true);
  const [showServiceSelector, setShowServiceSelector] = useState(false);
  const [showEditServiceModal, setShowEditServiceModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Services State
  const [selectedServices, setSelectedServices] = useState<Service[]>([
    {
      id: "1",
      name: "Wealth Management",
      revenue: 25000,
      commission: 5000,
      partnerId: "p1",
      partnerName: "Elite Financial Services",
    },
    {
      id: "2",
      name: "Investment Advisory",
      revenue: 15000,
      commission: 3500,
      partnerId: "p1",
      partnerName: "Elite Financial Services",
    },
  ]);

  const availableServices = [
    { id: "s1", name: "Wealth Management" },
    { id: "s2", name: "Investment Advisory" },
    { id: "s3", name: "Portfolio Management" },
    { id: "s4", name: "Financial Planning" },
    { id: "s5", name: "Tax Consulting" },
    { id: "s6", name: "Estate Planning" },
    { id: "s7", name: "Risk Assessment" },
    { id: "s8", name: "Retirement Planning" },
  ];

  const referralPartners = [
    { id: "p1", name: "Elite Financial Services" },
    { id: "p2", name: "Global Wealth Partners" },
    { id: "p3", name: "Alpha Advisors" },
    { id: "p4", name: "Premium Wealth" },
  ];

  const [newServiceSelection, setNewServiceSelection] = useState({
    serviceId: "",
    partnerId: "",
  });

  useEffect(() => {
    // Mock loading payout data
    // In real app, fetch from API
    setTimeout(() => {
      setPayout({
        id: route.params?.payoutId || "1",
        partnerId: "p1",
        partnerName: "Elite Financial Services",
        amount: 2500.0,
        status: "pending",
        requestDate: "2023-11-15",
        payoutDate: "2023-11-25",
      });
      setLoading(false);
    }, 500);
  }, [route.params?.payoutId]);

  const handleAddServices = () => {
    if (!newServiceSelection.serviceId || !newServiceSelection.partnerId) {
      Alert.alert(
        "Selection Required",
        "Please select both a service and a partner.",
      );
      return;
    }

    const serviceInfo = availableServices.find(
      (s) => s.id === newServiceSelection.serviceId,
    );
    const partnerInfo = referralPartners.find(
      (p) => p.id === newServiceSelection.partnerId,
    );

    if (serviceInfo && partnerInfo) {
      const newService: Service = {
        id: Math.random().toString(36).substr(2, 9),
        name: serviceInfo.name,
        revenue: 0,
        commission: 0,
        partnerId: partnerInfo.id,
        partnerName: partnerInfo.name,
      };
      setSelectedServices([...selectedServices, newService]);
      setNewServiceSelection({ serviceId: "", partnerId: "" });
      setShowServiceSelector(false);
    }
  };

  const handleEditService = (service: Service) => {
    setEditingService({ ...service });
    setShowEditServiceModal(true);
  };

  const handleSaveService = () => {
    if (editingService) {
      setSelectedServices(
        selectedServices.map((s) =>
          s.id === editingService.id ? editingService : s,
        ),
      );
      setShowEditServiceModal(false);
      setEditingService(null);
    }
  };

  const handleRemoveService = (serviceId: string) => {
    Alert.alert(
      "Remove Service",
      "Are you sure you want to remove this service?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () =>
            setSelectedServices(
              selectedServices.filter((s) => s.id !== serviceId),
            ),
        },
      ],
    );
  };

  const totalAmount = selectedServices.reduce(
    (sum, service) => sum + service.commission,
    0,
  );

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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.effects.cardBorder,
    },
    backButton: {
      marginRight: 16,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.colors.text,
    },
    content: {
      padding: 16,
    },
    section: {
      marginBottom: 24,
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.colors.text,
    },
    infoRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.effects.cardBorder,
    },
    infoLabel: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    infoValue: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.text,
    },
    statusBadge: {
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 6,
    },
    statusText: {
      fontSize: 12,
      fontWeight: "bold",
      textTransform: "uppercase",
    },
    serviceItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: theme.colors.surface,
      padding: 16,
      borderRadius: 12,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: theme.effects.cardBorder,
    },
    serviceName: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: 4,
    },
    serviceAmount: {
      fontSize: 14,
      color: theme.colors.primary,
      fontWeight: "600",
    },
    totalCard: {
      marginTop: 12,
      backgroundColor: theme.colors.primary + "10",
      borderColor: theme.colors.primary,
      borderWidth: 1,
      padding: 16,
      borderRadius: 12,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    totalLabel: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.colors.text,
    },
    totalValue: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.colors.primary,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "flex-end",
    },
    modalContent: {
      backgroundColor: theme.colors.surface,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      height: "80%",
      padding: 20,
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.colors.text,
    },
    serviceOption: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      borderRadius: 12,
      marginBottom: 12,
      borderWidth: 1,
    },
    checkbox: {
      width: 24,
      height: 24,
      borderRadius: 6,
      borderWidth: 2,
      marginRight: 12,
      justifyContent: "center",
      alignItems: "center",
    },
    addServicesButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 12,
      paddingVertical: 6,
      backgroundColor: theme.colors.primary + "20",
      borderRadius: 8,
    },
    addServicesText: {
      color: theme.colors.primary,
      fontWeight: "600",
      fontSize: 14,
      marginLeft: 4,
    },
    modalButtons: {
      flexDirection: "row",
      gap: 12,
      marginTop: 32,
      marginBottom: 16,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Payout</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Payout Details */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { marginBottom: 12 }]}>
            Payout Information
          </Text>
          <Card>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Payout Name</Text>
              <Text style={styles.infoValue}>Wealthcret Commission</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Service Provider</Text>
              <Text style={styles.infoValue}>
                {payout?.partnerName || "..."}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Commission Period</Text>
              <Text style={styles.infoValue}>February, 2025</Text>
            </View>
            <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.infoLabel}>Current Status</Text>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor:
                      getStatusColor(payout?.status || "") + "20",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    { color: getStatusColor(payout?.status || "") },
                  ]}
                >
                  {payout?.status || "Loading..."}
                </Text>
              </View>
            </View>
          </Card>

          <View style={{ marginTop: 16 }}>
            <Button
              title="Calculate Payout"
              onPress={() =>
                Alert.alert("Calculate", "Running calculation logic...")
              }
              variant="primary"
              // icon="calculator-outline"
            />
          </View>
        </View>

        {/* Services Section */}
        <View style={[styles.section, { marginBottom: 40 }]}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Services</Text>
              <Text style={{ fontSize: 12, color: theme.colors.textSecondary }}>
                Manage services included
              </Text>
            </View>
            <TouchableOpacity
              style={styles.addServicesButton}
              onPress={() => setShowServiceSelector(true)}
            >
              <Icon name="add" size={16} color={theme.colors.primary} />
              <Text style={styles.addServicesText}>Add</Text>
            </TouchableOpacity>
          </View>

          {selectedServices.length > 0 ? (
            <View>
              {selectedServices.map((service) => (
                <TouchableOpacity
                  key={service.id}
                  style={styles.serviceItem}
                  onPress={() => handleEditService(service)}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.serviceName}>{service.name}</Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: theme.colors.textSecondary,
                        marginBottom: 4,
                      }}
                    >
                      Partner: {service.partnerName}
                    </Text>
                    <View style={{ flexDirection: "row", gap: 12 }}>
                      <Text
                        style={{
                          fontSize: 13,
                          color: theme.colors.textSecondary,
                        }}
                      >
                        Rev:{" "}
                        <Text
                          style={{
                            color: theme.colors.text,
                            fontWeight: "600",
                          }}
                        >
                          ${service.revenue.toLocaleString()}
                        </Text>
                      </Text>
                      <Text
                        style={{
                          fontSize: 13,
                          color: theme.colors.textSecondary,
                        }}
                      >
                        Comm:{" "}
                        <Text
                          style={{
                            color: theme.colors.primary,
                            fontWeight: "600",
                          }}
                        >
                          ${service.commission.toLocaleString()}
                        </Text>
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleRemoveService(service.id)}
                    style={{
                      padding: 8,
                      backgroundColor: theme.colors.error + "10",
                      borderRadius: 8,
                    }}
                  >
                    <Icon
                      name="trash-outline"
                      size={20}
                      color={theme.colors.error}
                    />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}

              <View style={styles.totalCard}>
                <Text style={styles.totalLabel}>Total Commission</Text>
                <Text style={styles.totalValue}>
                  ${totalAmount.toLocaleString()}
                </Text>
              </View>
            </View>
          ) : (
            <Card style={{ alignItems: "center", padding: 24 }}>
              <Text
                style={{ color: theme.colors.textSecondary, marginBottom: 12 }}
              >
                No services added yet
              </Text>
              <Button
                title="Add Services"
                onPress={() => setShowServiceSelector(true)}
                variant="outline"
              />
            </Card>
          )}
        </View>
      </ScrollView>

      {/* Service Selector Modal */}
      <Modal
        visible={showServiceSelector}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowServiceSelector(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Service</Text>
              <TouchableOpacity onPress={() => setShowServiceSelector(false)}>
                <Icon name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <ThemeDropdown
                label="Select Service"
                placeholder="Choose a service"
                options={availableServices.map((s) => ({
                  label: s.name,
                  value: s.id,
                }))}
                selectedValue={newServiceSelection.serviceId}
                onValueChange={(val: string) =>
                  setNewServiceSelection({
                    ...newServiceSelection,
                    serviceId: val,
                  })
                }
              />

              <ThemeDropdown
                label="Select Partner"
                placeholder="Choose a partner"
                options={referralPartners.map((p) => ({
                  label: p.name,
                  value: p.id,
                }))}
                selectedValue={newServiceSelection.partnerId}
                onValueChange={(val: string) =>
                  setNewServiceSelection({
                    ...newServiceSelection,
                    partnerId: val,
                  })
                }
              />
            </ScrollView>

            <View style={styles.modalButtons}>
              <Button
                title="Cancel"
                variant="outline"
                onPress={() => setShowServiceSelector(false)}
                style={{ flex: 1 }}
              />
              <Button
                title="Add Service"
                onPress={handleAddServices}
                style={{ flex: 1 }}
                disabled={
                  !newServiceSelection.serviceId ||
                  !newServiceSelection.partnerId
                }
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Service Modal */}
      <Modal
        visible={showEditServiceModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEditServiceModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Service Details</Text>
              <TouchableOpacity onPress={() => setShowEditServiceModal(false)}>
                <Icon name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={[styles.serviceName, { marginBottom: 16 }]}>
                {editingService?.name}
              </Text>

              <Input
                label="Revenue Amount ($)"
                placeholder="0.00"
                keyboardType="numeric"
                value={editingService?.revenue?.toString()}
                onChangeText={(val: string) =>
                  setEditingService((prev) =>
                    prev ? { ...prev, revenue: parseFloat(val) || 0 } : null,
                  )
                }
              />

              <Input
                label="Commission Amount ($)"
                placeholder="0.00"
                keyboardType="numeric"
                value={editingService?.commission?.toString()}
                onChangeText={(val: string) =>
                  setEditingService((prev) =>
                    prev ? { ...prev, commission: parseFloat(val) || 0 } : null,
                  )
                }
              />
            </ScrollView>

            <View style={styles.modalButtons}>
              <Button
                title="Cancel"
                variant="outline"
                onPress={() => setShowEditServiceModal(false)}
                style={{ flex: 1 }}
              />
              <Button
                title="Save Changes"
                onPress={handleSaveService}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default PayoutEditScreen;
