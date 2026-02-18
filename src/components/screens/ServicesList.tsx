import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../../hooks/useTheme";
import Card from "../ui/Card";

interface Service {
  id: string;
  name: string;
  segment?: string;
  aum?: number;
  commission?: number;
}

interface ServicesListProps {
  services: Service[];
  title?: string;
  showCommission?: boolean;
}

const ServicesList: React.FC<ServicesListProps> = ({
  services,
  title = "Services",
  showCommission = true,
}) => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      marginBottom: 20,
    },
    title: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.colors.textSecondary,
      textTransform: "uppercase",
      marginBottom: 10,
      letterSpacing: 1,
    },
    serviceCard: {
      marginBottom: 12,
      paddingVertical: 12,
    },
    serviceName: {
      fontSize: 15,
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: 8,
    },
    serviceRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 8,
    },
    serviceLabel: {
      fontSize: 13,
      color: theme.colors.textSecondary,
      fontWeight: "500",
    },
    serviceValue: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.text,
    },
    lastRow: {
      borderBottomWidth: 0,
    },
  });

  const formatCurrency = (value: number) => {
    return `$${(value / 1000000).toFixed(2)}M`;
  };

  if (!services || services.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Card>
        {services.map((service, index) => (
          <View key={service.id}>
            <Text style={styles.serviceName}>{service.name}</Text>
            {service.segment && (
              <View style={styles.serviceRow}>
                <Text style={styles.serviceLabel}>Segment</Text>
                <Text style={styles.serviceValue}>{service.segment}</Text>
              </View>
            )}
            {service.aum && (
              <View style={styles.serviceRow}>
                <Text style={styles.serviceLabel}>AUM</Text>
                <Text style={styles.serviceValue}>
                  {formatCurrency(service.aum)}
                </Text>
              </View>
            )}
            {showCommission && service.commission && (
              <View
                style={[
                  styles.serviceRow,
                  index === services.length - 1 && styles.lastRow,
                ]}
              >
                <Text style={styles.serviceLabel}>Commission %</Text>
                <Text style={styles.serviceValue}>{service.commission}%</Text>
              </View>
            )}
          </View>
        ))}
      </Card>
    </View>
  );
};

export default ServicesList;
