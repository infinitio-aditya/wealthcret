import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../../hooks/useTheme';
import { mockClients, mockDocuments } from '../../../utils/mockData';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

type RouteParams = {
    ClientDocuments: { clientId: string };
};

const ClientDocumentsScreen = () => {
    const theme = useTheme();
    const route = useRoute<RouteProp<RouteParams, 'ClientDocuments'>>();
    const navigation = useNavigation();
    const clientId = route.params?.clientId;
    const client = mockClients.find(c => c.id === clientId);

    const [showRequestForm, setShowRequestForm] = useState(false);
    const [docType, setDocType] = useState('');
    const [description, setDescription] = useState('');

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        header: {
            padding: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        title: {
            fontSize: 24,
            fontWeight: 'bold',
            color: theme.colors.text,
        },
        subtitle: {
            fontSize: 14,
            color: theme.colors.textSecondary,
        },
        sectionTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: theme.colors.text,
            marginBottom: 12,
        },
        statsRow: {
            flexDirection: 'row',
            paddingHorizontal: 20,
            gap: 12,
            marginBottom: 20,
        },
        statBox: {
            flex: 1,
            padding: 12,
            borderRadius: 12,
            alignItems: 'center',
            borderWidth: 1,
        },
        statValue: {
            fontSize: 18,
            fontWeight: 'bold',
        },
        statLabel: {
            fontSize: 10,
            color: theme.colors.textSecondary,
        },
        docCard: {
            marginHorizontal: 20,
            marginBottom: 16,
            padding: 16,
        },
        docHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12,
        },
        docIcon: {
            width: 40,
            height: 40,
            borderRadius: 8,
            justifyContent: 'center',
            alignItems: 'center',
        },
        statusBadge: {
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 12,
        },
        statusText: {
            fontSize: 10,
            fontWeight: 'bold',
            textTransform: 'capitalize',
        },
        docTitle: {
            fontSize: 16,
            fontWeight: 'bold',
            color: theme.colors.text,
            marginBottom: 4,
        },
        docInfo: {
            fontSize: 12,
            color: theme.colors.textSecondary,
        },
        actions: {
            flexDirection: 'row',
            gap: 8,
            marginTop: 12,
        },
        requestForm: {
            padding: 20,
            backgroundColor: theme.colors.surface,
            borderBottomWidth: 1,
            borderColor: theme.effects.cardBorder,
            marginBottom: 20,
        },
    });

    if (!client) {
        return (
            <View style={[styles.container, { backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ color: theme.colors.text }}>Client not found</Text>
            </View>
        );
    }

    const clientDocuments = mockDocuments.filter(d => d.clientId === clientId);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved': return theme.colors.success;
            case 'rejected': return theme.colors.error;
            case 'pending': return theme.colors.warning;
            default: return theme.colors.textSecondary;
        }
    };

    const handleRequest = () => {
        Alert.alert('Success', `Requested ${docType} from ${client.name}`);
        setShowRequestForm(false);
        setDocType('');
        setDescription('');
    };

    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.title}>Documents</Text>
                        <Text style={styles.subtitle}>{client.name}</Text>
                    </View>
                    <TouchableOpacity onPress={() => setShowRequestForm(!showRequestForm)}>
                        <Icon name="add-circle" size={32} color={theme.colors.primary} />
                    </TouchableOpacity>
                </View>

                {showRequestForm && (
                    <View style={styles.requestForm}>
                        <Text style={[styles.sectionTitle, { marginBottom: 12 }]}>Request Document</Text>
                        <Input
                            label="Document Type"
                            value={docType}
                            onChangeText={setDocType}
                            placeholder="e.g. ID Proof"
                        />
                        <Input
                            label="Description"
                            value={description}
                            onChangeText={setDescription}
                            placeholder="Why is this needed?"
                            multiline
                        />
                        <Button title="Send Request" onPress={handleRequest} style={{ marginTop: 12 }} />
                    </View>
                )}

                <View style={styles.statsRow}>
                    <View style={[styles.statBox, { borderColor: theme.colors.primary + '40' }]}>
                        <Text style={[styles.statValue, { color: theme.colors.primary }]}>{clientDocuments.length}</Text>
                        <Text style={styles.statLabel}>Total</Text>
                    </View>
                    <View style={[styles.statBox, { borderColor: theme.colors.success + '40' }]}>
                        <Text style={[styles.statValue, { color: theme.colors.success }]}>{clientDocuments.filter(d => d.status === 'approved').length}</Text>
                        <Text style={styles.statLabel}>Approved</Text>
                    </View>
                    <View style={[styles.statBox, { borderColor: theme.colors.warning + '40' }]}>
                        <Text style={[styles.statValue, { color: theme.colors.warning }]}>{clientDocuments.filter(d => d.status === 'pending').length}</Text>
                        <Text style={styles.statLabel}>Pending</Text>
                    </View>
                </View>

                {clientDocuments.map((doc) => (
                    <Card key={doc.id} style={styles.docCard}>
                        <View style={styles.docHeader}>
                            <View style={[styles.docIcon, { backgroundColor: getStatusColor(doc.status) + '20' }]}>
                                <Icon name="document-text" size={24} color={getStatusColor(doc.status)} />
                            </View>
                            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(doc.status) + '20' }]}>
                                <Text style={[styles.statusText, { color: getStatusColor(doc.status) }]}>{doc.status}</Text>
                            </View>
                        </View>
                        <Text style={styles.docTitle}>{doc.name}</Text>
                        <Text style={styles.docInfo}>Type: {doc.type}</Text>
                        <Text style={styles.docInfo}>Uploaded: {doc.uploadDate}</Text>

                        <View style={styles.actions}>
                            <Button title="View" variant="outline" onPress={() => { }} style={{ flex: 1 }} />
                            <Button title="Download" variant="outline" onPress={() => { }} style={{ flex: 1 }} />
                        </View>
                    </Card>
                ))}
            </ScrollView>
        </View>
    );
};

export default ClientDocumentsScreen;
