import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import Card from './ui/Card';
import { NewsItem } from '../types';

interface NewsCardProps {
    news: NewsItem;
    index: number;
}

const NewsCard: React.FC<NewsCardProps> = ({ news }) => {
    const theme = useTheme();

    const styles = StyleSheet.create({
        card: {
            marginBottom: 12,
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 8,
        },
        domain: {
            fontSize: 12,
            color: theme.colors.primary,
            fontWeight: '600',
            textTransform: 'uppercase',
        },
        date: {
            fontSize: 12,
            color: theme.colors.textSecondary,
        },
        title: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.colors.text,
            marginBottom: 8,
        },
        description: {
            fontSize: 14,
            color: theme.colors.textSecondary,
            lineHeight: 20,
        },
    });

    return (
        <TouchableOpacity activeOpacity={0.8}>
            <Card style={styles.card}>
                <View style={styles.header}>
                    <Text style={styles.domain}>{news.domain}</Text>
                    <Text style={styles.date}>{news.date}</Text>
                </View>
                <Text style={styles.title}>{news.title}</Text>
                <Text style={styles.description} numberOfLines={2}>
                    {news.description}
                </Text>
            </Card>
        </TouchableOpacity>
    );
};

export default NewsCard;
