import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface CardProps extends ViewProps {
    children: React.ReactNode;
    variant?: 'default' | 'elevated' | 'outlined';
}

const Card: React.FC<CardProps> = ({ children, variant = 'default', style, ...props }) => {
    const theme = useTheme();

    const styles = StyleSheet.create({
        card: {
            backgroundColor: theme.effects.cardBackground,
            borderRadius: 16,
            padding: 16,
            borderWidth: 1,
            borderColor: theme.effects.cardBorder,
        },
        elevated: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
        },
        outlined: {
            borderWidth: 2,
            borderColor: theme.colors.primary,
        },
    });

    return (
        <View
            style={[
                styles.card,
                variant === 'elevated' && styles.elevated,
                variant === 'outlined' && styles.outlined,
                style,
            ]}
            {...props}>
            {children}
        </View>
    );
};

export default Card;
