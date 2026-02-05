import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView,
} from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import Card from '../../../components/ui/Card';
import Icon from 'react-native-vector-icons/Ionicons';
import { ServiceRequest } from '../../../types';
import Button from '../../../components/ui/Button';
import { Alert } from 'react-native';

const mockServiceRequests: ServiceRequest[] = [
    {
        id: '1',
        serviceName: 'Portfolio Analysis',
        clientId: '1',
        clientName: 'John Anderson',
        organizationId: 'org-1',
        status: 'assigned',
        requestDate: '2025-12-08',
        priority: 'high',
    },
    {
        id: '2',
        serviceName: 'Tax Planning Consultation',
        clientId: '2',
        clientName: 'Emily Chen',
        status: 'pending',
        requestDate: '2025-12-07',
        priority: 'medium',
    },
    {
        id: '3',
        serviceName: 'Estate Planning Review',
        clientId: '3',
        clientName: 'Robert Martinez',
        organizationId: 'org-3',
        status: 'completed',
        requestDate: '2025-12-05',
        priority: 'low',
    },
    {
        id: '4',
        serviceName: 'Investment Strategy Session',
        clientId: '4',
        clientName: 'Lisa Thompson',
        status: 'pending',
        requestDate: '2025-12-09',
        priority: 'high',
    },
];

