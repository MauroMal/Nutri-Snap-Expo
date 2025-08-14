import { StyleSheet, Button, Linking, View } from "react-native"

import * as React from 'react';
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";

import { useCameraPermissions, CameraView, CameraMode, FlashMode } from "expo-camera";
import { usePermissions as useMediaLibraryPermissions } from "expo-media-library";
import { useEffect, useRef, useState } from "react";
import IconButton from "@/components/IconButton";
import BottomRowTools from "@/components/BottomRowTools";
import MainRowActions from "@/components/MainRowActions";
import { router } from "expo-router";
import PictureView from "@/components/PictureView";

export default function CameraScreen() {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] = useMediaLibraryPermissions();

  const [cameraTorch, setCameraTorch] = React.useState<boolean>(false);
  const [cameraFlash, setCameraFlash] = React.useState<FlashMode>("off");
  const [cameraFacing, setCameraFacing] = React.useState<"front" | "back">(
    "back"
  );
  const [cameraZoom, setCameraZoom] = React.useState<number>(0);
  const cameraRef = useRef<CameraView>(null)

  const [picture, setPicture] = React.useState<string>("");

  async function handleTakePicture() {
    const response = await cameraRef.current?.takePictureAsync({})
    setPicture(response!.uri);
  }

  useEffect(() => {
    requestCameraPermission()
  }, [])

  const allGranted =
    cameraPermission?.granted &&
    mediaPermission?.granted

  if (!cameraPermission ||  !mediaPermission) { /*!micPermission ||*/
    return (
      <ThemedView style={styles.center}>
        <ThemedText>Checking permissions...</ThemedText>
      </ThemedView>
    )
  }

  if (!allGranted) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText type="title">Permissions Required</ThemedText>
        {!cameraPermission.granted && (
          <ThemedText>Camera access is required</ThemedText>
        )}
        {/* {!micPermission.granted && (
          <ThemedText>Microphone access is required</ThemedText>
        )} */}
        {!mediaPermission.granted && (
          <ThemedText>Media library access is required</ThemedText>
        )}
        <Button title="Open Settings" onPress={() => Linking.openSettings()} />
      </ThemedView>
    )
  }
  
  const handleGalleryPress = async () => {
    const { granted } = await requestMediaPermission()
    if (granted) {
      router.push("/media-library")
    } else {
      alert("Media library permission is required to open gallery.")
    }
  }

  if (picture) return <PictureView picture={picture} setPicture={setPicture}/>;
  return (
    <View style={{ flex: 1 }}>
      <CameraView 
        ref={cameraRef} 
        facing={cameraFacing} 
        zoom={cameraZoom}
        flash={cameraFlash}
        enableTorch={cameraTorch}
        style={{ flex: 1 }}>
        <MainRowActions 
          handleTakePicture={handleTakePicture} 
          onPressGallery={handleGalleryPress} 
          setCameraFacing={setCameraFacing}/>
        <BottomRowTools 
          cameraZoom={cameraZoom}
          cameraFlash={cameraFlash}
          cameraTorch={cameraTorch}
          setCameraZoom={setCameraZoom}
          setCameraTorch={setCameraTorch}
          setCameraFlash={setCameraFlash}
          />
      </CameraView>
    </View>
  )
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
})