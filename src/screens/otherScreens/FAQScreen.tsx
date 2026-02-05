import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../hooks/useTheme';
import Icon from 'react-native-vector-icons/Ionicons';

const faqs = [
    {
        question: 'How do I reset my password?',
        answer: 'You can reset your password by clicking on "Forgot Password" on the login screen and following the instructions sent to your email.',
    },
    {
        question: 'How do I add a new client?',
        answer: 'Go to the Clients tab and use the "Add Client" feature (available for Service Providers and Admins).',
    },
    {
        question: 'What is a Risk Profile?',
        answer: 'A Risk Profile assessment helps determine the investment strategy best suited for a client based on their financial goals and risk tolerance.',
    },
    {
        question: 'How do I contact support?',
        answer: 'You can raise a ticket in the Support tab or use the "Contact Support" feature in Settings.',
    },
];

const FAQScreen = () => {
    const theme = useTheme();
    const navigation = useNavigation();
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 16,
            borderBottomWidth: 1,
            borderBottomColor: theme.effects.cardBorder,
        },
        backButton: {
            padding: 8,
        },
        title: {
            fontSize: 20,
            fontWeight: 'bold',
            color: theme.colors.text,
            marginLeft: 12,
        },
        content: {
            padding: 16,
        },
        faqItem: {
            backgroundColor: theme.colors.card,
            borderRadius: 16,
            marginBottom: 12,
            borderWidth: 1,
            borderColor: theme.effects.cardBorder,
            overflow: 'hidden',
        },
        faqHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 16,
        },
        question: {
            flex: 1,
            fontSize: 16,
            fontWeight: '600',
            color: theme.colors.text,
            marginRight: 12,
        },
        answerContainer: {
            padding: 16,
            paddingTop: 0,
            borderTopWidth: 1,
            borderTopColor: theme.effects.cardBorder,
        },
        answer: {
            fontSize: 14,
            color: theme.colors.textSecondary,
            lineHeight: 20,
            marginTop: 12,
        },
    });

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="arrow-back" size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={styles.title}>FAQ</Text>
            </View>
            <ScrollView style={styles.content}>
                {faqs.map((faq, index) => {
                    const isExpanded = expandedIndex === index;
                    return (
                        <View key={index} style={styles.faqItem}>
                            <TouchableOpacity
                                style={styles.faqHeader}
                                onPress={() => setExpandedIndex(isExpanded ? null : index)}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.question}>{faq.question}</Text>
                                <Icon
                                    name={isExpanded ? 'chevron-up' : 'chevron-down'}
                                    size={20}
                                    color={theme.colors.textSecondary}
                                />
                            </TouchableOpacity>
                            {isExpanded && (
                                <View style={styles.answerContainer}>
                                    <Text style={styles.answer}>{faq.answer}</Text>
                                </View>
                            )}
                        </View>
                    );
                })}
            </ScrollView>
        </SafeAreaView>
    );
};

export default FAQScreen;
