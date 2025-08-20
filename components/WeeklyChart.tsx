import { View, Text, TouchableOpacity } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { SymbolView } from "expo-symbols";
import { useEffect, useState } from "react";
import { FoodLog } from "./FoodLog";

export default function WeeklyChart({
  logs,
  selectedDay,
  setSelectedDay,
  calorieLimit,
}: {
  logs: FoodLog[];
  selectedDay: number;
  setSelectedDay: (day: number) => void;
  calorieLimit: number;
}) {
  const [barData, setBarData] = useState<{ label: string; value: number }[]>([]);
  const [chartKey, setChartKey] = useState(0);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentEndDate, setCurrentEndDate] = useState(new Date());

  useEffect(() => {
    const { startDate, endDate } = getWeekRange(currentDate);
    setCurrentEndDate(new Date(startDate));

    const weekLogs = logs.filter((entry) => {
      const logDate = new Date(entry.log_date);
      return logDate >= startDate && logDate <= endDate;
    });

    const dayMap: { [key: number]: number } = {};
    for (let i = 0; i < 7; i++) dayMap[i] = 0;

    weekLogs.forEach((entry) => {
      const date = new Date(entry.log_date);
      const day = date.getDay(); // 0 = Sunday
      dayMap[day] += entry.calories || 0;
    });

    const labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const formattedData = labels.map((label, i) => ({
      label,
      value: dayMap[i],
      frontColor: dayMap[i] > calorieLimit ? "#f44336" : "#4CAF50",
    }));

    setBarData(formattedData);
    setChartKey((prev) => prev + 1);
  }, [logs, currentDate, calorieLimit]);

  const getWeekRange = (date: Date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    return {
      startDate: startOfWeek,
      endDate: endOfWeek,
    };
  };

  const handlePreviousWeek = () => {
    const prev = new Date(currentDate);
    prev.setDate(prev.getDate() - 7);
    setCurrentDate(prev);
  };

  const handleNextWeek = () => {
    const next = new Date(currentDate);
    next.setDate(next.getDate() + 7);
    setCurrentDate(next);
  };

  const selectedDate = new Date(currentDate);
  selectedDate.setDate(currentDate.getDate() - selectedDate.getDay() + selectedDay);
  const formattedSelectedDate = selectedDate.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  //console.log(calorieLimit)
  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontWeight: "700", fontSize: 18, marginBottom: 8 }}>
        {currentEndDate.toLocaleDateString("en-US", { month: "short" })} {currentEndDate.getDate()} -{" "}
        {currentDate.toLocaleDateString("en-US", { month: "short" })} {currentDate.getDate()}
      </Text>

      <Text style={{ fontWeight: "700", fontSize: 32, marginBottom: 16 }}>
        {barData[selectedDay]?.value ?? 0} calories
      </Text>

      <BarChart
        onPress={(_item: { label: string; value: number }, index: number) => {
          setSelectedDay(index);
        }}
        key={chartKey}
        data={barData}
        barWidth={18}
        height={200}
        width={290}
        minHeight={3}
        barBorderRadius={3}
        showGradient={false}
        spacing={20}
        noOfSections={4}
        yAxisThickness={0}
        xAxisThickness={0}
        xAxisLabelsVerticalShift={2}
        xAxisLabelTextStyle={{ color: "gray" }}
        yAxisTextStyle={{ color: "gray" }}
        isAnimated
        animationDuration={300}
      />

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <TouchableOpacity onPress={handlePreviousWeek} style={{ alignItems: "center", marginTop: 10}}>
          <SymbolView name="chevron.left.circle.fill" size={40} type="hierarchical" tintColor={"gray"} />
          <Text style={{ fontSize: 11, color: "gray" }}>Prev week</Text>
        </TouchableOpacity>

        <Text style={{ fontSize: 20, fontWeight: "500"}}>{formattedSelectedDate}</Text>

        <TouchableOpacity onPress={handleNextWeek} style={{ alignItems: "center", marginTop: 10}}>
          <SymbolView name="chevron.right.circle.fill" size={40} type="hierarchical" tintColor={"gray"} />
          <Text style={{ fontSize: 11, color: "gray" }}>Next week</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}