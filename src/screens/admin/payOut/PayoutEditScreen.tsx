import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../hooks/useTheme';
import Icon from 'react-native-vector-icons/Ionicons';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { Payout } from '../../../types';
import { StackNavigationProp } from '@react-navigation/stack';
import { PayoutStackParamList } from '../../../navigation/NavigationParams';

type RouteParams = {
  PayoutEdit: {
    payoutId: string;
  };
};

type NavigationProp = StackNavigationProp<PayoutStackParamList, 'PayoutEdit'>;

interface Service {
  id: string;
  name: string;
  amount: number;
}

const PayoutEditScreen = () => {
  const theme = useTheme();
  const route = useRoute<RouteProp<RouteParams, 'PayoutEdit'>>();
  const navigation = useNavigation<NavigationProp>();

  // State
  const [payout, setPayout] = useState<Payout | null>(null);
  const [loading, setLoading] = useState(true);
  const [showServiceSelector, setShowServiceSelector] = useState(false);

  // Services State
  const [selectedServices, setSelectedServices] = useState<Service[]>([
    { id: '1', name: 'Wealth Management', amount: 5000 },
    { id: '2', name: 'Investment Advisory', amount: 3500 },
  ]);

  const availableServices: Service[] = [
    { id: '3', name: 'Portfolio Management', amount: 4200 },
    { id: '4', name: 'Financial Planning', amount: 2800 },
    { id: '5', name: 'Tax Consulting', amount: 1500 },
    { id: '6', name: 'Estate Planning', amount: 3000 },
    { id: '7', name: 'Risk Assessment', amount: 2200 },
    { id: '8', name: 'Retirement Planning', amount: 4500 },
  ];

  const [tempSelectedServices, setTempSelectedServices] = useState<string[]>(
    [],
  );

  useEffect(() => {
    // Mock loading payout data
    // In real app, fetch from API
    setTimeout(() => {
      setPayout({
        id: route.params?.payoutId || '1',
        partnerId: 'p1',
        partnerName: 'Elite Financial Services',
        amount: 2500.0,
        status: 'pending',
        requestDate: '2023-11-15',
        payoutDate: '2023-11-25',
      });
      setLoading(false);
    }, 500);
  }, [route.params?.payoutId]);

  const handleAddServices = () => {
    const newServices = availableServices.filter(service =>
      tempSelectedServices.includes(service.id),
    );
    setSelectedServices([...selectedServices, ...newServices]);
    setTempSelectedServices([]);
    setShowServiceSelector(false);
  };

  const handleRemoveService = (serviceId: string) => {
    Alert.alert(
      'Remove Service',
      'Are you sure you want to remove this service?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () =>
            setSelectedServices(
              selectedServices.filter(s => s.id !== serviceId),
            ),
        },
      ],
    );
  };

  const toggleServiceSelection = (serviceId: string) => {
    if (tempSelectedServices.includes(serviceId)) {
      setTempSelectedServices(
        tempSelectedServices.filter(id => id !== serviceId),
      );
    } else {
      setTempSelectedServices([...tempSelectedServices, serviceId]);
    }
  };

  const totalAmount = selectedServices.reduce(
    (sum, service) => sum + service.amount,
    0,
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return theme.colors.success;
      case 'pending':
        return theme.colors.warning;
      case 'processing':
        return theme.colors.info;
      case 'failed':
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
      flexDirection: 'row',
      alignItems: 'center',
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
      fontWeight: 'bold',
      color: theme.colors.text,
    },
    content: {
      padding: 16,
    },
    section: {
      marginBottom: 24,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.text,
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
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
      fontWeight: '600',
      color: theme.colors.text,
    },
    statusBadge: {
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 6,
    },
    statusText: {
      fontSize: 12,
      fontWeight: 'bold',
      textTransform: 'uppercase',
    },
    serviceItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      padding: 16,
      borderRadius: 12,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: theme.effects.cardBorder,
    },
    serviceName: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 4,
    },
    serviceAmount: {
      fontSize: 14,
      color: theme.colors.primary,
      fontWeight: '600',
    },
    totalCard: {
      marginTop: 12,
      backgroundColor: theme.colors.primary + '10',
      borderColor: theme.colors.primary,
      borderWidth: 1,
      padding: 16,
      borderRadius: 12,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    totalLabel: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.colors.text,
    },
    totalValue: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.colors.primary,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: theme.colors.surface,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      height: '80%',
      padding: 20,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.colors.text,
    },
    serviceOption: {
      flexDirection: 'row',
      alignItems: 'center',
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
      justifyContent: 'center',
      alignItems: 'center',
    },
    addServicesButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 6,
      backgroundColor: theme.colors.primary + '20',
      borderRadius: 8,
    },
    addServicesText: {
      color: theme.colors.primary,
      fontWeight: '600',
      fontSize: 14,
      marginLeft: 4,
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
                {payout?.partnerName || '...'}
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
                      getStatusColor(payout?.status || '') + '20',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    { color: getStatusColor(payout?.status || '') },
                  ]}
                >
                  {payout?.status || 'Loading...'}
                </Text>
              </View>
            </View>
          </Card>

          <View style={{ marginTop: 16 }}>
            <Button
              title="Calculate Payout"
              onPress={() =>
                Alert.alert('Calculate', 'Running calculation logic...')
              }
              variant="primary"
              icon="calculator-outline"
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
              {selectedServices.map(service => (
                <View key={service.id} style={styles.serviceItem}>
                  <View>
                    <Text style={styles.serviceName}>{service.name}</Text>
                    <Text style={styles.serviceAmount}>
                      ${service.amount.toLocaleString()}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleRemoveService(service.id)}
                    style={{
                      padding: 8,
                      backgroundColor: theme.colors.error + '10',
                      borderRadius: 8,
                    }}
                  >
                    <Icon
                      name="trash-outline"
                      size={20}
                      color={theme.colors.error}
                    />
                  </TouchableOpacity>
                </View>
              ))}

              <View style={styles.totalCard}>
                <Text style={styles.totalLabel}>Total Commission</Text>
                <Text style={styles.totalValue}>
                  ${totalAmount.toLocaleString()}
                </Text>
              </View>
            </View>
          ) : (
            <Card style={{ alignItems: 'center', padding: 24 }}>
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
              <Text style={styles.modalTitle}>Select Services</Text>
              <TouchableOpacity onPress={() => setShowServiceSelector(false)}>
                <Icon name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            <Text
              style={{ color: theme.colors.textSecondary, marginBottom: 16 }}
            >
              Choose services to add to this payout
            </Text>

            <ScrollView style={{ marginBottom: 16 }}>
              {availableServices
                .filter(
                  service => !selectedServices.find(s => s.id === service.id),
                )
                .map(service => {
                  const isSelected = tempSelectedServices.includes(service.id);
                  return (
                    <TouchableOpacity
                      key={service.id}
                      style={[
                        styles.serviceOption,
                        {
                          borderColor: isSelected
                            ? theme.colors.primary
                            : theme.effects.cardBorder,
                          backgroundColor: isSelected
                            ? theme.colors.primary + '10'
                            : theme.colors.surface,
                        },
                      ]}
                      onPress={() => toggleServiceSelection(service.id)}
                    >
                      <View
                        style={[
                          styles.checkbox,
                          {
                            borderColor: isSelected
                              ? theme.colors.primary
                              : theme.colors.textSecondary,
                            backgroundColor: isSelected
                              ? theme.colors.primary
                              : 'transparent',
                          },
                        ]}
                      >
                        {isSelected && (
                          <Icon name="checkmark" size={16} color="#FFF" />
                        )}
                      </View>
                      <View>
                        <Text style={[styles.serviceName, { fontSize: 14 }]}>
                          {service.name}
                        </Text>
                        <Text style={[styles.serviceAmount, { fontSize: 13 }]}>
                          ${service.amount.toLocaleString()}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}

              {availableServices.filter(
                service => !selectedServices.find(s => s.id === service.id),
              ).length === 0 && (
                <Text
                  style={{
                    textAlign: 'center',
                    color: theme.colors.textSecondary,
                    marginTop: 20,
                  }}
                >
                  All available services added
                </Text>
              )}
            </ScrollView>

            <View style={{ gap: 12 }}>
              <Button
                title={`Add Selected (${tempSelectedServices.length})`}
                onPress={handleAddServices}
                variant="primary"
                disabled={tempSelectedServices.length === 0}
              />
              <Button
                title="Cancel"
                onPress={() => setShowServiceSelector(false)}
                variant="ghost"
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default PayoutEditScreen;
