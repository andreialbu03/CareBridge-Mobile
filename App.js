import React, { useState, useEffect } from "react";
import { SafeAreaView, StatusBar, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import UploadScreen from "./Screens/UploadScreen.js";
import ResultScreen from "./Screens/ResultScreen.js";
import { processImage } from "./services/AwsService.js";
import { Amplify } from "aws-amplify";
import amplifyconfig from "./src/amplifyconfiguration.json";

// Configure Amplify
Amplify.configure(amplifyconfig);

// Main App component
export default function App() {
  // State to manage various screens and data
  const [screen, setScreen] = useState("upload");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState(null);

  // Request permissions on app load for photo library
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

  // Function to handle image upload and processing
  const handleUpload = async () => {
    if (!selectedImage) return;
    setIsProcessing(true);

    // Try to process the image and get the results
    try {
      const explanation = await processImage(selectedImage);
      setResults(explanation);
      setScreen("result");
    } catch (error) {
      console.error("Error processing image:", error);
      alert("Error processing image. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Function to reset the app state
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

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
});
