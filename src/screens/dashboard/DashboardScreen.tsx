import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useSelector } from "react-redux";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../hooks/useTheme";
import NewsCard from "../../components/NewsCard";
import Chart from "../../components/Chart";
import Header from "../../components/Header";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { useGetUserAggregatedDataQuery } from "../../services/backend/dashboardApi";
import { useGetNewsQuery } from "../../services/backend/newsApi";
import { NewsItem } from "../../types";
import {
  ORG_TYPE_AD,
  ORG_TYPE_RP,
  ORG_TYPE_SP,
  ORG_TYPE_CL,
} from "../../types/backend/constants";
import {
  useGetOrgnizationsQuery,
  useGetOrgnizationByOrgTypeQuery,
} from "../../services/backend/authApi";
import { useGetApprovalRequestListQuery } from "../../services/backend/adminApi";
import { useGetClientRiskProfileQuery } from "../../services/backend/complianceApi";
import { useGetUserServicesQuery } from "../../services/backend/userServicesApi";

import LinearGradient from "react-native-linear-gradient";

const DashboardScreen = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const navigation = useNavigation<any>();

  const { data: dashboardData, isLoading: isDashboardLoading } =
    useGetUserAggregatedDataQuery();
  const { data: newsData, isLoading: isNewsLoading } = useGetNewsQuery({
    page: 1,
    page_size: 5,
  });

  const { data: orgsData } = useGetOrgnizationsQuery(
    { page: 1, page_size: 1, q: "" },
    {
      skip: user?.organization?.org_type?.toString() !== ORG_TYPE_AD,
    },
  );

  const { data: approvalRequests } = useGetApprovalRequestListQuery(undefined, {
    skip: user?.organization?.org_type?.toString() !== ORG_TYPE_AD,
  });

  const { data: clientRiskProfile } = useGetClientRiskProfileQuery(undefined, {
    skip: user?.organization?.org_type?.toString() !== ORG_TYPE_CL,
  });

  const { data: userServices } = useGetUserServicesQuery(user?.id || 0, {
    skip: user?.organization?.org_type?.toString() !== ORG_TYPE_CL || !user?.id,
  });

  const { data: spList } = useGetOrgnizationByOrgTypeQuery(ORG_TYPE_SP, {
    skip: user?.organization?.org_type?.toString() !== ORG_TYPE_AD,
  });

  const { data: rpList } = useGetOrgnizationByOrgTypeQuery(ORG_TYPE_RP, {
    skip: user?.organization?.org_type?.toString() !== ORG_TYPE_AD,
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    const greeting =
      hour < 12
        ? "Good Morning"
        : hour < 18
          ? "Good Afternoon"
          : "Good Evening";
    return `${greeting}, ${user?.first_name}!`;
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
    switch (user?.organization?.org_type?.toString()) {
      case ORG_TYPE_AD:
        return [
          {
            label: "Total Organizations",
            value: orgsData?.count || 0,
            change: 0,
            icon: "business",
          },
          {
            label: "Active Sp/Rp",
            value: (spList?.length || 0) + (rpList?.length || 0),
            change: 0,
            icon: "people",
          },
          {
            label: "Total Revenue",
            value: `₹${(dashboardData?.history?.reduce((acc, h) => acc + (h.revenue || 0), 0) || 0).toLocaleString()}`,
            change: 0,
            icon: "cash",
          },
          {
            label: "Pending Requests",
            value: approvalRequests?.length || 0,
            change: 0,
            icon: "alert-circle",
          },
        ];
      case ORG_TYPE_SP:
      case ORG_TYPE_RP:
        return [
          {
            label: "Total Clients",
            value: dashboardData?.active_customers || 0,
            change: dashboardData?.active_customers_change || 0,
            icon: "people",
          },
          {
            label: "Active Prospects",
            value: dashboardData?.active_prospects || 0,
            change: dashboardData?.active_prospects_change || 0,
            icon: "person-add",
          },
          {
            label: "Total AUM",
            value: `₹${(dashboardData?.aum || 0).toLocaleString()}`,
            change: dashboardData?.aum_change || 0,
            icon: "trending-up",
          },
          {
            label: "Total Earnings",
            value: `₹${(dashboardData?.earnings || 0).toLocaleString()}`,
            change: 0,
            icon: "cash",
          },
        ];
      case ORG_TYPE_CL:
        return [
          {
            label: "Portfolio Value",
            value: `₹${(dashboardData?.aum || 0).toLocaleString()}`,
            change: dashboardData?.aum_change || 0,
            icon: "account-balance",
          },
          {
            label: "YTD Return",
            value: "+12.4%",
            change: 0,
            icon: "trending-up",
          },
          {
            label: "Risk Score",
            value: clientRiskProfile?.current_score || 0,
            change: 0,
            icon: "shield",
          },
          {
            label: "Pending Actions",
            value: "0",
            change: 0,
            icon: "notifications",
          },
        ];
      default:
        return [];
    }
  };

  const getHeroDescription = () => {
    switch (user?.organization?.org_type?.toString()) {
      case ORG_TYPE_AD:
        return "Manage your organization, review requests, and oversee operations.";
      case ORG_TYPE_SP:
      case ORG_TYPE_RP:
        return "Track your clients, manage prospects, and grow your business.";
      case ORG_TYPE_CL:
        return "Monitor your portfolio, view documents, and stay informed.";
      default:
        return "";
    }
  };

  const metrics = getMetrics();

  const getChartData = (key: "earnings" | "revenue") => {
    if (!dashboardData?.history || dashboardData.history.length === 0) {
      return {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [{ data: [0, 0, 0, 0, 0, 0] }],
      };
    }

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // Take last 6 months or all if less
    const history = [...dashboardData.history].slice(-6);

    return {
      labels: history.map((h) => monthNames[h.month - 1] || `${h.month}`),
      datasets: [
        {
          data: history.map((h) => h[key] || 0),
        },
      ],
    };
  };
  const getServiceAllocationData = () => {
    if (!userServices || userServices.length === 0) {
      return [
        {
          name: "No Services",
          value: 100,
          color: theme.colors.textSecondary + "40",
          legendFontColor: theme.colors.textSecondary,
        },
      ];
    }

    const counts: Record<string, number> = {};
    userServices.forEach((us: any) => {
      const label = us.service?.label || "General";
      counts[label] = (counts[label] || 0) + 1;
    });

    const sorted = Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    const top3 = sorted.slice(0, 3);
    const others = sorted.slice(3);

    const colors = [
      theme.colors.primary,
      theme.colors.warning,
      theme.colors.error + "80",
      theme.colors.success,
    ];

    const finalData = top3.map((item, index) => ({
      ...item,
      color: colors[index],
      legendFontColor: theme.colors.textSecondary,
    }));

    if (others.length > 0) {
      finalData.push({
        name: "Other",
        value: others.reduce((acc, curr) => acc + curr.value, 0),
        color: colors[3],
        legendFontColor: theme.colors.textSecondary,
      });
    }

    return finalData;
  };

  return (
    <View style={styles.container}>
      {/* <Header
        title="Dashboard"
        rightElement={
          <TouchableOpacity
            onPress={() => navigation.navigate("Notifications")}
            style={{ padding: 4 }}
          >
            <Icon
              name="notifications-outline"
              size={24}
              color={theme.colors.text}
            />
          </TouchableOpacity>
        }
      /> */}
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
          {user?.organization?.org_type?.toString() === ORG_TYPE_CL && (
            <>
              <Chart
                type="line"
                title="Historical Growth"
                data={getChartData("earnings")}
              />
              <Chart
                type="pie"
                title="Services"
                data={getServiceAllocationData()}
              />
            </>
          )}
          {(user?.organization?.org_type?.toString() === ORG_TYPE_SP ||
            user?.organization?.org_type?.toString() === ORG_TYPE_RP) && (
            <>
              <Chart
                type="bar"
                title="Growth Trend"
                data={getChartData("earnings")}
              />
              <Chart
                type="line"
                title="Revenue Trend"
                data={getChartData("revenue")}
              />
            </>
          )}
          {user?.organization?.org_type?.toString() === ORG_TYPE_AD && (
            <>
              <Chart
                type="bar"
                title="Revenue Trend"
                data={getChartData("revenue")}
              />
              <Chart
                type="line"
                title="Growth Trend"
                data={getChartData("earnings")}
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
          {newsData?.results.map((news, index) => {
            const newsItem: NewsItem = {
              id: news.id?.toString() || `${index}`,
              title: news.title,
              description: news.description,
              domain: news.url,
              date: news.created,
              category: news.category,
              sub_category: news.sub_category,
            };
            return (
              <TouchableOpacity
                key={index}
                onPress={() => navigation.navigate("NewsDetails", { newsItem })}
              >
                <NewsCard news={newsItem} index={index} />
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export default DashboardScreen;
