import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useTheme } from '../../../hooks/useTheme';
import { RootState } from '../../../store';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { Payout } from '../../../types';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { PayoutStackParamList } from '../../../navigation/MainNavigator';

type NavigationProp = StackNavigationProp<PayoutStackParamList, 'Payout'>;

const mockPayouts: Payout[] = [
    {
        id: '1',
        partnerId: 'p1',
        partnerName: 'Elite Financial Services',
        amount: 2500.00,
        status: 'pending',
        requestDate: '2023-11-15',
        payoutDate: '2023-11-25',
    },
    {
        id: '2',
        partnerId: 'p2',
        partnerName: 'Sunset Advisory',
        amount: 3200.50,
        status: 'completed',
        requestDate: '2023-10-10',
        payoutDate: '2023-10-20',
    },
    {
        id: '3',
        partnerId: 'p3',
        partnerName: 'Capital Partners',
        amount: 1500.00,
        status: 'processing',
        requestDate: '2023-11-18',
        payoutDate: '2023-11-30',
    },
];

const PayoutScreen = () => {
    const theme = useTheme();
    const navigation = useNavigation<NavigationProp>();
    const user = useSelector((state: RootState) => state.auth.user);
    const [loading, setLoading] = useState(true);
    const [payouts, setPayouts] = useState<Payout[]>([]);

    useEffect(() => {
        // Mock loading payout data with role filtering
        setTimeout(() => {
            let filteredPayouts = mockPayouts;
            if (user?.role === 'service_provider' || user?.role === 'referral_partner') {
                filteredPayouts = mockPayouts.filter(p => p.partnerName === user.name);
            }
            // For demo purposes, if filtered results are empty, show all but with a note
            setPayouts(filteredPayouts.length > 0 ? filteredPayouts : mockPayouts);
            setLoading(false);
        }, 500);
    }, [user]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return theme.colors.success;
            case 'pending': return theme.colors.warning;
            case 'processing': return theme.colors.info;
            case 'failed': return theme.colors.error;
            default: return theme.colors.textSecondary;
        }
    };

    const renderPayoutItem = ({ item }: { item: Payout }) => (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('PayoutEdit', { payoutId: item.id })}
        >
            <Card style={styles.payoutCard}>
                <View style={styles.row}>
                    <View>
                        <Text style={styles.partnerName}>{item.partnerName}</Text>
                        <Text style={styles.dateText}>Requested: {item.requestDate}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                        <Text style={styles.amountText}>${item.amount.toLocaleString()}</Text>
                        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
                            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{item.status}</Text>
                        </View>
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
        },
        title: {
            fontSize: 24,
            fontWeight: 'bold',
            color: theme.colors.text,
            marginBottom: 8,
        },
        payoutCard: {
            marginBottom: 12,
            marginHorizontal: 16,
        },
        row: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        partnerName: {
            fontSize: 16,
            fontWeight: 'bold',
            color: theme.colors.text,
        },
        dateText: {
            fontSize: 12,
            color: theme.colors.textSecondary,
            marginTop: 4,
        },
        amountText: {
            fontSize: 18,
            fontWeight: 'bold',
            color: theme.colors.primary,
            marginBottom: 4,
        },
        statusBadge: {
            paddingHorizontal: 8,
            paddingVertical: 2,
            borderRadius: 10,
        },
        statusText: {
            fontSize: 10,
            fontWeight: 'bold',
            textTransform: 'uppercase',
        },
        addButton: {
            backgroundColor: theme.colors.primary,
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 12,
        },
        addButtonText: {
            color: theme.colors.textOnPrimary,
            fontWeight: '600',
            fontSize: 14,
        },
        subtitle: {
            fontSize: 14,
            color: theme.colors.textSecondary,
            marginBottom: 8,
        },
    });

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center' }]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={[styles.row, { marginBottom: 8 }]}>
                    <Text style={styles.title}>Payout Management</Text>
                    {user?.role === 'admin' && (
                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={() => Alert.alert('Add Payout', 'This feature is coming soon!')}
                        >
                            <Text style={styles.addButtonText}>+ Add New</Text>
                        </TouchableOpacity>
                    )}
                </View>
                <Text style={styles.subtitle}>Manage commission payouts and processing</Text>
            </View>
            <FlatList
                data={payouts}
                renderItem={renderPayoutItem}
                keyExtractor={item => item.id}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </View>
    );
};

export default PayoutScreen;
