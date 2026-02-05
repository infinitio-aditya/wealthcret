import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView,
    Dimensions,
} from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { mockTeamMembers } from '../../../utils/mockData';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { TeamMember } from '../../../types';
import Icon from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import LinearGradient from 'react-native-linear-gradient';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Role {
    id: string;
    name: string;
    key: string;
    description: string;
    membersCount: number;
    color: string;
}

const availableRoles: Role[] = [
    {
        id: '1',
        name: 'Administrator',
        key: 'ADMINISTRATOR',
        description: 'Full system access and control',
        membersCount: 3,
        color: '#ef4444',
    },
    {
        id: '2',
        name: 'Service Provider',
        key: 'SERVICE_PROVIDER',
        description: 'Manage clients and services',
        membersCount: 12,
        color: '#3b82f6',
    },
    {
        id: '3',
        name: 'Referral Partner',
        key: 'REFERRAL_PARTNER',
        description: 'Limited access for partners',
        membersCount: 8,
        color: '#8b5cf6',
    },
    {
        id: '4',
        name: 'Support Staff',
        key: 'SUPPORT_STAFF',
        description: 'Customer support team',
        membersCount: 5,
        color: '#f59e0b',
    },
];

const TeamMembersScreen = () => {
    const theme = useTheme();
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Modal states
    const [isAddModalVisible, setAddModalVisible] = useState(false);
    const [isDetailModalVisible, setDetailModalVisible] = useState(false);
    const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
    const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

    // Form states
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: '',
    });

    useEffect(() => {
        loadTeamMembers();
    }, []);

    const loadTeamMembers = () => {
        setTimeout(() => {
            setTeamMembers(mockTeamMembers);
            setLoading(false);
        }, 500);
    };

    const handleRefresh = () => {
        setRefreshing(true);
        setTimeout(() => {
            setTeamMembers(mockTeamMembers);
            setRefreshing(false);
        }, 1000);
    };

    const getRoleById = (roleId: string) => {
        return availableRoles.find(r => r.id === roleId);
    };

    const toggleRole = (roleId: string) => {
        if (selectedRoles.includes(roleId)) {
            setSelectedRoles(selectedRoles.filter(r => r !== roleId));
        } else {
            setSelectedRoles([...selectedRoles, roleId]);
        }
    };

    const handleOpenDetail = (member: TeamMember) => {
        setSelectedMember(member);
        setSelectedRoles(member.roles || []);
        setDetailModalVisible(true);
    };

    const handleAddMember = () => {
        if (!formData.name || !formData.email) {
            return;
        }
        const newMember: TeamMember = {
            id: Math.random().toString(36).substr(2, 9),
            name: formData.name,
            email: formData.email,
            role: formData.role || 'Team Member',
            roles: [],
            joinDate: new Date().toISOString().split('T')[0],
        };
        setTeamMembers([newMember, ...teamMembers]);
        setAddModalVisible(false);
        setFormData({ name: '', email: '', role: '' });
    };

    const handleSaveRoles = () => {
        if (selectedMember) {
            setTeamMembers(teamMembers.map(m =>
                m.id === selectedMember.id ? { ...m, roles: selectedRoles } : m
            ));
        }
        setDetailModalVisible(false);
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        loadingContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
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
            marginBottom: 4,
        },
        subtitle: {
            fontSize: 14,
            color: theme.colors.textSecondary,
        },
        addButton: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 12,
            gap: 6,
        },
        addButtonText: {
            color: theme.colors.textOnPrimary,
            fontWeight: '600',
            fontSize: 14,
        },
        statsRow: {
            flexDirection: 'row',
            paddingHorizontal: 20,
            gap: 12,
            marginBottom: 20,
        },
        statCard: {
            flex: 1,
            padding: 16,
        },
        statIconContainer: {
            width: 36,
            height: 36,
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 8,
        },
        statValue: {
            fontSize: 22,
            fontWeight: 'bold',
            color: theme.colors.text,
        },
        statLabel: {
            fontSize: 12,
            color: theme.colors.textSecondary,
        },
        listContainer: {
            paddingBottom: 40,
        },
        memberCard: {
            marginHorizontal: 20,
            marginBottom: 12,
            padding: 16,
        },
        memberHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 16,
        },
        avatar: {
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: theme.colors.primary,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 12,
        },
        avatarText: {
            fontSize: 18,
            fontWeight: 'bold',
            color: theme.colors.textOnPrimary,
        },
        memberInfo: {
            flex: 1,
        },
        memberName: {
            fontSize: 18,
            fontWeight: '600',
            color: theme.colors.text,
            marginBottom: 2,
        },
        memberRoleLabel: {
            fontSize: 14,
            color: theme.colors.textSecondary,
        },
        contactInfo: {
            flexDirection: 'column',
            gap: 16,
            marginBottom: 16,
        },
        contactItem: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
        },
        contactText: {
            fontSize: 13,
            color: theme.colors.textSecondary,
        },
        roleChipsContainer: {
            paddingTop: 12,
            borderTopWidth: 1,
            borderTopColor: theme.effects.cardBorder,
        },
        roleHeaderRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            marginBottom: 8,
        },
        roleCountText: {
            fontSize: 13,
            fontWeight: '500',
            color: theme.colors.primary,
        },
        chipsWrapper: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 8,
        },
        roleChip: {
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 6,
            borderWidth: 1,
        },
        roleChipText: {
            fontSize: 11,
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
        modalSubtitle: {
            fontSize: 14,
            color: theme.colors.textSecondary,
        },
        memberDetailHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
        },
        form: {
            gap: 16,
        },
        modalButton: {
            marginTop: 8,
        },
        detailSummary: {
            flexDirection: 'column',
            backgroundColor: theme.colors.background,
            padding: 16,
            borderRadius: 16,
            marginBottom: 24,
        },
        summaryItem: {
            flex: 1,
        },
        summaryLabel: {
            fontSize: 12,
            color: theme.colors.textSecondary,
            marginBottom: 4,
        },
        summaryValue: {
            fontSize: 14,
            fontWeight: '500',
            color: theme.colors.text,
        },
        sectionTitle: {
            fontSize: 16,
            fontWeight: 'bold',
            color: theme.colors.text,
            marginBottom: 4,
        },
        sectionSubtitle: {
            fontSize: 13,
            color: theme.colors.textSecondary,
            marginBottom: 16,
        },
        rolesList: {
            gap: 12,
            marginBottom: 24,
        },
        roleItem: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 12,
            backgroundColor: theme.colors.background,
            borderRadius: 12,
            borderWidth: 2,
            borderColor: 'transparent',
        },
        roleIconBox: {
            width: 40,
            height: 40,
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 12,
        },
        roleInfoText: {
            flex: 1,
        },
        roleName: {
            fontSize: 15,
            fontWeight: '600',
            color: theme.colors.text,
            marginBottom: 2,
        },
        roleDesc: {
            fontSize: 12,
            color: theme.colors.textSecondary,
        },
        checkbox: {
            width: 24,
            height: 24,
            borderRadius: 12,
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: 12,
        },
        modalActionRow: {
            flexDirection: 'row',
            gap: 12,
        },
        headerButtons: { flexDirection: 'row', gap: 12 },
    });

    const renderHeader = () => (
        <View style={styles.header}>
            <View>
                <Text style={styles.title}>Team Members</Text>
                <Text style={styles.subtitle}>Manage team roles and permissions</Text>
            </View>
            {/* <TouchableOpacity onPress={() => setAddModalVisible(true)}>
                <LinearGradient
                    colors={theme.effects.buttonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.addButton}
                >
                    <Icon name="person-add" size={20} color={theme.colors.textOnPrimary} />
                    <Text style={styles.addButtonText}>Add</Text>
                </LinearGradient>
            </TouchableOpacity> */}
            <View style={styles.headerButtons}>
                <TouchableOpacity onPress={() => setAddModalVisible(true)}>
                    <Icon name="add-circle" size={32} color={theme.colors.primary} />
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderStats = () => (
        <View style={styles.statsRow}>
            <Card style={styles.statCard}>
                <View style={[styles.statIconContainer, { backgroundColor: theme.colors.primary + '20' }]}>
                    <Icon name="people" size={20} color={theme.colors.primary} />
                </View>
                <Text style={styles.statValue}>{teamMembers.length}</Text>
                <Text style={styles.statLabel}>Total Members</Text>
            </Card>
            <Card style={styles.statCard}>
                <View style={[styles.statIconContainer, { backgroundColor: theme.colors.success + '20' }]}>
                    <Icon name="shield-checkmark" size={20} color={theme.colors.success} />
                </View>
                <Text style={styles.statValue}>{availableRoles.length}</Text>
                <Text style={styles.statLabel}>Active Roles</Text>
            </Card>
        </View>
    );

    const renderTeamMember = ({ item }: { item: TeamMember }) => {
        const getInitials = (name: string) => {
            return name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase();
        };

        return (
            <TouchableOpacity activeOpacity={0.8} onPress={() => handleOpenDetail(item)}>
                <Card style={styles.memberCard}>
                    <View style={styles.memberHeader}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>{getInitials(item.name)}</Text>
                        </View>
                        <View style={styles.memberInfo}>
                            <Text style={styles.memberName}>{item.name}</Text>
                            <Text style={styles.memberRoleLabel}>{item.role}</Text>
                        </View>
                    </View>

                    <View style={styles.contactInfo}>
                        <View style={styles.contactItem}>
                            <Icon name="mail-outline" size={14} color={theme.colors.textSecondary} />
                            <Text style={styles.contactText}>{item.email}</Text>
                        </View>
                        <View style={styles.contactItem}>
                            <Icon name="calendar-outline" size={14} color={theme.colors.textSecondary} />
                            <Text style={styles.contactText}>Joined {item.joinDate}</Text>
                        </View>
                    </View>

                    <View style={styles.roleChipsContainer}>
                        <View style={styles.roleHeaderRow}>
                            <Icon name="pricetag-outline" size={14} color={theme.colors.primary} />
                            <Text style={styles.roleCountText}>
                                {item.roles?.length || 0} {item.roles?.length === 1 ? 'Role' : 'Roles'}
                            </Text>
                        </View>
                        <View style={styles.chipsWrapper}>
                            {item.roles?.slice(0, 3).map((roleId) => {
                                const role = getRoleById(roleId);
                                if (!role) return null;
                                return (
                                    <View
                                        key={roleId}
                                        style={[styles.roleChip, { backgroundColor: role.color + '15', borderColor: role.color + '30' }]}
                                    >
                                        <Text style={[styles.roleChipText, { color: role.color }]}>{role.name}</Text>
                                    </View>
                                );
                            })}
                            {(item.roles?.length || 0) > 3 && (
                                <View style={[styles.roleChip, { backgroundColor: theme.colors.primary + '15' }]}>
                                    <Text style={[styles.roleChipText, { color: theme.colors.primary }]}>
                                        +{(item.roles?.length || 0) - 3}
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>
                </Card>
            </TouchableOpacity>
        );
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                ListHeaderComponent={() => (
                    <>
                        {renderHeader()}
                        {renderStats()}
                    </>
                )}
                data={teamMembers}
                renderItem={renderTeamMember}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
                refreshing={refreshing}
                onRefresh={handleRefresh}
            />

            {/* Add Member Modal */}
            <Modal
                isVisible={isAddModalVisible}
                onBackdropPress={() => setAddModalVisible(false)}
                onBackButtonPress={() => setAddModalVisible(false)}
                swipeDirection={['down']}
                onSwipeComplete={() => setAddModalVisible(false)}
                style={styles.modal}
            >
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Add Team Member</Text>
                        <TouchableOpacity onPress={() => setAddModalVisible(false)}>
                            <Icon name="close" size={24} color={theme.colors.text} />
                        </TouchableOpacity>
                    </View>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={styles.form}>
                            <Input
                                label="Full Name"
                                placeholder="Enter full name"
                                value={formData.name}
                                onChangeText={(text) => setFormData({ ...formData, name: text })}
                            />
                            <Input
                                label="Email Address"
                                placeholder="Enter email address"
                                value={formData.email}
                                onChangeText={(text) => setFormData({ ...formData, email: text })}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                            <Input
                                label="Role/Title"
                                placeholder="Enter role (e.g. Financial Advisor)"
                                value={formData.role}
                                onChangeText={(text) => setFormData({ ...formData, role: text })}
                            />
                            <Button
                                title="Add Member"
                                onPress={handleAddMember}
                                style={styles.modalButton}
                            />
                        </View>
                    </ScrollView>
                </View>
            </Modal>

            {/* Member Details & Role Assignment Modal */}
            <Modal
                isVisible={isDetailModalVisible}
                onBackdropPress={() => setDetailModalVisible(false)}
                onBackButtonPress={() => setDetailModalVisible(false)}
                swipeDirection={['down']}
                onSwipeComplete={() => {
                    setDetailModalVisible(false);
                    setSelectedMember(null);
                }}
                style={styles.modal}
            >
                <View style={[styles.modalContent, { maxHeight: SCREEN_HEIGHT * 0.85 }]}>
                    <View style={styles.modalHeader}>
                        <View style={styles.memberDetailHeader}>
                            <View style={[styles.avatar, { width: 44, height: 44, borderRadius: 22 }]}>
                                <Text style={[styles.avatarText, { fontSize: 16 }]}>
                                    {selectedMember ? selectedMember.name.charAt(0) : ''}
                                </Text>
                            </View>
                            <View>
                                <Text style={styles.modalTitle}>{selectedMember?.name}</Text>
                                <Text style={styles.modalSubtitle}>{selectedMember?.role}</Text>
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => setDetailModalVisible(false)}>
                            <Icon name="close" size={24} color={theme.colors.text} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={styles.detailSummary}>
                            <View style={styles.summaryItem}>
                                <Text style={styles.summaryLabel}>Email</Text>
                                <Text style={styles.summaryValue}>{selectedMember?.email}</Text>
                            </View>
                            <View style={styles.summaryItem}>
                                <Text style={styles.summaryLabel}>Joined</Text>
                                <Text style={styles.summaryValue}>{selectedMember?.joinDate}</Text>
                            </View>
                        </View>

                        <Text style={styles.sectionTitle}>Assign Roles</Text>
                        <Text style={styles.sectionSubtitle}>Select one or more roles for this member</Text>

                        <View style={styles.rolesList}>
                            {availableRoles.map((role) => {
                                const isSelected = selectedRoles.includes(role.id);
                                return (
                                    <TouchableOpacity
                                        key={role.id}
                                        activeOpacity={0.7}
                                        onPress={() => toggleRole(role.id)}
                                        style={[
                                            styles.roleItem,
                                            isSelected && {
                                                backgroundColor: role.color + '10',
                                                borderColor: role.color,
                                                borderWidth: 2,
                                            }
                                        ]}
                                    >
                                        <View style={[styles.roleIconBox, { backgroundColor: role.color + '20' }]}>
                                            <Icon name="shield" size={18} color={role.color} />
                                        </View>
                                        <View style={styles.roleInfoText}>
                                            <Text style={[styles.roleName, isSelected && { color: role.color }]}>
                                                {role.name}
                                            </Text>
                                            <Text style={styles.roleDesc}>{role.description}</Text>
                                        </View>
                                        <View style={[
                                            styles.checkbox,
                                            { backgroundColor: isSelected ? role.color : theme.colors.textSecondary + '20' }
                                        ]}>
                                            {isSelected && <Icon name="checkmark" size={16} color="#fff" />}
                                        </View>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                        <View style={styles.modalActionRow}>
                            <Button
                                title="Cancel"
                                variant="secondary"
                                onPress={() => setDetailModalVisible(false)}
                                style={{ flex: 1 }}
                            />
                            <Button
                                title="Save Changes"
                                onPress={handleSaveRoles}
                                style={{ flex: 1 }}
                            />
                        </View>
                    </ScrollView>
                </View>
            </Modal>
        </View>
    );
};

export default TeamMembersScreen;
