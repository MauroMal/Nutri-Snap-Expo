import { StyleSheet, Button, Linking, View, Alert } from "react-native"

import { useFocusEffect, useIsFocused, useRoute } from "@react-navigation/native"; // Camera turns on only after clicking tab

import * as React from 'react';
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";

import { useCameraPermissions, CameraView, CameraMode, FlashMode } from "expo-camera";
import { usePermissions as useMediaLibraryPermissions } from "expo-media-library";
import { useEffect, useRef, useState, useCallback } from "react"; //callback from camera on
import IconButton from "@/components/IconButton";
import BottomRowTools from "@/components/BottomRowTools";
import MainRowActions from "@/components/MainRowActions";
import { router, useLocalSearchParams } from "expo-router";
import PictureView from "@/components/PictureView";
import MediaLibrary from '../media-library';

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

  const isFocused = useIsFocused();  //camera should be on?
  const [showCamera, setShowCamera] = useState(true);

  useFocusEffect(
    useCallback(() => {
      setShowCamera(true); // Tab gained focus
      return () => {
        setShowCamera(false); // Tab lost focus
      };
    }, [])
  );

  async function handleTakePicture() {
    const response = await cameraRef.current?.takePictureAsync({})
    setPicture(response!.uri);
  }

  const params = useLocalSearchParams();
  const imageFromLibrary = params.image as string;

  useEffect(() => {
    requestCameraPermission()
  }, [])

  useEffect(() => {
    if (imageFromLibrary) {
      setPicture(imageFromLibrary);
    }
  }, [imageFromLibrary]);

  const allGranted =
    cameraPermission?.granted 

  if (!cameraPermission /*|| !mediaPermission*/) { 
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
        <Button title="Open Settings" onPress={() => Linking.openSettings()} />
      </ThemedView>
    )
  }
  
  const handleGalleryPress = async () => {
    const { granted, canAskAgain } = await requestMediaPermission();
  
    if (granted) {
      router.push("/media-library");
    } else if (canAskAgain) {
      Alert.alert("Permission Required", "We need access to your photos to open the gallery.");
    } else {
      Alert.alert(
        "Photo Access Blocked",
        "You’ve previously denied photo access. Would you like to open settings to enable it?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Settings",
            onPress: () => Linking.openSettings(),
          },
        ]
      );
    }
  };

  if (picture) return <PictureView picture={picture} setPicture={setPicture}/>;
  return (
    <View style={{ flex: 1 }}>{
      showCamera &&
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
          
          setCameraFacing={setCameraFacing}
          />
        <BottomRowTools 
          cameraZoom={cameraZoom}
          cameraFlash={cameraFlash}
          cameraTorch={cameraTorch}
          setCameraZoom={setCameraZoom}
          setCameraTorch={setCameraTorch}
          setCameraFlash={setCameraFlash}
          />
      </CameraView>
      }
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