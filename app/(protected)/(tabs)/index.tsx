import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/supabase-provider";

const NutrientDonut = ({ label, value, max }: any) => {
  const safeValue = isNaN(value) ? 0 : value;
  const safeMax = isNaN(max) || max === 0 ? 1 : max;
  const percent = Math.min((safeValue / safeMax) * 100, 100);
  if (isNaN(value) || isNaN(max)) return null;
  const color = value > max ? "#f44336" : "#4CAF50";
  const chartData = [
    { value: percent, color },
    { value: 100 - percent, color: "#e0e0e0" },
  ];
  const unit = label === "Calories" ? "" : "g";
  return (
    <View style={{ alignItems: "center", width: 60, marginHorizontal: 4 }}>
      <PieChart
        donut
        radius={28}
        innerRadius={20}
        data={chartData}
        centerLabelComponent={() => (
          <Text style={{ fontSize: 12 }}>{Math.round(value)}{unit}</Text>
        )}
      />
      <Text style={{ fontSize: 10 }}>{label}</Text>
    </View>
  );
};

export default function HomeScreen() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [addingIndex, setAddingIndex] = useState<number | null>(null);
  const [servings, setServings] = useState("1");
  const { session } = useAuth();

  const [thresholds, setThresholds] = useState({
    calories: "250",
    protein: "50",
    carbs: "50",
    fat: "20",
    sugar: "20",
  });
  const [tempThresholds, setTempThresholds] = useState(thresholds);

  const updateThresholds = () => {
    setThresholds(tempThresholds);
  };

  const handleSearch = async (text: string) => {
    setQuery(text);
    if (!text) return setResults([]);
    setLoading(true);
    try {
      const res = await fetch(`https://api.nal.usda.gov/fdc/v1/foods/search?query=${text}&api_key=`);
      const json = await res.json();
      setResults(json.foods || []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleAddToLog = async (item: any, nutrients: any) => {
    const multiplier = parseFloat(servings);
    if (isNaN(multiplier) || multiplier <= 0 || !session?.user?.id) return;
    const nutrientPer100 = (val: number) => Math.round(val * multiplier);
    const { error } = await supabase.from("food_log").insert({
      user_id: session.user.id,
      food_name: item.description,
      calories: nutrientPer100(nutrients.calories || 0),
      protein: nutrientPer100(nutrients.protein || 0),
      carbs: nutrientPer100(nutrients.carbs || 0),
      fat: nutrientPer100(nutrients.fat || 0),
      sugar: nutrientPer100(nutrients.sugar || 0),
    });
    if (!error) {
      setAddingIndex(null);
      setServings("1");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search</Text>
      <TextInput
        style={[styles.input, styles.shadow]}
        placeholder="Search for food"
        placeholderTextColor="#888"
        value={query}
        onChangeText={handleSearch}
      />
      <View style={[styles.thresholdBox, styles.shadow]}>
        <Text style={styles.subtext}>Recommended values per 100g (editable)</Text>
        <View style={styles.thresholdGrid}>
          {(["calories", "protein", "carbs", "fat", "sugar"] as const).map((key) => (
            <View key={key} style={styles.thresholdColumn}>
              <Text style={styles.subtext}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
              <TextInput
                style={styles.thresholdInput}
                value={tempThresholds[key]}
                onChangeText={(text) => setTempThresholds((prev) => ({ ...prev, [key]: text }))}
                keyboardType="numeric"
              />
            </View>
          ))}
        </View>
        <Pressable onPress={updateThresholds}>
          <Text style={styles.updateButton}>Update</Text>
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.resultsContainer} showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator />
        ) : (
          results.map((item, idx) => {
            const nutrients: Record<string, number> = {};
            item.foodNutrients?.forEach((n: any) => {
              if (n.nutrientName.includes("Protein")) nutrients.protein = n.value;
              if (n.nutrientName.includes("Carbohydrate")) nutrients.carbs = n.value;
              if (n.nutrientName.includes("Total lipid")) nutrients.fat = n.value;
              if (n.nutrientName.includes("Sugars")) nutrients.sugar = n.value;
              if (n.nutrientName.includes("Energy")) {
                nutrients.calories = n.unitName === "kJ" ? n.value * 0.239 : n.value;
              }
            });
            const isAdding = addingIndex === idx;
            return (
              <View key={idx} style={styles.card}>
                <Text style={styles.foodName}>{item.description}</Text>
                <Text style={styles.subinfo}>{item.foodCategory || ""} {item.brandOwner ? `• ${item.brandOwner}` : ""}</Text>
                <Text style={styles.servingText}>Serving: per 100g</Text>
                <View style={styles.donutsRow}>
                  <NutrientDonut label="Calories" value={nutrients.calories || 0} max={parseFloat(thresholds.calories) || 0} />
                  <NutrientDonut label="Protein" value={nutrients.protein || 0} max={parseFloat(thresholds.protein) || 0} />
                  <NutrientDonut label="Carbs" value={nutrients.carbs || 0} max={parseFloat(thresholds.carbs) || 0} />
                  <NutrientDonut label="Fat" value={nutrients.fat || 0} max={parseFloat(thresholds.fat) || 0} />
                  <NutrientDonut label="Sugar" value={nutrients.sugar || 0} max={parseFloat(thresholds.sugar) || 0} />
                </View>
                {isAdding ? (
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
                  <Pressable
                    onPress={() => setAddingIndex(null)}
                    style={{
                      width: 80,
                      height: 30,
                      backgroundColor: "red",
                      borderRadius: 8,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ color: "white", fontSize: 20 }}>×</Text>
                  </Pressable>
                
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <Text style={{ fontSize: 16 }}>Serving size</Text>
                    <TextInput
                      style={{
                        width: 50,
                        height: 30,
                        borderWidth: 1,
                        borderColor: "#ccc",
                        borderRadius: 6,
                        textAlign: "center",
                        paddingHorizontal: 8,
                      }}
                      value={servings}
                      onChangeText={setServings}
                      keyboardType="numeric"
                      placeholder="1"
                    />
                  </View>
                
                  <Pressable
                    onPress={() => handleAddToLog(item, nutrients)}
                    style={{
                      width: 80,
                      height: 30,
                      backgroundColor: "green",
                      borderRadius: 8,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ color: "white", fontSize: 18 }}>✓</Text>
                  </Pressable>
                </View>
                ) : (
                  <Pressable onPress={() => setAddingIndex(idx)}
                  style={{
                    marginTop: 8,
                    backgroundColor: "#007bff",
                    borderRadius: 10,
                    paddingVertical: 5,
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>+</Text>
                  </Pressable>
                )}
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    paddingHorizontal: 12,
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 12,
    paddingTop:11,
    alignSelf: "center",
    padding: 5
  },
  input: {
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  thresholdBox: {
    backgroundColor: "#e5e5e5",
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
  },
  thresholdGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginTop: 8,
  },
  thresholdColumn: {
    flexBasis: "18%",
    alignItems: "center",
    marginVertical: 4,
  },
  thresholdInput: {
    backgroundColor: "#fff",
    borderRadius: 6,
    padding: 8,
    width: "100%",
    textAlign: "center",
    fontSize: 14,
  },
  updateButton: {
    backgroundColor: "#000",
    color: "#fff",
    paddingVertical: 10,
    textAlign: "center",
    borderRadius: 8,
    fontWeight: "600",
    marginTop: 10,
  },
  subtext: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  resultsContainer: {
    paddingBottom: 100,
  },
  card: {
    backgroundColor: "#fff",
    marginVertical: 10,
    padding: 12,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  shadow: {
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  foodName: {
    fontWeight: "700",
    fontSize: 15,
    marginBottom: 2,
  },
  subinfo: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  servingText: {
    fontSize: 13,
    color: "#666",
    marginBottom: 10,
    fontStyle: "italic",
  },
  donutsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 10,
  },
});
