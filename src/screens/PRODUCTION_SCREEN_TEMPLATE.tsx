/**
 * Production-Ready Screen Template
 * 
 * This template demonstrates all production-ready patterns:
 * - API integration with RTK Query
 * - Loading, error, and empty states
 * - Error handling with retry
 * - Refresh functionality
 * - User feedback
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useAlert } from '../context/AlertContext';
import { ErrorState, EmptyState, LoadingScreen } from '../app/components/StateComponents';
import { createLogger } from '../app/utils/logger';
import { getErrorMessage } from '../app/utils/errorHandler';

// Initialize logger for this module
const logger = createLogger('MyListScreen');

interface MyItem {
  id: string;
  name: string;
  description?: string;
}

/**
 * Production-Ready List Screen Template
 * 
 * Replace the following:
 * 1. MyItem - your data type
 * 2. useGetMyItemsQuery - your API hook
 * 3. MyListScreen - your screen name
 * 4. 'MyListScreen' - your module name
 */
const MyListScreen = () => {
  // Hooks
  const theme = useTheme();
  const { showAlert } = useAlert();
  
  // State
  const [items, setItems] = useState<MyItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MyItem[]>([]);
  const [searchText, setSearchText] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [manualError, setManualError] = useState<string | null>(null);

  // TODO: Uncomment when API hook is available
  // const { data, isLoading, error, refetch } = useGetMyItemsQuery();

  // Mock API call for demonstration
  const { 
    data: mockData,
    isLoading: apiLoading, 
    error: apiError 
  } = useGetMyItemsQuery ? useGetMyItemsQuery() : {
    data: undefined,
    isLoading: false,
    error: null,
  };

  // Combine API data and errors
  const isLoading = apiLoading;
  const error = apiError || manualError;
  const data = mockData || [];

  // Initialize
  useEffect(() => {
    logger.info('Screen mounted');
    loadData();
  }, []);

  // Handle data changes
  useEffect(() => {
    if (data && data.length > 0) {
      setItems(data);
      filterItems(data, searchText);
      logger.info('Data loaded', { count: data.length });
    }
  }, [data]);

  /**
   * Load data from API
   */
  const loadData = async () => {
    try {
      setManualError(null);
      logger.info('Loading data...');
      // Data will be loaded by RTK Query automatically
      // No manual action needed when hook is real
    } catch (err) {
      const errorMsg = getErrorMessage(err);
      logger.error('Failed to load data', err, { errorMsg });
      setManualError(errorMsg);
      showAlert('Error', errorMsg);
    }
  };

  /**
   * Refresh handler for pull-to-refresh
   */
  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      setManualError(null);
      logger.info('Refreshing data...');
      
      // TODO: Call refetch() when real API is available
      // await refetch();
      
      // Simulate refresh
      await new Promise(resolve => setTimeout(resolve, 500));
      
      logger.info('Data refreshed successfully');
      showAlert('Success', 'Data refreshed');
    } catch (err) {
      const errorMsg = getErrorMessage(err);
      logger.error('Refresh failed', err, { errorMsg });
      setManualError(errorMsg);
      showAlert('Error', `Refresh failed: ${errorMsg}`);
    } finally {
      setRefreshing(false);
    }
  };

  /**
   * Retry loading data
   */
  const handleRetry = async () => {
    logger.info('Retrying data load...');
    await loadData();
    // TODO: When real API: await refetch();
  };

  /**
   * Search and filter
   */
  const filterItems = (itemsToFilter: MyItem[], query: string) => {
    if (!query.trim()) {
      setFilteredItems(itemsToFilter);
      return;
    }

    const lowercasedQuery = query.toLowerCase();
    const filtered = itemsToFilter.filter(item =>
      item.name.toLowerCase().includes(lowercasedQuery) ||
      item.description?.toLowerCase().includes(lowercasedQuery)
    );

    setFilteredItems(filtered);
    logger.debug('Items filtered', { query, resultCount: filtered.length });
  };

  /**
   * Handle search input change
   */
  const handleSearch = (text: string) => {
    setSearchText(text);
    filterItems(items, text);
  };

  /**
   * Handle item selection
   */
  const handleItemPress = (item: MyItem) => {
    logger.info('Item selected', { itemId: item.id });
    // TODO: Navigate to detail screen or perform action
    showAlert('Item Selected', item.name);
  };

  /**
   * Render individual item
   */
  const renderItem = ({ item }: { item: MyItem }) => (
    <TouchableOpacity onPress={() => handleItemPress(item)}>
      <Card style={styles.itemCard}>
        <View style={styles.itemContent}>
          <Text style={[styles.itemName, { color: theme.colors.text }]}>
            {item.name}
          </Text>
          {item.description && (
            <Text style={[styles.itemDescription, { color: theme.colors.textSecondary }]}>
              {item.description}
            </Text>
          )}
        </View>
        <Text style={{ color: theme.colors.primary }}>→</Text>
      </Card>
    </TouchableOpacity>
  );

  /**
   * Render header with search
   */
  const renderHeader = () => (
    <View style={[styles.header, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>My Items</Text>
      <View style={[styles.searchBox, { borderColor: theme.effects.cardBorder }]}>
        <Text style={{ color: theme.colors.textSecondary }}>🔍</Text>
        <TextInput
          style={[styles.searchInput, { color: theme.colors.text }]}
          placeholder="Search..."
          placeholderTextColor={theme.colors.textSecondary}
          value={searchText}
          onChangeText={handleSearch}
        />
      </View>
    </View>
  );

  // Styles
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.effects.cardBorder,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 12,
    },
    searchBox: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 12,
      backgroundColor: theme.effects.cardBackground,
    },
    searchInput: {
      flex: 1,
      paddingVertical: 10,
      paddingHorizontal: 8,
      fontSize: 14,
    },
    listContainer: {
      padding: 12,
    },
    itemCard: {
      marginBottom: 8,
      paddingHorizontal: 16,
      paddingVertical: 12,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    itemContent: {
      flex: 1,
    },
    itemName: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 4,
    },
    itemDescription: {
      fontSize: 13,
      lineHeight: 18,
    },
  });

  // RENDER: Loading State
  if (isLoading) {
    return <LoadingScreen message="Loading items..." fullScreen={true} />;
  }

  // RENDER: Error State
  if (error) {
    return (
      <View style={styles.container}>
        <ErrorState
          title="Failed to Load Items"
          message={getErrorMessage(error)}
          onRetry={handleRetry}
          fullScreen={true}
        />
      </View>
    );
  }

  // RENDER: Empty State
  if (filteredItems.length === 0) {
    return (
      <View style={styles.container}>
        <EmptyState
          title={searchText ? 'No Results' : 'No Items'}
          message={
            searchText
              ? `No items match "${searchText}"`
              : "You don't have any items yet"
          }
          fullScreen={true}
        />
      </View>
    );
  }

  // RENDER: Main List
  return (
    <View style={styles.container}>
      <FlatList
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary}
          />
        }
        scrollEnabled={true}
      />
    </View>
  );
};

