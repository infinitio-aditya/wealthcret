import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { useAlert } from "../../context/AlertContext";
import Card from "../ui/Card";
import Button from "../ui/Button";
import ThemeDropdown from "../ui/ThemeDropdown";

interface Service {
  id: string;
  name: string;
  segment?: string;
  aum?: number;
  commission?: number;
}

interface CommissionEditorProps {
  services: Service[]; // all system services
  selectedServices: Service[]; // services assigned to org
  userOrganizationDefaultCommission?: number;
  onUpdateDefaultCommission?: (value: number) => void;
  onSaveServiceOverride?: (
    serviceId: string,
    payload: Partial<Service>,
  ) => void;
}

// Segment options
const SEGMENT_OPTIONS = [
  { label: "HNI (High Net Worth Individual)", value: "HNI" },
  { label: "Ultra HNI", value: "Ultra HNI" },
  { label: "Affluent", value: "Affluent" },
  { label: "Premium", value: "Premium" },
  { label: "Standard", value: "Standard" },
];

// AUM range options
const AUM_OPTIONS = [
  { label: "$0 - $10M", value: "0-10" },
  { label: "$10M - $50M", value: "10-50" },
  { label: "$50M - $100M", value: "50-100" },
  { label: "$100M - $500M", value: "100-500" },
  { label: "$500M+", value: "500+" },
];

const getAUMValue = (aumLabel: string): number => {
  const ranges: { [key: string]: number } = {
    "0-10": 5000000,
    "10-50": 25000000,
    "50-100": 75000000,
    "100-500": 250000000,
    "500+": 1000000000,
  };
  return ranges[aumLabel] || 0;
};

const getAUMLabelFromValue = (aum: number): string => {
  if (aum <= 10000000) return "0-10";
  if (aum <= 50000000) return "10-50";
  if (aum <= 100000000) return "50-100";
  if (aum <= 500000000) return "100-500";
  return "500+";
};

const CommissionEditor: React.FC<CommissionEditorProps> = ({
  services,
  selectedServices,
  userOrganizationDefaultCommission = 0,
  onUpdateDefaultCommission,
  onSaveServiceOverride,
}) => {
  const { showAlert } = useAlert();
  const theme = useTheme();
  const [defaultCommission, setDefaultCommission] = useState(
    userOrganizationDefaultCommission,
  );
  const [rows, setRows] = useState(
    selectedServices.map((s) => ({
      id: s.id,
      segment: s.segment || "",
      aum: s.aum || 0,
      commission: s.commission || 0,
      name: s.name,
      changed: false,
    })),
  );

  useEffect(() => {
    setDefaultCommission(userOrganizationDefaultCommission);
  }, [userOrganizationDefaultCommission]);

  useEffect(() => {
    setRows(
      selectedServices.map((s) => ({
        id: s.id,
        segment: s.segment || "",
        aum: s.aum || 0,
        commission: s.commission || 0,
        name: s.name,
        changed: false,
      })),
    );
  }, [selectedServices]);

  const handleRowChange = (id: string, key: string, value: any) => {
    setRows((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, [key]: value, changed: true } : r,
      ),
    );
  };

  const handleSaveRow = (r: any) => {
    if (onSaveServiceOverride) {
      onSaveServiceOverride(r.id, {
        segment: r.segment,
        aum: r.aum,
        commission: Number(r.commission),
      });
    } else {
      showAlert("Saved", `Saved override for ${r.name}`);
    }
    setRows((prev) =>
      prev.map((row) => (row.id === r.id ? { ...row, changed: false } : row)),
    );
  };

  const handleSaveDefault = () => {
    if (onUpdateDefaultCommission) {
      onUpdateDefaultCommission(Number(defaultCommission));
    } else {
      showAlert("Saved", `Default commission set to ${defaultCommission}%`);
    }
  };

  const styles = StyleSheet.create({
    container: { marginBottom: 20 },
    title: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.colors.textSecondary,
      textTransform: "uppercase",
      marginBottom: 10,
      letterSpacing: 1,
    },
    rowCard: {
      paddingVertical: 12,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: theme.effects.cardBorder,
    },
    label: { fontSize: 13, color: theme.colors.textSecondary },
    value: { fontSize: 14, color: theme.colors.text, fontWeight: "600" },
    input: {
      minWidth: 60,
      textAlign: "center",
      borderWidth: 1,
      borderColor: theme.effects.cardBorder,
      borderRadius: 6,
      padding: 6,
      color: theme.colors.text,
      backgroundColor: theme.colors.background,
    },
    saveRow: { minWidth: 90 },
    defaultRow: {
      flexDirection: "row",
      gap: 8,
      alignItems: "center",
      marginBottom: 8,
    },
  });

  if (!selectedServices || selectedServices.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Commissions</Text>
      <Card>
        <View style={{ padding: 12 }}>
          <View style={styles.defaultRow as any}>
            <Text style={styles.label}>Default Commission</Text>
            <TextInput
              value={String(defaultCommission)}
              onChangeText={(t) => setDefaultCommission(Number(t || 0))}
              keyboardType="numeric"
              style={styles.input}
            />
            <View style={{ flex: 1 }} />
            <Button
              title="Save"
              onPress={handleSaveDefault}
              variant="primary"
            />
          </View>

          <ScrollView>
            {rows.map((r) => (
              <View key={r.id} style={styles.rowCard}>
                <Text style={[styles.value, { marginBottom: 12 }]}>
                  {r.name}
                </Text>

                {/* Segment Dropdown */}
                <View style={{ marginBottom: 12 }}>
                  <ThemeDropdown
                    label="Segment"
                    options={SEGMENT_OPTIONS}
                    selectedValue={r.segment}
                    onValueChange={(value) =>
                      handleRowChange(r.id, "segment", value)
                    }
                    placeholder="Select Segment"
                  />
                </View>

                {/* AUM Dropdown */}
                <View style={{ marginBottom: 12 }}>
                  <ThemeDropdown
                    label="AUM Range"
                    options={AUM_OPTIONS}
                    selectedValue={getAUMLabelFromValue(r.aum)}
                    onValueChange={(value) =>
                      handleRowChange(r.id, "aum", getAUMValue(value))
                    }
                    placeholder="Select AUM Range"
                  />
                </View>

                {/* Commission Input */}
                <View style={styles.row}>
                  <Text style={styles.label}>Commission %</Text>
                  <TextInput
                    value={String(r.commission)}
                    onChangeText={(t) =>
                      handleRowChange(r.id, "commission", Number(t || 0))
                    }
                    keyboardType="numeric"
                    style={styles.input}
                  />
                </View>

                <View style={{ marginTop: 12, alignItems: "flex-end" }}>
                  <TouchableOpacity
                    disabled={!r.changed}
                    onPress={() => handleSaveRow(r)}
                    style={{ opacity: r.changed ? 1 : 0.5 }}
                  >
                    <View style={{ paddingHorizontal: 12 }}>
                      <Text
                        style={{
                          color: theme.colors.primary,
                          fontWeight: "600",
                        }}
                      >
                        Save
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </Card>
    </View>
  );
};

export default CommissionEditor;
