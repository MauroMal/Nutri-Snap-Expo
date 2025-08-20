import * as React from "react";
import { ScrollView, TouchableOpacity, Button, View } from "react-native";
import { Asset, getAlbumsAsync, getAssetsAsync, getAssetInfoAsync } from "expo-media-library";
import { Image } from "expo-image";
import { Stack, router } from "expo-router";

export default function MediaLibrary() {
  const [assets, setAssets] = React.useState<Asset[]>([]);
  const [selectedImage, setSelectedImage] = React.useState<Asset | null>(null);

  React.useEffect(() => {
    (async () => {
      const albums = await getAlbumsAsync({ includeSmartAlbums: true });
      const recents = albums.find((album) => album.title === "Recents");
      if (recents) {
        const result = await getAssetsAsync({
          album: recents,
          mediaType: "photo",
          sortBy: "creationTime",
          first: 100,
        });
        setAssets(result.assets);
      }
    })();
  }, []);

  return (
    <>
      <Stack.Screen
        options={{
          title: "Your Library",
          headerTransparent: true,
          headerBlurEffect: "dark",
          headerLeft: () => (
            <Button title="Cancel" onPress={() => router.back()} />
          ),
          headerRight: () =>
            selectedImage ? (
              <Button
                title="Select"
                onPress={async () => {
                  if (!selectedImage) return;
                  const assetInfo = await getAssetInfoAsync(selectedImage.id);
                  const resolvedUri = assetInfo.localUri || assetInfo.uri;

                  router.replace({
                    pathname: "/camera",
                    params: { image: resolvedUri },
                  });
                }}
              />
            ) : null,
        }}
      />

      <ScrollView
        contentContainerStyle={{
          paddingTop: 60,
          padding: 2,
          flexDirection: "row",
          flexWrap: "wrap",
        }}
      >
        {assets.map((photo) => (
          <TouchableOpacity
            key={photo.id}
            onPress={() => setSelectedImage(photo)}
            style={{
              width: "25%",
              padding: 2,
              borderWidth: selectedImage?.id === photo.id ? 2 : 0,
              borderColor: "#1E90FF",
            }}
          >
            <Image
              source={photo.uri}
              style={{
                width: "100%",
                height: 100,
              }}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </>
  );
}