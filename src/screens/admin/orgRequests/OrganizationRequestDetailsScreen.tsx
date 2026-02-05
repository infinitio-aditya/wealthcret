import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useTheme } from '../../../hooks/useTheme';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { OrganizationRequest } from '../../../types';

type RouteParams = {
    OrganizationRequestDetails: {
        requestId: string;
    };
};

const OrganizationRequestDetailsScreen = () => {
    const theme = useTheme();
    const route = useRoute<RouteProp<RouteParams, 'OrganizationRequestDetails'>>();
    const [loading, setLoading] = useState(true);
    const [request, setRequest] = useState<OrganizationRequest | null>(null);

    useEffect(() => {
        // Mock loading request data
        setTimeout(() => {
            setRequest({
                id: route.params?.requestId || '1',
                organizationName: 'Global Wealth Partners',
                requestType: 'service_provider',
                contactPerson: 'Sarah Jenkins',
                email: 'sarah.j@globalwealth.com',
                phone: '+1 (555) 012-3456',
                status: 'pending',
                requestDate: '2023-10-20',
                description: 'Expanding our operations to offer specialized portfolio management services for high-net-worth clients.',
            });
            setLoading(false);
        }, 500);
    }, [route.params?.requestId]);

    const handleApprove = () => {
        Alert.alert('Approve Request', 'Are you sure you want to approve this organization?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Approve', onPress: () => setRequest(prev => prev ? { ...prev, status: 'approved' } : null) },
        ]);
    };

    const handleReject = () => {
        Alert.alert('Reject Request', 'Are you sure you want to reject this organization?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Reject', style: 'destructive', onPress: () => setRequest(prev => prev ? { ...prev, status: 'rejected' } : null) },
        ]);
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        content: {
            padding: 16,
        },
        header: {
            marginBottom: 20,
        },
        orgName: {
            fontSize: 24,
            fontWeight: 'bold',
            color: theme.colors.text,
            marginBottom: 5,
        },
        statusBadge: {
            alignSelf: 'flex-start',
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 12,
        },
        statusText: {
            fontSize: 12,
            fontWeight: 'bold',
            textTransform: 'uppercase',
        },
        section: {
            marginBottom: 20,
        },
        sectionTitle: {
            fontSize: 16,
            fontWeight: 'bold',
            color: theme.colors.textSecondary,
            textTransform: 'uppercase',
            marginBottom: 10,
            letterSpacing: 1,
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
            fontWeight: '500',
            color: theme.colors.text,
            textAlign: 'right',
            flex: 1,
            marginLeft: 20,
        },
        description: {
            fontSize: 15,
            color: theme.colors.text,
            lineHeight: 22,
        },
        footer: {
            padding: 16,
            borderTopWidth: 1,
            borderTopColor: theme.effects.cardBorder,
            backgroundColor: theme.colors.card,
        },
        buttonRow: {
            flexDirection: 'row',
            gap: 12,
        },
        actionButton: {
            flex: 1,
        },
    });

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center' }]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    const statusColors = {
        pending: theme.colors.warning,
        approved: theme.colors.success,
        rejected: theme.colors.error,
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.orgName}>{request?.organizationName}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: (statusColors as any)[request?.status || 'pending'] + '20' }]}>
                        <Text style={[styles.statusText, { color: (statusColors as any)[request?.status || 'pending'] }]}>
                            {request?.status}
                        </Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Organization Details</Text>
                    <Card>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Type</Text>
                            <Text style={styles.infoValue}>{request?.requestType.replace('_', ' ')}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Date Requested</Text>
                            <Text style={styles.infoValue}>{request?.requestDate}</Text>
                        </View>
                    </Card>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Contact Information</Text>
                    <Card>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Name</Text>
                            <Text style={styles.infoValue}>{request?.contactPerson}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Email</Text>
                            <Text style={styles.infoValue}>{request?.email}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Phone</Text>
                            <Text style={styles.infoValue}>{request?.phone}</Text>
                        </View>
                    </Card>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Description</Text>
                    <Card>
                        <Text style={styles.description}>{request?.description}</Text>
                    </Card>
                </View>
            </ScrollView>

            {request?.status === 'pending' && (
                <View style={styles.footer}>
                    <View style={styles.buttonRow}>
                        <View style={styles.actionButton}>
                            <Button title="Reject" onPress={handleReject} variant="outline" />
                        </View>
                        <View style={styles.actionButton}>
                            <Button title="Approve" onPress={handleApprove} variant="primary" />
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
};

export default OrganizationRequestDetailsScreen;
