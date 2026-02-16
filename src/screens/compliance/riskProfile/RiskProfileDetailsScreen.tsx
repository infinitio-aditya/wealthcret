import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { useTheme } from "../../../hooks/useTheme";
import Card from "../../../components/ui/Card";
import Icon from "react-native-vector-icons/Ionicons";
import { RiskProfile, Assessment } from "../../../types";
import Svg, { Path, Circle, Line, G, Text as SvgText } from "react-native-svg";

type RouteParams = {
  RiskProfileDetails: {
    profileId: string;
  };
};

// Mock Assessment History
const mockAssessments: { [key: string]: Assessment[] } = {
  "1": [
    {
      id: "1",
      date: "2025-11-15",
      score: 35,
      status: "low",
      assessedBy: "Sarah Mitchell",
      notes: "Conservative investment approach confirmed.",
    },
    {
      id: "2",
      date: "2025-08-22",
      score: 32,
      status: "low",
      assessedBy: "Sarah Mitchell",
      notes: "Initial risk assessment.",
    },
  ],
  "2": [
    {
      id: "1",
      date: "2025-11-20",
      score: 65,
      status: "medium",
      assessedBy: "Michael Roberts",
      notes: "Balanced risk appetite.",
    },
  ],
  "3": [
    {
      id: "1",
      date: "2025-11-10",
      score: 85,
      status: "high",
      assessedBy: "Sarah Mitchell",
      notes: "Aggressive growth strategy.",
    },
  ],
  "4": [],
  "5": [],
};

const mockProfiles: RiskProfile[] = [
  {
    id: "1",
    clientId: "1",
    clientName: "John Anderson",
    score: 35,
    status: "low",
    lastAssessmentDate: "2025-11-15",
    nextReviewDate: "2026-11-15",
  },
  {
    id: "2",
    clientId: "2",
    clientName: "Emily Chen",
    score: 65,
    status: "medium",
    lastAssessmentDate: "2025-11-20",
    nextReviewDate: "2026-11-20",
  },
  {
    id: "3",
    clientId: "3",
    clientName: "Robert Martinez",
    score: 85,
    status: "high",
    lastAssessmentDate: "2025-11-10",
    nextReviewDate: "2026-11-10",
  },
  {
    id: "4",
    clientId: "4",
    clientName: "Sarah Wilson",
    score: 45,
    status: "medium",
    lastAssessmentDate: "2025-10-05",
    nextReviewDate: "2026-10-05",
  },
  {
    id: "5",
    clientId: "5",
    clientName: "David Lee",
    score: 20,
    status: "low",
    lastAssessmentDate: "2025-09-12",
    nextReviewDate: "2026-09-12",
  },
];

