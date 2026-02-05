import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import Icon from 'react-native-vector-icons/Ionicons';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    itemsPerPage?: number;
    totalItems?: number;
}

export const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    itemsPerPage = 10,
    totalItems,
}: PaginationProps) => {
    const theme = useTheme();

    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1);
                pages.push('...');
                pages.push(currentPage - 1);
                pages.push(currentPage);
                pages.push(currentPage + 1);
                pages.push('...');
                pages.push(totalPages);
            }
        }

        return pages;
    };

    if (totalPages <= 1) return null;

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems || 0);

    const styles = StyleSheet.create({
        container: {
            paddingVertical: 16,
            alignItems: 'center',
            gap: 12,
        },
        infoText: {
            fontSize: 12,
            color: theme.colors.textSecondary,
            marginBottom: 8,
        },
        controls: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
        },
        button: {
            width: 40,
            height: 40,
            borderRadius: 12,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: theme.effects.cardBorder,
            backgroundColor: theme.effects.cardBackground,
        },
        disabledButton: {
            opacity: 0.5,
        },
        pageNumber: {
            minWidth: 40,
            height: 40,
            borderRadius: 12,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: theme.effects.cardBorder,
            backgroundColor: theme.effects.cardBackground,
        },
        activePageNumber: {
            backgroundColor: theme.colors.primary,
            borderColor: theme.colors.primary,
        },
        pageText: {
            fontSize: 14,
            color: theme.colors.text,
        },
        activePageText: {
            color: theme.colors.textOnPrimary,
            fontWeight: 'bold',
        },
        ellipsis: {
            marginHorizontal: 4,
            color: theme.colors.textSecondary,
        },
    });

    return (
        <View style={styles.container}>
            {totalItems && (
                <Text style={styles.infoText}>
                    Showing {startItem} to {endItem} of {totalItems} results
                </Text>
            )}

            <View style={styles.controls}>
                <TouchableOpacity
                    style={[styles.button, currentPage === 1 && styles.disabledButton]}
                    onPress={() => currentPage > 1 && onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    <Icon name="chevron-back" size={20} color={theme.colors.text} />
                </TouchableOpacity>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    {getPageNumbers().map((page, index) => {
                        if (page === '...') {
                            return (
                                <Text key={`ellipsis-${index}`} style={styles.ellipsis}>
                                    ...
                                </Text>
                            );
                        }

                        const isActive = page === currentPage;

                        return (
                            <TouchableOpacity
                                key={page}
                                style={[styles.pageNumber, isActive && styles.activePageNumber]}
                                onPress={() => onPageChange(page as number)}
                            >
                                <Text style={[styles.pageText, isActive && styles.activePageText]}>
                                    {page}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                <TouchableOpacity
                    style={[styles.button, currentPage === totalPages && styles.disabledButton]}
                    onPress={() => currentPage < totalPages && onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    <Icon name="chevron-forward" size={20} color={theme.colors.text} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Pagination;
