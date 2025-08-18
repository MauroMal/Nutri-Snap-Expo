import * as React from "react";
import { View } from "react-native";
import FoodLogItem from "./FoodLogItem";

export type FoodLog = {
  log_id: string;
  user_id: string;
  food_name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  sugar: number;
  log_date: string;
};

type FoodLogListProps = {
  logs: FoodLog[];
  deleteLog?: (log_id: string) => void;
};

export default function FoodLogList({ logs, deleteLog }: FoodLogListProps) {
  return (
    <View>
      {logs.map((log) => (
        <FoodLogItem
          key={log.log_id}
          foodName={log.food_name}
          calories={log.calories}
          protein={log.protein}
          carbs={log.carbs}
          fat={log.fat}
          sugar={log.sugar}
          date={new Date(log.log_date).toLocaleDateString()}
          onDelete={() => deleteLog?.(log.log_id)}
        />
      ))}
    </View>
  );
}