const RiskProfileDetailsScreen = () => {
  const theme = useTheme();
  const route = useRoute<RouteProp<RouteParams, "RiskProfileDetails">>();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<RiskProfile | null>(null);
  const [assessments, setAssessments] = useState<Assessment[]>([]);

  useEffect(() => {
    setTimeout(() => {
      const foundProfile = mockProfiles.find(
        (p) => p.id === route.params?.profileId,
      );
      setProfile(foundProfile || null);
      setAssessments(mockAssessments[route.params?.profileId] || []);
      setLoading(false);
    }, 500);
  }, [route.params?.profileId]);

  const getScoreColor = (score: number) => {
    if (score < 40) return theme.colors.success;
    if (score < 70) return theme.colors.warning;
    return theme.colors.error;
  };

  const renderGauge = (score: number) => {
    const radius = 80;
    const strokeWidth = 12;
    const width = radius * 2 + strokeWidth * 2;
    const height = radius + strokeWidth * 2;
    const centerX = width / 2;
    const centerY = height - strokeWidth;

    // Calculate needle rotation: -90 (0 score) to 90 (100 score)
    const rotation = (score / 100) * 180 - 90;

    return (
      <View style={{ alignItems: "center", marginVertical: 20 }}>
        <Svg width={width} height={height}>
          {/* Background Arcs */}
          <Path
            d={`M ${centerX - radius} ${centerY} A ${radius} ${radius} 0 0 1 ${centerX - radius * 0.5} ${centerY - radius * 0.866}`}
            fill="none"
            stroke={theme.colors.success}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          <Path
            d={`M ${centerX - radius * 0.45} ${centerY - radius * 0.88} A ${radius} ${radius} 0 0 1 ${centerX + radius * 0.45} ${centerY - radius * 0.88}`}
            fill="none"
            stroke={theme.colors.warning}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray="4, 4"
          />
          <Path
            d={`M ${centerX + radius * 0.5} ${centerY - radius * 0.866} A ${radius} ${radius} 0 0 1 ${centerX + radius} ${centerY}`}
            fill="none"
            stroke={theme.colors.error}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Needle */}
          <G rotation={rotation} origin={`${centerX}, ${centerY}`}>
            <Line
              x1={centerX}
              y1={centerY}
              x2={centerX}
              y2={centerY - radius + 10}
              stroke={getScoreColor(score)}
              strokeWidth="3"
              strokeLinecap="round"
            />
            <Circle
              cx={centerX}
              cy={centerY}
              r="5"
              fill={getScoreColor(score)}
            />
          </G>
        </Svg>
        <View style={{ alignItems: "center", marginTop: -20 }}>
          <Text style={[styles.gaugeScore, { color: getScoreColor(score) }]}>
            {score}
          </Text>
          <View
            style={[
              styles.gaugeBadge,
              { backgroundColor: getScoreColor(score) + "20" },
            ]}
          >
            <Text
              style={[styles.gaugeBadgeText, { color: getScoreColor(score) }]}
            >
              {profile?.status.toUpperCase()} RULE
            </Text>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.colors.background,
            justifyContent: "center",
          },
        ]}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!profile) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.colors.background,
            alignItems: "center",
            justifyContent: "center",
          },
        ]}
      >
        <Text style={{ color: theme.colors.text }}>Profile not found</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View
        style={[styles.header, { borderBottomColor: theme.effects.cardBorder }]}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 16 }}>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
            Risk Profile Details
          </Text>
          <Text style={styles.headerSubtitle}>
            Comprehensive risk assessment and history
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        {/* Client Info */}
        <Card
          style={[
            styles.sectionCard,
            { borderColor: theme.effects.cardBorder },
          ]}
        >
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
            Client Information
          </Text>
          <View style={styles.infoRow}>
            <View
              style={[
                styles.iconBox,
                { backgroundColor: theme.colors.primary + "20" },
              ]}
            >
              <Icon name="person" size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Name</Text>
              <Text style={[styles.infoValue, { color: theme.colors.text }]}>
                {profile.clientName}
              </Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <View
              style={[
                styles.iconBox,
                { backgroundColor: theme.colors.info + "20" },
              ]}
            >
              <Icon name="calendar" size={20} color={theme.colors.info} />
            </View>
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Last Assessment</Text>
              <Text style={[styles.infoValue, { color: theme.colors.text }]}>
                {profile.lastAssessmentDate}
              </Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <View
              style={[
                styles.iconBox,
                { backgroundColor: theme.colors.warning + "20" },
              ]}
            >
              <Icon name="time" size={20} color={theme.colors.warning} />
            </View>
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Next Review</Text>
              <Text style={[styles.infoValue, { color: theme.colors.text }]}>
                {profile.nextReviewDate}
              </Text>
            </View>
          </View>
        </Card>

        {/* Gauge Chart */}
        <Card
          style={[
            styles.sectionCard,
            { borderColor: theme.effects.cardBorder, alignItems: "center" },
          ]}
        >
          <Text
            style={[
              styles.cardTitle,
              { color: theme.colors.text, alignSelf: "flex-start" },
            ]}
          >
            Risk Score
          </Text>
          {renderGauge(profile.score)}
        </Card>

        {/* History */}
        <Card
          style={[
            styles.sectionCard,
            { borderColor: theme.effects.cardBorder },
          ]}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Icon name="list" size={20} color={theme.colors.primary} />
            <Text
              style={[
                styles.cardTitle,
                { color: theme.colors.text, marginBottom: 0, marginLeft: 8 },
              ]}
            >
              Assessment History
            </Text>
          </View>

          {assessments.length > 0 ? (
            assessments.map((assessment, index) => (
              <View
                key={assessment.id}
                style={[
                  styles.historyItem,
                  index !== assessments.length - 1 && {
                    borderBottomWidth: 1,
                    borderBottomColor: theme.effects.cardBorder,
                  },
                ]}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <View style={{ flexDirection: "row", gap: 12 }}>
                    <View
                      style={[
                        styles.historyScoreBox,
                        {
                          backgroundColor:
                            getScoreColor(assessment.score) + "20",
                        },
                      ]}
                    >
                      <Icon
                        name={
                          assessment.status === "low"
                            ? "checkmark-circle"
                            : assessment.status === "medium"
                              ? "alert-circle"
                              : "shield"
                        }
                        size={16}
                        color={getScoreColor(assessment.score)}
                      />
                    </View>
                    <View>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <Text
                          style={[
                            styles.historyScore,
                            { color: getScoreColor(assessment.score) },
                          ]}
                        >
                          {assessment.score}
                        </Text>
                        <View
                          style={[
                            styles.miniBadge,
                            {
                              backgroundColor:
                                getScoreColor(assessment.score) + "20",
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.miniBadgeText,
                              { color: getScoreColor(assessment.score) },
                            ]}
                          >
                            {assessment.status} risk
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.historyDate}>
                        {assessment.date} • {assessment.assessedBy}
                      </Text>
                    </View>
                  </View>
                </View>
                <Text style={styles.historyNotes}>{assessment.notes}</Text>
              </View>
            ))
          ) : (
            <Text
              style={{
                textAlign: "center",
                color: theme.colors.textSecondary,
                padding: 20,
              }}
            >
              No history available
            </Text>
          )}
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
  },
  backButton: { padding: 8, marginRight: 8 },
  headerTitle: { fontSize: 20, fontWeight: "bold" },
  headerSubtitle: { fontSize: 13, color: "#6A6D70" },
  content: { padding: 16, gap: 16 },
  sectionCard: { padding: 16, borderRadius: 16, borderWidth: 1 },
  cardTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 16 },
  infoRow: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  infoText: { flex: 1 },
  infoLabel: { fontSize: 12, color: "#6A6D70", marginBottom: 2 },
  infoValue: { fontSize: 15, fontWeight: "500" },

  // Gauge
  gaugeScore: { fontSize: 40, fontWeight: "bold", marginTop: 10 },
  gaugeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
  },
  gaugeBadgeText: { fontSize: 12, fontWeight: "bold" },

  // History
  historyItem: { paddingVertical: 16 },
  historyScoreBox: { padding: 8, borderRadius: 8 },
  historyScore: { fontSize: 18, fontWeight: "bold" },
  miniBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  miniBadgeText: {
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  historyDate: { fontSize: 12, color: "#6A6D70", marginTop: 4 },
  historyNotes: {
    fontSize: 13,
    color: "#6A6D70",
    marginTop: 8,
    lineHeight: 18,
  },
});

export default RiskProfileDetailsScreen;
