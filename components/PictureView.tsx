import React, { useEffect, useRef, useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  ScrollView,
  Easing,
  TextInput,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Image } from "expo-image";
import { shareAsync } from "expo-sharing";
import { PieChart } from "react-native-gifted-charts";
import IconButton from "./IconButton";
import { useAuth } from "@/context/supabase-provider";
import { supabase } from "@/lib/supabase";
import * as ImageManipulator from "expo-image-manipulator";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface PictureViewProps {
  picture: string;
  setPicture: React.Dispatch<React.SetStateAction<string>>;
}
const NutrientDonut = ({ label, value, max }: any) => {
  const safeValue = isNaN(value) ? 0 : value;
  const safeMax = isNaN(max) || max === 0 ? 1 : max;
  const percent = Math.min((safeValue / safeMax) * 100, 100);
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
        innerRadius={18}
        innerCircleColor={"#222"}
        data={chartData}
        centerLabelComponent={() => (
          <Text style={{ fontSize: 12, color: "#fff" }}>{Math.round(value)}{unit}</Text>
        )}
      />
      <Text style={{ fontSize: 10, color: "#fff", marginTop: 4 }}>{label}</Text>
    </View>
  );
};

export default function PictureView({ picture, setPicture }: PictureViewProps) {
  const insets = useSafeAreaInsets();
  const [showScroll, setShowScroll] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [addingIndex, setAddingIndex] = useState<number | null>(null);
  const [servings, setServings] = useState("1");
  const imageAnim = useRef(new Animated.Value(0)).current;
  const { session } = useAuth();
  const [showFallback, setShowFallback] = useState(false);

  const thresholds = {
    calories: 250,
    protein: 50,
    carbs: 50,
    fat: 20,
    sugar: 20,
  };

  const handleMainButtonPress = () => {
    Animated.timing(imageAnim, {
      toValue: 1,
      duration: 500,
      easing: Easing.out(Easing.exp),
      useNativeDriver: false,
    }).start(() => setShowScroll(true));
  };

  const imageHeight = imageAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [400, 120],
  });

  const handleDetectFood = async () => {
    try {
      const manipulated = await ImageManipulator.manipulateAsync(
        picture,
        [],
        { compress: 0.9, format: ImageManipulator.SaveFormat.JPEG }
      );
  
      const formData = new FormData();
      formData.append("image", {
        uri: manipulated.uri,
        name: "photo.jpg",
        type: "image/jpeg",
      } as any);
  
      const response = await fetch("http://5000/detect", {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });
  
      const json = await response.json();
      console.log("Detected foods:", json.foods);
  
      if (!json.foods || json.foods.length === 0) {
        setResults([]);
        setShowFallback(false);
        setTimeout(() => {
          setShowFallback(true);
        }, 2000); // 2 second delay
        return;
      }
  
      const allResults: any[] = [];
  
      for (const food of json.foods) {
        const res = await fetch(
          `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(
            food
          )}&api_key=`
        );
        const data = await res.json();
        if (data.foods?.length) {
          allResults.push(...data.foods);
        }
      }
  
      setResults(allResults);
    } catch (err) {
      console.error("Upload or fetch error:", err);
    }
  };

  const handleAddToLog = async (item: any, nutrients: any) => {
    const multiplier = parseFloat(servings);
    if (isNaN(multiplier) || multiplier <= 0 || !session?.user?.id) return;
    const scale = (val: number) => Math.round(val * multiplier);
    const { error } = await supabase.from("food_log").insert({
      user_id: session.user.id,
      food_name: item.description,
      calories: scale(nutrients.calories || 0),
      protein: scale(nutrients.protein || 0),
      carbs: scale(nutrients.carbs || 0),
      fat: scale(nutrients.fat || 0),
      sugar: scale(nutrients.sugar || 0),
    });
    if (!error) {
      setAddingIndex(null);
      setServings("1");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>NutriSnap</Text>

      <Animated.View style={[styles.imageWrapper, { height: imageHeight }]}>
        <Image source={picture} style={styles.image} />
      </Animated.View>

      <TouchableOpacity
        style={[styles.mainButton, styles.shadow]}
        onPress={async () => {
          handleMainButtonPress();
          await handleDetectFood();
        }}
      >
        <Text style={styles.buttonText}>Scan</Text>
      </TouchableOpacity>

      {showScroll && (
        <View style={styles.scrollWrapper}>
          <ScrollView contentContainerStyle={[styles.scrollViewContent, { paddingBottom: insets.bottom + 101 }]} showsVerticalScrollIndicator={false}>
          {results.length === 0 ? (
              showFallback ? (
                <View style={styles.fallbackContainer}>
                  <Text style={styles.fallbackText}>No food detected. Try again with a clearer image.</Text>
                </View>
              ) : (
                <ActivityIndicator size="large" color="#888" />
              )
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
                      <NutrientDonut label="Calories" value={nutrients.calories || 0} max={thresholds.calories} />
                      <NutrientDonut label="Protein" value={nutrients.protein || 0} max={thresholds.protein} />
                      <NutrientDonut label="Carbs" value={nutrients.carbs || 0} max={thresholds.carbs} />
                      <NutrientDonut label="Fat" value={nutrients.fat || 0} max={thresholds.fat} />
                      <NutrientDonut label="Sugar" value={nutrients.sugar || 0} max={thresholds.sugar} />
                    </View>
                    {isAdding ? (
                      <View style={styles.servingRow}>
                        <Pressable
                          onPress={() => setAddingIndex(null)}
                          style={styles.cancelBtn}
                        >
                          <Text style={styles.cancelText}>×</Text>
                        </Pressable>
                        <View style={styles.servingInputWrapper}>
                          <Text style={styles.servingLabel}>Serving size</Text>
                          <TextInput
                            style={styles.servingInput}
                            value={servings}
                            onChangeText={setServings}
                            keyboardType="numeric"
                          />
                        </View>
                        <Pressable
                          onPress={() => handleAddToLog(item, nutrients)}
                          style={styles.confirmBtn}
                        >
                          <Text style={styles.confirmText}>✓</Text>
                        </Pressable>
                      </View>
                    ) : (
                      <Pressable
                        onPress={() => setAddingIndex(idx)}
                        style={styles.plusBtn}
                      >
                        <Text style={styles.plusText}>+</Text>
                      </Pressable>
                    )}
                  </View>
                );
              })
            )}
          </ScrollView>
        </View>
      )}

