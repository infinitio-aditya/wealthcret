import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Switch,
    ActivityIndicator,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import Card from '../components/ui/Card';
import { ErrorState, EmptyState } from '../app/components/StateComponents';

interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    timestamp: string;
    read: boolean;
}

const NotificationsScreen = () => {
    const theme = useTheme();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [showUnreadOnly, setShowUnreadOnly] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = async () => {
        try {
            setIsLoading(true);
            setError(null);
            // TODO: Replace with real API call when backend is ready
            // For now using placeholder
            setNotifications([]);
        } catch (err) {
            setError('Failed to load notifications');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredNotifications = showUnreadOnly
        ? notifications.filter((n) => !n.read)
        : notifications;

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'success':
                return theme.colors.success;
            case 'warning':
                return theme.colors.warning;
            case 'error':
                return theme.colors.error;
            case 'info':
            default:
                return theme.colors.info;
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'success':
                return '✓';
            case 'warning':
                return '⚠';
            case 'error':
                return '✕';
            case 'info':
            default:
                return 'ℹ';
        }
    };

    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days}d ago`;
        if (hours > 0) return `${hours}h ago`;
        return 'Just now';
    };

    const handleNotificationPress = (id: string) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
    };

    const markAllAsRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    };

    const renderNotification = ({ item }: { item: Notification }) => {
        const styles = StyleSheet.create({
            notificationCard: {
                marginBottom: 12,
                opacity: item.read ? 0.6 : 1,
            },
            notificationContent: {
                flexDirection: 'row',
                alignItems: 'flex-start',
            },
            iconContainer: {
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: getTypeColor(item.type) + '20',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 12,
            },
            icon: {
                fontSize: 20,
                color: getTypeColor(item.type),
            },
            textContainer: {
                flex: 1,
            },
            notificationHeader: {
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 4,
            },
            title: {
                fontSize: 16,
                fontWeight: '600',
                color: theme.colors.text,
                flex: 1,
            },
            timestamp: {
                fontSize: 12,
                color: theme.colors.textSecondary,
            },
            message: {
                fontSize: 14,
                color: theme.colors.textSecondary,
                lineHeight: 20,
            },
            unreadIndicator: {
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: theme.colors.primary,
                marginLeft: 8,
            },
        });

        return (
            <TouchableOpacity
                onPress={() => handleNotificationPress(item.id)}
                activeOpacity={0.8}>
                <Card style={styles.notificationCard}>
                    <View style={styles.notificationContent}>
                        <View style={styles.iconContainer}>
                            <Text style={styles.icon}>{getTypeIcon(item.type)}</Text>
                        </View>
                        <View style={styles.textContainer}>
                            <View style={styles.notificationHeader}>
                                <Text style={styles.title}>{item.title}</Text>
                                {!item.read && <View style={styles.unreadIndicator} />}
                            </View>
                            <Text style={styles.message}>{item.message}</Text>
                            <Text style={styles.timestamp}>{formatTimestamp(item.timestamp)}</Text>
                        </View>
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
        headerTop: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
        },
        title: {
            fontSize: 24,
            fontWeight: 'bold',
            color: theme.colors.text,
        },
        markAllButton: {
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 8,
            backgroundColor: theme.colors.primary + '20',
        },
        markAllText: {
            fontSize: 12,
            fontWeight: '600',
            color: theme.colors.primary,
        },
        filterContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        filterLabel: {
            fontSize: 14,
            color: theme.colors.text,
        },
        listContainer: {
            padding: 16,
            paddingTop: 8,
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

    const unreadCount = notifications.filter((n) => !n.read).length;

    if (isLoading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 100 }} />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <ErrorState
                    title="Failed to Load"
                    message={error}
                    onRetry={loadNotifications}
                    fullScreen={true}
                />
            </View>
        );
    }

    if (filteredNotifications.length === 0) {
        return (
            <View style={styles.container}>
                <EmptyState
                    title={showUnreadOnly ? 'All Caught Up!' : 'No Notifications'}
                    message={showUnreadOnly ? 'You have no unread notifications' : 'You will see notifications here'}
                    fullScreen={true}
                />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <View>
                        <Text style={styles.title}>Notifications</Text>
                        {unreadCount > 0 && (
                            <Text style={{ fontSize: 14, color: theme.colors.textSecondary }}>
                                {unreadCount} unread
                            </Text>
                        )}
                    </View>
                    {unreadCount > 0 && (
                        <TouchableOpacity onPress={markAllAsRead} style={styles.markAllButton}>
                            <Text style={styles.markAllText}>Mark all read</Text>
                        </TouchableOpacity>
                    )}
                </View>
                <View style={styles.filterContainer}>
                    <Text style={styles.filterLabel}>Show unread only</Text>
                    <Switch
                        value={showUnreadOnly}
                        onValueChange={setShowUnreadOnly}
                        trackColor={{ false: theme.effects.cardBorder, true: theme.colors.primary + '40' }}
                        thumbColor={showUnreadOnly ? theme.colors.primary : theme.colors.textSecondary}
                    />
                </View>
            </View>
            <FlatList
                data={filteredNotifications}
                renderItem={renderNotification}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>
                            {showUnreadOnly ? 'No unread notifications' : 'No notifications'}
                        </Text>
                    </View>
                }
            />
        </View>
    );
};

export default NotificationsScreen;
