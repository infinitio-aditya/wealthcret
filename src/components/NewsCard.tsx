import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "../hooks/useTheme";
import Card from "./ui/Card";
import Icon from "react-native-vector-icons/Feather";
import { NewsItem } from "../types";
import { format, parseISO } from "date-fns";

interface NewsCardProps {
  news: NewsItem;
  index: number;
}

const NewsCard: React.FC<NewsCardProps> = ({ news }) => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    card: {
      marginBottom: 16,
      borderRadius: 20,
      padding: 16,
    },
    metaRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    categoryBadge: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.primary + "15",
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 20,
      gap: 5,
    },
    category: {
      fontSize: 11,
      color: theme.colors.primary,
      fontWeight: "700",
      textTransform: "uppercase",
    },
    dateRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    date: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      fontWeight: "500",
    },
    title: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.colors.text,
      marginBottom: 8,
      lineHeight: 24,
    },
    description: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      lineHeight: 20,
      opacity: 0.8,
    },
    footerAction: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 12,
      gap: 4,
    },
    readMore: {
      fontSize: 13,
      fontWeight: "600",
      color: theme.colors.primary,
    },
  });

  return (
    <TouchableOpacity activeOpacity={0.8}>
      <Card style={styles.card}>
        <View style={styles.metaRow}>
          {news.category ? (
            <View style={styles.categoryBadge}>
              <Icon name="tag" size={12} color={theme.colors.primary} />
              <Text style={styles.category}>{news.category}</Text>
            </View>
          ) : (
            <View />
          )}
          <View style={styles.dateRow}>
            <Icon
              name="calendar"
              size={14}
              color={theme.colors.textSecondary}
            />
            <Text style={styles.date}>
              {(() => {
                try {
                  return format(parseISO(news.date), "dd MMM yyyy");
                } catch (e) {
                  return news.date;
                }
              })()}
            </Text>
          </View>
        </View>

        <Text style={styles.title} numberOfLines={2}>
          {news.title}
        </Text>

        <Text style={styles.description} numberOfLines={3}>
          {news.description}
        </Text>

        <View style={styles.footerAction}>
          <Text style={styles.readMore}>Read Article</Text>
          <Icon name="chevron-right" size={16} color={theme.colors.primary} />
        </View>
      </Card>
    </TouchableOpacity>
  );
};

export default NewsCard;
