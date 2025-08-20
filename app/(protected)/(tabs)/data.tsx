import * as React from "react";
import {
  ScrollView,
  Platform,
  View,
  Text,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import AddFood from "@/components/AddFood";
import { useEffect, useState } from "react";
import FoodLogList from "@/components/FoodLog";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/supabase-provider";
import { FoodLog } from "@/components/FoodLog";
import Card from "@/components/ui/Card";
import WeeklyChart from "@/components/WeeklyChart";
import NutrientDonuts from "@/components/NutrientDonuts";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfileScreen from "@/components/ProfileScreen";
import { SymbolView } from "expo-symbols"; 
import { Modal } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

export default function DataScreen() {
  const { session } = useAuth();
  const [logs, setLogs] = React.useState<FoodLog[]>([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [selectedDay, setSelectedDay] = React.useState<number>(new Date().getDay());
  const [showProfile, setShowProfile] = React.useState(false);
  const [limits, setLimits] = useState({
    protein: 150,
    carbs: 300,
    fat: 70,
    sugar: 50,
    calories: 2500,
  });
  
  const fetchLimits = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("protein_limit, carbs_limit, fat_limit, sugar_limit, calories_limit")
      .eq("id", session?.user?.id)
      .single();
  
    if (data) {
      setLimits({
        protein: data.protein_limit,
        carbs: data.carbs_limit,
        fat: data.fat_limit,
        sugar: data.sugar_limit,
        calories: data.calories_limit,
      });
    }
  };
  
  useFocusEffect(
    useCallback(() => {
      fetchLimits();
    }, [session?.user?.id])
  );

  const fetchLogs = async () => {
    if (!session?.user?.id) return;
    const { data, error } = await supabase
      .from("food_log")
      .select("*")
      .eq("user_id", session.user.id)
      .order("log_date", { ascending: false })
      .limit(20);

    if (error) {
      console.error("Error fetching logs:", error);
    } else {
      setLogs(data as FoodLog[]);
    }
  };

  React.useEffect(() => {
    fetchLogs();
  }, [session?.user?.id]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchLogs();
    setRefreshing(false);
  };

  const deleteLog = async (log_id: string) => {
    const { error } = await supabase
      .from("food_log")
      .delete()
      .eq("log_id", log_id);

    if (error) {
      console.error("Error deleting log:", error);
    } else {
      fetchLogs();
    }
  };

  const selectedDayLogs = logs.filter((log) => {
    const logDate = new Date(log.log_date);
    return logDate.getDay() === selectedDay;
  });

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
      contentContainerStyle={{
        paddingBottom: 90,
        flexGrow: 1,
        backgroundColor: "#fff",
      }}
      style={{ backgroundColor: "#fff" }}
    >
      <SafeAreaView
        edges={['top']} // Only apply safe area to the top
        style={{ flex: 1, padding: 10}}
      >
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 10 }}>
          <Text style={{ fontSize: 30, fontWeight: "bold" }}>Food Log</Text>
          <TouchableOpacity onPress={() => setShowProfile(true)}>
            <SymbolView name="person.crop.circle" size={35} tintColor="#000" />
          </TouchableOpacity>
        </View>

        <AddFood onAdd={fetchLogs} />
        <Card style={{ marginBottom: 16, marginTop: 16 }}>
        <WeeklyChart
          logs={logs}
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
          calorieLimit={limits.calories}
        />

        {limits && <NutrientDonuts logs={selectedDayLogs} limits={limits} />}
        </Card>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <View style={{ flex: 1, height: 1, backgroundColor: "#ccc" }} />
          <Text style={{ marginHorizontal: 8, color: "#888", fontWeight: "500" }}>
            Logs
          </Text>
          <View style={{ flex: 1, height: 1, backgroundColor: "#ccc" }} />
        </View>
        <FoodLogList logs={logs} deleteLog={deleteLog} />
      </SafeAreaView>
      <Modal
        visible={showProfile}
        animationType="slide"
        onRequestClose={() => setShowProfile(false)}
      >
        <ProfileScreen 
          onBack={() => setShowProfile(false)} 
          limits={limits}
          setLimits={setLimits}
        />
      </Modal>
    </ScrollView>
  );
}