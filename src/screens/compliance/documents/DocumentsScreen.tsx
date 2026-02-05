import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../../hooks/useTheme';
import { RootState } from '../../../store';
import { mockClients, mockDocuments } from '../../../utils/mockData';
import Card from '../../../components/ui/Card';
import { Client } from '../../../types';
import MyDocumentsScreen from './MyDocumentsScreen';

const DocumentsScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const user = useSelector((state: RootState) => state.auth.user);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false); // Mock loading if needed

  // Redirect or show MyDocuments for clients
  if (user?.role === 'client') {
    return <MyDocumentsScreen />;
  }

  const filteredClients = mockClients.filter(
    client =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getClientDocumentStats = (clientId: string) => {
    const docs = mockDocuments.filter(d => d.clientId === clientId);
    return {
      total: docs.length,
      approved: docs.filter(d => d.status === 'approved').length,
      pending: docs.filter(d => d.status === 'pending').length,
      rejected: docs.filter(d => d.status === 'rejected').length,
    };
  };

  const stats = [
    {
      label: 'Total Clients',
      count: mockClients.length,
      color: theme.colors.primary,
    },
    {
      label: 'Total Documents',
      count: mockDocuments.length,
      color: theme.colors.info,
    },
    {
      label: 'Pending Review',
      count: mockDocuments.filter(d => d.status === 'pending').length,
      color: theme.colors.warning,
    },
    {
      label: 'Approved',
      count: mockDocuments.filter(d => d.status === 'approved').length,
      color: theme.colors.success,
    },
  ];

  const renderStatsCard = (stat: any, index: number) => (
    <Card
      key={index}
      style={[
        styles.statsCard,
        { flex: 1, marginHorizontal: index % 2 === 0 ? 0 : 8 },
      ]}
    >
      <Text style={[styles.statsCount, { color: stat.color }]}>
        {stat.count}
      </Text>
      <Text style={styles.statsLabel}>{stat.label}</Text>
    </Card>
  );

  const renderClientItem = ({ item }: { item: Client }) => {
    const clientStats = getClientDocumentStats(item.id);

    const itemStyles = StyleSheet.create({
      clientCard: { marginBottom: 16, padding: 16 },
      clientHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 16,
      },
      avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: theme.colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
      },
      clientInfo: { flex: 1 },
      clientName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: 4,
      },
      clientRole: { fontSize: 14, color: theme.colors.textSecondary },
      contactRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 8,
      },
      contactText: { fontSize: 14, color: theme.colors.textSecondary },
      statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: theme.effects.cardBorder,
      },
      statItem: { alignItems: 'center', flex: 1 },
      statValue: { fontSize: 16, fontWeight: 'bold', marginBottom: 2 },
      statLabel: { fontSize: 10, color: theme.colors.textSecondary },
    });

    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('ClientDocuments', { clientId: item.id })
        }
        activeOpacity={0.8}
      >
        <Card style={itemStyles.clientCard}>
          <View style={itemStyles.clientHeader}>
            <View style={itemStyles.avatar}>
              <Icon
                name="person"
                size={24}
                color={theme.colors.textOnPrimary}
              />
            </View>
            <View style={itemStyles.clientInfo}>
              <Text style={itemStyles.clientName}>{item.name}</Text>
              <Text style={itemStyles.clientRole}>{item.role}</Text>
            </View>
          </View>

          <View style={{ marginBottom: 4 }}>
            <View style={itemStyles.contactRow}>
              <Icon
                name="mail-outline"
                size={14}
                color={theme.colors.textSecondary}
              />
              <Text style={itemStyles.contactText}>{item.email}</Text>
            </View>
            {item.phone && (
              <View style={itemStyles.contactRow}>
                <Icon
                  name="call-outline"
                  size={14}
                  color={theme.colors.textSecondary}
                />
                <Text style={itemStyles.contactText}>{item.phone}</Text>
              </View>
            )}
          </View>

          <View style={itemStyles.statsContainer}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginRight: 8,
                minWidth: 80,
              }}
            >
              <Icon
                name="document-text-outline"
                size={16}
                color={theme.colors.primary}
                style={{ marginRight: 4 }}
              />
              <Text style={{ fontSize: 12, color: theme.colors.textSecondary }}>
                Documents
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <View style={itemStyles.statItem}>
                <Text
                  style={[
                    itemStyles.statValue,
                    { color: theme.colors.primary },
                  ]}
                >
                  {clientStats.total}
                </Text>
                <Text style={itemStyles.statLabel}>Total</Text>
              </View>
              <View style={itemStyles.statItem}>
                <Text
                  style={[
                    itemStyles.statValue,
                    { color: theme.colors.success },
                  ]}
                >
                  {clientStats.approved}
                </Text>
                <Text style={itemStyles.statLabel}>OK </Text>
              </View>
              <View style={itemStyles.statItem}>
                <Text
                  style={[
                    itemStyles.statValue,
                    { color: theme.colors.warning },
                  ]}
                >
                  {clientStats.pending}
                </Text>
                <Text style={itemStyles.statLabel}>Pending </Text>
              </View>
              <View style={itemStyles.statItem}>
                <Text
                  style={[itemStyles.statValue, { color: theme.colors.error }]}
                >
                  {clientStats.rejected}
                </Text>
                <Text style={itemStyles.statLabel}>Reject</Text>
              </View>
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: { padding: 16, paddingBottom: 8 },
    title: { fontSize: 24, fontWeight: 'bold', color: theme.colors.text },
    subtitle: { fontSize: 14, color: theme.colors.textSecondary, marginTop: 4 },
    searchContainer: {
      backgroundColor: theme.effects.glassBackground,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.effects.cardBorder,
      paddingHorizontal: 16,
      paddingVertical: 12,
      flexDirection: 'row',
      alignItems: 'center',
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
    statsGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 16, gap: 12 },
    statsCard: { padding: 16, marginBottom: 12, minWidth: '45%' },
    statsCount: { fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
    statsLabel: { fontSize: 12, color: theme.colors.textSecondary },
    listContainer: { padding: 16, paddingTop: 8 },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 60,
    },
    emptyText: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Client Documents</Text>
          <Text style={styles.subtitle}>
            Select a client to view and manage their documents
          </Text>
        </View>

        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color={theme.colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholder="Search clients..."
            placeholderTextColor={theme.colors.textSecondary}
          />
        </View>

        <View
          style={{
            paddingHorizontal: 16,
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
          }}
        >
          {stats.map((stat, i) => (
            <View key={i} style={{ width: '48%', marginBottom: 12 }}>
              <Card style={{ padding: 16 }}>
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: 'bold',
                    color: stat.color,
                    marginBottom: 4,
                  }}
                >
                  {stat.count}
                </Text>
                <Text
                  style={{ fontSize: 12, color: theme.colors.textSecondary }}
                >
                  {stat.label}
                </Text>
              </Card>
            </View>
          ))}
        </View>

        <FlatList
          data={filteredClients}
          renderItem={renderClientItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          scrollEnabled={false} // Since we are inside ScrollView
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No clients found</Text>
            </View>
          }
        />
      </ScrollView>
    </View>
  );
};

export default DocumentsScreen;
