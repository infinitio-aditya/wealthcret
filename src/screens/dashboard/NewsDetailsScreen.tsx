import React from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { DashboardStackParamList } from "../../navigation/NavigationParams";
import { useTheme } from "../../hooks/useTheme";
import Header from "../../components/Header";
import { mockNews } from "../../utils/mockData";

type ScreenRouteProp = RouteProp<DashboardStackParamList, "NewsDetails">;

const NewsDetailsScreen = () => {
  const theme = useTheme();
  const route = useRoute<any>();
  const { newsItem } = route.params;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: 12,
    },
    date: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 20,
    },
    body: {
      fontSize: 16,
      color: theme.colors.text,
      lineHeight: 24,
    },
    errorText: {
      fontSize: 18,
      color: theme.colors.error,
      textAlign: "center",
      marginTop: 50,
    },
  });

  if (!newsItem) {
    return (
      <View style={styles.container}>
        <Header title="News Details" showBack />
        <Text style={styles.errorText}>News item not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="News Details" showBack />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{newsItem.title}</Text>
        <Text style={styles.date}>{newsItem.date}</Text>
        {/* 
                   If mockData has a 'content' field, use it. 
                   Otherwise, we'll display a placeholder or the summary.
                   Assuming mockData has 'summary' based on previous context, 
                   but usually details would have more using Lorem Ipsum for now.
                */}
        <Text style={styles.body}>
          {newsItem.description}
          {"\n\n"}
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </Text>
      </ScrollView>
    </View>
  );
};

export default NewsDetailsScreen;
