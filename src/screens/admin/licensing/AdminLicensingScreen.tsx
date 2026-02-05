import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    Alert,
    Platform,
} from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import ThemeDropdown from '../../../components/ui/ThemeDropdown';
import ThemeBottomSheet from '../../../components/ui/ThemeBottomSheet';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import LinearGradient from 'react-native-linear-gradient';
import { Feature, Organization } from '../../../types';
import { mockOrganizations, mockFeatures, mockServiceProviders, mockReferralPartners } from '../../../utils/mockData';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const uniqueAdvisors = mockServiceProviders.map(sp => sp.name);
const uniqueReferralPartners = mockReferralPartners.map(rp => rp.name);

const AdminLicensingScreen = () => {
    const theme = useTheme();
    const [organizations, setOrganizations] = useState<Organization[]>(mockOrganizations);
    const [isModalVisible, setModalVisible] = useState(false);
    const [editingOrg, setEditingOrg] = useState<Organization | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        type: 'Enterprise',
        startDate: '',
        endDate: '',
        isActive: true,
        features: JSON.parse(JSON.stringify(mockFeatures)) as Feature[],
        assignedSP: 'all',
        referralPartner: 'all',
    });

    // Filter States
    const [showFilters, setShowFilters] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        status: 'all' as 'all' | 'active' | 'inactive',
        assignedSP: 'all',
        referralPartner: 'all',
    });
    const [tempFilters, setTempFilters] = useState({
        status: 'all' as 'all' | 'active' | 'inactive',
        assignedSP: 'all',
        referralPartner: 'all',
    });

    const filteredOrganizations = organizations.filter(org => {
        const matchesSearch = org.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filters.status === 'all' || (filters.status === 'active' ? org.isActive : !org.isActive);
        const matchesAdvisor = filters.assignedSP === 'all' || org.assignedSP === filters.assignedSP;
        const matchesReferral = filters.referralPartner === 'all' || org.referralPartner === filters.referralPartner;
        return matchesSearch && matchesStatus && matchesAdvisor && matchesReferral;
    });

    const handleApplyFilters = () => {
        setFilters(tempFilters);
        setShowFilters(false);
    };

    const handleResetFilters = () => {
        const reset = {
            status: 'all' as 'all' | 'active' | 'inactive',
            assignedSP: 'all',
            referralPartner: 'all',
        };
        setTempFilters(reset);
        setFilters(reset);
        setShowFilters(false);
    };

    const handleOpenModal = (org?: Organization) => {
        if (org) {
            setEditingOrg(org);
            setFormData({
                name: org.name,
                type: org.type,
                startDate: org.startDate,
                endDate: org.endDate,
                isActive: org.isActive,
                features: [...org.features],
                assignedSP: org.assignedSP || 'all',
                referralPartner: org.referralPartner || 'all',
            });
        } else {
            setEditingOrg(null);
            setFormData({
                name: '',
                type: 'Enterprise',
                startDate: new Date().toISOString().split('T')[0],
                endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
                isActive: true,
                features: JSON.parse(JSON.stringify(mockFeatures)),
                assignedSP: 'all',
                referralPartner: 'all',
            });
        }
        setModalVisible(true);
    };

    const handleSaveOrg = () => {
        if (!formData.name) {
            Alert.alert('Error', 'Organization name is required');
            return;
        }

        if (editingOrg) {
            setOrganizations(organizations.map(o => o.id === editingOrg.id ? { ...editingOrg, ...formData } : o));
        } else {
            const newOrg: Organization = {
                id: Math.random().toString(36).substr(2, 9),
                ...formData,
            };
            setOrganizations([...organizations, newOrg]);
        }
        setModalVisible(false);
    };

    const toggleFeature = (featureId: string) => {
        setFormData(prev => ({
            ...prev,
            features: prev.features.map(f => f.id === featureId ? { ...f, isActive: !f.isActive } : f)
        }));
    };

    const updateFeatureAllocated = (featureId: string, count: string) => {
        const val = parseInt(count) || 0;
        setFormData(prev => ({
            ...prev,
            features: prev.features.map(f => f.id === featureId ? { ...f, allocatedLicenses: val } : f)
        }));
    };

    const stats = [
        { label: 'Total Orgs', value: organizations.length.toString(), icon: 'business-outline', color: theme.colors.primary },
        { label: 'Active Orgs', value: organizations.filter(o => o.isActive).length.toString(), icon: 'trending-up-outline', color: theme.colors.success },
        { label: 'Total Users', value: '2,847', icon: 'people-outline', color: theme.colors.info },
        { label: 'Revenue', value: '$127K', icon: 'cash-outline', color: theme.colors.warning },
    ];

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
        headerButtons: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12
        },
        filterButtonIcon: {
            padding: 8,
            backgroundColor: 'rgba(0,0,0,0.05)',
            borderRadius: 8,
        },
        searchContainer: {
            paddingHorizontal: 16,
            marginBottom: 16,
        },
        searchInner: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.colors.surface,
            borderRadius: 12,
            paddingHorizontal: 12,
            borderWidth: 1,
            borderColor: theme.effects.cardBorder,
        },
        searchInput: {
            flex: 1,
            marginLeft: 8,
            fontSize: 14,
        },
        emptyContainer: {
            alignItems: 'center',
            justifyContent: 'center',
            padding: 40,
        },
        pickerContainer: {
            borderWidth: 1,
            borderRadius: 12,
            height: 50,
            justifyContent: 'center',
            marginTop: 8,
        },
        modalButtons: {
            flexDirection: 'row',
            gap: 12,
            marginTop: 32,
            marginBottom: 16,
        },
        statsContainer: {
            paddingHorizontal: 16,
            paddingBottom: 20,
            gap: 12,
        },
        statCard: {
            backgroundColor: theme.colors.surface,
            borderRadius: 16,
            padding: 16,
            width: 140,
            borderWidth: 1,
            borderColor: theme.effects.cardBorder,
        },
        statIcon: {
            width: 36,
            height: 36,
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 8,
        },
        statValue: {
            fontSize: 20,
            fontWeight: 'bold',
            color: theme.colors.text,
        },
        statLabel: {
            fontSize: 12,
            color: theme.colors.textSecondary,
            marginTop: 2,
        },
        listContainer: {
            padding: 16,
        },
        sectionTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: theme.colors.text,
            marginBottom: 16,
        },
        orgCard: {
            backgroundColor: theme.colors.surface,
            borderRadius: 16,
            padding: 16,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: theme.effects.cardBorder,
        },
        orgHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 16,
        },
        iconContainer: {
            width: 40,
            height: 40,
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
        },
        orgInfo: {
            flex: 1,
            marginLeft: 12,
        },
        orgName: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.colors.text,
        },
        typeBadge: {
            alignSelf: 'flex-start',
            paddingHorizontal: 8,
            paddingVertical: 2,
            borderRadius: 6,
            marginTop: 4,
        },
        typeText: {
            fontSize: 11,
            fontWeight: '600',
        },
        editButton: {
            padding: 8,
        },
        datesGrid: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingTop: 12,
            borderTopWidth: 1,
            borderTopColor: theme.effects.cardBorder,
            marginBottom: 12,
        },
        dateLabel: {
            fontSize: 10,
            color: theme.colors.textSecondary,
            fontWeight: '600',
            marginBottom: 4,
        },
        dateValue: {
            fontSize: 13,
            color: theme.colors.text,
            fontWeight: '500',
        },
        statusRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        statusBadge: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
        },
        statusText: {
            fontSize: 13,
            fontWeight: '600',
        },
        modal: {
            margin: 0,
            justifyContent: 'flex-end',
        },
        modalOverlay: {
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'flex-end',
        },
        modalContent: {
            backgroundColor: theme.colors.surface,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            padding: 24,
            paddingBottom: 40,
            maxHeight: SCREEN_HEIGHT * 0.9,
        },
        modalHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 24,
        },
        modalTitle: {
            fontSize: 20,
            fontWeight: 'bold',
            color: theme.colors.text,
        },
        form: {
            gap: 20,
        },
        formGroup: {
            gap: 8,
        },
        label: {
            fontSize: 14,
            fontWeight: '600',
            color: theme.colors.text,
        },
        featureItem: {
            padding: 16,
            borderRadius: 12,
            backgroundColor: theme.colors.background,
            marginBottom: 12,
            borderWidth: 1,
            borderColor: theme.effects.cardBorder,
        },
        featureHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12,
        },
        featureName: {
            fontSize: 15,
            fontWeight: 'bold',
            color: theme.colors.text,
        },
        featureControls: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
        },
        allocatedInput: {
            flex: 1,
            backgroundColor: theme.colors.surface,
            height: 40,
            borderRadius: 8,
            paddingHorizontal: 12,
            color: theme.colors.text,
            borderWidth: 1,
            borderColor: theme.effects.cardBorder,
        },
        saveButton: {
            marginTop: 24,
        },
    });

    const renderOrg = ({ item }: { item: Organization }) => (
        <Card style={styles.orgCard}>
            <View style={styles.orgHeader}>
                <View style={[styles.iconContainer, { backgroundColor: theme.colors.primary + '20' }]}>
                    <Icon name="business-outline" size={20} color={theme.colors.primary} />
                </View>
                <View style={styles.orgInfo}>
                    <Text style={styles.orgName}>{item.name}</Text>
                    <View style={[styles.typeBadge, { backgroundColor: theme.colors.info + '20' }]}>
                        <Text style={[styles.typeText, { color: theme.colors.info }]}>{item.type}</Text>
                    </View>
                </View>
                <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => handleOpenModal(item)}
                >
                    <Icon name="create-outline" size={22} color={theme.colors.primary} />
                </TouchableOpacity>
            </View>

            <View style={styles.datesGrid}>
                <View>
                    <Text style={styles.dateLabel}>START DATE</Text>
                    <Text style={styles.dateValue}>{item.startDate}</Text>
                </View>
                <View>
                    <Text style={styles.dateLabel}>END DATE</Text>
                    <Text style={styles.dateValue}>{item.endDate}</Text>
                </View>
            </View>

            <View style={styles.statusRow}>
                <Text style={styles.dateLabel}>STATUS</Text>
                <View style={styles.statusBadge}>
                    <Icon
                        name={item.isActive ? "checkmark-circle" : "close-circle"}
                        size={16}
                        color={item.isActive ? theme.colors.success : theme.colors.error}
                    />
                    <Text style={[styles.statusText, { color: item.isActive ? theme.colors.success : theme.colors.error }]}>
                        {item.isActive ? 'Active' : 'Inactive'}
                    </Text>
                </View>
            </View>
        </Card>
    );

    const renderFilters = () => (
        <ThemeBottomSheet
            isVisible={showFilters}
            onClose={() => setShowFilters(false)}
            title="Filters"
        >
            <Text style={[styles.label, { color: theme.colors.text }]}>Status</Text>
            <View style={styles.modalButtons}>
                {['all', 'active', 'inactive'].map((status) => (
                    <TouchableOpacity
                        key={status}
                        style={[
                            { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
                            tempFilters.status === status ? { backgroundColor: theme.colors.primary } : { borderColor: theme.effects.cardBorder, borderWidth: 1 }
                        ]}
                        onPress={() => setTempFilters({ ...tempFilters, status: status as any })}
                    >
                        <Text style={[
                            { fontSize: 14, fontWeight: '500' },
                            tempFilters.status === status ? { color: '#fff' } : { color: theme.colors.text }
                        ]}>{status.toUpperCase()}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <ThemeDropdown
                label="Assigned Service Provider"
                options={[{ label: 'All Advisors', value: 'all' }, ...uniqueAdvisors.map(ad => ({ label: ad, value: ad }))]}
                selectedValue={tempFilters.assignedSP}
                onValueChange={value => setTempFilters({ ...tempFilters, assignedSP: value })}
            />

            <ThemeDropdown
                label="Referral Partner"
                options={[{ label: 'All Partners', value: 'all' }, ...uniqueReferralPartners.map(rp => ({ label: rp, value: rp }))]}
                selectedValue={tempFilters.referralPartner}
                onValueChange={value => setTempFilters({ ...tempFilters, referralPartner: value })}
            />

            <View style={[styles.modalButtons, { marginBottom: 20 }]}>
                <Button title="Reset All" variant="outline" onPress={handleResetFilters} style={{ flex: 1 }} />
                <Button title="Apply Filters" onPress={handleApplyFilters} style={{ flex: 1 }} />
            </View>
        </ThemeBottomSheet>
    );

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.title}>License Management</Text>
                        <Text style={styles.subtitle}>Manage organization licenses</Text>
                    </View>
                    <View style={styles.headerButtons}>
                        <TouchableOpacity style={styles.filterButtonIcon} onPress={() => setShowFilters(true)}>
                            <Icon name="filter" size={24} color={theme.colors.primary} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleOpenModal()}>
                            <Icon name="add-circle" size={32} color={theme.colors.primary} />
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statsContainer}>
                    {stats.map((stat, idx) => (
                        <View key={idx} style={styles.statCard}>
                            <View style={[styles.statIcon, { backgroundColor: stat.color + '20' }]}>
                                <Icon name={stat.icon} size={20} color={stat.color} />
                            </View>
                            <Text style={styles.statValue}>{stat.value}</Text>
                            <Text style={styles.statLabel}>{stat.label}</Text>
                        </View>
                    ))}
                </ScrollView>

                <View style={[styles.searchContainer, { backgroundColor: theme.colors.surface, borderColor: theme.effects.cardBorder }]}>
                    <View style={styles.searchInner}>
                        <Icon name="search" size={20} color={theme.colors.textSecondary} />
                        <Input
                            style={[styles.searchInput, { color: theme.colors.text, borderBottomWidth: 0, height: 40 }]}
                            placeholder="Search organizations..."
                            placeholderTextColor={theme.colors.textSecondary}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>
                </View>

                <View style={styles.listContainer}>
                    <Text style={styles.sectionTitle}>Organizations</Text>
                    {filteredOrganizations.map(org => (
                        <View key={org.id}>
                            {renderOrg({ item: org })}
                        </View>
                    ))}
                    {filteredOrganizations.length === 0 && (
                        <View style={styles.emptyContainer}>
                            <Icon name="business-outline" size={48} color={theme.colors.textSecondary} />
                            <Text style={{ color: theme.colors.textSecondary, marginTop: 12 }}>No organizations found</Text>
                        </View>
                    )}
                </View>
            </ScrollView>

            {renderFilters()}

            <Modal
                isVisible={isModalVisible}
                onBackdropPress={() => setModalVisible(false)}
                onBackButtonPress={() => setModalVisible(false)}
                swipeDirection={['down']}
                onSwipeComplete={() => setModalVisible(false)}
                style={styles.modal}
                backdropOpacity={0.5}
            >
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>
                            {editingOrg ? 'Edit Organization' : 'Add Organization'}
                        </Text>
                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                            <Icon name="close" size={24} color={theme.colors.text} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Organization Name</Text>
                            <Input
                                placeholder="e.g. Acme Corp"
                                value={formData.name}
                                onChangeText={(text) => setFormData({ ...formData, name: text })}
                            />
                        </View>

                        <ThemeDropdown
                            label="Assigned advisor"
                            options={[{ label: 'Select Advisor', value: 'all' }, ...uniqueAdvisors.map(ad => ({ label: ad, value: ad }))]}
                            selectedValue={formData.assignedSP}
                            onValueChange={(itemValue) => setFormData({ ...formData, assignedSP: itemValue })}
                        />

                        <ThemeDropdown
                            label="Referral Partner"
                            options={[{ label: 'Select Partner', value: 'all' }, ...uniqueReferralPartners.map(rp => ({ label: rp, value: rp }))]}
                            selectedValue={formData.referralPartner}
                            onValueChange={(itemValue) => setFormData({ ...formData, referralPartner: itemValue })}
                        />

                        <View style={{ flexDirection: 'row', gap: 12 }}>
                            <View style={[styles.formGroup, { flex: 1 }]}>
                                <Text style={styles.label}>Start Date</Text>
                                <Input
                                    placeholder="YYYY-MM-DD"
                                    value={formData.startDate}
                                    onChangeText={(text) => setFormData({ ...formData, startDate: text })}
                                />
                            </View>
                            <View style={[styles.formGroup, { flex: 1 }]}>
                                <Text style={styles.label}>End Date</Text>
                                <Input
                                    placeholder="YYYY-MM-DD"
                                    value={formData.endDate}
                                    onChangeText={(text) => setFormData({ ...formData, endDate: text })}
                                />
                            </View>
                        </View>

                        <View style={styles.formGroup}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text style={styles.label}>Active Status</Text>
                                <TouchableOpacity
                                    onPress={() => setFormData({ ...formData, isActive: !formData.isActive })}
                                    style={{
                                        width: 48,
                                        height: 24,
                                        borderRadius: 12,
                                        backgroundColor: formData.isActive ? theme.colors.success : theme.colors.error,
                                        padding: 2
                                    }}
                                >
                                    <View style={{
                                        width: 20,
                                        height: 20,
                                        borderRadius: 10,
                                        backgroundColor: '#FFF',
                                        alignSelf: formData.isActive ? 'flex-end' : 'flex-start'
                                    }} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Feature Licenses</Text>
                            {formData.features.map((feature) => (
                                <View key={feature.id} style={styles.featureItem}>
                                    <View style={styles.featureHeader}>
                                        <Text style={styles.featureName}>{feature.name}</Text>
                                        <TouchableOpacity onPress={() => toggleFeature(feature.id)}>
                                            <Icon
                                                name={feature.isActive ? "toggle" : "toggle-outline"}
                                                size={32}
                                                color={feature.isActive ? theme.colors.success : theme.colors.textSecondary}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                    {feature.isActive && (
                                        <View style={styles.featureControls}>
                                            <View style={{ flex: 1 }}>
                                                <Text style={[styles.dateLabel, { marginBottom: 4 }]}>ALLOCATED</Text>
                                                <Input
                                                    keyboardType="numeric"
                                                    value={feature.allocatedLicenses.toString()}
                                                    onChangeText={(text) => updateFeatureAllocated(feature.id, text)}
                                                    style={{ height: 40 }}
                                                />
                                            </View>
                                            <View style={{ flex: 1 }}>
                                                <Text style={[styles.dateLabel, { marginBottom: 4 }]}>BILLING</Text>
                                                <View style={[styles.allocatedInput, { justifyContent: 'center' }]}>
                                                    <Text style={{ color: theme.colors.text, textTransform: 'capitalize' }}>{feature.billingType}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    )}
                                </View>
                            ))}
                        </View>

                        <Button
                            title={editingOrg ? 'Update Organization' : 'Add Organization'}
                            onPress={handleSaveOrg}
                            style={styles.saveButton}
                        />
                    </ScrollView>
                </View>
            </Modal>
        </View>
    );
};

export default AdminLicensingScreen;
