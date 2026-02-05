import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../hooks/useTheme';
import ThemeBottomSheet from './ThemeBottomSheet';

interface DropdownOption {
    label: string;
    value: string;
}

interface ThemeDropdownProps {
    label?: string;
    options: DropdownOption[];
    selectedValue: string;
    onValueChange: (value: string) => void;
    placeholder?: string;
    error?: string;
}

const ThemeDropdown: React.FC<ThemeDropdownProps> = ({
    label,
    options,
    selectedValue,
    onValueChange,
    placeholder = 'Select an option',
    error,
}) => {
    const theme = useTheme();
    const [isOpen, setIsOpen] = useState(false);

    const selectedOption = options.find(opt => opt.value === selectedValue);

    const handleSelect = (value: string) => {
        onValueChange(value);
        setIsOpen(false);
    };

    const styles = StyleSheet.create({
        container: {
            marginBottom: 16,
        },
        label: {
            fontSize: 14,
            color: theme.colors.textSecondary,
            marginBottom: 8,
            fontWeight: '500',
            marginLeft: 4,
        },
        dropdownButton: {
            backgroundColor: theme.effects.glassBackground,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: error ? theme.colors.error : theme.effects.cardBorder,
            paddingHorizontal: 16,
            paddingVertical: 14,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        selectedText: {
            fontSize: 16,
            color: selectedOption ? theme.colors.text : theme.colors.textSecondary,
        },
        error: {
            fontSize: 12,
            color: theme.colors.error,
            marginTop: 4,
            marginLeft: 4,
        },
        optionItem: {
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border + '20',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        optionText: {
            fontSize: 16,
            color: theme.colors.text,
        },
        selectedOptionText: {
            color: theme.colors.primary,
            fontWeight: '600',
        },
    });

    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}
            <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setIsOpen(true)}
                activeOpacity={0.7}
            >
                <Text style={styles.selectedText}>
                    {selectedOption ? selectedOption.label : placeholder}
                </Text>
                <Icon name="chevron-down" size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>
            {error && <Text style={styles.error}>{error}</Text>}

            <ThemeBottomSheet
                isVisible={isOpen}
                onClose={() => setIsOpen(false)}
                title={label}
            >
                <View style={{ paddingBottom: 20 }}>
                    {options.map((option) => (
                        <TouchableOpacity
                            key={option.value}
                            style={styles.optionItem}
                            onPress={() => handleSelect(option.value)}
                        >
                            <Text style={[
                                styles.optionText,
                                selectedValue === option.value && styles.selectedOptionText
                            ]}>
                                {option.label}
                            </Text>
                            {selectedValue === option.value && (
                                <Icon name="checkmark" size={20} color={theme.colors.primary} />
                            )}
                        </TouchableOpacity>
                    ))}
                </View>
            </ThemeBottomSheet>
        </View>
    );
};

export default ThemeDropdown;
