import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AutoSizeText, ResizeTextMode } from "react-native-auto-size-text";
import Card from "./ui/Card";

interface FoodLogItemProps {
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  sugar: number;
  date: string; 
  onDelete?: () => void;
}

export default function FoodLogItem({
  foodName,
  calories,
  protein,
  carbs,
  fat,
  sugar,
  date,
  onDelete
}: FoodLogItemProps) {
  return (
    <TouchableOpacity onLongPress={onDelete} activeOpacity={0.8}>
      <Card>
        <View style={styles.row}>
          <View style={styles.calorieBox}>
            <AutoSizeText
              fontSize={28}
              mode={ResizeTextMode.max_lines}
              numberOfLines={1}
              style={styles.calories}
            >
              {calories} cal
            </AutoSizeText>
          </View>

          <View style={styles.foodInfo}>
            <Text style={styles.foodName}>{foodName}</Text>
            <Text style={styles.date}>{date}</Text>
          </View>

          <View style={styles.nutrientBox}>
            <Text style={styles.nutrientText}>Protein: {protein}g</Text>
            <Text style={styles.nutrientText}>Carb: {carbs}g</Text>
            <Text style={styles.nutrientText}>Fat: {fat}g</Text>
            <Text style={styles.nutrientText}>Sugar: {sugar}g</Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  calorieBox: {
    width: 60,
    alignItems: "flex-start",
  },
  calories: {
    fontWeight: "800",
  },
  foodInfo: {
    flex: 1,
    gap: 2,
  },
  foodName: {
    fontSize: 16,
    fontWeight: "600",
  },
  date: {
    fontSize: 12,
    color: "gray",
  },
  nutrientBox: {
    alignItems: "flex-end",
    gap: 2,
  },
  nutrientText: {
    fontSize: 12,
    color: "gray",
  },
});