import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    RefreshControl,
    Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather'; // Using Feather for better match with Lucide
import { useTheme } from '../../../hooks/useTheme';
import { mockTickets } from '../../../utils/mockData';
import Icon1 from 'react-native-vector-icons/Ionicons';
import { Ticket } from '../../../types';
import LinearGradient from 'react-native-linear-gradient';

const SupportScreen = () => {
    const theme = useTheme();
    const navigation = useNavigation<any>();
    const [refreshing, setRefreshing] = useState(false);
    // In a real app we might filter data, here we use mockTickets directly
    const [tickets, setTickets] = useState<Ticket[]>(mockTickets);

    const handleRefresh = () => {
        setRefreshing(true);
        // Simulate refresh
        setTimeout(() => setRefreshing(false), 1000);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'open': return theme.colors.info;
            case 'in-progress': return theme.colors.warning;
            case 'resolved': return theme.colors.success;
            case 'closed': return theme.colors.textSecondary;
            default: return theme.colors.textSecondary;
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return theme.colors.error;
            case 'medium': return theme.colors.warning;
            case 'low': return theme.colors.success;
            default: return theme.colors.textSecondary;
        }
    };

    const stats = [
        { label: 'Open', count: tickets.filter(t => t.status === 'open').length, color: theme.colors.info },
        { label: 'In Progress', count: tickets.filter(t => t.status === 'in-progress').length, color: theme.colors.warning },
        { label: 'Resolved', count: tickets.filter(t => t.status === 'resolved').length, color: theme.colors.success },
        { label: 'Closed', count: tickets.filter(t => t.status === 'closed').length, color: theme.colors.textSecondary },
    ];

    const renderHeader = () => (
        <View style={styles.headerContainer}>
            <View style={styles.headerTop}>
                <View>
                    <Text style={styles.headerTitle}>Support Tickets</Text>
                    <Text style={styles.headerSubtitle}>Submit and track your support requests</Text>
                </View>
                {/* <TouchableOpacity
                    onPress={() => navigation.navigate('CreateTicket')}
                >
                    <LinearGradient
                        colors={theme.effects.buttonGradient}
                        style={styles.newTicketButton}
                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                    >
                        <Icon name="plus" size={20} color="#fff" />
                        <Text style={styles.newTicketText}>New Ticket</Text>
                    </LinearGradient>
                </TouchableOpacity> */}
                <View style={styles.headerButtons}>
                    <TouchableOpacity onPress={() => navigation.navigate('CreateTicket')}>
                        <Icon1 name="add-circle" size={32} color={theme.colors.primary} />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.statsGrid}>
                {stats.map((stat) => (
                    <View key={stat.label} style={styles.statCard}>
                        <Text style={[styles.statCount, { color: stat.color }]}>{stat.count}</Text>
                        <Text style={styles.statLabel}>{stat.label}</Text>
                    </View>
                ))}
            </View>
        </View>
    );

    const renderTicket = ({ item }: { item: Ticket }) => (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('TicketDetails', { ticketId: item.id })}
        >
            <View style={[styles.ticketCard, { borderLeftColor: getStatusColor(item.status) }]}>
                <View style={styles.ticketHeader}>
                    <Text style={styles.ticketTitle} numberOfLines={2}>{item.title}</Text>
                    <View style={styles.messageBadge}>
                        <Icon name="message-square" size={14} color={theme.colors.textSecondary} />
                        <Text style={styles.messageCount}>{item.messages.length}</Text>
                    </View>
                </View>

                <View style={styles.badgesContainer}>
                    <View style={[styles.badge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
                        {/* Feather doesn't have all exact filled icons, using simple mapping or just text */}
                        <Text style={[styles.badgeText, { color: getStatusColor(item.status) }]}>
                            {item.status.replace('-', ' ')}
                        </Text>
                    </View>
                    <View style={[styles.badge, { backgroundColor: getPriorityColor(item.priority) + '20' }]}>
                        <Text style={[styles.badgeText, { color: getPriorityColor(item.priority) }]}>
                            {item.priority}
                        </Text>
                    </View>
                </View>

                <Text style={styles.ticketDescription} numberOfLines={2}>{item.description}</Text>

                <View style={styles.ticketFooter}>
                    <Text style={styles.footerText}>#{item.id}</Text>
                    <Text style={styles.footerDot}>•</Text>
                    <Text style={[styles.footerText, { flex: 1 }]} numberOfLines={1}>{item.organizationName}</Text>
                    <Text style={styles.footerDot}>•</Text>
                    <Text style={styles.footerText}>{new Date(item.createdAt).toLocaleDateString()}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        headerContainer: {
            // padding: 16,
            paddingTop: 16,
            paddingBottom: 8,
        },
        headerTop: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 24,
        },
        headerTitle: {
            fontSize: 24,
            fontWeight: 'bold',
            color: theme.colors.text,
        },
        headerSubtitle: {
            fontSize: 14,
            color: theme.colors.textSecondary,
            marginTop: 4,
        },
        newTicketButton: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingVertical: 10,
            borderRadius: 12,
            gap: 8,
        },
        headerButtons: { flexDirection: 'row', gap: 12 },
        newTicketText: {
            color: '#fff',
            fontWeight: '600',
            fontSize: 14,
        },
        statsGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 12,
            justifyContent: 'space-between', // Basic grid approximation
        },
        statCard: {
            width: '48%', // Approx 2 columns
            backgroundColor: theme.effects.cardBackground, // Assuming theme struct
            borderRadius: 12,
            padding: 16,
            marginBottom: 12,
            borderWidth: 1,
            borderColor: theme.effects.cardBorder,
            // Shadow would go here if needed
        },
        statCount: {
            fontSize: 28,
            fontWeight: 'bold',
            marginBottom: 4,
        },
        statLabel: {
            fontSize: 12,
            color: theme.colors.textSecondary,
        },
        listContent: {
            padding: 16,
            paddingTop: 0,
        },
        ticketCard: {
            backgroundColor: theme.colors.surface, // Or cardBackground
            borderRadius: 12,
            padding: 16,
            marginBottom: 12,
            borderWidth: 1,
            borderColor: theme.effects.cardBorder,
            borderLeftWidth: 4,
            // Shadow
        },
        ticketHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 12,
            marginBottom: 12,
        },
        ticketTitle: {
            flex: 1,
            fontSize: 16,
            fontWeight: '600',
            color: theme.colors.text,
            lineHeight: 22,
        },
        messageBadge: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.effects.glassBackground, // Approximate
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 8,
            gap: 4,
        },
        messageCount: {
            fontSize: 12,
            color: theme.colors.textSecondary,
        },
        badgesContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 8,
            marginBottom: 12,
        },
        badge: {
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 20,
        },
        badgeText: {
            fontSize: 11,
            fontWeight: '600',
            textTransform: 'capitalize',
        },
        ticketDescription: {
            fontSize: 14,
            color: theme.colors.textSecondary,
            lineHeight: 20,
            marginBottom: 12,
        },
        ticketFooter: {
            flexDirection: 'row',
            alignItems: 'center',
            flexWrap: 'wrap',
        },
        footerText: {
            fontSize: 12,
            color: theme.colors.textSecondary,
        },
        footerDot: {
            fontSize: 12,
            color: theme.colors.textSecondary,
            marginHorizontal: 6,
        },
    });

    return (
        <View style={styles.container}>
            <FlatList
                data={tickets}
                renderItem={renderTicket}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                ListHeaderComponent={renderHeader}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                }
            />
        </View>
    );
};

export default SupportScreen;
