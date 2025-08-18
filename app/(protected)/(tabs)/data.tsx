import * as React from "react";
import {
  ScrollView,
  Platform,
  View,
  Text,
  RefreshControl,
} from "react-native";
import AddFood from "@/components/AddFood";
import FoodLogList from "@/components/FoodLog";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/supabase-provider";
import { FoodLog } from "@/components/FoodLog";
import Card from "@/components/ui/Card";
import WeeklyChart from "@/components/WeeklyChart";
import NutrientDonuts from "@/components/NutrientDonuts";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DataScreen() {
  const { session } = useAuth();
  const [logs, setLogs] = React.useState<FoodLog[]>([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [selectedDay, setSelectedDay] = React.useState<number>(new Date().getDay());

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
        paddingBottom: 20,
        flexGrow: 1,
        backgroundColor: "#fff",
      }}
      style={{ backgroundColor: "#fff" }}
    >
      <SafeAreaView
        edges={['top']} // Only apply safe area to the top
        style={{ flex: 1, padding: 15 }}
      >
        <Text style={{ fontSize: 30, fontWeight: "bold", padding: 5 }}>
          Food Log
        </Text>
        <AddFood onAdd={fetchLogs} />
        <Card style={{ marginBottom: 16, marginTop: 16 }}>
          <WeeklyChart
            logs={logs}
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
          />
          <NutrientDonuts logs={selectedDayLogs} />
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
    </ScrollView>
  );
}