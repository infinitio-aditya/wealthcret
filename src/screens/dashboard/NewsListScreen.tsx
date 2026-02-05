import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { DashboardStackParamList } from '../../navigation/NavigationParams';
import { useTheme } from '../../hooks/useTheme';
import Header from '../../components/Header';
import NewsCard from '../../components/NewsCard';
import { mockNews } from '../../utils/mockData';

type NavigationProp = StackNavigationProp<DashboardStackParamList, 'NewsList'>;

const NewsListScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    listContent: {
      padding: 16,
    },
  });

  return (
    <View style={styles.container}>
      <Header title="Financial News" showBack />
      <FlatList
        data={mockNews}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('NewsDetails', { newsId: item.id })
            }
          >
            <NewsCard news={item} index={index} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default NewsListScreen;
