import { StyleSheet, Button, Linking, View } from "react-native"

import * as React from 'react';
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";

import { useCameraPermissions, useMicrophonePermissions, CameraView } from "expo-camera";
import { usePermissions as useMediaLibraryPermissions } from "expo-media-library";
import { useEffect, useRef, useState } from "react";
import IconButton from "@/components/IconButton";
import BottomRowTools from "@/components/BottomRowTools";
import MainRowActions from "@/components/MainRowActions";

export default function CameraScreen() {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions()
  // const [micPermission, requestMicPermission] = useMicrophonePermissions()
  const [mediaPermission, requestMediaPermission] = useMediaLibraryPermissions()

  const cameraRef = useRef<CameraView>(null)

  useEffect(() => {
    requestCameraPermission()
    // requestMicPermission()
    requestMediaPermission()
  }, [])

  const allGranted =
    cameraPermission?.granted &&
    // micPermission?.granted &&
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

  return (
    <View style={{ flex: 1 }}>
      <CameraView ref={cameraRef} style={{ flex: 1 }}>
        <MainRowActions handleTakePicture={() => {}} />
        {/* <BottomRowTools /> */}
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