import { useTheme } from "@hooks/useTheme";
import { RiskProfile } from "../../types";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, G, Line, Path } from "react-native-svg";

const Gauge: React.FC<{ score: number }> = ({ score }) => {
  const theme = useTheme();
  const [profile, setProfile] = useState<RiskProfile | null>(null);
  const radius = 80;
  const strokeWidth = 12;
  const width = radius * 2 + strokeWidth * 2;
  const height = radius + strokeWidth * 2;
  const centerX = width / 2;
  const centerY = height - strokeWidth;

  // Calculate needle rotation: -90 (0 score) to 90 (100 score)
  const rotation = (score / 100) * 180 - 90;

  const getScoreColor = (score: number) => {
    if (score < 40) return theme.colors.success;
    if (score < 70) return theme.colors.warning;
    return theme.colors.error;
  };

  const styles = StyleSheet.create({
    // Gauge
    gaugeScore: { fontSize: 40, fontWeight: "bold", marginTop: 10 },
    gaugeBadge: {
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 12,
      marginTop: 4,
    },
    gaugeBadgeText: { fontSize: 12, fontWeight: "bold" },
  });

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
          <Circle cx={centerX} cy={centerY} r="5" fill={getScoreColor(score)} />
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

export default Gauge;
