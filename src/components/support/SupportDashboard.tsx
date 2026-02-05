import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import Card from '../ui/Card';
import { useGetSupportDashboardQuery } from '../../services/supportApi';

const SupportDashboard = () => {
    const theme = useTheme();
    const { data: dashboard, isLoading } = useGetSupportDashboardQuery();

    const styles = StyleSheet.create({
        container: {
            padding: 16,
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 12,
        },
        card: {
            flex: 1,
            minWidth: '45%',
            alignItems: 'center',
            padding: 16,
        },
        count: {
            fontSize: 24,
            fontWeight: 'bold',
            color: theme.colors.primary,
            marginBottom: 4,
        },
        label: {
            fontSize: 14,
            color: theme.colors.textSecondary,
        },
    });

    if (isLoading || !dashboard) {
        return null; // Or a loading skeleton
    }

    return (
        <View style={styles.container}>
            <Card style={styles.card}>
                <Text style={styles.count}>{dashboard.total_tickets}</Text>
                <Text style={styles.label}>Total Tickets</Text>
            </Card>
            <Card style={styles.card}>
                <Text style={[styles.count, { color: theme.colors.info }]}>{dashboard.open_tickets}</Text>
                <Text style={styles.label}>Open</Text>
            </Card>
            <Card style={styles.card}>
                <Text style={[styles.count, { color: theme.colors.success }]}>{dashboard.closed_tickets}</Text>
                <Text style={styles.label}>Closed</Text>
            </Card>
            <Card style={styles.card}>
                <Text style={[styles.count, { color: theme.colors.warning }]}>{dashboard.pending_tickets}</Text>
                <Text style={styles.label}>Pending</Text>
            </Card>
        </View>
    );
};

export default SupportDashboard;
