// Screens/UploadScreen.js
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { processImage } from "../services/AwsService";

// Get screen dimensions
const { width, height } = Dimensions.get("window");

const UploadScreen = ({ navigation }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const pickImage = async () => {
    // Launch the image picker
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleUpload = async () => {
    if (!selectedImage) return;

    try {
      setIsProcessing(true);

      // Call our AWS service to process the image
      const textractResults = await processImage(selectedImage);

      // Navigate to results screen with the textract data
      navigation.navigate("Results", { textractResults });
    } catch (error) {
      console.error("Error processing document:", error);
      Alert.alert(
        "Upload Failed",
        "There was an error processing your document. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          {/* Use a placeholder view if you don't have the logo */}
          <View style={styles.logoPlaceholder} />
        </View>
        <Text style={styles.welcomeTitle}>Welcome to CareBridge</Text>
      </View>

      <View style={styles.descriptionContainer}>
        <Text style={styles.description}>
          CareBridge is a web-based healthcare communication tool designed to
          help you understand and interpret medical documents and notes from
          healthcare providers.
        </Text>
      </View>

      {/* Make the instructions more compact */}
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsTitle}>How to Use:</Text>
        <View style={styles.instructionStep}>
          <Text style={styles.instructionNumber}>1.</Text>
          <Text style={styles.instructionText}>
            Click the "Choose File" button below.
          </Text>
        </View>
        <View style={styles.instructionStep}>
          <Text style={styles.instructionNumber}>2.</Text>
          <Text style={styles.instructionText}>
            Select the document you want to understand.
          </Text>
        </View>
        <View style={styles.instructionStep}>
          <Text style={styles.instructionNumber}>3.</Text>
          <Text style={styles.instructionText}>
            Click "Upload" to initiate the process.
          </Text>
        </View>
      </View>

      {/* Upload Container with Image Preview */}
      <View style={styles.uploadContainer}>
        {/* Image Preview - Show if an image is selected */}
        {selectedImage && (
          <View style={styles.previewContainer}>
            <Image
              source={{ uri: selectedImage }}
              style={styles.imagePreview}
              resizeMode="contain"
            />
            <TouchableOpacity
              style={styles.changeImageButton}
              onPress={pickImage}
            >
              <Text style={styles.changeImageText}>Change Image</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Only show the Choose File button if no image is selected */}
        {!selectedImage && (
          <TouchableOpacity style={styles.chooseFileButton} onPress={pickImage}>
            <Text style={styles.chooseFileText}>Choose File</Text>
            <Text style={styles.fileSelectedText}>no file selected</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[
            styles.uploadButton,
            (!selectedImage || isProcessing) && styles.disabledButton,
          ]}
          onPress={handleUpload}
          disabled={!selectedImage || isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.uploadButtonText}>Upload</Text>
          )}
        </TouchableOpacity>
      </View>

      <Text style={styles.disclaimerText}>
        Please note that while this tool can provide helpful insights, it's
        essential to consult with a healthcare professional for any medical
        advice or decisions.
      </Text>
    </ScrollView>
  );
};

export default UploadScreen;

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginVertical: 16,
  },
  logoContainer: {
    marginBottom: 8,
  },
  logoPlaceholder: {
    width: 70,
    height: 70,
    backgroundColor: "#f0f0f0",
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#4062FF",
    textAlign: "center",
  },
  descriptionContainer: {
    marginVertical: 12,
  },
  description: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    lineHeight: 20,
  },
  instructionsContainer: {
    marginVertical: 12,
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 8,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4062FF",
    marginBottom: 8,
  },
  instructionStep: {
    flexDirection: "row",
    marginBottom: 6,
  },
  instructionNumber: {
    fontSize: 14,
    fontWeight: "600",
    marginRight: 6,
    color: "#333",
  },
  instructionText: {
    fontSize: 14,
    color: "#333",
    flex: 1,
  },
  disclaimerText: {
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
    marginVertical: 12,
    lineHeight: 18,
  },
  // Upload container
  uploadContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginVertical: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  chooseFileButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    padding: 10,
    marginBottom: 12,
  },
  chooseFileText: {
    color: "#555",
    fontSize: 16,
  },
  fileSelectedText: {
    color: "#999",
    fontSize: 14,
  },
  uploadButton: {
    backgroundColor: "#4062FF",
    borderRadius: 4,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  disabledButton: {
    backgroundColor: "#a0a0a0",
  },
  uploadButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  // Image preview styles
  previewContainer: {
    marginBottom: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 8,
    backgroundColor: "#f9f9f9",
  },
  imagePreview: {
    width: "100%",
    height: 200,
    borderRadius: 4,
  },
  changeImageButton: {
    marginTop: 10,
    padding: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  changeImageText: {
    color: "#4062FF",
    fontSize: 14,
    fontWeight: "500",
  },
});
