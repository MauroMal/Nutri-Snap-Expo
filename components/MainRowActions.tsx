import { useEffect, useState } from "react"
import { Asset, getAssetsAsync } from "expo-media-library"
import { StyleSheet, TouchableOpacity, View, Image } from "react-native"
import { SymbolView } from "expo-symbols"

interface MainRowActionsProps {
  handleTakePicture: () => void
  onPressGallery?: () => void
}

export default function MainRowActions({
  handleTakePicture,
  onPressGallery,
}: MainRowActionsProps) {
  const [latestImage, setLatestImage] = useState<Asset | null>(null)

  useEffect(() => {
    loadLatest()
  }, [])

  async function loadLatest() {
    const result = await getAssetsAsync({
      mediaType: "photo",
      sortBy: "creationTime",
      first: 1,
    })
    if (result.assets.length > 0) {
      setLatestImage(result.assets[0])
    }
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.pillContainer}>
        {latestImage && (
          <TouchableOpacity onPress={onPressGallery} style={styles.imageButton}>
            <Image source={{ uri: latestImage.uri }} style={styles.image} />
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={handleTakePicture}>
          <SymbolView
            name="circle"
            size={90}
            type="hierarchical"
            tintColor="white"
            animationSpec={{ effect: { type: "bounce" } }}
          />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    alignItems: "center",
  },
  pillContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.55)",
    paddingHorizontal: 100,
    paddingVertical: 10,
    borderRadius: 9999, // max roundness
    gap: 16,
  },
  imageButton: {
    width: 50,
    height: 50,
    borderRadius: 15,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "white",
    position: "absolute",
    left: 30
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
})