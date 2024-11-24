import {
  View,
  Image,
  Button,
  Platform,
  Text,
  StyleSheet,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import CustomButton from "../../components/shared/CustomButton";
import { showMessage } from "react-native-flash-message";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";

const HomeScreen = () => {
  const [uploadStatus, setUploadStatus] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const route = useRoute();
  const navigation = useNavigation();
  const URL = "http://192.168.203.108/api/upload-image/";
  const params = route.params || {};

  console.log("imageUri----imageUri", params);

  useEffect(() => {});

  const showAlertMessage = (data: any) => {
    if (data.status === 0) {
      showMessage({
        message: "Error",
        description: `Sorry! Internal Server Error...`,
        type: "danger",
      });
    } else if (data.status === 1) {
      showMessage({
        message: "Error",
        description: `This is not a "Puwalu" Banana`,
        type: "danger",
      });
    } else if (data.status === 2) {
      showMessage({
        message: "Error",
        description: `This is detected as a Puwalu Banana.But this is not a diseased banana`,
        type: "success",
      });
    } else if (data.status === 3) {
      showMessage({
        message: "Error",
        description: `Puwalu and diseased detected`,
        type: "success",
      });
    }
  };

  const requestPermissions = async () => {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
        return false;
      }
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0]);
        setUploadStatus("Image selected");
      }
    } catch (error) {
      console.error("Error picking image:", error);
      setUploadStatus("Error selecting image");
    }
  };

  const uploadImage = async () => {
    if (!selectedImage) {
      setUploadStatus("Please select an image first");
      return;
    }

    setUploadStatus("Uploading...");

    try {
      const formData = new FormData();

      // Prepare image data
      const imageUri = selectedImage.uri;

      const filename = imageUri.split("/").pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : "image";

      formData.append("file", {
        uri: imageUri,
        name: filename || `image.${type.split("/")[1]}`,
        type,
      });

      const response = await fetch(URL, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("response-----2", data);
      showAlertMessage(data);
      setUploadStatus("Upload successful!");
      console.log("Upload response:", data);
    } catch (error) {
      console.error("Error uploading image:", error);
      setUploadStatus("Upload failed. Please try again.");
    }

    setTimeout(() => {
      setSelectedImage(null);
    }, 2000);
  };

  const onCameraPressed = () => {
    navigation.navigate("Camera");
  };
  return (
    <View style={styles.container}>
      <View
        style={{
          flex: 1,
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        {selectedImage && (
          <Image source={{ uri: selectedImage.uri }} style={styles.image} />
        )}

        {!selectedImage && (
          <Image
            source={require("../../../assets/images/bananaDefault.jpg")}
            style={styles.image}
          />
        )}

        <CustomButton
          text={selectedImage ? "Upload Image" : "Pick Image"}
          onPress={selectedImage ? uploadImage : pickImage}
          loadingState={false}
        />

        <CustomButton
          text={"Take a picture"}
          onPress={onCameraPressed}
          loadingState={false}
        />
      </View>
      {/* <Button title="Pick an image from camera roll" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={styles.image} />} */}
      {/* <Button title="Pick an image" onPress={pickImage} /> */}

      {/* {selectedImage && (
        <Image source={{ uri: selectedImage.uri }} style={styles.image} />
      )}

      {selectedImage && <Button title="Upload image" onPress={uploadImage} />}

      <Text style={styles.status}>{uploadStatus}</Text> */}
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 200,
    height: 200,
  },
  status: {
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },
});
