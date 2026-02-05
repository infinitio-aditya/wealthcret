import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Switch,
} from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../hooks/useTheme';
import Icon from 'react-native-vector-icons/Ionicons';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import { StackNavigationProp } from '@react-navigation/stack';
import { AdminLicensingStackParamList } from '../../../navigation/NavigationParams';

type RouteParams = {
  OrganizationEdit: { orgId: string };
};

type NavigationProp = StackNavigationProp<
  AdminLicensingStackParamList,
  'OrganizationEdit'
>;

interface Feature {
  id: string;
  name: string;
  allocatedLicenses: number;
  usedLicenses: number;
  billingType: 'monthly' | 'annually';
  amount: number;
  isActive: boolean;
}

const OrganizationEditScreen = () => {
  const theme = useTheme();
  const route = useRoute<RouteProp<RouteParams, 'OrganizationEdit'>>();
  const navigation = useNavigation<NavigationProp>();

  // Organization Details State
  const [orgName, setOrgName] = useState('Acme Financial Services');
  const [startDate, setStartDate] = useState('2024-01-15');
  const [endDate, setEndDate] = useState('2025-01-15');

  // Features State
  const [features, setFeatures] = useState<Feature[]>([
    {
      id: '1',
      name: 'CRM Access',
      allocatedLicenses: 50,
      usedLicenses: 32,
      billingType: 'monthly',
      amount: 29.99,
      isActive: true,
    },
    {
      id: '2',
      name: 'Analytics Pro',
      allocatedLicenses: 25,
      usedLicenses: 18,
      billingType: 'annually',
      amount: 299.99,
      isActive: true,
    },
    {
      id: '3',
      name: 'Document Manager',
      allocatedLicenses: 40,
      usedLicenses: 35,
      billingType: 'monthly',
      amount: 19.99,
      isActive: true,
    },
    {
      id: '4',
      name: 'Client Portal',
      allocatedLicenses: 100,
      usedLicenses: 67,
      billingType: 'monthly',
      amount: 49.99,
      isActive: true,
    },
    {
      id: '5',
      name: 'Risk Assessment',
      allocatedLicenses: 30,
      usedLicenses: 22,
      billingType: 'annually',
      amount: 199.99,
      isActive: false,
    },
  ]);

  useEffect(() => {
    // Mock loading org data based on route.params.orgId
    // In a real app, you would fetch data here
  }, [route.params?.orgId]);

  const updateFeature = (id: string, field: keyof Feature, value: any) => {
    setFeatures(prev =>
      prev.map(feature =>
        feature.id === id ? { ...feature, [field]: value } : feature,
      ),
    );
  };

  const handleSaveAll = () => {
    console.log('Saving all changes:', {
      orgName,
      startDate,
      endDate,
      features,
    });
    Alert.alert(
      'Success',
      'Organization details and features updated successfully!',
      [{ text: 'OK', onPress: () => navigation.goBack() }],
    );
  };

  const getUsagePercentage = (used: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((used / total) * 100);
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
      padding: 4,
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
      alignItems: 'center',
      marginBottom: 12,
      gap: 8,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.text,
    },
    card: {
      padding: 16,
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: theme.effects.cardBorder,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    featureHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    featureName: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
    },
    featureContent: {
      gap: 12,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    label: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginBottom: 4,
    },
    input: {
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.effects.cardBorder,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 8,
      color: theme.colors.text,
      fontSize: 14,
      minWidth: 80,
    },
    usageBarContainer: {
      flex: 1,
      height: 6,
      backgroundColor: theme.colors.background,
      borderRadius: 3,
      marginHorizontal: 8,
      overflow: 'hidden',
    },
    usageBar: {
      height: '100%',
      borderRadius: 3,
    },
    usageText: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      minWidth: 35,
      textAlign: 'right',
    },
    picker: {
      height: 40,
      width: 120,
    },
    saveButtonContainer: {
      marginTop: 20,
      marginBottom: 40,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Organization</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Organization Details */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="business" size={20} color={theme.colors.primary} />
            <Text style={styles.sectionTitle}>Organization Details</Text>
          </View>

          <Card>
            <Input
              label="Organization Name"
              value={orgName}
              onChangeText={setOrgName}
              placeholder="Enter name"
            />
            <View style={{ flexDirection: 'row', gap: 16 }}>
              <View style={{ flex: 1 }}>
                <Input
                  label="Start Date"
                  value={startDate}
                  onChangeText={setStartDate}
                  placeholder="YYYY-MM-DD"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Input
                  label="End Date"
                  value={endDate}
                  onChangeText={setEndDate}
                  placeholder="YYYY-MM-DD"
                />
              </View>
            </View>
          </Card>
        </View>

        {/* Features */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="ribbon" size={20} color={theme.colors.primary} />
            <Text style={styles.sectionTitle}>Feature Licenses</Text>
          </View>

          {features.map(feature => {
            const percentage = getUsagePercentage(
              feature.usedLicenses,
              feature.allocatedLicenses,
            );
            let usageColor = theme.colors.success;
            if (percentage >= 90) usageColor = theme.colors.error;
            else if (percentage >= 70) usageColor = theme.colors.warning;

            return (
              <View key={feature.id} style={styles.card}>
                <View style={styles.featureHeader}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <Icon
                      name="medal-outline"
                      size={18}
                      color={theme.colors.primary}
                    />
                    <Text style={styles.featureName}>{feature.name}</Text>
                  </View>
                  <Switch
                    value={feature.isActive}
                    onValueChange={value =>
                      updateFeature(feature.id, 'isActive', value)
                    }
                    trackColor={{
                      false: theme.colors.border,
                      true: theme.colors.success + '80',
                    }}
                    thumbColor={
                      feature.isActive ? theme.colors.success : '#f4f3f4'
                    }
                  />
                </View>

                <View style={styles.featureContent}>
                  {/* Licenses */}
                  <View>
                    <Text style={styles.label}>
                      Licenses (Used / Allocated)
                    </Text>
                    <View style={styles.row}>
                      <Text
                        style={[
                          styles.label,
                          { marginBottom: 0, color: usageColor },
                        ]}
                      >
                        {feature.usedLicenses}
                      </Text>
                      <View style={styles.usageBarContainer}>
                        <View
                          style={[
                            styles.usageBar,
                            {
                              width: `${Math.min(percentage, 100)}%`,
                              backgroundColor: usageColor,
                            },
                          ]}
                        />
                      </View>
                      <TextInput
                        style={styles.input}
                        value={feature.allocatedLicenses.toString()}
                        onChangeText={text =>
                          updateFeature(
                            feature.id,
                            'allocatedLicenses',
                            parseInt(text) || 0,
                          )
                        }
                        keyboardType="numeric"
                      />
                    </View>
                  </View>

                  {/* Billing & Amount */}
                  <View style={styles.row}>
                    <View style={{ flex: 1, marginRight: 8 }}>
                      <Text style={styles.label}>Billing Type</Text>
                      <TouchableOpacity
                        style={[styles.input, { justifyContent: 'center' }]}
                        onPress={() => {
                          // Simple toggle for now, could be a picker/modal
                          const newValue =
                            feature.billingType === 'monthly'
                              ? 'annually'
                              : 'monthly';
                          updateFeature(feature.id, 'billingType', newValue);
                        }}
                      >
                        <Text
                          style={{
                            color: theme.colors.text,
                            textTransform: 'capitalize',
                          }}
                        >
                          {feature.billingType}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1, marginLeft: 8 }}>
                      <Text style={styles.label}>Amount ($)</Text>
                      <TextInput
                        style={styles.input}
                        value={feature.amount.toString()}
                        onChangeText={text =>
                          updateFeature(
                            feature.id,
                            'amount',
                            parseFloat(text) || 0,
                          )
                        }
                        keyboardType="numeric"
                      />
                    </View>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.saveButtonContainer}>
          <Button
            title="Save All Changes"
            onPress={handleSaveAll}
            variant="primary"
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default OrganizationEditScreen;
