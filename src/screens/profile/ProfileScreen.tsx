import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../../hooks/useTheme';
import { RootState } from '../../store';
import { logout } from '../../store/slices/authSlice';
import { setTheme } from '../../store/slices/themeSlice';
import Card from '../../components/ui/Card';
import { themes } from '../../theme/themes';

const ProfileScreen = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.auth.user);
    const currentTheme = useSelector((state: RootState) => state.theme.currentTheme);

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: () => dispatch(logout()),
                },
            ]
        );
    };

    const handleThemeChange = (themeId: string) => {
        dispatch(setTheme(themeId));
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        scrollView: {
            flex: 1,
        },
        content: {
            padding: 16,
        },
        profileHeader: {
            alignItems: 'center',
            marginBottom: 24,
        },
        avatarGradient: {
            width: 100,
            height: 100,
            borderRadius: 50,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 16,
        },
        avatarText: {
            fontSize: 40,
            fontWeight: 'bold',
            color: theme.colors.textOnPrimary,
        },
        userName: {
            fontSize: 24,
            fontWeight: 'bold',
            color: theme.colors.text,
            marginBottom: 4,
        },
        userEmail: {
            fontSize: 16,
            color: theme.colors.textSecondary,
            marginBottom: 8,
        },
        userRole: {
            fontSize: 14,
            color: theme.colors.primary,
            fontWeight: '600',
            textTransform: 'capitalize',
        },
        section: {
            marginBottom: 24,
        },
        sectionTitle: {
            fontSize: 18,
            fontWeight: '600',
            color: theme.colors.text,
            marginBottom: 12,
        },
        infoRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: theme.effects.cardBorder,
        },
        infoLabel: {
            fontSize: 14,
            color: theme.colors.textSecondary,
        },
        infoValue: {
            fontSize: 14,
            fontWeight: '500',
            color: theme.colors.text,
        },
        themeGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 8,
        },
        themeButton: {
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 8,
            borderWidth: 2,
            minWidth: '48%',
            alignItems: 'center',
        },
        themeButtonText: {
            fontSize: 12,
            fontWeight: '600',
        },
        logoutButton: {
            marginTop: 16,
            borderRadius: 12,
            overflow: 'hidden',
        },
        logoutButtonGradient: {
            paddingVertical: 16,
            alignItems: 'center',
        },
        logoutButtonText: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.colors.textOnPrimary,
        },
    });

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase();
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
                {/* Profile Header */}
                <View style={styles.profileHeader}>
                    <LinearGradient
                        colors={theme.effects.buttonGradient}
                        style={styles.avatarGradient}>
                        <Text style={styles.avatarText}>{user ? getInitials(user.name) : 'U'}</Text>
                    </LinearGradient>
                    <Text style={styles.userName}>{user?.name}</Text>
                    <Text style={styles.userEmail}>{user?.email}</Text>
                    <Text style={styles.userRole}>{user?.role.replace('_', ' ')}</Text>
                </View>

                {/* Account Information */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account Information</Text>
                    <Card>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>User ID</Text>
                            <Text style={styles.infoValue}>{user?.id}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Email</Text>
                            <Text style={styles.infoValue}>{user?.email}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Role</Text>
                            <Text style={styles.infoValue}>{user?.role.replace('_', ' ')}</Text>
                        </View>
                        {user?.organization && (
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Organization</Text>
                                <Text style={styles.infoValue}>{user.organization}</Text>
                            </View>
                        )}
                    </Card>
                </View>

                {/* Theme Selection */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Theme ({themes.length} available)</Text>
                    <Card>
                        <View style={styles.themeGrid}>
                            {themes.slice(0, 6).map((t) => (
                                <TouchableOpacity
                                    key={t.id}
                                    onPress={() => handleThemeChange(t.id)}
                                    style={[
                                        styles.themeButton,
                                        {
                                            borderColor: currentTheme === t.id ? theme.colors.primary : theme.effects.cardBorder,
                                            backgroundColor: currentTheme === t.id ? theme.colors.primary + '20' : 'transparent',
                                        },
                                    ]}>
                                    <Text
                                        style={[
                                            styles.themeButtonText,
                                            { color: currentTheme === t.id ? theme.colors.primary : theme.colors.text },
                                        ]}>
                                        {t.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </Card>
                </View>

                {/* Logout Button */}
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <LinearGradient
                        colors={[theme.colors.error, theme.colors.error]}
                        style={styles.logoutButtonGradient}>
                        <Text style={styles.logoutButtonText}>Logout</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

export default ProfileScreen;
