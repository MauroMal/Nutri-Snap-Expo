import { Image } from "expo-image";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { shareAsync } from "expo-sharing";
import IconButton from "./IconButton";

interface PictureViewProps {
  picture: string;
  setPicture: React.Dispatch<React.SetStateAction<string>>;
}

export default function PictureView({ picture, setPicture }: PictureViewProps) {
  return (
    <View style={styles.container}>
      <Image source={picture} style={styles.image} />

      <TouchableOpacity style={[styles.mainButton, styles.shadow]}>
        <Text style={styles.buttonText}>Main Button</Text>
      </TouchableOpacity>

      <View style={styles.sideButtonsContainer}>
        <TouchableOpacity
          onPress={() => setPicture("")}
          style={[styles.sideButton, styles.shadow, { backgroundColor: "#ff4d4d" }]}
        >
          <IconButton
            onPress={() => setPicture("")}
            iosName="xmark"
            androidName="close"
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => shareAsync(picture)}
          style={[styles.sideButton,, styles.shadow, { backgroundColor: "#4d94ff" }]}
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
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20
  },
  image: {
    width: "100%",
    height: undefined,
    aspectRatio: 3 / 4,
    resizeMode: "contain",
    borderRadius: 12,
    borderColor: "#fff",
    backgroundColor: "#000",
  },
  mainButton: {
    marginTop: 16,
    width: "100%",
    backgroundColor: "green",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  sideButtonsContainer: {
    marginTop: 12,
    flexDirection: "row",
    width: "100%",
    gap: 10,
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
    }
});