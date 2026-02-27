import React from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { DashboardStackParamList } from "../../navigation/NavigationParams";
import { useTheme } from "../../hooks/useTheme";
import Header from "../../components/Header";
import NewsCard from "../../components/NewsCard";
import { useGetNewsQuery } from "../../services/backend/newsApi";
import { NewsItem } from "../../types";

type NavigationProp = StackNavigationProp<DashboardStackParamList, "NewsList">;

const NewsListScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const { data: newsData, isLoading } = useGetNewsQuery({
    page: 1,
    page_size: 50,
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    listContent: {
      padding: 16,
    },
  });

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Financial News" showBack />
      <FlatList
        data={newsData?.results || []}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={({ item, index }) => {
          const newsItem: NewsItem = {
            id: item.id?.toString() || index.toString(),
            title: item.title,
            description: item.description,
            domain: item.url,
            date: item.created,
            category: item.category,
            sub_category: item.sub_category,
          };
          return (
            <TouchableOpacity
              onPress={() => navigation.navigate("NewsDetails", { newsItem })}
            >
              <NewsCard news={newsItem} index={index} />
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default NewsListScreen;
