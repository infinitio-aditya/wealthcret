import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useTheme } from '../../../hooks/useTheme';
import Card from '../../../components/ui/Card';

type RouteParams = {
    BulkUploadDetails: {
        uploadId: string;
    };
};

const BulkUploadDetailsScreen = () => {
    const theme = useTheme();
    const route = useRoute<RouteProp<RouteParams, 'BulkUploadDetails'>>();
    const [loading, setLoading] = useState(true);
    const [upload, setUpload] = useState<any>(null);

    useEffect(() => {
        // Mock loading upload details
        setTimeout(() => {
            setUpload({
                id: route.params?.uploadId || '1',
                fileName: 'clients_batch_october.csv',
                uploadDate: '2023-10-15',
                totalRecords: 150,
                successful: 145,
                failed: 5,
                status: 'completed',
                errors: [
                    { row: 12, message: 'Invalid email format' },
                    { row: 45, message: 'Missing required field: Phone' },
                    { row: 89, message: 'Duplicate client ID' },
                ],
            });
            setLoading(false);
        }, 500);
    }, [route.params?.uploadId]);

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
        fileName: {
            fontSize: 20,
            fontWeight: 'bold',
            color: theme.colors.text,
            marginBottom: 5,
        },
        date: {
            fontSize: 14,
            color: theme.colors.textSecondary,
        },
        statsRow: {
            flexDirection: 'row',
            gap: 12,
            marginBottom: 24,
        },
        statCard: {
            flex: 1,
            alignItems: 'center',
            paddingVertical: 15,
        },
        statValue: {
            fontSize: 24,
            fontWeight: 'bold',
            marginBottom: 4,
        },
        statLabel: {
            fontSize: 12,
            color: theme.colors.textSecondary,
            textTransform: 'uppercase',
        },
        sectionTitle: {
            fontSize: 16,
            fontWeight: 'bold',
            color: theme.colors.textSecondary,
            textTransform: 'uppercase',
            marginBottom: 12,
            letterSpacing: 1,
        },
        errorCard: {
            marginBottom: 10,
            borderLeftWidth: 4,
            borderLeftColor: theme.colors.error,
        },
        errorRow: {
            fontSize: 14,
            fontWeight: 'bold',
            color: theme.colors.text,
            marginBottom: 2,
        },
        errorMessage: {
            fontSize: 13,
            color: theme.colors.textSecondary,
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
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.fileName}>{upload?.fileName}</Text>
                    <Text style={styles.date}>Uploaded on {upload?.uploadDate}</Text>
                </View>

                <View style={styles.statsRow}>
                    <Card style={styles.statCard}>
                        <Text style={[styles.statValue, { color: theme.colors.text }]}>{upload?.totalRecords}</Text>
                        <Text style={styles.statLabel}>Total</Text>
                    </Card>
                    <Card style={styles.statCard}>
                        <Text style={[styles.statValue, { color: theme.colors.success }]}>{upload?.successful}</Text>
                        <Text style={styles.statLabel}>Success</Text>
                    </Card>
                    <Card style={styles.statCard}>
                        <Text style={[styles.statValue, { color: theme.colors.error }]}>{upload?.failed}</Text>
                        <Text style={styles.statLabel}>Failed</Text>
                    </Card>
                </View>

                {upload?.failed > 0 && (
                    <View>
                        <Text style={styles.sectionTitle}>Error Details</Text>
                        {upload.errors.map((error: any, index: number) => (
                            <Card key={index} style={styles.errorCard}>
                                <Text style={styles.errorRow}>Row {error.row}</Text>
                                <Text style={styles.errorMessage}>{error.message}</Text>
                            </Card>
                        ))}
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

export default BulkUploadDetailsScreen;
