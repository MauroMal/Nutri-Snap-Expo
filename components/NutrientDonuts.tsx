import React from "react";
import { View, Text } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { FoodLog } from "./FoodLog";

type NutrientDonutsProps = {
  logs: FoodLog[];
};

const maxValues = {
  protein: 150,
  carbs: 300,
  fat: 70,
  sugar: 50,
};

export default function NutrientDonuts({ logs }: NutrientDonutsProps) {
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
    const percent = Math.min((value / max) * 100, 100);
    const color = value > max ? "#f44336" : "#4CAF50";
  
    return (
      <View style={{ alignItems: "center", width: 80, marginHorizontal: 4 }}>
        <View style={{ position: "relative", justifyContent: "center", alignItems: "center" }}>
          <PieChart
            donut
            radius={40}
            innerRadius={30}
            data={[
              { value: percent || 0.01, color },
              { value: 100 - percent || 99.99, color: "#e0e0e0" },
            ]}
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

  return (
    <View style={{ flexDirection: "row", justifyContent: "space-around"}}>
      {renderDonut("Protein", totals.protein, maxValues.protein)}
      {renderDonut("Carbs", totals.carbs, maxValues.carbs)}
      {renderDonut("Fat", totals.fat, maxValues.fat)}
      {renderDonut("Sugar", totals.sugar, maxValues.sugar)}
    </View>
  );
}