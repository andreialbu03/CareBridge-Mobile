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

export default function App() {
  const [screen, setScreen] = useState("upload");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState(null);

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

  const handleUpload = async () => {
    if (!selectedImage) return;
    setIsProcessing(true);
    try {
      const textractResults = await processImage(selectedImage);
      setResults(textractResults); // Store the raw Textract results
      setScreen("result");
    } catch (error) {
      console.error("Error processing image:", error);
      alert("Error processing image. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

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
