import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "../../../hooks/useTheme";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import {
  useGetBulkUploadJobsQuery,
  useCreateBulkUploadJobMutation,
} from "../../../services/backend/authApi";
import { BulkUploadJob } from "../../../types/backend/auth";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

const BulkUploadScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const { data: uploadJobs, isLoading, refetch } = useGetBulkUploadJobsQuery();
  const [createJob] = useCreateBulkUploadJobMutation();

  const renderUploadItem = ({ item }: { item: BulkUploadJob }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() =>
        item.id && navigation.navigate("BulkUploadDetails", { jobId: item.id })
      }
    >
      <Card style={styles.uploadCard}>
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.fileName} numberOfLines={1}>
              {item.name ||
                item.file?.split("/").pop() ||
                `Upload ID: ${item.id}`}
            </Text>
            <Text style={styles.dateText}>
              {item.id ? `ID: ${item.id}` : "Pending"}
            </Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor:
                    Number(item.status) === 1
                      ? theme.colors.success + "20"
                      : theme.colors.primary + "20",
                },
              ]}
            >
              <Text
                style={[
                  styles.statusBadgeText,
                  {
                    color:
                      Number(item.status) === 1
                        ? theme.colors.success
                        : theme.colors.primary,
                  },
                ]}
              >
                {Number(item.status) === 1 ? "COMPLETED" : "PROCESSING"}
              </Text>
            </View>
            <Text style={styles.countText}>
              {item.total_records || 0} Records
            </Text>
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
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.colors.text,
    },
    uploadCard: {
      marginBottom: 12,
      marginHorizontal: 16,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    fileName: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.text,
    },
    dateText: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginTop: 4,
    },
    statusText: {
      fontSize: 12,
      fontWeight: "bold",
      color: theme.colors.primary,
      textTransform: "uppercase",
      marginBottom: 4,
    },
    statusBadge: {
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 6,
      marginBottom: 4,
    },
    statusBadgeText: {
      fontSize: 10,
      fontWeight: "bold",
      textTransform: "uppercase",
    },
    countText: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
    listContent: {
      paddingBottom: 20,
    },
  });

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Bulk Uploads</Text>
        <Button title="+ New" onPress={() => {}} variant="primary" />
      </View>
      <FlatList
        data={uploadJobs}
        renderItem={renderUploadItem}
        keyExtractor={(item) =>
          item.id ? item.id.toString() : Math.random().toString()
        }
        contentContainerStyle={styles.listContent}
        onRefresh={refetch}
        refreshing={isLoading}
      />
    </View>
  );
};

export default BulkUploadScreen;
