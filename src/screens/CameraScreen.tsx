import React, { useState, useRef } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import {
  CameraView,
  CameraType,
  useCameraPermissions,
  Camera,
} from "expo-camera";

import { useNavigation } from "@react-navigation/native";

const CameraScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState<CameraType>("back");
  const [capturedImage, setCapturedImage] = useState(null);
  const cameraRef = useRef(null);
  const navigation = useNavigation();

  React.useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.5,
          base64: true,
        });

        // photo.uri contains the image URI
        setCapturedImage(photo.uri);

        setTimeout(() => {
          //   //   navigation.navigate("Main", { imageUri: photo.uri });

          navigation.navigate("Main", {
            screen: "Home", // Specify which tab to open
            params: photo, // Pass the parameters
          });
        }, 1300);

        // You can use the URI for further processing, uploading, etc.
        return photo.uri;
      } catch (error) {
        console.error("Error taking picture:", error);
      }
    }
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={type} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
            <Text style={styles.buttonText}>Capture</Text>
          </TouchableOpacity>
        </View>
      </CameraView>

      {capturedImage && (
        <View style={styles.imagePreview}>
          <Image source={{ uri: capturedImage }} style={styles.preview} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "space-around",
    margin: 20,
  },
  flipButton: {
    alignSelf: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
  },
  captureButton: {
    alignSelf: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 18,
    color: "white",
  },
  imagePreview: {
    position: "absolute",
    bottom: 0,
    right: 0,
    height: 100,
    width: 100,
    padding: 10,
  },
  preview: {
    height: "100%",
    width: "100%",
    borderRadius: 5,
  },
});

export default CameraScreen;
