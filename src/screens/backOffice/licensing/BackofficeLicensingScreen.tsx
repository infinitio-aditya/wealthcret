import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    Alert,
} from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import ThemeDropdown from '../../../components/ui/ThemeDropdown';
import ThemeBottomSheet from '../../../components/ui/ThemeBottomSheet';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Icon from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import { License, TeamMember } from '../../../types';
import { mockLicenses, mockBackofficeTeamMembers, mockServiceProviders, mockReferralPartners } from '../../../utils/mockData';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const uniqueAdvisors = mockServiceProviders.map(sp => sp.name);
const uniqueReferralPartners = mockReferralPartners.map(rp => rp.name);

const BackofficeLicensingScreen = () => {
    const theme = useTheme();
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>(mockBackofficeTeamMembers);
    const [isManageModalVisible, setManageModalVisible] = useState(false);
    const [isFilterModalVisible, setFilterModalVisible] = useState(false);
    const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
    const [tempAssignedLicenses, setTempAssignedLicenses] = useState<string[]>([]);
    const [filters, setFilters] = useState({
        licenses: [] as string[],
        assignedSP: 'all',
        referralPartner: 'all',
    });
    const [tempFilters, setTempFilters] = useState({
        licenses: [] as string[],
        assignedSP: 'all',
        referralPartner: 'all',
    });

    const filteredMembers = useMemo(() => {
        return teamMembers.filter(member => {
            const matchesLicense = filters.licenses.length === 0 ||
                filters.licenses.some(licenseId => member.assignedLicenses?.includes(licenseId));
            const matchesAdvisor = filters.assignedSP === 'all' || member.assignedSP === filters.assignedSP;
            const matchesReferral = filters.referralPartner === 'all' || member.referralPartner === filters.referralPartner;
            return matchesLicense && matchesAdvisor && matchesReferral;
        });
    }, [teamMembers, filters]);

    const handleOpenManageModal = (member: TeamMember) => {
        setSelectedMember(member);
        setTempAssignedLicenses([...(member.assignedLicenses || [])]);
        setManageModalVisible(true);
    };

    const handleSaveLicenses = () => {
        if (selectedMember) {
            setTeamMembers(mockBackofficeTeamMembers.map(m =>
                m.id === selectedMember.id ? { ...m, assignedLicenses: tempAssignedLicenses } : m
            ));
        }
        setManageModalVisible(false);
    };

    const toggleLicense = (licenseId: string) => {
        setTempAssignedLicenses(prev =>
            prev.includes(licenseId)
                ? prev.filter(id => id !== licenseId)
                : [...prev, licenseId]
        );
    };

    const handleApplyFilters = () => {
        setFilters(tempFilters);
        setFilterModalVisible(false);
    };

    const handleResetFilters = () => {
        const reset = {
            licenses: [] as string[],
            assignedSP: 'all',
            referralPartner: 'all',
        };
        setTempFilters(reset);
        setFilters(reset);
        setFilterModalVisible(false);
    };

    const toggleLicenseFilter = (licenseId: string) => {
        setTempFilters(prev => {
            const licenses = prev.licenses.includes(licenseId)
                ? prev.licenses.filter(id => id !== licenseId)
                : [...prev.licenses, licenseId];
            return { ...prev, licenses };
        });
    };

    const renderLicenseCard = (license: License) => {
        const percentage = Math.round((license.usedLicenses / license.allocatedLicenses) * 100);
        const usageColor = percentage >= 90 ? theme.colors.error : percentage >= 70 ? theme.colors.warning : theme.colors.success;

        return (
            <View key={license.id} style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: theme.colors.primary + '20' }]}>
                    <Icon name="ribbon-outline" size={20} color={theme.colors.primary} />
                </View>
                <Text style={styles.statName} numberOfLines={1}>{license.featureName}</Text>
                <View style={styles.statUsageRow}>
                    <Text style={styles.statUsageLabel}>Used</Text>
                    <Text style={[styles.statUsageValue, { color: usageColor }]}>{license.usedLicenses || 0}/{license.allocatedLicenses || 0}</Text>
                </View>
                <View style={styles.progressBarContainer}>
                    <View style={[styles.progressBar, { width: `${percentage}%`, backgroundColor: usageColor }]} />
                </View>
                <Text style={[styles.percentageText, { color: usageColor }]}>{percentage}% utilized</Text>
            </View>
        );
    };

    const renderMember = ({ item }: { item: TeamMember }) => (
        <Card style={styles.memberCard}>
            <View style={styles.memberHeader}>
                <View style={[styles.avatar, { backgroundColor: theme.colors.primary + '20' }]}>
                    <Icon name="person-outline" size={20} color={theme.colors.primary} />
                </View>
                <View style={styles.memberInfo}>
                    <Text style={styles.memberName}>{item.name}</Text>
                    <View style={styles.contactRow}>
                        <Icon name="mail-outline" size={12} color={theme.colors.textSecondary} />
                        <Text style={styles.contactText} numberOfLines={1}>{item.email}</Text>
                    </View>
                </View>
                <TouchableOpacity
                    style={styles.manageButton}
                    onPress={() => handleOpenManageModal(item)}
                >
                    <Text style={styles.manageButtonText}>Manage</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.licensesSection}>
                <Text style={styles.licenseLabel}>Assigned Licenses ({item.assignedLicenses?.length || 0})</Text>
                <View style={styles.licenseBadges}>
                    {item.assignedLicenses?.map(lId => {
                        const license = mockLicenses.find(l => l.id === lId);
                        return (
                            <View key={lId} style={[styles.badge, { backgroundColor: theme.colors.primary + '15' }]}>
                                <Text style={[styles.badgeText, { color: theme.colors.primary }]}>{license?.featureName}</Text>
                            </View>
                        );
                    })}
                </View>
            </View>
        </Card>
    );

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
            gap: 12
        },
        sectionTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: theme.colors.text,
            marginHorizontal: 16,
            marginBottom: 12,
            marginTop: 8,
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
            width: 160,
            borderWidth: 1,
            borderColor: theme.effects.cardBorder,
        },
        statIcon: {
            width: 36,
            height: 36,
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 12,
        },
        statName: {
            fontSize: 14,
            fontWeight: 'bold',
            color: theme.colors.text,
            marginBottom: 8,
        },
        statUsageRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 8,
        },
        statUsageLabel: {
            fontSize: 11,
            color: theme.colors.textSecondary,
        },
        statUsageValue: {
            fontSize: 11,
            fontWeight: '600',
        },
        progressBarContainer: {
            height: 6,
            backgroundColor: theme.colors.background,
            borderRadius: 3,
            overflow: 'hidden',
        },
        progressBar: {
            height: '100%',
            borderRadius: 3,
        },
        percentageText: {
            fontSize: 10,
            textAlign: 'center',
            marginTop: 4,
            fontWeight: '500',
        },
        listContainer: {
            paddingBottom: 40,
        },
        memberCard: {
            backgroundColor: theme.colors.surface,
            borderRadius: 16,
            padding: 16,
            marginHorizontal: 16,
            marginBottom: 12,
            borderWidth: 1,
            borderColor: theme.effects.cardBorder,
        },
        memberHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 16,
        },
        avatar: {
            width: 40,
            height: 40,
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
        },
        memberInfo: {
            flex: 1,
            marginLeft: 12,
        },
        memberName: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.colors.text,
        },
        contactRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
            marginTop: 2,
        },
        contactText: {
            fontSize: 12,
            color: theme.colors.textSecondary,
            maxWidth: 150,
        },
        manageButton: {
            backgroundColor: theme.colors.surface,
            borderWidth: 1,
            borderColor: theme.effects.cardBorder,
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 8,
        },
        manageButtonText: {
            fontSize: 12,
            fontWeight: '600',
            color: theme.colors.primary,
        },
        licensesSection: {
            paddingTop: 12,
            borderTopWidth: 1,
            borderTopColor: theme.effects.cardBorder,
        },
        licenseLabel: {
            fontSize: 12,
            color: theme.colors.textSecondary,
            marginBottom: 8,
        },
        licenseBadges: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 6,
        },
        badge: {
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 6,
        },
        badgeText: {
            fontSize: 10,
            fontWeight: '600',
        },
        modal: {
            margin: 0,
            justifyContent: 'flex-end',
        },
        modalContent: {
            backgroundColor: theme.colors.surface,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            padding: 24,
            paddingBottom: 40,
            maxHeight: SCREEN_HEIGHT * 0.8,
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
        licenseOption: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 16,
            borderRadius: 12,
            backgroundColor: theme.colors.background,
            marginBottom: 8,
            borderWidth: 1,
            borderColor: theme.effects.cardBorder,
        },
        licenseOptionText: {
            fontSize: 15,
            color: theme.colors.text,
            fontWeight: '500',
        },
        filterOption: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 12,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: theme.effects.cardBorder,
            marginBottom: 8,
            gap: 12,
        },
        filterOptionSelected: {
            backgroundColor: theme.colors.primary + '10',
            borderColor: theme.colors.primary,
        },
        saveButton: {
            marginTop: 24,
        },
        pickerContainer: {
            borderWidth: 1,
            borderRadius: 12,
            height: 50,
            justifyContent: 'center',
            marginTop: 8,
            marginBottom: 16,
        },
        modalButtons: {
            flexDirection: 'row',
            gap: 12,
            marginTop: 24,
            marginBottom: 16,
        },
        filterLabel: {
            fontSize: 14,
            fontWeight: '600',
            color: theme.colors.text,
            marginTop: 16,
            marginBottom: 8,
        },
    });

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.title}>Licensing</Text>
                        <Text style={styles.subtitle}>Team member licenses</Text>
                    </View>
                    <View style={styles.headerButtons}>
                        <TouchableOpacity onPress={() => setFilterModalVisible(true)}>
                            <Icon name="filter" size={20} color={theme.colors.primary} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View>
                    <Text style={styles.sectionTitle}>Available Licenses</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statsContainer}>
                        {mockLicenses.map(l => renderLicenseCard(l))}
                    </ScrollView>
                </View>

                <View style={styles.listContainer}>
                    <Text style={styles.sectionTitle}>Team Members</Text>
                    {filteredMembers.map(member => (
                        <View key={member.id}>
                            {renderMember({ item: member })}
                        </View>
                    ))}
                    {filteredMembers.length === 0 && (
                        <View style={{ padding: 40, alignItems: 'center' }}>
                            <Icon name="search-outline" size={48} color={theme.colors.textSecondary} />
                            <Text style={{ color: theme.colors.textSecondary, marginTop: 12 }}>No members found</Text>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Management Modal */}
            <Modal
                isVisible={isManageModalVisible}
                onBackdropPress={() => setManageModalVisible(false)}
                style={styles.modal}
                backdropOpacity={0.5}
            >
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <View>
                            <Text style={styles.modalTitle}>Manage Licenses</Text>
                            <Text style={{ color: theme.colors.textSecondary, fontSize: 13 }}>{selectedMember?.name}</Text>
                        </View>
                        <TouchableOpacity onPress={() => setManageModalVisible(false)}>
                            <Icon name="close" size={24} color={theme.colors.text} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        {mockLicenses.map(license => (
                            <TouchableOpacity
                                key={license.id}
                                style={[styles.licenseOption, tempAssignedLicenses.includes(license.id) && { borderColor: theme.colors.primary }]}
                                onPress={() => toggleLicense(license.id)}
                            >
                                <Text style={styles.licenseOptionText}>{license.name}</Text>
                                <Icon
                                    name={tempAssignedLicenses.includes(license.id) ? "checkbox" : "square-outline"}
                                    size={24}
                                    color={tempAssignedLicenses.includes(license.id) ? theme.colors.primary : theme.colors.textSecondary}
                                />
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    <Button
                        title="Save Changes"
                        onPress={handleSaveLicenses}
                        style={styles.saveButton}
                    />
                </View>
            </Modal>

            <ThemeBottomSheet
                isVisible={isFilterModalVisible}
                onClose={() => setFilterModalVisible(false)}
                title="Filter by License"
            >
                <Text style={styles.filterLabel}>Licenses</Text>
                <View style={{ gap: 8 }}>
                    {mockLicenses.map(license => (
                        <TouchableOpacity
                            key={license.id}
                            style={[styles.filterOption, tempFilters.licenses.includes(license.id) && styles.filterOptionSelected]}
                            onPress={() => toggleLicenseFilter(license.id)}
                        >
                            <Icon
                                name={tempFilters.licenses.includes(license.id) ? "checkmark-circle" : "ellipse-outline"}
                                size={20}
                                color={tempFilters.licenses.includes(license.id) ? theme.colors.primary : theme.colors.textSecondary}
                            />
                            <Text style={{ color: theme.colors.text, fontWeight: tempFilters.licenses.includes(license.id) ? '600' : '400' }}>
                                {license.name}
                            </Text>
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

                <View style={styles.modalButtons}>
                    <Button title="Reset All" variant="outline" onPress={handleResetFilters} style={{ flex: 1 }} />
                    <Button title="Apply Filters" onPress={handleApplyFilters} style={{ flex: 1 }} />
                </View>
            </ThemeBottomSheet>
        </View>
    );
};

export default BackofficeLicensingScreen;
