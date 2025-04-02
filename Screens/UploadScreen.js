import React from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

// Get screen dimensions
const { width, height } = Dimensions.get("window");

// UploadScreen component
const UploadScreen = ({
  selectedImage,
  setSelectedImage,
  handleUpload,
  isProcessing,
}) => {
  // Function to pick image from gallery
  const pickImage = async () => {
    // Launch the image picker
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // If the user selected an image, set it as the selected image
    if (!result.canceled && result.assets.length > 0) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  // New function to take a picture with the camera
  const takePicture = async () => {
    // Request camera permissions first
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== "granted") {
      alert("Sorry, we need camera permissions to make this work!");
      return;
    }

    console.log("Launching camera...");

    // Launch the camera
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // If the user took a picture, set it as the selected image
    if (!result.canceled && result.assets.length > 0) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../assets/logo.png")}
            style={styles.logoPlaceholder}
          />
        </View>
        <Text style={styles.welcomeTitle}>Welcome to CareBridge</Text>
      </View>

      {/* Description */}
      <View style={styles.descriptionContainer}>
        <Text style={styles.description}>
          CareBridge is a mobile healthcare communication app designed to help
          you understand and interpret medical documents and notes from
          healthcare providers.
        </Text>
      </View>

      {/* App instructions */}
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsTitle}>How to Use:</Text>
        <View style={styles.instructionStep}>
          <Text style={styles.instructionNumber}>1.</Text>
          <Text style={styles.instructionText}>
            Choose a file from your device or take a new photo.
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
        <View style={styles.instructionStep}>
          <Text style={styles.instructionNumber}>4.</Text>
          <Text style={styles.instructionText}>
            Wait for the app to process the document.
          </Text>
        </View>
        <View style={styles.instructionStep}>
          <Text style={styles.instructionNumber}>5.</Text>
          <Text style={styles.instructionText}>
            Once processing is complete, you'll get a medical explanation.
          </Text>
        </View>
      </View>

      {/* Upload Container with Image Preview */}
      <View style={styles.uploadContainer}>
        {/* Image Preview visible if an image is selected */}
        {selectedImage && (
          <View style={styles.previewContainer}>
            <Image
              source={{ uri: selectedImage }}
              style={styles.imagePreview}
              resizeMode="contain"
            />
            <View style={styles.imageActionButtons}>
              <TouchableOpacity
                style={styles.changeImageButton}
                onPress={pickImage}
              >
                <Text style={styles.changeImageText}>Choose From Gallery</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.changeImageButton}
                onPress={takePicture}
              >
                <Text style={styles.changeImageText}>Take New Photo</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Show both buttons if no image is selected */}
        {!selectedImage && (
          <View style={styles.inputButtonsContainer}>
            <TouchableOpacity style={styles.inputButton} onPress={pickImage}>
              <Text style={styles.inputButtonText}>Choose From Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.inputButton} onPress={takePicture}>
              <Text style={styles.inputButtonText}>Take a Photo</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.uploadButton,
            (!selectedImage || isProcessing) && styles.disabledButton,
          ]}
          // This uses the handleUpload from App.js
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

      {/* Disclaimer */}
      <Text style={styles.disclaimerText}>
        Please note that while this app can provide helpful insights, it's
        essential to consult with a healthcare professional for any medical
        advice or decisions.
      </Text>
    </ScrollView>
  );
};

export default UploadScreen;

// Styles
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
    width: 96,
    height: 60,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
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
  // New styles for input option buttons
  inputButtonsContainer: {
    marginBottom: 16,
  },
  inputButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    padding: 12,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
    alignItems: "center",
  },
  inputButtonText: {
    color: "#4062FF",
    fontSize: 16,
    fontWeight: "500",
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
  imageActionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },
  changeImageButton: {
    padding: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ddd",
    flex: 1,
    marginHorizontal: 4,
    alignItems: "center",
  },
  changeImageText: {
    color: "#4062FF",
    fontSize: 14,
    fontWeight: "500",
  },
});
