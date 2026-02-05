import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

const mockUploads = [
    {
        id: '1',
        fileName: 'clients_batch_october.csv',
        uploadDate: '2023-10-15',
        totalRecords: 150,
        successful: 145,
        failed: 5,
        status: 'completed',
    },
    {
        id: '2',
        fileName: 'payouts_q3_final.xlsx',
        uploadDate: '2023-10-05',
        totalRecords: 80,
        successful: 80,
        failed: 0,
        status: 'completed',
    },
    {
        id: '3',
        fileName: 'documents_sync.zip',
        uploadDate: '2023-11-20',
        totalRecords: 45,
        successful: 0,
        failed: 0,
        status: 'processing',
    },
];

const BulkUploadScreen = () => {
    const theme = useTheme();
    const [loading, setLoading] = useState(true);
    const [uploads, setUploads] = useState<any[]>([]);

    useEffect(() => {
        // Mock loading upload history
        setTimeout(() => {
            setUploads(mockUploads);
            setLoading(false);
        }, 500);
    }, []);

    const renderUploadItem = ({ item }: { item: any }) => (
        <TouchableOpacity activeOpacity={0.7}>
            <Card style={styles.uploadCard}>
                <View style={styles.row}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.fileName} numberOfLines={1}>{item.fileName}</Text>
                        <Text style={styles.dateText}>{item.uploadDate}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                        <Text style={styles.statusText}>{item.status}</Text>
                        <Text style={styles.countText}>
                            {item.successful}/{item.totalRecords} Success
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
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        title: {
            fontSize: 24,
            fontWeight: 'bold',
            color: theme.colors.text,
        },
        uploadCard: {
            marginBottom: 12,
            marginHorizontal: 16,
        },
        row: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        fileName: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.colors.text,
        },
        dateText: {
            fontSize: 12,
            color: theme.colors.textSecondary,
            marginTop: 4,
        },
        statusText: {
            fontSize: 12,
            fontWeight: 'bold',
            color: theme.colors.primary,
            textTransform: 'uppercase',
            marginBottom: 4,
        },
        countText: {
            fontSize: 12,
            color: theme.colors.textSecondary,
        },
        listContent: {
            paddingBottom: 20,
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
                <Text style={styles.title}>Bulk Uploads</Text>
                <Button title="+ New" onPress={() => { }} variant="primary" />
            </View>
            <FlatList
                data={uploads}
                renderItem={renderUploadItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
};

export default BulkUploadScreen;
