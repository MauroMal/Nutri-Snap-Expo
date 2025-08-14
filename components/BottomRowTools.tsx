import { StyleSheet, TouchableOpacity, View } from "react-native";
import IconButton from "./IconButton";
import { Link } from "expo-router";
import { ThemedText } from "./ThemedText";
import { FlashMode } from "expo-camera";

interface CameraToolsProps{
  cameraZoom: number;
  cameraFlash: FlashMode
  cameraTorch: boolean;
  setCameraZoom: React.Dispatch<React.SetStateAction<number>>;
  setCameraTorch: React.Dispatch<React.SetStateAction<boolean>>;
  setCameraFlash: React.Dispatch<React.SetStateAction<FlashMode>>;
}

export default function BottomRowTools({
  cameraZoom,
  cameraFlash,
  cameraTorch,
  setCameraZoom,
  setCameraTorch,
  setCameraFlash,
}: CameraToolsProps) {
  return (
    <View style={[styles.bottomContainer, styles.directionRowItemsCenter]}>
      <IconButton
        onPress={()=>
          setCameraTorch((prev) => !(prev))
        }
        iosName={"flashlight.on.fill"}
        androidName={"flashlight"}
        />
        <IconButton
        onPress={() =>
          setCameraFlash((prevValue) => (prevValue === "off" ? "on" : "off"))
        }
        iosName={cameraFlash === "on" ? "bolt.fill" : "bolt.slash"}
        androidName={cameraFlash === "on" ? "flash" : "flash-off"}
      />
      <IconButton
        onPress={() => {
          // decrement by .01
          if (cameraZoom > 0) {
            setCameraZoom((prevValue) => prevValue - 0.01);
          }
        }}
        iosName={"minus"}
        androidName="close"
      />
      <IconButton
        onPress={() => {
          // increment by .01
          if (cameraZoom < 1) {
            setCameraZoom((prevValue) => prevValue + 0.01);
          }
        }}
        iosName={"plus"}
        androidName="close"
      />
    </View>
  )
}

const styles = StyleSheet.create({
  directionRowItemsCenter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 1,
  },
  bottomContainer: {
    width: "40%",
    justifyContent: "space-between",
    position: "absolute",
    alignSelf: "center",
    bottom: 15,
    backgroundColor: "rgba(0,0,0,0.30)",
    padding: 6,             
    borderRadius: 999,
  },
});