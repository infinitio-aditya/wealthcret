import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Platform,
    ScrollView,
} from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../hooks/useTheme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ThemeBottomSheetProps {
    isVisible: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    maxHeight?: number | string;
}

const ThemeBottomSheet: React.FC<ThemeBottomSheetProps> = ({
    isVisible,
    onClose,
    title,
    children,
    maxHeight = SCREEN_HEIGHT * 0.8,
}) => {
    const theme = useTheme();

    const styles = StyleSheet.create({
        modal: {
            margin: 0,
            justifyContent: 'flex-end',
        },
        content: {
            backgroundColor: theme.colors.surface,
            borderTopLeftRadius: 32,
            borderTopRightRadius: 32,
            paddingTop: 8,
            paddingHorizontal: 24,
            paddingBottom: Platform.OS === 'ios' ? 40 : 24,
            maxHeight: maxHeight as any,
        },
        dragHandle: {
            width: 40,
            height: 4,
            backgroundColor: theme.colors.border,
            borderRadius: 2,
            alignSelf: 'center',
            marginBottom: 20,
            opacity: 0.5,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 20,
        },
        title: {
            fontSize: 20,
            fontWeight: 'bold',
            color: theme.colors.text,
        },
        closeButton: {
            padding: 4,
        },
    });

    return (
        <Modal
            isVisible={isVisible}
            onBackdropPress={onClose}
            onSwipeComplete={onClose}
            swipeDirection={['down']}
            style={styles.modal}
            backdropOpacity={0.5}
            propagateSwipe={true}
            backdropTransitionOutTiming={0}
            useNativeDriverForBackdrop
        >
            <View style={styles.content}>
                <View style={styles.dragHandle} />
                {onClose && (
                    <View style={styles.header}>
                        {title ? <Text style={styles.title}>{title}</Text> : <View />}
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Icon name="close" size={24} color={theme.colors.textSecondary} />
                        </TouchableOpacity>
                    </View>
                )}
                <ScrollView showsVerticalScrollIndicator={false}>
                    {children}
                </ScrollView>
            </View>
        </Modal>
    );
};

export default ThemeBottomSheet;
