import React from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({ label, error, icon, ...props }) => {
    const theme = useTheme();

    const styles = StyleSheet.create({
        container: {
            marginBottom: 16,
        },
        label: {
            fontSize: 14,
            color: theme.colors.textSecondary,
            marginBottom: 8,
            fontWeight: '500',
        },
        inputContainer: {
            backgroundColor: theme.effects.glassBackground,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: error ? theme.colors.error : theme.effects.cardBorder,
            paddingHorizontal: 16,
            paddingVertical: 12,
            flexDirection: 'row',
            alignItems: 'center',
        },
        input: {
            flex: 1,
            fontSize: 16,
            color: theme.colors.text,
            padding: 0,
        },
        icon: {
            marginRight: 12,
        },
        error: {
            fontSize: 12,
            color: theme.colors.error,
            marginTop: 4,
        },
    });

    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}
            <View style={styles.inputContainer}>
                {icon && <View style={styles.icon}>{icon}</View>}
                <TextInput
                    style={styles.input}
                    placeholderTextColor={theme.colors.textSecondary}
                    {...props}
                />
            </View>
            {error && <Text style={styles.error}>{error}</Text>}
        </View>
    );
};

export default Input;
