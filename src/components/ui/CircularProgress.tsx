import React from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Circle, G } from "react-native-svg";
import { useTheme } from "../../hooks/useTheme";

interface CircularProgressProps {
  size: number;
  strokeWidth: number;
  percentage: number;
  color?: string;
  backgroundColor?: string;
  children?: React.ReactNode;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  size,
  strokeWidth,
  percentage,
  color,
  backgroundColor,
  children,
}) => {
  const theme = useTheme();
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const progressColor = color || theme.colors.primary;
  const trackColor = backgroundColor || theme.effects.cardBorder;

  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Svg width={size} height={size}>
        <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
          {/* Track */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={trackColor}
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={progressColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="none"
          />
        </G>
      </Svg>
      <View style={StyleSheet.absoluteFillObject}>
        <View style={styles.centerContent}>{children}</View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  centerContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default CircularProgress;
