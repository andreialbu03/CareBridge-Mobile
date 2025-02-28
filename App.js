import { useState } from "react";
import React, { useEffect } from "react";
import { View, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";

import UploadScreen from "./Screens/UploadScreen";
import ResultScreen from "./Screens/ResultScreen";

export default function App() {
  // Request permissions when the app starts
  useEffect(() => {
    const requestPermissions = async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    };

    requestPermissions();
  }, []);

  let screen = <UploadScreen />;

  return <View>{screen}</View>;
}