const ServiceRequestsScreen = () => {
    const theme = useTheme();
    const [requests, setRequests] = useState<ServiceRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [filter, setFilter] = useState<'all' | 'pending' | 'assigned' | 'completed'>('all');

    useEffect(() => {
        loadRequests();
    }, []);

    const loadRequests = () => {
        setTimeout(() => {
            setRequests(mockServiceRequests);
            setLoading(false);
        }, 500);
    };

    const handleRefresh = () => {
        setRefreshing(true);
        setTimeout(() => {
            setRequests(mockServiceRequests);
            setRefreshing(false);
        }, 1000);
    };

    const handleAssign = (id: string) => {
        Alert.alert(
            'Assign Organization',
            'Select an organization to assign this request to:',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Acme Financial',
                    onPress: () => {
                        setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'assigned', organizationId: 'org-1' } : r));
                        Alert.alert('Success', 'Request assigned to Acme Financial');
                    }
                },
                {
                    text: 'Global Wealth',
                    onPress: () => {
                        setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'assigned', organizationId: 'org-2' } : r));
                        Alert.alert('Success', 'Request assigned to Global Wealth');
                    }
                },
            ]
        );
    };

    const filteredRequests = filter === 'all'
        ? requests
        : requests.filter(r => r.status === filter);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return theme.colors.warning;
            case 'assigned':
                return theme.colors.info;
            case 'completed':
                return theme.colors.success;
            default:
                return theme.colors.textSecondary;
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high':
                return theme.colors.error;
            case 'medium':
                return theme.colors.warning;
            case 'low':
                return theme.colors.success;
            default:
                return theme.colors.textSecondary;
        }
    };

    const renderRequest = ({ item }: { item: ServiceRequest }) => {
        const styles = StyleSheet.create({
            requestCard: {
                marginBottom: 12,
            },
            requestHeader: {
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: 12,
            },
            requestInfo: {
                flex: 1,
                marginRight: 12,
            },
            serviceName: {
                fontSize: 16,
                fontWeight: '600',
                color: theme.colors.text,
                marginBottom: 4,
            },
            clientName: {
                fontSize: 14,
                color: theme.colors.textSecondary,
            },
            badges: {
                flexDirection: 'row',
                gap: 8,
            },
            badge: {
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 8,
            },
            badgeText: {
                fontSize: 10,
                fontWeight: '600',
                textTransform: 'uppercase',
            },
            requestFooter: {
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingTop: 12,
                borderTopWidth: 1,
                borderTopColor: theme.effects.cardBorder,
            },
            footerText: {
                fontSize: 12,
                color: theme.colors.textSecondary,
            },
        });

        return (
            <TouchableOpacity activeOpacity={0.8}>
                <Card style={styles.requestCard}>
                    <View style={styles.requestHeader}>
                        <View style={styles.requestInfo}>
                            <Text style={styles.serviceName}>{item.serviceName}</Text>
                            <Text style={styles.clientName}>{item.clientName}</Text>
                        </View>
                        <View style={styles.badges}>
                            <View style={[styles.badge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
                                <Text style={[styles.badgeText, { color: getStatusColor(item.status) }]}>
                                    {item.status}
                                </Text>
                            </View>
                            <View style={[styles.badge, { backgroundColor: getPriorityColor(item.priority) + '20' }]}>
                                <Text style={[styles.badgeText, { color: getPriorityColor(item.priority) }]}>
                                    {item.priority}
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.requestFooter}>
                        <Text style={styles.footerText}>
                            Requested: {new Date(item.requestDate).toLocaleDateString()}
                        </Text>
                        {item.status === 'pending' && (
                            <View style={{ width: 120 }}>
                                <Button
                                    title="Assign"
                                    onPress={() => handleAssign(item.id)}
                                    variant="primary"
                                    size="small"
                                />
                            </View>
                        )}
                    </View>
                </Card>
            </TouchableOpacity>
        );
    };

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
            fontWeight: 'bold',
            color: theme.colors.text,
            marginBottom: 16,
        },
        filterContainer: {
            flexDirection: 'row',
            gap: 8,
        },
        filterButton: {
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 20,
            borderWidth: 1,
        },
        filterButtonText: {
            fontSize: 14,
            fontWeight: '600',
        },
        listContainer: {
            padding: 16,
            paddingTop: 8,
        },
        statsContainer: {
            paddingBottom: 16,
            gap: 12,
        },
        statCard: {
            backgroundColor: theme.effects.cardBackground,
            borderRadius: 16,
            padding: 16,
            width: 110,
            borderWidth: 1,
            borderColor: theme.effects.cardBorder,
        },
        statHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 8,
        },
        statCount: {
            fontSize: 20,
            fontWeight: 'bold',
            color: theme.colors.text,
        },
        statIcon: {
            width: 32,
            height: 32,
            borderRadius: 8,
            justifyContent: 'center',
            alignItems: 'center',
        },
        statLabel: {
            fontSize: 12,
            color: theme.colors.textSecondary,
        },
        loadingContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
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

    if (loading) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    const pendingCount = requests.filter(r => r.status === 'pending').length;
    const assignedCount = requests.filter(r => r.status === 'assigned').length;
    const completedCount = requests.filter(r => r.status === 'completed').length;

    const stats = [
        { label: 'Pending', count: pendingCount, icon: 'time-outline', color: theme.colors.warning },
        { label: 'Assigned', count: assignedCount, icon: 'briefcase-outline', color: theme.colors.info },
        { label: 'Completed', count: completedCount, icon: 'checkmark-circle-outline', color: theme.colors.success },
    ];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Service Requests</Text>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statsContainer}>
                    {stats.map((stat, idx) => (
                        <View key={idx} style={styles.statCard}>
                            <View style={styles.statHeader}>
                                <Text style={styles.statCount}>{stat.count}</Text>
                                <View style={[styles.statIcon, { backgroundColor: stat.color + '20' }]}>
                                    <Icon name={stat.icon} size={18} color={stat.color} />
                                </View>
                            </View>
                            <Text style={styles.statLabel}>{stat.label}</Text>
                        </View>
                    ))}
                </ScrollView>

                <View style={styles.filterContainer}>
                    {['all', 'pending', 'assigned', 'completed'].map((f) => (
                        <TouchableOpacity
                            key={f}
                            onPress={() => setFilter(f as any)}
                            style={[
                                styles.filterButton,
                                {
                                    borderColor: filter === f ? theme.colors.primary : theme.effects.cardBorder,
                                    backgroundColor: filter === f ? theme.colors.primary + '20' : 'transparent',
                                },
                            ]}>
                            <Text
                                style={[
                                    styles.filterButtonText,
                                    { color: filter === f ? theme.colors.primary : theme.colors.text },
                                ]}>
                                {f}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
            <FlatList
                data={filteredRequests}
                renderItem={renderRequest}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
                refreshing={refreshing}
                onRefresh={handleRefresh}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No service requests found</Text>
                    </View>
                }
            />
        </View>
    );
};

export default ServiceRequestsScreen;
