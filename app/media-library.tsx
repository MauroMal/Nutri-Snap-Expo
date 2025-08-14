import * as React from "react";
import { Link, router, Stack } from "expo-router";
import { Button, ScrollView, Text, TouchableOpacity } from "react-native";
import { Asset, getAlbumsAsync, getAssetsAsync } from "expo-media-library";
import { Image } from "expo-image";

interface MediaLibraryProps {
  setPicture: (uri: string) => void;
}

export default function MediaLibrary() {
  const [assets, setAssets] = React.useState<Asset[]>([]);
  const [selectedImage, setSelectedImage] = React.useState<Asset | null>(null);

  
  React.useEffect(() => {
    getAlbums();
  }, []);

  async function getAlbums() {
    const fetchedAlbums = await getAlbumsAsync({
      includeSmartAlbums: true,
    });

    // Recents album
    const albumAssets = await getAssetsAsync({
      album: fetchedAlbums.find((album) => album.title === "Recents"),
      mediaType: "photo",
      sortBy: "creationTime",
    });
    setAssets(albumAssets.assets);
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Your Library",
          headerTransparent: true,
          headerBlurEffect: "dark",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={{ color: "#1E90FF", paddingLeft: 16 }}>Cancel</Text>
            </TouchableOpacity>
          ),
          headerRight: () =>
            selectedImage && (
              <TouchableOpacity onPress={() => setPicture(selectedImage.uri)}>
                <Text style={{ color: "#1E90FF", paddingRight: 16 }}>Select</Text>
              </TouchableOpacity>
            ),
        }}
      />

      <ScrollView
        contentContainerStyle={{
          paddingTop: 50,
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
              height: 100,
              borderWidth: selectedImage?.id === photo.id ? 3 : 0,
              borderColor: "#1E90FF",
            }}
          >
            <Image
              source={photo.uri}
              style={{
                width: "100%",
                height: "100%",
              }}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </>
  );
}