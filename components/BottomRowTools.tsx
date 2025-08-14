import { StyleSheet, TouchableOpacity, View } from "react-native";
import IconButton from "./IconButton";
import { Link } from "expo-router";
import { ThemedText } from "./ThemedText";

export default function BottomRowTools() {
  return (
    <View style={[styles.bottomContainer, styles.directionRowItemsCenter]}>
      <Link href={"/media-library"} asChild>
        <IconButton iosName="photo.stack" androidName="library" onPress={()=>{}}/>
      </Link>
      <IconButton androidName="add" iosName="magnifyingglass" />
    </View>
  )
}

const styles = StyleSheet.create({
  directionRowItemsCenter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  bottomContainer: {
    width: "100%",
    justifyContent: "space-between",
    position: "absolute",
    alignSelf: "center",
    bottom: 6,
  },
});