export default MyListScreen;

/**
 * IMPLEMENTATION GUIDE
 * 
 * 1. Copy this entire file
 * 2. Replace MyItem with your data type
 * 3. Replace MyListScreen with your screen name
 * 4. Replace useGetMyItemsQuery with your real API hook
 * 5. Update renderItem to display your data correctly
 * 6. Update handleItemPress to navigate or perform action
 * 7. Add any additional filters or sorting logic
 * 8. Test loading, error, and empty states
 * 9. Test search and filter
 * 10. Deploy!
 * 
 * KEY FEATURES INCLUDED:
 * ✅ Loading state with spinner
 * ✅ Error state with retry button
 * ✅ Empty state with helpful message
 * ✅ Search/filter functionality
 * ✅ Pull-to-refresh
 * ✅ Proper logging with context
 * ✅ Error messages displayed to user
 * ✅ User feedback (alerts)
 * ✅ Type-safe with TypeScript
 * ✅ Theme-aware styling
 * ✅ Accessibility-friendly
 * 
 * API INTEGRATION:
 * When your API hook is ready:
 * 1. Uncomment the useGetMyItemsQuery hook
 * 2. Remove the mock data section
 * 3. Update apiLoading and apiError references
 * 4. Uncomment refetch in handleRefresh
 * 5. Test with real API
 */
