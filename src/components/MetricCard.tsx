import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import Card from './ui/Card';
import { DashboardMetric } from '../types';

interface MetricCardProps {
    metric: DashboardMetric;
    index: number;
}

const MetricCard: React.FC<MetricCardProps> = ({ metric }) => {
    const theme = useTheme();

    const styles = StyleSheet.create({
        card: {
            flex: 1,
            minWidth: '48%',
        },
        label: {
            fontSize: 14,
            color: theme.colors.textSecondary,
            marginBottom: 8,
        },
        value: {
            fontSize: 24,
            fontWeight: 'bold',
            color: theme.colors.text,
            marginBottom: 4,
        },
        changeContainer: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        change: {
            fontSize: 12,
            fontWeight: '600',
        },
    });

    const getChangeColor = () => {
        if (!metric.change || metric.change === 0) return theme.colors.textSecondary;
        return metric.change > 0 ? theme.colors.success : theme.colors.error;
    };

    return (
        <Card style={styles.card}>
            <Text style={styles.label}>{metric.label}</Text>
            <Text style={styles.value}>{metric.value}</Text>
            {metric.change !== undefined && metric.change !== 0 && (
                <View style={styles.changeContainer}>
                    <Text style={[styles.change, { color: getChangeColor() }]}>
                        {metric.change > 0 ? '↑' : '↓'} {Math.abs(metric.change)}%
                    </Text>
                </View>
            )}
        </Card>
    );
};

export default MetricCard;
