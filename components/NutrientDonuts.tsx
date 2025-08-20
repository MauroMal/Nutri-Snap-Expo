import React from "react";
import { View, Text } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { FoodLog } from "./FoodLog";

type NutrientDonutsProps = {
  logs: FoodLog[];
  limits: {
    protein: number;
    carbs: number;
    fat: number;
    sugar: number;
  };
};

export default function NutrientDonuts({ logs, limits }: NutrientDonutsProps) {
  if (!limits) return null;

  const totals = logs.reduce(
    (acc, log) => ({
      protein: acc.protein + (log.protein || 0),
      carbs: acc.carbs + (log.carbs || 0),
      fat: acc.fat + (log.fat || 0),
      sugar: acc.sugar + (log.sugar || 0),
    }),
    { protein: 0, carbs: 0, fat: 0, sugar: 0 }
  );

  const renderDonut = (label: string, value: number = 0, max: number = 100) => {
    const basePercent = Math.min((value / max) * 100, 100);
    const overflow = value > max ? ((value - max) / max) * 100 : 0;

    const data = [];

    if (basePercent > 0) {
      data.push({ value: basePercent, color: "#4CAF50" }); // green
    }

    if (overflow > 0) {
      data.push({ value: overflow, color: "#f44336" }); // red
    }

    const totalPercent = basePercent + overflow;
    if (totalPercent < 100) {
      data.push({ value: 100 - totalPercent, color: "#e0e0e0" }); // gray
    }

    return (
      <View style={{ alignItems: "center", width: 80, marginHorizontal: 4 }}>
        <View style={{ position: "relative", justifyContent: "center", alignItems: "center" }}>
          <PieChart
            donut
            radius={40}
            innerRadius={30}
            data={data}
            startAngle={-90}
          />
          <Text
            style={{
              position: "absolute",
              fontWeight: "600",
              fontSize: 14,
              textAlign: "center",
            }}
          >
            {Math.round(value)}g
          </Text>
        </View>
        <Text style={{ marginTop: 6, fontSize: 13 }}>{label}</Text>
      </View>
    );
  };

  console.log(limits)
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
      {renderDonut("Protein", totals.protein, limits.protein)}
      {renderDonut("Carbs", totals.carbs, limits.carbs)}
      {renderDonut("Fat", totals.fat, limits.fat)}
      {renderDonut("Sugar", totals.sugar, limits.sugar)}
    </View>
  );
}