import React from "react";
import { View, Text, Dimensions, StyleSheet } from "react-native";
import { LineChart, BarChart, PieChart } from "react-native-chart-kit";
import { useTheme } from "../hooks/useTheme";

interface ChartProps {
  type: "line" | "bar" | "pie";
  data: any;
  title: string;
  height?: number;
}

const Chart = ({ type, data, title, height = 220 }: ChartProps) => {
  const theme = useTheme();
  const screenWidth = Dimensions.get("window").width - 32;

  const chartConfig = {
    backgroundGradientFrom: theme.colors.surface,
    backgroundGradientTo: theme.colors.surface,
    color: (opacity = 1) => theme.colors.primary,
    labelColor: (opacity = 1) => theme.colors.textSecondary,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
    fillShadowGradient: theme.colors.primary,
    fillShadowGradientOpacity: 1,
  };

  const renderChart = () => {
    switch (type) {
      case "line":
        return (
          <LineChart
            data={data}
            width={screenWidth - 2}
            height={height}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        );
      case "bar":
        return (
          <BarChart
            data={data}
            width={screenWidth - 2}
            height={height}
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={chartConfig}
            style={styles.chart}
          />
        );
      case "pie":
        return (
          <PieChart
            data={data}
            width={screenWidth - 2}
            height={height}
            chartConfig={chartConfig}
            accessor="value"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        );
      default:
        return null;
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.effects.cardBackground,
          borderColor: theme.effects.cardBorder,
        },
      ]}
    >
      <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
      {/* the chart should be inside the container */}
      {renderChart()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    // padding: 16,
    paddingRight: 1,
    marginBottom: 16,
    borderWidth: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
    marginLeft: 16,
    marginTop: 16,
  },
  chart: {
    borderRadius: 16,
    paddingLeft: 0,
  },
});

export default Chart;
