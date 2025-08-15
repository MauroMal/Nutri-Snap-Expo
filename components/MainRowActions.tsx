import { useEffect, useState } from "react"
import { Asset, getAssetsAsync } from "expo-media-library"
import { StyleSheet, TouchableOpacity, View, Image } from "react-native"
import { SymbolView } from "expo-symbols"
import IconButton from "./IconButton"
import * as MediaLibrary from "expo-media-library";

interface MainRowActionsProps {
  handleTakePicture: () => void
  onPressGallery?: () => void
  setCameraFacing: React.Dispatch<React.SetStateAction<"front" | "back">>;
}

export default function MainRowActions({
  handleTakePicture,
  onPressGallery,
  setCameraFacing,
}: MainRowActionsProps) {
  const [latestImage, setLatestImage] = useState<Asset | null>(null)

  useEffect(() => {
    (async () => {
      const { granted } = await MediaLibrary.requestPermissionsAsync();
      if (granted) {
        loadLatest();
      }
    })();
  }, []);

  async function loadLatest() {
    const result = await getAssetsAsync({
      mediaType: "photo",
      sortBy: "creationTime",
      first: 1,
    })
    if (result.assets.length > 0) {
      const asset = result.assets[0];
      const assetInfo = await MediaLibrary.getAssetInfoAsync(asset.id);
  
      if (assetInfo.localUri) {
        setLatestImage({ ...asset, uri: assetInfo.localUri });
      }
    }
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.pillContainer}>
        <TouchableOpacity onPress={onPressGallery} style={styles.imageButton}>
          {latestImage ? (
            <Image source={{ uri: latestImage.uri }} style={styles.image} />
          ) : (
            <View style={[styles.image, { backgroundColor: "#aaa" }]} />
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={handleTakePicture}>
          <SymbolView
            name="circle"
            size={90}
            type="hierarchical"
            tintColor="#fff"
            animationSpec={{ effect: { type: "bounce" } }}
          />
        </TouchableOpacity>
        <View style={styles.flipPicButton}>
          <IconButton
            onPress={() =>
              setCameraFacing((prev) => (prev === "back" ? "front" : "back"))
            }
            iosName="arrow.triangle.2.circlepath"
            androidName="camera-reverse"
            width={45}
            height={45}
          />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 60,
    width: "100%",
    alignItems: "center",
  },
  pillContainer: {
    flexDirection: "row",
    alignItems: "flex-start", 
    backgroundColor: "rgba(0,0,0,0.30)",
    paddingTop: 7,             
    paddingBottom: 7,           
    paddingHorizontal: 100,
    borderRadius: 999,
    gap: 16,
  },
  imageButton: {
    width: 45,
    height: 45,
    borderRadius: 999,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "white",
    position: "absolute",
    left: 32,
    top: 30
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  flipPicButton: {
    position: "absolute",
    right: 35,
    top: 28
  },
})