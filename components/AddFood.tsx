import React, { useState } from "react";
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Card from "./ui/Card";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/supabase-provider";

export default function AddFood({ onAdd }: { onAdd: () => void }) {
  const [isAddingFood, setIsAddingFood] = useState(false);
  const [foodName, setFoodName] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");
  const [sugar, setSugar] = useState("");
  const { session } = useAuth();

  const handleSave = async () => {
    if (
      !foodName.trim() ||
      !calories.trim() ||
      !protein.trim() ||
      !carbs.trim() ||
      !fat.trim() ||
      !sugar.trim()
    ) {
      alert("Please fill out all fields.");
      return;
    }

    if (!session?.user?.id) return;

    const { error } = await supabase.from("food_log").insert({
      user_id: session.user.id,
      food_name: foodName,
      calories: parseInt(calories) || 0,
      protein: parseFloat(protein) || 0,
      carbs: parseFloat(carbs) || 0,
      fat: parseFloat(fat) || 0,
      sugar: parseFloat(sugar) || 0,
      log_date: new Date().toISOString(),
    });

    if (error) {
      console.error("Error adding food:", error);
    } else {
      resetForm();
      setIsAddingFood(false);
      onAdd?.(); // This triggers refresh in parent (DataScreen)
    }
  };

  const resetForm = () => {
    setFoodName("");
    setCalories("");
    setProtein("");
    setCarbs("");
    setFat("");
    setSugar("");
  };

  return (
    <View style={{ marginTop: 10 }}>
      {isAddingFood ? (
        <View>
          <Card>
            <TextInput placeholder="Food name" placeholderTextColor="#888" value={foodName} onChangeText={setFoodName} style={styles.food_nutri} />
            <TextInput placeholder="Calories" placeholderTextColor="#888" value={calories} onChangeText={(text) => setCalories(text.replace(/[^0-9]/g, ""))} keyboardType="numeric" style={styles.food_nutri} />
            <TextInput placeholder="Protein (g)" placeholderTextColor="#888" value={protein} onChangeText={setProtein} keyboardType="numeric" style={styles.food_nutri} />
            <TextInput placeholder="Carbs (g)" placeholderTextColor="#888" value={carbs} onChangeText={setCarbs} keyboardType="numeric" style={styles.food_nutri} />
            <TextInput placeholder="Fat (g)" placeholderTextColor="#888" value={fat} onChangeText={setFat} keyboardType="numeric" style={styles.food_nutri} />
            <TextInput placeholder="Sugar (g)" placeholderTextColor="#888" value={sugar} onChangeText={setSugar} keyboardType="numeric" style={styles.food_nutri} />
          </Card>

          <View style={styles.sideButtonsContainer}>
            <TouchableOpacity onPress={() => setIsAddingFood(false)} style={[styles.sideButton, styles.shadow, { backgroundColor: "#ff4d4d" }]}>
              <MaterialIcons name="close" size={24} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity onPress={handleSave} style={[styles.sideButton, styles.shadow, { backgroundColor: "#4CAF50" }]}>
              <MaterialIcons name="check" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <AddButton setIsAddingFood={setIsAddingFood} />
      )}
    </View>
  );
}

function AddButton({ setIsAddingFood }: { setIsAddingFood: React.Dispatch<React.SetStateAction<boolean>> }) {
  return (
    <TouchableOpacity
      onPress={() => setIsAddingFood(true)}
      activeOpacity={0.6}
      style={{
        height: 50,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#007bff",
        borderRadius: 15,
        shadowColor: "#000",
        shadowRadius: 8,
        shadowOffset: { height: 6, width: 0 },
        shadowOpacity: 0.35,
      }}
    >
      <MaterialIcons name="add" size={24} color="#fff" />
      <Text style={{ fontWeight: "700", color: "#fff", marginLeft: 5 }}>Add Food</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  food_nutri: {
    marginVertical: 5,
    borderRadius: 6,
    borderWidth: 1.5,
    height: 35,
    borderColor: "gray",
    paddingLeft: 5,
  },
  sideButtonsContainer: {
    marginTop: 12,
    flexDirection: "row",
    gap: 10,
    alignSelf: "center",
  },
  sideButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  shadow: {
    shadowColor: "#000",
    shadowRadius: 8,
    shadowOffset: { height: 6, width: 0 },
    shadowOpacity: 0.15,
  },
});