import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../hooks/useTheme';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

const FeedbackScreen = () => {
    const theme = useTheme();
    const navigation = useNavigation();
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');

    const handleSubmit = () => {
        if (!rating || !feedback) return;
        // In a real app, send feedback
        navigation.goBack();
    };

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
            padding: 24,
        },
        sectionTitle: {
            fontSize: 18,
            fontWeight: '600',
            color: theme.colors.text,
            marginBottom: 20,
            textAlign: 'center',
        },
        ratingContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 12,
            marginBottom: 32,
        },
        inputLabel: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.colors.text,
            marginBottom: 12,
        },
        textInput: {
            backgroundColor: theme.colors.card,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: theme.effects.cardBorder,
            padding: 16,
            color: theme.colors.text,
            minHeight: 150,
            textAlignVertical: 'top',
        },
        submitButton: {
            height: 56,
            borderRadius: 16,
            overflow: 'hidden',
            marginTop: 32,
        },
        gradient: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        submitText: {
            color: '#FFF',
            fontSize: 16,
            fontWeight: 'bold',
        },
    });

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="arrow-back" size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={styles.title}>Send Feedback</Text>
            </View>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.content}>
                    <Text style={styles.sectionTitle}>How would you rate your experience?</Text>

                    <View style={styles.ratingContainer}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <TouchableOpacity key={star} onPress={() => setRating(star)}>
                                <Icon
                                    name={star <= rating ? 'star' : 'star-outline'}
                                    size={40}
                                    color={star <= rating ? theme.colors.warning : theme.colors.textSecondary}
                                />
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={styles.inputLabel}>Tell us more</Text>
                    <TextInput
                        style={styles.textInput}
                        placeholder="What can we improve? What do you like?"
                        placeholderTextColor={theme.colors.textSecondary}
                        multiline
                        value={feedback}
                        onChangeText={setFeedback}
                    />

                    <TouchableOpacity
                        style={styles.submitButton}
                        onPress={handleSubmit}
                    >
                        <LinearGradient
                            colors={[theme.colors.primary, theme.colors.secondary]}
                            style={styles.gradient}
                        >
                            <Text style={styles.submitText}>Submit Feedback</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default FeedbackScreen;
