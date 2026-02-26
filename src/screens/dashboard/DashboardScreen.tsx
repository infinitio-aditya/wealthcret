import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useTheme } from "../../hooks/useTheme";
import NewsCard from "../../components/NewsCard";
import { mockNews } from "../../utils/mockData";
import Chart from "../../components/Chart";
import { useNavigation } from "@react-navigation/native";

import LinearGradient from "react-native-linear-gradient";

const DashboardScreen = () => {
  const theme = useTheme();
  const user = useSelector((state: RootState) => state.auth.user);
  const navigation = useNavigation<any>();

  const getGreeting = () => {
    const hour = new Date().getHours();
    const greeting =
      hour < 12
        ? "Good Morning"
        : hour < 18
          ? "Good Afternoon"
          : "Good Evening";
    return `${greeting}, ${user?.name?.split(" ")[0]}!`;
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollView: {
      flex: 1,
    },
    content: {
      padding: 16,
    },
    heroCard: {
      borderRadius: 24,
      padding: 24,
      marginBottom: 24,
    },
    heroTitle: {
      fontSize: 28,
      fontWeight: "bold",
      color: theme.colors.textOnPrimary,
      marginBottom: 12,
    },
    heroDescription: {
      fontSize: 16,
      color: theme.colors.textOnPrimary,
      opacity: 0.9,
      lineHeight: 24,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: 16,
    },
    metricsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
      marginBottom: 24,
    },
    metricCard: {
      flex: 1,
      minWidth: "48%",
      backgroundColor: theme.effects.cardBackground,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: theme.effects.cardBorder,
    },
    metricLabel: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 8,
    },
    metricValue: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.colors.text,
    },
    metricChange: {
      fontSize: 12,
      marginTop: 4,
    },
    chartsContainer: {
      marginBottom: 24,
    },
    newsSection: {
      marginTop: 8,
    },
    newsHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
  });

  const getMetrics = () => {
    switch (user?.role) {
      case "admin":
        return [
          {
            label: "Total Organizations",
            value: "247",
            change: 12,
            icon: "business",
          },
          { label: "Active Sp/Rp", value: "89", change: 8, icon: "people" },
          { label: "Total Revenue", value: "$2.4M", change: 15, icon: "cash" },
          {
            label: "Pending Requests",
            value: "23",
            change: -5,
            icon: "alert-circle",
          },
        ];
      case "service_provider":
      case "referral_partner":
        return [
          { label: "Total Clients", value: "156", change: 8, icon: "people" },
          {
            label: "Active Prospects",
            value: "42",
            change: 15,
            icon: "person-add",
          },
          {
            label: "Total AUM",
            value: "$45.8M",
            change: 12,
            icon: "trending-up",
          },
          {
            label: "Open Tickets",
            value: "7",
            change: -3,
            icon: "chatbubbles",
          },
        ];
      case "client":
        return [
          {
            label: "Portfolio Value",
            value: "$2.5M",
            change: 8.5,
            icon: "account-balance",
          },
          {
            label: "YTD Return",
            value: "+12.4%",
            change: 2.1,
            icon: "trending-up",
          },
          { label: "Risk Score", value: "35", change: 0, icon: "shield" },
          {
            label: "Pending Actions",
            value: "3",
            change: -1,
            icon: "notifications",
          },
        ];
      default:
        return [];
    }
  };

  const getHeroDescription = () => {
    switch (user?.role) {
      case "admin":
        return "Manage your organization, review requests, and oversee operations.";
      case "service_provider":
      case "referral_partner":
        return "Track your clients, manage prospects, and grow your business.";
      case "client":
        return "Monitor your portfolio, view documents, and stay informed.";
      default:
        return "";
    }
  };

  const metrics = getMetrics();

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        {/* Hero Section */}
        <LinearGradient
          colors={[theme.colors.primary, theme.colors.primary + "80"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <Text style={styles.heroTitle}>{getGreeting()}</Text>
          <Text style={styles.heroDescription}>{getHeroDescription()}</Text>
        </LinearGradient>

        {/* Metrics Section */}
        <Text style={styles.sectionTitle}>Overview</Text>
        <View style={styles.metricsGrid}>
          {metrics.map((metric, index) => (
            <View key={index} style={styles.metricCard}>
              <Text style={[styles.metricLabel, { alignSelf: "center" }]}>
                {metric.label}
              </Text>
              <Text style={[styles.metricValue, { alignSelf: "center" }]}>
                {metric.value}
              </Text>
              {metric.change !== 0 && (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={[
                      styles.metricChange,
                      {
                        color:
                          metric.change > 0
                            ? theme.colors.success
                            : theme.colors.error,
                      },
                    ]}
                  >
                    {metric.change > 0 ? "↑" : "↓"} {Math.abs(metric.change)}%
                  </Text>
                  <Text
                    style={{
                      fontSize: 8,
                      color: theme.colors.textSecondary,
                      alignSelf: "flex-end",
                    }}
                  >
                    {"  as last month"}
                  </Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Analytics Section */}
        <Text style={styles.sectionTitle}>Analytics</Text>
        <View style={styles.chartsContainer}>
          {user?.role === "client" && (
            <>
              <Chart
                type="line"
                title="Portfolio Growth"
                data={{
                  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                  datasets: [{ data: [20, 45, 28, 80, 99, 43] }],
                }}
              />
              <Chart
                type="pie"
                title="Asset Allocation"
                data={[
                  {
                    name: "Equity",
                    value: 45,
                    color: theme.colors.primary,
                    legendFontColor: theme.colors.textSecondary,
                  },
                  {
                    name: "Debt",
                    value: 30,
                    color: theme.colors.error + "80",
                    legendFontColor: theme.colors.textSecondary,
                  },
                  {
                    name: "Gold",
                    value: 15,
                    color: theme.colors.warning,
                    legendFontColor: theme.colors.textSecondary,
                  },
                  {
                    name: "Cash",
                    value: 10,
                    color: theme.colors.success,
                    legendFontColor: theme.colors.textSecondary,
                  },
                ]}
              />
            </>
          )}
          {(user?.role === "service_provider" ||
            user?.role === "referral_partner") && (
            <>
              <Chart
                type="bar"
                title="Clients"
                data={{
                  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                  datasets: [{ data: [20, 45, 28, 80, 99, 43] }],
                }}
              />
              <Chart
                type="line"
                title="Total AUM Growth"
                data={{
                  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                  datasets: [{ data: [15, 30, 45, 60, 75, 90] }],
                }}
              />
            </>
          )}
          {user?.role === "admin" && (
            <>
              <Chart
                type="bar"
                title="Revenue"
                data={{
                  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                  datasets: [{ data: [80, 90, 100, 110, 120, 130] }],
                }}
              />
              <Chart
                type="line"
                title="Organization Growth"
                data={{
                  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                  datasets: [{ data: [210, 218, 225, 232, 239, 247] }],
                }}
              />
            </>
          )}
        </View>

        {/* News Section */}
        <View style={styles.newsSection}>
          <View style={styles.newsHeader}>
            <Text style={styles.sectionTitle}>Latest Financial News</Text>
            <TouchableOpacity onPress={() => navigation.navigate("NewsList")}>
              <Text style={{ color: theme.colors.primary, fontWeight: "bold" }}>
                View All →
              </Text>
            </TouchableOpacity>
          </View>
          {mockNews.map((news, index) => (
            <TouchableOpacity
              key={news.id}
              onPress={() =>
                navigation.navigate("NewsDetails", { newsId: news.id })
              }
            >
              <NewsCard news={news} index={index} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default DashboardScreen;
