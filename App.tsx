import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  PermissionsAndroid,
  Linking,
  ActivityIndicator,
} from "react-native";
import { AppNavigator } from "./src/navigation";
import React, { useEffect } from "react";
import FlashMessage from "react-native-flash-message";
// import { messaging } from "./firebaseConfig";

const NAVIGATION_IDS = ["home", "settings"];

// const API_URL = "http://127.0.0.1:8000/api/upload-image/";

// 192.168.203.108

fetch("http://192.168.203.108:8000/api/upload-image/");

// function buildDeepLinkFromNotificationData(data: any): string | null {
//   const navigationId = data?.navigationId;
//   if (!NAVIGATION_IDS.includes(navigationId)) {
//     console.warn("Unverified navigationId", navigationId);
//     return null;
//   }
//   if (navigationId === "home") {
//     return "myapp://home";
//   }
//   if (navigationId === "settings") {
//     return "myapp://settings";
//   }

//   return null;
// }

// const linking = {
//   prefixes: ["myapp://"],
//   config: {
//     screens: {
//       Home: "home",
//       Settings: "settings",
//     },
//   },
//   async getInitialURL() {
//     const url = await Linking.getInitialURL();
//     if (typeof url === "string") {
//       return url;
//     }
//     //getInitialNotification: When the application is opened from a quit state.
//     const message = await messaging().getInitialNotification();
//     const deeplinkURL = buildDeepLinkFromNotificationData(message?.data);
//     if (typeof deeplinkURL === "string") {
//       return deeplinkURL;
//     }
//   },
//   subscribe(listener: (url: string) => void) {
//     const onReceiveURL = ({ url }: { url: string }) => listener(url);

//     // Listen to incoming links from deep linking
//     const linkingSubscription = Linking.addEventListener("url", onReceiveURL);
//     messaging().setBackgroundMessageHandler(async (remoteMessage) => {
//       console.log("Message handled in the background!", remoteMessage);
//     });

//     const foreground = messaging().onMessage(async (remoteMessage) => {
//       console.log("A new FCM message arrived!", remoteMessage);
//     });
//     //onNotificationOpenedApp: When the application is running, but in the background.
//     const unsubscribe = messaging().onNotificationOpenedApp((remoteMessage) => {
//       const url = buildDeepLinkFromNotificationData(remoteMessage.data);
//       if (typeof url === "string") {
//         listener(url);
//       }
//     });

//     return () => {
//       linkingSubscription.remove();
//       unsubscribe();
//       foreground();
//     };
//   },
// };

export default function App() {
  // useEffect(() => {
  //   const requestUserPermission = async () => {
  //     PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
  //     );
  //     const authStatus = await messaging().requestPermission();
  //     const enabled =
  //       authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
  //       authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  //     if (enabled) {
  //       console.log("Authorization status:", authStatus);
  //       const token = await messaging().getToken();
  //       console.log("FCM token:", token);
  //     }
  //   };

  //   requestUserPermission();
  // }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AppNavigator />
      <FlashMessage position="top" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
