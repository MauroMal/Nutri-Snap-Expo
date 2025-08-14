import { Image } from "expo-image";
import { Alert, View } from "react-native";
import IconButton from "./IconButton";
import { shareAsync } from "expo-sharing";
import { saveToLibraryAsync } from "expo-media-library";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";

interface PictureViewProps {
  picture: string;
  setPicture: React.Dispatch<React.SetStateAction<string>>;
}

export default function PictureView({ picture, setPicture }: PictureViewProps) {
  return (
    <View>
      <View style={{
        position: "absolute",
        right: 6,
        zIndex: 1,
        paddingTop: 50,
        gap: 16,
      }}>
        <IconButton
          iosName="arrow.down"
          androidName="save"
          onPress={async () => {
            saveToLibraryAsync(picture);
            Alert.alert("Picture saved!");
          }}
        />
        <IconButton
          iosName="arrow.down"
          androidName="save"
          onPress={() => saveToLibraryAsync(picture)}
        />
      </View>
      <Image 
        source={picture} style={{
        width: '100%',
        height: '100%'
      }}/>
      <View
        style={{
          position: "absolute",
          zIndex: 1,
          paddingTop: 50,
          left: 6,
        }}
      >
        <IconButton
          onPress={() => setPicture("")}
          iosName={"xmark"}
          androidName="close"
        />
      </View>
    </View>
  )
}