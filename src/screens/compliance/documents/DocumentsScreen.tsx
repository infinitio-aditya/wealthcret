import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  Dimensions,
} from "react-native";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import { useTheme } from "../../../hooks/useTheme";
import { RootState } from "../../../store";
import Card from "../../../components/ui/Card";
import MyDocumentsScreen from "./MyDocumentsScreen";
import { useGetProspectsClientsQuery } from "../../../services/backend/prospectApi";
import { ProspectAssociation } from "../../../types/backend/prospect";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const DocumentsScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const user = useSelector((state: RootState) => state.auth.user);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: prospectsData,
    isLoading,
    isFetching,
    refetch,
  } = useGetProspectsClientsQuery({
    user_types: "1,2",
    q: searchTerm,
  });

  // Redirect or show MyDocuments for clients
  if (user?.role === "client") {
    return <MyDocumentsScreen />;
  }

  const prospects = prospectsData?.results || [];

  const stats = [
    {
      label: "Clients/Prospects",
      count: prospectsData?.count || 0,
      color: theme.colors.primary,
    },
    {
      label: "Active Connections",
      count: prospects.filter((p) => p.invitation_accepted).length,
      color: theme.colors.success,
    },
    {
      label: "Pending Invites",
      count: prospects.filter((p) => !p.invitation_accepted).length,
      color: theme.colors.warning,
    },
    {
      label: "Total Organizations",
      count: Array.from(new Set(prospects.map((p) => p.organization.id)))
        .length,
      color: theme.colors.info,
    },
  ];

  const renderClientItem = ({ item }: { item: ProspectAssociation }) => {
    // Current backend doesn't provide document counts in the association list
    // We'll show a "View Documents" action instead of stats

    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("ClientDocuments", { clientId: item.user.uuid })
        }
        activeOpacity={0.8}
      >
        <Card style={styles.clientCard}>
          <View style={styles.clientHeader}>
            <View style={styles.avatar}>
              <Icon
                name="person"
                size={24}
                color={theme.colors.textOnPrimary}
              />
            </View>
            <View style={styles.clientInfo}>
              <Text style={styles.clientName}>
                {item.user.first_name} {item.user.last_name}
              </Text>
              <View style={styles.roleBadge}>
                <Text style={styles.roleText}>
                  {item.user.user_type === 1 ? "Prospect" : "Client"}
                </Text>
              </View>
            </View>
            {!item.invitation_accepted && (
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: theme.colors.warning + "20" },
                ]}
              >
                <Text
                  style={[styles.statusText, { color: theme.colors.warning }]}
                >
                  Pending
                </Text>
              </View>
            )}
          </View>

          <View style={{ marginBottom: 12 }}>
            <View style={styles.contactRow}>
              <Icon
                name="mail-outline"
                size={14}
                color={theme.colors.textSecondary}
              />
              <Text style={styles.contactText}>{item.user.email}</Text>
            </View>
            {item.user.mobile_number && (
              <View style={styles.contactRow}>
                <Icon
                  name="call-outline"
                  size={14}
                  color={theme.colors.textSecondary}
                />
                <Text style={styles.contactText}>
                  {item.user.mobile_number}
                </Text>
              </View>
            )}
            <View style={styles.contactRow}>
              <Icon
                name="business-outline"
                size={14}
                color={theme.colors.textSecondary}
              />
              <Text style={styles.contactText}>{item.organization.name}</Text>
            </View>
          </View>

          <View style={styles.cardFooter}>
            <Text style={styles.footerLabel}>Select to manage documents</Text>
            <Icon
              name="chevron-forward"
              size={16}
              color={theme.colors.primary}
            />
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: { padding: 16, paddingBottom: 8 },
    title: { fontSize: 24, fontWeight: "bold", color: theme.colors.text },
    subtitle: { fontSize: 14, color: theme.colors.textSecondary, marginTop: 4 },
    searchContainer: {
      backgroundColor: theme.effects.glassBackground,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.effects.cardBorder,
      paddingHorizontal: 16,
      paddingVertical: 12,
      flexDirection: "row",
      alignItems: "center",
      marginHorizontal: 16,
      marginTop: 16,
      marginBottom: 8,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      color: theme.colors.text,
      padding: 0,
      marginLeft: 8,
    },
    statsContainer: {
      paddingHorizontal: 16,
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      marginTop: 8,
    },
    statCardWrapper: { width: "48%", marginBottom: 12 },
    statCard: { padding: 16, borderRadius: 16 },
    statCount: {
      fontSize: 22,
      fontWeight: "bold",
      marginBottom: 4,
    },
    statLabel: { fontSize: 11, color: theme.colors.textSecondary },
    listContainer: { padding: 16, paddingTop: 8 },
    clientCard: { marginBottom: 16, padding: 16, borderRadius: 20 },
    clientHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 16,
    },
    avatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.colors.primary,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },
    clientInfo: { flex: 1 },
    clientName: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: 4,
    },
    roleBadge: {
      alignSelf: "flex-start",
      backgroundColor: theme.colors.primary + "15",
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 4,
    },
    roleText: {
      fontSize: 10,
      fontWeight: "bold",
      color: theme.colors.primary,
    },
    statusBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
    },
    statusText: {
      fontSize: 10,
      fontWeight: "bold",
    },
    contactRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 6,
      gap: 8,
    },
    contactText: { fontSize: 13, color: theme.colors.textSecondary },
    cardFooter: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: theme.effects.cardBorder,
    },
    footerLabel: {
      fontSize: 12,
      color: theme.colors.primary,
      fontWeight: "600",
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 60,
    },
    emptyText: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      textAlign: "center",
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={refetch}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>Compliance Documents</Text>
          <Text style={styles.subtitle}>
            Select a client to view and manage their compliance vault
          </Text>
        </View>

        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color={theme.colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholder="Search by name or email..."
            placeholderTextColor={theme.colors.textSecondary}
          />
        </View>

        <View style={styles.statsContainer}>
          {stats.map((stat, i) => (
            <View key={i} style={styles.statCardWrapper}>
              <Card style={styles.statCard}>
                <Text style={[styles.statCount, { color: stat.color }]}>
                  {stat.count}
                </Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </Card>
            </View>
          ))}
        </View>

        {isLoading ? (
          <View style={{ paddingVertical: 40 }}>
            <ActivityIndicator color={theme.colors.primary} size="large" />
          </View>
        ) : (
          <FlatList
            data={prospects}
            renderItem={renderClientItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
            scrollEnabled={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  No clients or prospects found
                </Text>
              </View>
            }
          />
        )}
      </ScrollView>
    </View>
  );
};

export default DocumentsScreen;