<View style={[styles.sideButtonsContainer, { paddingBottom: insets.bottom || 24}]}>
        <TouchableOpacity
          onPress={() => setPicture("")}
          style={[styles.sideButton, styles.shadow, { backgroundColor: "red" }]}
        >
          <IconButton
            onPress={() => setPicture("")}
            iosName="xmark"
            androidName="close"
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => shareAsync(picture)}
          style={[styles.sideButton, styles.shadow, { backgroundColor: "#007bff" }]}
        >
          <IconButton
            onPress={() => shareAsync(picture)}
            iosName="square.and.arrow.up"
            androidName="share"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingHorizontal: 7,
    paddingTop: 50,
  },
  title: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  imageWrapper: {
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#000",
    marginBottom: 16,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    borderRadius: 12,
  },
  mainButton: {
    backgroundColor: "green",
    paddingVertical: 11,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  scrollWrapper: {
    flexGrow: 0,
    height: 470,
    marginBottom: 12,
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#222",
    marginVertical: 10,
    padding: 12,
    borderRadius: 10,
  },
  foodName: {
    fontWeight: "700",
    fontSize: 15,
    marginBottom: 2,
    color: "#fff",
  },
  subinfo: {
    fontSize: 12,
    color: "#ccc",
    marginBottom: 4,
  },
  servingText: {
    fontSize: 13,
    color: "#aaa",
    marginBottom: 10,
    fontStyle: "italic",
  },
  donutsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 7,
  },
  servingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },
  servingInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  servingLabel: {
    fontSize: 16,
    color: "#fff",
  },
  servingInput: {
    width: 50,
    height: 30,
    backgroundColor: "#fff",
    borderRadius: 6,
    textAlign: "center",
  },
  plusBtn: {
    marginTop: 2,
    backgroundColor: "#007bff",
    borderRadius: 10,
    paddingVertical: 5,
    alignItems: "center",
  },
  plusText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  cancelBtn: {
    width: 80,
    height: 30,
    backgroundColor: "red",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelText: {
    color: "white",
    fontSize: 20,
  },
  confirmBtn: {
    width: 80,
    height: 30,
    backgroundColor: "green",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  confirmText: {
    color: "white",
    fontSize: 18,
  },
  sideButtonsContainer: {
    flexDirection: "row",
    width: "100%",
    gap: 8,
    paddingBottom: 24,
  },
  sideButton: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 10,
    alignItems: "center",
  },
  shadow: {
    shadowColor: "#000",
    shadowRadius: 8,
    shadowOffset: { height: 6, width: 0 },
    shadowOpacity: 0.15,
  },
  fallbackContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  fallbackText: {
    color: "#888",
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
    
  },
});