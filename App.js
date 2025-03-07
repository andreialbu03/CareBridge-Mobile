// App.js
import React, { useState, useEffect } from "react";
import { SafeAreaView, StatusBar, View, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import UploadScreen from "./Screens/UploadScreen.js";
import ResultScreen from "./Screens/ResultScreen.js";
import "react-native-get-random-values";

export default function App() {
  const [screen, setScreen] = useState("upload");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState(null);

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

  // Handle document upload and processing
  const handleUpload = async () => {
    if (!selectedImage) return;

    setIsProcessing(true);

    // Simulate processing - in a real app you would send this to your backend
    setTimeout(() => {
      setResults({
        title: "Medical Report Analysis",
        content: "This is a sample analysis of the uploaded medical document.",
        recommendations:
          "Please consult with your healthcare provider to discuss these results.",
      });
      setIsProcessing(false);
      setScreen("result");
    }, 2000);
  };

  // Reset and go back to upload screen
  const handleReset = () => {
    setSelectedImage(null);
    setResults(null);
    setScreen("upload");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {screen === "upload" ? (
        <UploadScreen
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
          handleUpload={handleUpload}
          isProcessing={isProcessing}
        />
      ) : (
        <ResultScreen results={results} handleReset={handleReset} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
});
